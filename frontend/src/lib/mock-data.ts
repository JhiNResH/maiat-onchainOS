// Mock data for Maiat onchainOS — Pixel Tamagotchi Edition

export type TierName = 'Kozo' | 'Senpai' | 'Tatsujin' | 'Sensei';

export interface TierInfo {
  name: TierName;
  emoji: string;
  label: string;
  fee: string;
  minTrust: number;
  scarabCost: number;
  color: string;
}

export const TIERS: Record<TierName, TierInfo> = {
  Kozo:     { name: 'Kozo',     emoji: '🥚', label: '小僧', fee: '5%', minTrust: 0,  scarabCost: 0,     color: '#A0AEC0' },
  Senpai:   { name: 'Senpai',   emoji: '⭐', label: '先輩', fee: '3%', minTrust: 25, scarabCost: 100,   color: '#64B5F6' },
  Tatsujin: { name: 'Tatsujin', emoji: '🦸', label: '達人', fee: '2%', minTrust: 60, scarabCost: 1000,  color: '#B388FF' },
  Sensei:   { name: 'Sensei',   emoji: '👑', label: '先生', fee: '1%', minTrust: 85, scarabCost: 10000, color: '#FFD54F' },
};

export function getTier(trust: number): TierInfo {
  if (trust >= 85) return TIERS.Sensei;
  if (trust >= 60) return TIERS.Tatsujin;
  if (trust >= 25) return TIERS.Senpai;
  return TIERS.Kozo;
}

export type SkillType = 'Hard' | 'Operational' | 'Performance';

export interface SoulboundSkill {
  id: string;
  name: string;
  icon: string;
  category: string;
  type: SkillType;
  stars: number; // 1-5
  certified: boolean;
}

export interface Agent {
  address: string;
  name: string;
  trust: number;
  scarab: number;
  scarabBurned: number;
  skills: SoulboundSkill[];
  completedJobs: number;
  totalEarnings: number;
  avgRating: number;
  registeredDays: number;
  status: 'active' | 'busy' | 'offline';
  category: string; // primary domain
  // Trust breakdown
  trackRecord: number;
  specialization: number;
  consistency: number;
  // Activity log
  recentActivity: { text: string; type: 'success' | 'warning' | 'info' }[];
}

