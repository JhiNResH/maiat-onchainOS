# 🛡️ Maiat XLayer Security Audit Report

**Date:** 2026-03-28  
**Auditors:** Trail of Bits (Slither), Pashov-style manual review, SolSkill methodology  
**Scope:** All contracts in `contracts/src/` (7 contracts + 2 interfaces)  
**Solidity:** 0.8.26  
**Framework:** Foundry  
**Commit:** `9dfca4a`

---

## Executive Summary

The Maiat XLayer protocol implements an **ERC-8183 Agentic Commerce** system with job marketplace, reputation engine, skill NFTs, agent identity, and trust-gated evaluations. The codebase demonstrates solid security fundamentals (CEI pattern, Ownable2Step, ReentrancyGuard) but has several findings that should be addressed before mainnet deployment.

| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 3 |
| 🟡 Medium | 4 |
| 🔵 Low | 5 |
| ℹ️ Informational | 4 |
| **Total** | **17** |

---

## 🔴 Critical Findings

### C-01: SkillRegistry.buySkill() — Reentrancy via ERC-1155 Callback

**Contract:** `SkillRegistry.sol:57-86`  
**Detector:** Slither `reentrancy-no-eth`

**Description:** `_mint()` triggers `onERC1155Received()` callback on the recipient BEFORE state updates (`hasSkill`, `totalBuyers`, `_agentSkills`). A malicious contract can re-enter `buySkill()` and purchase the same skill multiple times since `hasSkill[msg.sender][skillId]` hasn't been set yet.

**Impact:** Attacker mints unlimited skill NFTs for a single payment. If skill has limited supply intent, this breaks the economy.

**Proof of Concept:**
```solidity
contract Attacker is IERC1155Receiver {
    SkillRegistry target;
    uint256 attackSkillId;
    uint256 count;
    
    function attack(uint256 skillId) external payable {
        attackSkillId = skillId;
        target.buySkill{value: msg.value}(skillId);
    }
    
    function onERC1155Received(...) external returns (bytes4) {
        if (count++ < 5) {
            target.buySkill{value: price}(attackSkillId); // re-enters!
        }
        return this.onERC1155Received.selector;
    }
}
```

**Recommendation:** Apply checks-effects-interactions pattern:
```solidity
function buySkill(uint256 skillId) external payable {
    // ... checks ...
    
    // EFFECTS FIRST
    hasSkill[msg.sender][skillId] = true;
    _agentSkills[msg.sender].push(skillId);
    s.totalBuyers++;
    
    // INTERACTIONS LAST
    _mint(msg.sender, skillId, 1, "");
    // ... royalty + refund transfers ...
}
```

Or add `ReentrancyGuard`.

---

## 🟠 High Findings

### H-01: JobMarket.withdrawFees() Drains Worker Escrowed Funds

**Contract:** `JobMarket.sol:178-183`

**Description:** `withdrawFees()` sends the **entire contract balance** to the owner. This balance includes escrowed job rewards (locked ETH for open/in-progress jobs), not just protocol fees. Owner can steal all escrowed funds.

**Impact:** Loss of all user funds held in escrow.

**Recommendation:** Track accumulated fees separately:
```solidity
uint256 public accumulatedFees;

function buyerRateWorker(...) {
    // ...
    accumulatedFees += fee;
    // ...
}

function withdrawFees() external {
    require(msg.sender == owner);
    uint256 fees = accumulatedFees;
    accumulatedFees = 0;
    (bool ok, ) = owner.call{value: fees}("");
    require(ok);
}
```

### H-02: JobMarket — No Deadline / Dispute Resolution

**Contract:** `JobMarket.sol`

**Description:** Once a worker accepts a job, there is no deadline enforcement and no dispute mechanism. A worker can accept and never complete, locking the buyer's funds forever. The buyer cannot cancel an in-progress job.

**Impact:** Permanent fund lockup for buyers.

**Recommendation:** Add job deadline + buyer reclaim after expiry:
```solidity
// In Job struct: uint256 deadline;
function reclaimExpiredJob(uint256 jobId) external {
    require(job.buyer == msg.sender);
    require(job.status == JobStatus.InProgress);
    require(block.timestamp > job.deadline);
    // refund buyer
}
```

### H-03: JobMarket.buyerRateWorker() — Fee on Rating Creates Perverse Incentive

**Contract:** `JobMarket.sol:105-131`

**Description:** The worker only gets paid when the **buyer rates them**. If the buyer never rates, the worker's escrowed reward is locked forever. The buyer has zero incentive to rate (especially if unhappy), creating a griefing vector.

**Impact:** Workers may never receive payment for completed work.

**Recommendation:** Separate payment release from rating. Auto-release after timeout, or let worker claim after buyer confirmation period expires.

---

## 🟡 Medium Findings

### M-01: AgentTBA.ownerToAgent Mapping Not Updated on NFT Transfer

**Contract:** `AgentTBA.sol`

