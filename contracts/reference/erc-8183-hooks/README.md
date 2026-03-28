# ERC-8183 Hook Contracts (Reference)

These contracts were contributed by JhiNResH to the [erc-8183/hook-contracts](https://github.com/erc-8183/hook-contracts) repository.

They are included here as reference implementations. They depend on the `@acp/IACPHook.sol` interface and `@openzeppelin/contracts-upgradeable/` — install those dependencies to compile.

## Contracts

| Contract | PR | Description |
|----------|----|-------------|
| **MutualAttestationHook.sol** | [#14](https://github.com/erc-8183/hook-contracts/pull/14) | Airbnb-style bilateral reviews for ERC-8183 — buyer and provider rate each other |
| **AttestationHook.sol** | [#10](https://github.com/erc-8183/hook-contracts/pull/10) | EAS-integrated attestation for job completions |
| **CompositeRouterHook.sol** | [#19](https://github.com/erc-8183/hook-contracts/pull/19) | Multi-hook composition — chain multiple hooks in sequence |
| **TokenSafetyHook.sol** | [#20](https://github.com/erc-8183/hook-contracts/pull/20) | Pre-transaction token safety checks (honeypot, high tax, etc.) |
| **TrustBasedEvaluator.sol** | [#6](https://github.com/erc-8183/hook-contracts/pull/6) | Auto-approve/reject based on trust score threshold |
| **BaseACPHook.sol** | upstream | Abstract base for ACP hooks |

## Key: MutualAttestationHook

The MutualAttestationHook implements bilateral reviews where both parties in an ERC-8183 job rate each other (1-5 stars). This is the same mutual review pattern used in Maiat's JobMarket contract, but implemented as a composable ERC-8183 hook.