export const AGENTS: Agent[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: '0xAlpha.eth',
    trust: 92,
    scarab: 12500,
    scarabBurned: 10000,
    skills: [
      { id: 's1', name: 'DeFi Routing', icon: '🔀', category: 'DeFi', type: 'Hard', stars: 5, certified: true },
      { id: 's2', name: 'Token Trading', icon: '📈', category: 'Trading', type: 'Performance', stars: 4, certified: true },
      { id: 's3', name: 'Data Analysis', icon: '📊', category: 'Analytics', type: 'Hard', stars: 5, certified: true },
      { id: 's4', name: 'MEV Protection', icon: '🛡️', category: 'Security', type: 'Operational', stars: 4, certified: true },
    ],
    completedJobs: 312,
    totalEarnings: 234.5,
    avgRating: 4.8,
    registeredDays: 128,
    status: 'active',
    category: 'DeFi',
    trackRecord: 95,
    specialization: 90,
    consistency: 88,
    recentActivity: [
      { text: 'JOB #312 COMPLETE — ★★★★★ — +20 SCARAB', type: 'success' },
      { text: 'SKILL UPGRADED: DATA ANALYSIS ★★★★ → ★★★★★', type: 'success' },
      { text: 'TRUST UPDATED: 90 → 92 (+2)', type: 'info' },
      { text: 'EVOLVED TO SENSEI 👑', type: 'success' },
    ],
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Satoshi.eth',
    trust: 94,
    scarab: 15200,
    scarabBurned: 10000,
    skills: [
      { id: 's5', name: 'Smart Contract Audit', icon: '🛡️', category: 'Security', type: 'Hard', stars: 5, certified: true },
      { id: 's6', name: 'Security Scanning', icon: '🔒', category: 'Security', type: 'Operational', stars: 5, certified: true },
      { id: 's7', name: 'Exploit Detection', icon: '🐛', category: 'Security', type: 'Hard', stars: 4, certified: true },
    ],
    completedJobs: 287,
    totalEarnings: 445.2,
    avgRating: 4.9,
    registeredDays: 200,
    status: 'active',
    category: 'Security',
    trackRecord: 96,
    specialization: 95,
    consistency: 90,
    recentActivity: [
      { text: 'JOB #287 COMPLETE — ★★★★★ — +20 SCARAB', type: 'success' },
      { text: 'FOUND CRITICAL BUG IN DEX CONTRACT', type: 'success' },
      { text: 'TRUST UPDATED: 93 → 94 (+1)', type: 'info' },
    ],
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'ContentMaster.ai',
    trust: 75,
    scarab: 2800,
    scarabBurned: 1000,
    skills: [
      { id: 's8', name: 'Content Creation', icon: '✍️', category: 'Content', type: 'Hard', stars: 4, certified: true },
      { id: 's9', name: 'SEO Optimization', icon: '🔍', category: 'Content', type: 'Performance', stars: 3, certified: true },
    ],
    completedJobs: 203,
    totalEarnings: 156.8,
    avgRating: 4.5,
    registeredDays: 95,
    status: 'busy',
    category: 'Content',
    trackRecord: 78,
    specialization: 72,
    consistency: 70,
    recentActivity: [
      { text: 'JOB #203 COMPLETE — ★★★★☆ — +15 SCARAB', type: 'success' },
      { text: 'SKILL WARNING: SEO ★★★☆☆ (DECLINING)', type: 'warning' },
    ],
  },
  {
    address: '0xfedcba9876543210fedcba9876543210fedcba98',
    name: 'BridgeBot.world',
    trust: 82,
    scarab: 4200,
    scarabBurned: 1000,
    skills: [
      { id: 's10', name: 'Cross-Chain Bridge', icon: '🌉', category: 'Infrastructure', type: 'Operational', stars: 4, certified: true },
      { id: 's11', name: 'Gas Optimization', icon: '⛽', category: 'Infrastructure', type: 'Performance', stars: 5, certified: true },
      { id: 's12', name: 'Route Finding', icon: '🗺️', category: 'Infrastructure', type: 'Hard', stars: 4, certified: true },
    ],
    completedJobs: 156,
    totalEarnings: 98.3,
    avgRating: 4.6,
    registeredDays: 80,
    status: 'active',
    category: 'Infrastructure',
    trackRecord: 85,
    specialization: 80,
    consistency: 78,
    recentActivity: [
      { text: 'JOB #156 COMPLETE — ★★★★★ — +20 SCARAB', type: 'success' },
      { text: 'TRUST UPDATED: 80 → 82 (+2)', type: 'info' },
    ],
  },
  {
    address: '0x1111222233334444555566667777888899990000',
    name: 'DeliveryBot.serve',
    trust: 71,
    scarab: 1800,
    scarabBurned: 100,
    skills: [
      { id: 's13', name: 'Delivery Ops', icon: '🚚', category: 'Delivery', type: 'Operational', stars: 4, certified: true },
      { id: 's14', name: 'Route Planning', icon: '📍', category: 'Delivery', type: 'Hard', stars: 3, certified: true },
    ],
    completedJobs: 98,
    totalEarnings: 45.2,
    avgRating: 4.3,
    registeredDays: 60,
    status: 'active',
    category: 'Delivery',
    trackRecord: 74,
    specialization: 68,
    consistency: 70,
    recentActivity: [
      { text: 'JOB #98 COMPLETE — ★★★★☆ — +15 SCARAB', type: 'success' },
      { text: 'DELIVERY SUCCESS RATE: 96%', type: 'info' },
    ],
  },
  {
    address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    name: 'NewKid.world',
    trust: 15,
    scarab: 45,
    scarabBurned: 0,
    skills: [
      { id: 's15', name: 'Data Entry', icon: '⌨️', category: 'General', type: 'Hard', stars: 2, certified: true },
    ],
    completedJobs: 5,
    totalEarnings: 1.2,
    avgRating: 3.8,
    registeredDays: 7,
    status: 'active',
    category: 'General',
    trackRecord: 20,
    specialization: 10,
    consistency: 15,
    recentActivity: [
      { text: 'JOB #5 COMPLETE — ★★★★☆ — +10 SCARAB', type: 'success' },
      { text: 'REGISTERED AS KOZO 🥚', type: 'info' },
    ],
  },
];

export const CATEGORIES = ['All', 'Security', 'DeFi', 'Content', 'Infrastructure', 'Delivery', 'General'];

export function getAgentByAddress(address: string): Agent | undefined {
  return AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
}

export function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
