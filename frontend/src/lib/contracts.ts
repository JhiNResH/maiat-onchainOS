// Contract addresses — UPDATE after deployment
// Set via env vars or hardcode after forge script
export const CONTRACTS = {
  reputationEngine: process.env.NEXT_PUBLIC_REPUTATION_ENGINE || "0x",
  skillRegistry: process.env.NEXT_PUBLIC_SKILL_REGISTRY || "0x",
  agentTBA: process.env.NEXT_PUBLIC_AGENT_TBA || "0x",
  jobMarket: process.env.NEXT_PUBLIC_JOB_MARKET || "0x",
  trustScoreOracle: process.env.NEXT_PUBLIC_TRUST_SCORE_ORACLE || "0x",
  agentIdentity: process.env.NEXT_PUBLIC_AGENT_IDENTITY || "0x",
  agentFactory: process.env.NEXT_PUBLIC_AGENT_FACTORY || "0x",
  maiatEvaluator: process.env.NEXT_PUBLIC_MAIAT_EVALUATOR || "0x",
  evaluatorRegistry: process.env.NEXT_PUBLIC_EVALUATOR_REGISTRY || "0x",
} as const;

// SkillRegistry ABI (relevant functions only)
export const SKILL_REGISTRY_ABI = [
  {
    name: "buySkill",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "skillId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "createSkill",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "price", type: "uint256" },
      { name: "royaltyBps", type: "uint16" },
    ],
    outputs: [{ name: "skillId", type: "uint256" }],
  },
  {
    name: "skills",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "skillId", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "creator", type: "address" },
      { name: "price", type: "uint256" },
      { name: "royaltyBps", type: "uint16" },
      { name: "totalBuyers", type: "uint256" },
      { name: "exists", type: "bool" },
    ],
  },
  {
    name: "nextSkillId",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "hasSkill",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "skillId", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// AgentFactory ABI
export const AGENT_FACTORY_ABI = [
  {
    name: "registerAgent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "agentURI", type: "string" },
    ],
    outputs: [
      { name: "tbaAgentId", type: "uint256" },
      { name: "identityAgentId", type: "uint256" },
      { name: "tbaAddress", type: "address" },
    ],
  },
  {
    name: "isFullyRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [
      { name: "hasTBA", type: "bool" },
      { name: "hasIdentity", type: "bool" },
    ],
  },
] as const;

// JobMarket ABI
export const JOB_MARKET_ABI = [
  {
    name: "postJob",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "description", type: "string" },
      { name: "preferredSkillId", type: "uint256" },
      { name: "durationSeconds", type: "uint256" },
    ],
    outputs: [{ name: "jobId", type: "uint256" }],
  },
  {
    name: "acceptJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "completeJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getOpenJobs",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getJob",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [
      { name: "buyer", type: "address" },
      { name: "worker", type: "address" },
      { name: "description", type: "string" },
      { name: "reward", type: "uint256" },
      { name: "preferredSkillId", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "buyerRating", type: "uint8" },
      { name: "workerRating", type: "uint8" },
      { name: "createdAt", type: "uint256" },
    ],
  },
] as const;

// AgentTBA ABI
export const AGENT_TBA_ABI = [
  {
    name: "createAgent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentName", type: "string" }],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
  {
    name: "equipSkill",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "skillId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getAgent",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      { name: "agentName", type: "string" },
      { name: "agentOwner", type: "address" },
      { name: "tbaAddress", type: "address" },
      { name: "equippedSkills", type: "uint256[]" },
    ],
  },
  {
    name: "getAgentByOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner_", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
