// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IQ402Facilitator — x402/Q402 Payment Interface
 * @notice Interface for Q402 (Quack AI) / x402 (Coinbase) sign-to-pay integration.
 *         Enables gasless, policy-aware payment settlements for agent jobs.
 *
 * @dev Architecture aligned with:
 *      - x402 (Coinbase): HTTP 402 payment standard for agentic payments
 *      - Q402 (Quack AI): EIP-7702 delegated execution + EIP-712 witness signatures
 *      - OKX OnchainOS okx-x402-payment: TEE-signed payment authorization
 *
 * Integration points:
 *      - JobMarket.sol calls executePayment() for escrow settlements
 *      - MaiatEvaluator.sol calls verifySignature() for attestation verification
 *
 * Production: plug into Quack AI SDK or OKX OnchainOS okx-x402-payment skill
 */
interface IQ402Facilitator {
    /// @notice Payment request structure (EIP-712 typed)
    struct PaymentRequest {
        address payer;        // Buyer / job poster
        address payee;        // Worker / service provider
        uint256 amount;       // Payment amount
        address token;        // ERC-20 token (address(0) = native)
        uint256 nonce;        // Replay protection
        uint256 deadline;     // Expiry timestamp
        bytes32 policyHash;   // Policy rules hash (KYC, limits, whitelist)
    }

    /// @notice Execute a signed payment via the facilitator network
    /// @param req The payment request
    /// @param signature EIP-712 signature from payer
    /// @return success Whether payment was executed
    function executePayment(
        PaymentRequest calldata req,
        bytes calldata signature
    ) external returns (bool success);

    /// @notice Verify a payment signature without executing
    /// @param req The payment request
    /// @param signature EIP-712 signature
    /// @return valid Whether signature is valid
    function verifySignature(
        PaymentRequest calldata req,
        bytes calldata signature
    ) external view returns (bool valid);

    /// @notice Get payment status by nonce
    /// @param payer The payer address
    /// @param nonce The payment nonce
    /// @return executed Whether this nonce has been used
    function isExecuted(address payer, uint256 nonce) external view returns (bool executed);

    /// @notice Emitted when a payment is executed
    event PaymentExecuted(
        address indexed payer,
        address indexed payee,
        uint256 amount,
        address token,
        uint256 nonce
    );

    /// @notice Emitted when a payment fails policy check
    event PaymentRejected(
        address indexed payer,
        uint256 nonce,
        bytes32 policyHash,
        string reason
    );
}
