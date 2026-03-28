// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable2Step, Ownable} from "openzeppelin-contracts/contracts/access/Ownable2Step.sol";

/**
 * @title TrustGateHook — Reputation-Gated Dynamic Fee
 * @notice Reads agent reputation from TrustScoreOracle → maps score to swap fee tier.
 *         Higher reputation = lower fee. Lower reputation = higher fee.
 *
 *         Compatible with any DEX or router that queries fee before swap.
 *         Designed as a standalone hook — can plug into Uniswap V3 pool factory
 *         (as fee oracle) or V4 hooks (as beforeSwap fee modifier).
 *
 * @dev Fee Tiers (inspired by Uniswap V3):
 *      Score 90+  (Guardian)  → 100 bps (0.01%) — best agents get cheapest trades
 *      Score 75+  (Verified)  → 500 bps (0.05%)
 *      Score 50+  (Trusted)   → 3000 bps (0.30%) — default V3 tier
 *      Score 25+  (New)       → 5000 bps (0.50%)
 *      Score <25  (Untrusted) → 10000 bps (1.00%) — maximum penalty
 *
 *      Economic consequence: bad actors pay 100x more than top agents.
 */
/// @notice Minimal interface to read trust scores
interface ITrustGateOracle {
    function getUserReputation(address user) external view returns (uint256 score, uint256 lastUpdated);
}