**Description:** `ownerToAgent[msg.sender]` is set during `createAgent()` but never updated when the ERC-721 NFT is transferred. After transfer, `ownerToAgent` points to the old owner, and the new owner cannot create a new agent (the old owner's mapping isn't cleared). `equipSkill`/`unequipSkill` use `ownerOf()` correctly, but the mapping is stale.

**Impact:** Inconsistent state after NFT transfers. Cannot create new agents from transferred-from addresses.

**Recommendation:** Override `_update()` (OZ ERC721 hook) to update the mapping:
```solidity
function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
    address from = super._update(to, tokenId, auth);
    if (from != address(0)) ownerToAgent[from] = 0;
    if (to != address(0)) ownerToAgent[to] = tokenId;
    return from;
}
```

### M-02: ReputationEngine — Division by Zero if totalRatings is 0

**Contract:** `ReputationEngine.sol:75-79, 88-101`

**Description:** `getGlobalReputation()` and `calculateFee()` iterate `_ratedSkills` and sum `totalScore`/`totalRatings`. If somehow `_ratedSkills` is non-empty but all entries have `totalRatings == 0`, division by zero occurs. While currently unlikely (ratings start at 1), future code changes could trigger this.

**Recommendation:** Add `if (totalRatings == 0) return 50;` guard before division.

### M-03: SkillRegistry.buySkill() — Royalty Calculated on msg.value, Not price

**Contract:** `SkillRegistry.sol:72`

**Description:** `uint256 royalty = (msg.value * s.royaltyBps) / 10000;` — royalty is calculated on `msg.value` which can be higher than `s.price` (excess is refunded). If someone sends 100 ETH for a 0.01 ETH skill, the creator gets a massive royalty. The refund happens AFTER royalty payment.

**Impact:** Overpayment of creator royalties. The excess refund on L81 only refunds `msg.value - s.price`, not accounting for the inflated royalty.

**Recommendation:** Calculate royalty on `s.price`, not `msg.value`:
```solidity
uint256 royalty = (s.price * s.royaltyBps) / 10000;
```

### M-04: AgentIdentity — No ReentrancyGuard, But Minimal Risk

**Contract:** `AgentIdentity.sol`

**Description:** No reentrancy protection, but there are no external calls or ETH transfers, so current risk is minimal. Flagged for awareness if future upgrades add interactions.

---

## 🔵 Low Findings

### L-01: Pragma Version Inconsistency

**Detector:** Slither `pragma`

Some contracts use `0.8.26` (fixed), others use `^0.8.26` (floating). Recommend standardizing to `0.8.26` across all files.

### L-02: Local Variable Shadowing

**Detector:** Slither `shadowing-local`

- `AgentTBA.createAgent(name)` shadows `ERC721.name()`
- `AgentTBA.getAgent().name` shadows `ERC721.name()`
- `MaiatEvaluator.constructor._owner` shadows `Ownable._owner`

**Recommendation:** Rename local variables (e.g., `agentName` instead of `name`).

### L-03: Missing Zero-Address Checks

**Contracts:** `JobMarket.sol`, `ReputationEngine.sol`

Constructor parameters (`_reputationEngine`, `_skillRegistry`) don't validate against `address(0)`.

### L-04: No Event Emission in AgentIdentity.cancelOwnershipTransfer()

**Contract:** `AgentIdentity.sol`

`cancelOwnershipTransfer()` silently clears `pendingOwner` without emitting an event.

### L-05: TrustScoreOracle.getScore() Strict Equality

**Detector:** Slither `incorrect-equality`

`ts.lastUpdated == 0` is a strict equality check. While safe here (0 is the default for unset timestamps), flagged as informational.

---

## ℹ️ Informational

### I-01: No Test Suite

**Impact:** Zero test coverage. No unit tests, integration tests, or fuzz tests exist. This is the single biggest risk factor for production deployment.

**Recommendation:** Before mainnet: add Foundry tests for all entry points, especially `buySkill()` reentrancy, `withdrawFees()` accounting, and `evaluate()` edge cases.

### I-02: IQ402Facilitator is Interface Only

The x402 payment interface is defined but has no implementation. Production deployment requires connecting to OKX OnchainOS `okx-x402-payment` or building a concrete facilitator.

### I-03: AgentTBA ERC-6551 is Simplified

The TBA address computation is a local hash, not using the canonical ERC-6551 Registry (`0x000000006551c19487814612e58FE06813775758`). Skills are tracked in state rather than actually transferred to the TBA. This is acceptable for hackathon but should be upgraded for production.

### I-04: Low-Level Calls for ETH Transfer

Multiple contracts use `call{value: amount}("")` for ETH transfers. While this is the recommended pattern (vs `transfer()`), ensure all return values are checked (they are ✅).

---

## Entry Point Analysis

