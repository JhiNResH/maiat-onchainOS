## Spec: Maiat — The Reputation Clearing Network for Agent Economy (XLayer Hackathon)

**Goal:** 把 Maiat 從 "Yelp for Agents" 進化成完整的 **聲譽清算網絡** — Agent 做工賺錢、驗證賺錢、技能是 NFT、信譽影響收費，全部 on-chain 在 XLayer 上。

---

### 核心定位

**One-liner:** "The reputation clearing network for the agent economy — agents work to earn, verify to earn."

**跟現有 Maiat 的關係：** 這就是 Maiat 的最終產品形態。現有的 trust scoring + TrustGateHook 是基礎設施層，這次在上面建完整的 agent job marketplace + skill NFT + verification AVS。XLayer hackathon 是第一個落地場景，但架構是永久的。

---

### 系統角色（4 roles）

| 角色 | 功能 | 經濟激勵 |
|------|------|----------|
| **Buyer** | 發布任務、付錢、評價 Seller | 好 reputation → 更好的 Seller 願意接單 |
| **Seller** | 接任務、執行、交付 | 好 reputation → 更低手續費、更多單 |
| **Evaluator** | 評估 job quality、competence、attestation | 每次評估收費 + 聲譽積分 |
| **Verifier** | Stake 驗證每個 job 的結果正確性 | Stake 賺驗證獎勵（AVS 模式） |

---

### Job 流程（每個 job 統一 pipeline）

```
1. Buyer scored PB (reputation check) → needs a [service]
2. Dispatch funds → escrow (payment router: escrow / x402 / EIP)
3. Evaluator scored → find good Seller candidates
4. Seller matched → executes job
5. Evaluator: evaluate job quality, competence, attestation
6. Charge job fee (dynamic, based on reputation)
7. Seller scored → get paid
8. Verifiers: stake EXACT → verify each role → earn reward
```

**垂直場景示例（展示通用性）：**

| Job# | 場景 | Buyer 要什麼 | Seller 提供 |
|------|------|-------------|------------|
| 1 | Ride | 叫車 | 司機服務 |
| 2 | Swap | Token 交換 | DEX 路由 |
| 3 | Move | 搬家 | 搬運服務 |
| 4 | Delivery | 外送 | 送餐 |
| 5 | Staking | Staking 服務 | 節點運營 |

→ **Hackathon demo 聚焦 1-2 個場景**（建議：Swap + 一個非金融場景如 Delivery，展示通用性）

---

### Verification Layer（Maiat as AVS）

**架構：Maiat = Actively Validated Service**

**Verifier 選擇機制：**
- VRF（Chainlink）隨機選 Verifier → 防串謀
- Reputation + Stake weighted pool → 高信譽 + 高質押 = 更常被選中

**Restaking：EigenLayer 整合**
- Verifier 可以 restake ETH/LST 到 Maiat AVS
- Slash 條件：驗證錯誤 or 不作為

**3 個驗證 Track：**

| Track | 驗證方式 | 適用場景 |
|-------|---------|---------|
| **On-chain** | tx outcome 直接驗證 | Swap 成功/失敗、轉帳到帳 |
| **Proof-based (off-chain)** | 提交 proof → on-chain 驗證 | 外送拍照、任務完成截圖 |
| **Quality (multi-model)** | 多個 AI model 交叉評估 | 代碼品質、內容品質、創意工作 |

---

### Dispute Resolution

| 金額 | 機制 | 說明 |
|------|------|------|
| Small amount | **Kleros** | 去中心化仲裁法庭，低成本 |
| Big amount | **UMA** (Optimistic Oracle) | 鏈上爭議，escalation 機制 |

---

### 🥋 Dojo — Where Agents Learn Skills

**概念：** Agent 的技能培訓場 + NFT skill marketplace

**Dojo 角色：**
- **Kozo** (小僧) = Buyer — 花錢學技能
- **Sempai** (前輩) = Evaluator — 評估技能品質
- **Sensei** (師父) = Seller — 提供/販賣技能
- **Verifiers** — 驗證技能真實性

**Skill NFT 機制：**

```
1. Buy skills → ERC-1155 (可量產、可分類)
2. Receive skills → 存入 agent wallet
3. Wear skills on agent → ERC-6551 (TBA, token-bound account)
```

**Skill Tier 系統：**

| Tier | 標準 | On-chain |
|------|------|----------|
| **Free** | 基礎技能、入門 | ERC-8004 (Identity Registry) |
| **Pro** | 進階技能、認證 | ERC-6551 (Token-Bound Account) |

**經濟循環：**
- Sensei 創建 skill → mint ERC-1155 → 定價
- Kozo 購買 skill → 裝備到 ERC-6551 agent
- Sempai 評估 skill 品質 → 影響 skill 排名
- 高品質 skill 的 Sensei → 聲譽提升 → 更多銷量

---

### On-Chain 合約架構（XLayer 部署）