contract TrustGateHook is Ownable2Step {

    /*//////////////////////////////////////////////////////////////
                             STATE
    //////////////////////////////////////////////////////////////*/

    ITrustGateOracle public oracle;

    /// @notice Fee tiers in basis points (1 bps = 0.01%)
    uint24 public constant FEE_GUARDIAN  = 100;    // 0.01% — top tier
    uint24 public constant FEE_VERIFIED  = 500;    // 0.05%
    uint24 public constant FEE_TRUSTED   = 3000;   // 0.30% — V3 default
    uint24 public constant FEE_NEW       = 5000;   // 0.50%
    uint24 public constant FEE_UNTRUSTED = 10000;  // 1.00% — max penalty

    /// @notice Score thresholds (configurable by owner)
    uint256 public thresholdGuardian  = 90;
    uint256 public thresholdVerified  = 75;
    uint256 public thresholdTrusted   = 50;
    uint256 public thresholdNew       = 25;

    /// @notice Maximum score age before falling back to default fee
    uint256 public maxScoreAge = 7 days;

    /// @notice Override fees for specific addresses (0 = use dynamic)
    mapping(address => uint24) public feeOverrides;

    /// @notice Total fee lookups (analytics)
    uint256 public totalLookups;

    /*//////////////////////////////////////////////////////////////
                             EVENTS
    //////////////////////////////////////////////////////////////*/

    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event ThresholdsUpdated(uint256 guardian, uint256 verified, uint256 trusted, uint256 newAgent);
    event FeeOverrideSet(address indexed account, uint24 fee);
    event FeeLookup(address indexed account, uint256 score, uint24 fee, string tier);

    /*//////////////////////////////////////////////////////////////
                             ERRORS
    //////////////////////////////////////////////////////////////*/

    error TrustGateHook__ZeroAddress();
    error TrustGateHook__InvalidThresholds();

    /*//////////////////////////////////////////////////////////////
                          CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _oracle, address _owner) Ownable(_owner) {
        if (_oracle == address(0)) revert TrustGateHook__ZeroAddress();
        oracle = ITrustGateOracle(_oracle);
        emit OracleUpdated(address(0), _oracle);
    }

    /*//////////////////////////////////////////////////////////////
                        CORE: FEE LOOKUP
    //////////////////////////////////////////////////////////////*/

    /// @notice Get the dynamic swap fee for an account based on reputation
    /// @param account The address performing the swap
    /// @return fee The fee in basis points (100 = 0.01%, 10000 = 1.00%)
    /// @return tier Human-readable tier name
    function getSwapFee(address account) external returns (uint24 fee, string memory tier) {
        totalLookups++;

        // Check for override first
        if (feeOverrides[account] != 0) {
            emit FeeLookup(account, 0, feeOverrides[account], "Override");
            return (feeOverrides[account], "Override");
        }

        // Read reputation from oracle
        try oracle.getUserReputation(account) returns (uint256 score, uint256 lastUpdated) {
            // If score is stale, use default (trusted) fee
            if (block.timestamp - lastUpdated > maxScoreAge) {
                emit FeeLookup(account, score, FEE_TRUSTED, "Stale");
                return (FEE_TRUSTED, "Stale");
            }

            // Map score to fee tier
            if (score >= thresholdGuardian) {
                emit FeeLookup(account, score, FEE_GUARDIAN, "Guardian");
                return (FEE_GUARDIAN, "Guardian");
            } else if (score >= thresholdVerified) {
                emit FeeLookup(account, score, FEE_VERIFIED, "Verified");
                return (FEE_VERIFIED, "Verified");
            } else if (score >= thresholdTrusted) {
                emit FeeLookup(account, score, FEE_TRUSTED, "Trusted");
                return (FEE_TRUSTED, "Trusted");
            } else if (score >= thresholdNew) {
                emit FeeLookup(account, score, FEE_NEW, "New");
                return (FEE_NEW, "New");
            } else {
                emit FeeLookup(account, score, FEE_UNTRUSTED, "Untrusted");
                return (FEE_UNTRUSTED, "Untrusted");
            }
        } catch {
            // Oracle unavailable — default to trusted tier
            emit FeeLookup(account, 0, FEE_TRUSTED, "OracleError");
            return (FEE_TRUSTED, "OracleError");
        }
    }

    /// @notice View-only fee lookup (no state change, no event)
    function getSwapFeeView(address account) external view returns (uint24 fee, string memory tier) {
        if (feeOverrides[account] != 0) {
            return (feeOverrides[account], "Override");
        }

        try oracle.getUserReputation(account) returns (uint256 score, uint256 lastUpdated) {
            if (block.timestamp - lastUpdated > maxScoreAge) return (FEE_TRUSTED, "Stale");
            if (score >= thresholdGuardian) return (FEE_GUARDIAN, "Guardian");
            if (score >= thresholdVerified) return (FEE_VERIFIED, "Verified");
            if (score >= thresholdTrusted) return (FEE_TRUSTED, "Trusted");
            if (score >= thresholdNew) return (FEE_NEW, "New");
            return (FEE_UNTRUSTED, "Untrusted");
        } catch {
            return (FEE_TRUSTED, "OracleError");
        }
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN: CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    /// @notice Update the TrustScoreOracle address
    function setOracle(address _oracle) external onlyOwner {
        if (_oracle == address(0)) revert TrustGateHook__ZeroAddress();
        address old = address(oracle);
        oracle = ITrustGateOracle(_oracle);
        emit OracleUpdated(old, _oracle);
    }

    /// @notice Update score thresholds
    function setThresholds(
        uint256 _guardian,
        uint256 _verified,
        uint256 _trusted,
        uint256 _new
    ) external onlyOwner {
        if (_guardian <= _verified || _verified <= _trusted || _trusted <= _new) {
            revert TrustGateHook__InvalidThresholds();
        }
        thresholdGuardian = _guardian;
        thresholdVerified = _verified;
        thresholdTrusted = _trusted;
        thresholdNew = _new;
        emit ThresholdsUpdated(_guardian, _verified, _trusted, _new);
    }

    /// @notice Set a fixed fee override for an address (0 to remove)
    function setFeeOverride(address account, uint24 fee) external onlyOwner {
        feeOverrides[account] = fee;
        emit FeeOverrideSet(account, fee);
    }

    /// @notice Update max score age
    function setMaxScoreAge(uint256 _maxAge) external onlyOwner {
        maxScoreAge = _maxAge;
    }
}