### Public (Unrestricted) — 10 functions
| Function | Contract | Notes |
|----------|----------|-------|
| `postJob()` | JobMarket | Payable, creates escrow |
| `acceptJob()` | JobMarket | Worker accepts |
| `completeJob()` | JobMarket | Worker marks done |
| `buyerRateWorker()` | JobMarket | Triggers payout |
| `workerRateBuyer()` | JobMarket | Mutual review |
| `cancelJob()` | JobMarket | Buyer refund |
| `createSkill()` | SkillRegistry | Anyone creates skill type |
| `buySkill()` | SkillRegistry | **⚠️ C-01 reentrancy** |
| `createAgent()` | AgentTBA | 1 agent per address |
| `register()` | AgentIdentity | Self-register |

### Role-Restricted — 12 functions
| Function | Contract | Restriction |
|----------|----------|-------------|
| `withdrawFees()` | JobMarket | `owner` **⚠️ H-01** |
| `withdraw()` | SkillRegistry | `onlyOwner` |
| `setAuthorizedCaller()` | ReputationEngine | `onlyOwner` |
| `evaluate()` | MaiatEvaluator | Optional caller whitelist |
| `setThreshold/Oracle/etc` | MaiatEvaluator | `onlyOwner` (Ownable2Step) |
| `updateTokenScore()` | TrustScoreOracle | `UPDATER_ROLE` |
| `updateUserReputation()` | TrustScoreOracle | `UPDATER_ROLE` |
| `batch*()` | TrustScoreOracle | `UPDATER_ROLE` |
| `pause/unpause()` | TrustScoreOracle | `DEFAULT_ADMIN_ROLE` |
| `registerFor()` | AgentIdentity | `owner` |
| `setAgentURIFor()` | AgentIdentity | `owner` |

---

## Recommendations Summary

| Priority | Action |
|----------|--------|
| **P0** | Fix C-01: SkillRegistry reentrancy (add ReentrancyGuard or CEI) |
| **P0** | Fix H-01: Track fees separately in JobMarket |
| **P1** | Fix H-02: Add job deadlines + dispute resolution |
| **P1** | Fix H-03: Separate payment from rating |
| **P1** | Fix M-01: Update ownerToAgent on transfer |
| **P1** | Fix M-03: Royalty on price, not msg.value |
| **P2** | Add comprehensive Foundry test suite |
| **P2** | Standardize pragma versions |
| **P2** | Add zero-address checks |

---

## Methodology

1. **Static Analysis:** Slither v0.10.x with `--exclude-dependencies` (33 findings, 101 detectors)
2. **Manual Review:** Line-by-line analysis following Trail of Bits audit-context-building methodology
3. **Entry Point Analysis:** All state-changing functions categorized by access level (SolSkill methodology)
4. **Pattern Matching:** Pashov-style vulnerability pattern detection (reentrancy, access control, fund handling, oracle manipulation)
5. **CEI Verification:** Checked all functions for checks-effects-interactions ordering

---

---

## Addendum: Post-Audit Contracts (2026-03-28 15:20)

### AgentFactory.sol — Slither + Manual Review

**Findings:**

| ID | Severity | Finding |
|----|----------|---------|
| AF-01 | 🟠 High | `registerFor()` requires Factory to be AgentIdentity owner. Deploy must transfer ownership or add authorized caller. Without this, `registerAgent()` reverts. |
| AF-02 | 🔵 Low | `unused-return` on `getAgent()` — intentionally ignoring unused tuple fields. No impact. |
| AF-03 | 🔵 Low | Event emitted after 2 external calls (reentrancy-events). No state-changing risk — event ordering only. |

**Recommendation:** Add `authorizedFactory` mapping to AgentIdentity, or transfer ownership post-deploy.

### EvaluatorRegistry.sol — Slither + Manual Review

**Findings:**

| ID | Severity | Finding |
|----|----------|---------|
| ER-01 | 🔵 Low | Constructor `_owner` shadows `Ownable._owner`. Standard OZ pattern, no impact. |

**Verdict:** Clean. Pure admin registry — no ETH handling, no reentrancy vectors.

### Audit Coverage: 9/9 contracts ✅

| Contract | Slither | Manual | Status |
|----------|---------|--------|--------|
| MaiatEvaluator | ✅ | ✅ | Audited |
| JobMarket | ✅ | ✅ | Audited + Fixed (C-01, H-01) |
| ReputationEngine | ✅ | ✅ | Audited |
| TrustScoreOracle | ✅ | ✅ | Audited |
| SkillRegistry | ✅ | ✅ | Audited + Fixed (C-01) |
| AgentTBA | ✅ | ✅ | Audited + Fixed (M-01) |
| AgentIdentity | ✅ | ✅ | Audited |
| AgentFactory | ✅ | ✅ | Audited (AF-01 noted) |
| EvaluatorRegistry | ✅ | ✅ | Audited — Clean |

*Report generated by Jensen 🐺 using Trail of Bits Slither + manual Pashov/SolSkill review methodology.*
