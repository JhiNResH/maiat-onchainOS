// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable2Step, Ownable} from "openzeppelin-contracts/contracts/access/Ownable2Step.sol";

/**
 * @title EvaluatorRegistry — Domain-Specific Evaluator Routing
 * @notice Maps skill categories to specialized ERC-8183 evaluators.
 *         When a job is posted, the system queries this registry to assign
 *         the right evaluator based on the required skill.
 *
 * @dev Architecture:
 *      Job posted (skillId) → EvaluatorRegistry.getEvaluator(skillId) → domain evaluator address
 *      Each evaluator can have different thresholds, logic, and domain expertise.
 *
 *      Example:
 *        skillId 1 (Audit)   → SecurityEvaluator (threshold=80, checks Slither output)
 *        skillId 2 (DeFi)    → DeFiEvaluator (threshold=70, checks execution quality)
 *        skillId 3 (Content) → ContentEvaluator (threshold=50, more lenient)
 *        skillId 0 (default) → MaiatEvaluator (general purpose, threshold=60)
 */
contract EvaluatorRegistry is Ownable2Step {
    struct EvaluatorInfo {
        address evaluator;      // ERC-8183 evaluator contract address
        string  domain;         // Human-readable domain name (e.g. "Security", "DeFi")
        uint256 threshold;      // Recommended threshold for this domain
        bool    active;         // Whether this evaluator is accepting new jobs
    }

    /// @notice Default evaluator (fallback when no domain-specific one exists)
    address public defaultEvaluator;

    /// @notice skillId → evaluator info
    mapping(uint256 => EvaluatorInfo) public evaluators;

    /// @notice All registered skill IDs (for enumeration)
    uint256[] public registeredSkillIds;
    mapping(uint256 => bool) private _isRegistered;

    /// @notice Domain name → list of skill IDs in that domain
    mapping(string => uint256[]) public domainSkills;

    event EvaluatorSet(uint256 indexed skillId, address indexed evaluator, string domain, uint256 threshold);
    event EvaluatorRemoved(uint256 indexed skillId);
    event DefaultEvaluatorSet(address indexed evaluator);
    event EvaluatorToggled(uint256 indexed skillId, bool active);

    error EvaluatorRegistry__ZeroAddress();
    error EvaluatorRegistry__NotRegistered(uint256 skillId);
    error EvaluatorRegistry__DomainTooLong(uint256 length);

    uint256 public constant MAX_DOMAIN_LENGTH = 64;

    constructor(address _defaultEvaluator, address _owner) Ownable(_owner) {
        if (_defaultEvaluator == address(0)) revert EvaluatorRegistry__ZeroAddress();
        defaultEvaluator = _defaultEvaluator;
        emit DefaultEvaluatorSet(_defaultEvaluator);
    }

    /*//////////////////////////////////////////////////////////////
                        CORE: ROUTING
    //////////////////////////////////////////////////////////////*/

    /// @notice Get the evaluator for a given skill (returns default if none set)
    /// @param skillId The skill/category of the job
    /// @return evaluator The evaluator contract address
    /// @return domain The domain name
    /// @return threshold The recommended threshold
    function getEvaluator(uint256 skillId) external view returns (
        address evaluator,
        string memory domain,
        uint256 threshold
    ) {
        EvaluatorInfo storage info = evaluators[skillId];
        if (info.evaluator != address(0) && info.active) {
            return (info.evaluator, info.domain, info.threshold);
        }
        // Fallback to default
        return (defaultEvaluator, "General", 60);
    }

    /// @notice Resolve evaluator for a job (convenience — just returns address)
    function resolve(uint256 skillId) external view returns (address) {
        EvaluatorInfo storage info = evaluators[skillId];
        if (info.evaluator != address(0) && info.active) {
            return info.evaluator;
        }
        return defaultEvaluator;
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN: CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    /// @notice Register or update a domain-specific evaluator
    function setEvaluator(
        uint256 skillId,
        address evaluator,
        string calldata domain,
        uint256 threshold
    ) external onlyOwner {
        if (evaluator == address(0)) revert EvaluatorRegistry__ZeroAddress();
        if (bytes(domain).length > MAX_DOMAIN_LENGTH) revert EvaluatorRegistry__DomainTooLong(bytes(domain).length);

        evaluators[skillId] = EvaluatorInfo({
            evaluator: evaluator,
            domain: domain,
            threshold: threshold,
            active: true
        });

        if (!_isRegistered[skillId]) {
            _isRegistered[skillId] = true;
            registeredSkillIds.push(skillId);
            domainSkills[domain].push(skillId);
        }

        emit EvaluatorSet(skillId, evaluator, domain, threshold);
    }

    /// @notice Toggle an evaluator active/inactive
    function toggleEvaluator(uint256 skillId, bool active) external onlyOwner {
        if (evaluators[skillId].evaluator == address(0)) revert EvaluatorRegistry__NotRegistered(skillId);
        evaluators[skillId].active = active;
        emit EvaluatorToggled(skillId, active);
    }

    /// @notice Update the default evaluator
    function setDefaultEvaluator(address _evaluator) external onlyOwner {
        if (_evaluator == address(0)) revert EvaluatorRegistry__ZeroAddress();
        defaultEvaluator = _evaluator;
        emit DefaultEvaluatorSet(_evaluator);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW: ENUMERATION
    //////////////////////////////////////////////////////////////*/

    /// @notice Get all registered skill IDs
    function getAllSkillIds() external view returns (uint256[] memory) {
        return registeredSkillIds;
    }

    /// @notice Get all skill IDs in a domain
    function getSkillsByDomain(string calldata domain) external view returns (uint256[] memory) {
        return domainSkills[domain];
    }

    /// @notice Get total number of domain evaluators
    function totalEvaluators() external view returns (uint256) {
        return registeredSkillIds.length;
    }
}