```
contracts/
├── core/
│   ├── JobRouter.sol          — Job 建立、escrow、完成、結算
│   ├── ReputationRegistry.sol — 信譽分數 CRUD（整合現有 ERC-8004）
│   ├── PaymentRouter.sol      — Escrow + x402 + 動態費率
│   └── DisputeResolver.sol    — Kleros/UMA 接口
├── avs/
│   ├── MaiatAVS.sol           — EigenLayer AVS registration
│   ├── VerifierPool.sol       — Stake weighted pool + VRF 選擇
│   └── SlashingConditions.sol — Slash 邏輯
├── dojo/
│   ├── SkillNFT.sol           — ERC-1155 skill tokens
│   ├── AgentTBA.sol           — ERC-6551 agent accounts
│   └── SkillMarketplace.sol   — 技能市場（list/buy/equip）
└── hooks/
    └── TrustGateHook.sol      — 現有 Uniswap V4 Hook（移植到 XLayer）
```

---

### Inputs / Outputs

**Inputs:**
- Agent wallet address (EOA or ERC-6551 TBA)
- Job request (type, params, budget)
- Skill NFT metadata (name, description, tier, price)
- Verification proofs (on-chain tx, off-chain proof, multi-model scores)

**Outputs:**
- Job completion attestation (BAS/EAS)
- Updated reputation scores (on-chain)
- Skill NFTs minted/transferred
- Verifier rewards distributed
- Dispute resolution outcome

---

### Acceptance Criteria

**Core（Hackathon MVP — must have）：**
- [ ] JobRouter: Buyer 發 job → Seller 接 → 完成 → 結算，全流程 on XLayer
- [ ] ReputationRegistry: 每次 job 完成後更新 Buyer/Seller/Evaluator 聲譽分數
- [ ] PaymentRouter: Escrow 機制 — 資金鎖定到 job 完成
- [ ] SkillNFT (ERC-1155): Mint、buy、transfer 技能 NFT
- [ ] AgentTBA (ERC-6551): Agent 建立 TBA → 裝備 skill NFT
- [ ] SkillMarketplace: List skill → buy skill → equip to agent（基本 UI）
- [ ] 至少 1 個完整 job 場景 demo（Swap or Delivery）
- [ ] 部署到 XLayer testnet
- [ ] 基本前端 UI（job board + skill marketplace + agent profile）
- [ ] tsc --noEmit passes
- [ ] 現有 tests 不 break

**Stretch（有時間就做）：**
- [ ] VerifierPool: Stake → VRF 選擇 → 驗證 → 獎勵
- [ ] DisputeResolver: Kleros integration（至少 mock）
- [ ] Multi-model quality track（2+ AI model 交叉評估）
- [ ] EigenLayer AVS registration（testnet）
- [ ] 動態費率：reputation score → fee tier（現有 TrustGateHook 邏輯移植）
- [ ] 第二個 job 場景 demo

**Out of Scope:**
- Production EigenLayer mainnet integration
- Real Kleros/UMA dispute resolution（mock OK）
- Mobile app
- Cross-chain（只做 XLayer）
- Token launch / tokenomics

---

### 技術選型

| Component | Tech | 理由 |
|-----------|------|------|
| Smart Contracts | Solidity + Foundry | 現有 codebase |
| Frontend | Next.js 16 + Tailwind | 複用 maiat-protocol |
| Chain | XLayer (OKX L2) | Hackathon 要求 |
| NFT | ERC-1155 + ERC-6551 | Skills = 1155, Agent = 6551 TBA |
| Identity | ERC-8004 | 現有 Maiat infra |
| VRF | block.prevrandao + commit-reveal | Verifier 隨機選擇（XLayer 無 Chainlink VRF）|
| DEX | Uniswap V3 (XLayer) | Swap 場景 — wrapper router 做動態費率 |
| Attestation | BAS (Base Attestation) or EAS | Job completion proof |

---

### 跟現有 Maiat 的關係

```
現有 Maiat (Base)                    XLayer Hackathon Build
─────────────────                    ─────────────────────
TrustScoreOracle          →→→       ReputationRegistry (擴展)
TrustGateHook (V4)        →→→       PaymentRouter dynamic fees
ERC-8004 Identity         →→→       Agent identity (直接用)
Guard SDK                 →→→       PaymentRouter pre-check
ACP Offerings             →→→       Job marketplace API layer
Wadjet ML                 →→→       Quality track evaluator
```

**產品演進：** 這就是 Maiat 最終形態。XLayer hackathon = 第一個部署鏈，之後 multi-chain。所有現有 Base 上的 infra 都會整合進來。

---

### 時間估算（4.5hr 極限版 — deadline 今天 23:59 UTC）

| 時間 | 交付物 |
|------|--------|
| 12:20-13:30 | 合約：SkillNFT (1155) + ReputationRegistry + AgentTBA (6551) |
| 13:30-14:30 | 部署 XLayer testnet + 合約驗證 |
| 14:30-16:00 | 前端：Skill marketplace + Agent profile |
| 16:00-16:59 | README + 提交 |

---

### Demo 腳本（Hackathon presentation）

```
1. Agent A (Buyer) 在 Dojo 買了 "DeFi Routing" skill NFT
2. Skill 裝備到 Agent A 的 ERC-6551 TBA
3. Agent B (Seller) 有高聲譽 + "Swap Execution" skill
4. Buyer 發布 Swap job → PaymentRouter escrow 資金
5. Evaluator 匹配最佳 Seller (基於 reputation + skill)
6. Seller 執行 swap → Evaluator 驗證品質
7. Verifier 確認結果 → 獎勵分發
8. 雙方聲譽更新 → 下次 Seller 享受更低手續費
```

**核心敘事：** "Every job makes the network smarter. Every skill makes agents better. Every verification makes trust real."
