// Mock data for Maiat XLayer Hackathon Demo

export interface Skill {
  id: string;
  name: string;
  description: string;
  price: number;
  royalty: number;
  creator: string;
  totalBuyers: number;
  rating: number;
  category: string;
  icon: string;
}

export interface Job {
  id: string;
  description: string;
  reward: number;
  requiredSkill: string;
  buyer: string;
  worker?: string;
  status: 'open' | 'in_progress' | 'completed' | 'disputed';
  buyerRating?: number;
  workerRating?: number;
  createdAt: string;
}

export interface Agent {
  address: string;
  name: string;
  reputation: number;
  equippedSkills: string[];
  completedJobs: number;
  totalEarnings: number;
  feeTier: 'Guardian' | 'Verified' | 'Trusted' | 'New';
  joinedAt: string;
  skillRatings: Record<string, number>;
}

export const SKILLS: Skill[] = [
  {
    id: 'skill-1',
    name: 'DeFi Routing',
    description: 'Optimal swap routing across DEXs with MEV protection and slippage optimization',
    price: 0.5,
    royalty: 5,
    creator: '0x1234...5678',
    totalBuyers: 47,
    rating: 4.8,
    category: 'DeFi',
    icon: '🔀',
  },
  {
    id: 'skill-2',
    name: 'Smart Contract Audit',
    description: 'Automated vulnerability scanning with formal verification and exploit detection',
    price: 2.0,
    royalty: 10,
    creator: '0xabcd...ef01',
    totalBuyers: 23,
    rating: 4.9,
    category: 'Security',
    icon: '🛡️',
  },
  {
    id: 'skill-3',
    name: 'Data Analysis',
    description: 'On-chain analytics, wallet profiling, and market sentiment analysis',
    price: 0.3,
    royalty: 3,
    creator: '0x9876...5432',
    totalBuyers: 89,
    rating: 4.6,
    category: 'Analytics',
    icon: '📊',
  },
  {
    id: 'skill-4',
    name: 'Content Creation',
    description: 'AI-powered content generation for social media, docs, and marketing',
    price: 0.2,
    royalty: 2,
    creator: '0xfedc...ba98',
    totalBuyers: 156,
    rating: 4.4,
    category: 'Content',
    icon: '✍️',
  },
  {
    id: 'skill-5',
    name: 'Token Trading',
    description: 'Algorithmic trading strategies with risk management and portfolio balancing',
    price: 1.5,
    royalty: 8,
    creator: '0x2468...1357',
    totalBuyers: 34,
    rating: 4.7,
    category: 'Trading',
    icon: '📈',
  },
  {
    id: 'skill-6',
    name: 'Security Scanning',
    description: 'Real-time threat detection, honeypot analysis, and rug pull prevention',
    price: 0.8,
    royalty: 6,
    creator: '0x1357...2468',
    totalBuyers: 62,
    rating: 4.9,
    category: 'Security',
    icon: '🔒',
  },
  {
    id: 'skill-7',
    name: 'NFT Valuation',
    description: 'AI-powered NFT appraisal using rarity analysis and market trends',
    price: 0.4,
    royalty: 4,
    creator: '0xaaaa...bbbb',
    totalBuyers: 41,
    rating: 4.3,
    category: 'NFT',
    icon: '🎨',
  },
  {
    id: 'skill-8',
    name: 'Cross-Chain Bridge',
    description: 'Secure asset bridging across chains with optimal fee routing',
    price: 1.0,
    royalty: 7,
    creator: '0xcccc...dddd',
    totalBuyers: 28,
    rating: 4.5,
    category: 'Infrastructure',
    icon: '🌉',
  },
];

export const JOBS: Job[] = [
  {
    id: 'job-1',
    description: 'Audit smart contract for new DEX launch on XLayer',
    reward: 5.0,
    requiredSkill: 'Smart Contract Audit',
    buyer: '0x7890...1234',
    status: 'open',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'job-2',
    description: 'Optimize swap routes for $100k USDT to OKB',
    reward: 2.5,
    requiredSkill: 'DeFi Routing',
    buyer: '0x4567...8901',
    worker: '0x1234...5678',
    status: 'in_progress',
    createdAt: '2024-03-14T14:20:00Z',
  },
  {
    id: 'job-3',
    description: 'Generate weekly market analysis report for portfolio',
    reward: 1.0,
    requiredSkill: 'Data Analysis',
    buyer: '0x2345...6789',
    worker: '0x9876...5432',
    status: 'completed',
    buyerRating: 5,
    workerRating: 5,
    createdAt: '2024-03-13T09:15:00Z',
  },
  {
    id: 'job-4',
    description: 'Create social media content for NFT collection launch',
    reward: 0.8,
    requiredSkill: 'Content Creation',
    buyer: '0x3456...7890',
    status: 'open',
    createdAt: '2024-03-15T08:00:00Z',
  },
  {
    id: 'job-5',
    description: 'Execute DCA strategy for 10 ETH over 7 days',
    reward: 3.0,
    requiredSkill: 'Token Trading',
    buyer: '0x5678...9012',
    worker: '0x2468...1357',
    status: 'in_progress',
    createdAt: '2024-03-12T16:45:00Z',
  },
  {
    id: 'job-6',
    description: 'Scan new token contract before investment',
    reward: 0.5,
    requiredSkill: 'Security Scanning',
    buyer: '0x6789...0123',
    worker: '0x1357...2468',
    status: 'completed',
    buyerRating: 5,
    workerRating: 4,
    createdAt: '2024-03-11T11:30:00Z',
  },
];

export const AGENTS: Agent[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'AlphaTrader.eth',
    reputation: 92,
    equippedSkills: ['DeFi Routing', 'Token Trading', 'Data Analysis'],
    completedJobs: 156,
    totalEarnings: 234.5,
    feeTier: 'Guardian',
    joinedAt: '2024-01-15',
    skillRatings: {
      'DeFi Routing': 4.9,
      'Token Trading': 4.7,
      'Data Analysis': 4.8,
    },
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'SecurityBot.xlayer',
    reputation: 88,
    equippedSkills: ['Smart Contract Audit', 'Security Scanning'],
    completedJobs: 89,
    totalEarnings: 178.2,
    feeTier: 'Verified',
    joinedAt: '2024-02-01',
    skillRatings: {
      'Smart Contract Audit': 4.9,
      'Security Scanning': 4.8,
    },
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'ContentMaster.ai',
    reputation: 75,
    equippedSkills: ['Content Creation', 'Data Analysis'],
    completedJobs: 234,
    totalEarnings: 156.8,
    feeTier: 'Trusted',
    joinedAt: '2024-02-20',
    skillRatings: {
      'Content Creation': 4.5,
      'Data Analysis': 4.4,
    },
  },
];

export interface Review {
  id: string;
  fromAddress: string;
  fromName: string;
  toAddress: string;
  rating: number;
  comment: string;
  jobDescription: string;
  skillUsed: string;
  createdAt: string;
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    fromAddress: '0x7890...1234',
    fromName: 'DeFiWhale.eth',
    toAddress: '0x1234567890abcdef1234567890abcdef12345678',
    rating: 5,
    comment: 'Incredibly fast swap routing. Saved me 0.3 OKB on slippage alone. Will hire again.',
    jobDescription: 'Optimize swap routes for $100k USDT to OKB',
    skillUsed: 'DeFi Routing',
    createdAt: '2024-03-14T18:30:00Z',
  },
  {
    id: 'rev-2',
    fromAddress: '0x4567...8901',
    fromName: 'BuilderDAO.xlayer',
    toAddress: '0x1234567890abcdef1234567890abcdef12345678',
    rating: 5,
    comment: 'Top-tier data analysis. The market sentiment report was detailed and actionable.',
    jobDescription: 'Generate weekly market analysis report',
    skillUsed: 'Data Analysis',
    createdAt: '2024-03-13T12:00:00Z',
  },
  {
    id: 'rev-3',
    fromAddress: '0x2345...6789',
    fromName: 'Trader_Mike',
    toAddress: '0x1234567890abcdef1234567890abcdef12345678',
    rating: 4,
    comment: 'Good execution on the DCA strategy. Minor delay on day 3 but recovered well.',
    jobDescription: 'Execute DCA strategy for 10 ETH over 7 days',
    skillUsed: 'Token Trading',
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'rev-4',
    fromAddress: '0x3456...7890',
    fromName: 'NFTCollector',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    rating: 5,
    comment: 'Found a critical reentrancy bug in our NFT marketplace. Saved us from a potential exploit.',
    jobDescription: 'Audit smart contract for new DEX launch',
    skillUsed: 'Smart Contract Audit',
    createdAt: '2024-03-12T14:00:00Z',
  },
  {
    id: 'rev-5',
    fromAddress: '0x5678...9012',
    fromName: 'SafeSwap.xyz',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    rating: 5,
    comment: 'Thorough security scan. Identified honeypot patterns we completely missed. Highly recommend.',
    jobDescription: 'Scan new token contract before investment',
    skillUsed: 'Security Scanning',
    createdAt: '2024-03-11T16:30:00Z',
  },
  {
    id: 'rev-6',
    fromAddress: '0x6789...0123',
    fromName: 'ContentDAO',
    toAddress: '0x9876543210fedcba9876543210fedcba98765432',
    rating: 4,
    comment: 'Great social media content. Could improve on the visual assets but writing was excellent.',
    jobDescription: 'Create social media content for NFT collection launch',
    skillUsed: 'Content Creation',
    createdAt: '2024-03-09T11:00:00Z',
  },
];

export function getReviewsForAgent(address: string): Review[] {
  return REVIEWS.filter(r =>
    r.toAddress.toLowerCase() === address.toLowerCase() ||
    r.toAddress.toLowerCase().includes(address.toLowerCase().replace('0x', '').slice(0, 8))
  );
}

export const STATS = {
  totalJobs: 1247,
  totalSkills: 86,
  totalAgents: 523,
  totalVolume: 15420,
};

export function getAgentByAddress(address: string): Agent | undefined {
  return AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase() ||
    a.address.toLowerCase().includes(address.toLowerCase().replace('0x', '')));
}

export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getFeeTierColor(tier: Agent['feeTier']): string {
  switch (tier) {
    case 'Guardian': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'Verified': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    case 'Trusted': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'New': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}

export function getReputationColor(score: number): string {
  if (score >= 90) return 'text-amber-400';
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-blue-400';
  return 'text-gray-400';
}

export function getStatusBadge(status: Job['status']): { text: string; color: string } {
  switch (status) {
    case 'open': return { text: 'Open', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    case 'in_progress': return { text: 'In Progress', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    case 'completed': return { text: 'Completed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    case 'disputed': return { text: 'Disputed', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  }
}
