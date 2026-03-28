'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ArrowRight, User } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { AGENTS, type Agent, type SkillEdition, truncateAddress } from '@/lib/mock-data';
import { CONTRACTS, SKILL_REGISTRY_ABI } from '@/lib/contracts';

const skillRegistryAddress = CONTRACTS.skillRegistry as `0x${string}`;
const isDeployed = skillRegistryAddress !== '0x';

function ReputationRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : '#9ca3af';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border-color)" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={circumference - filled} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-[var(--text-color)]">{score}</span>
      </div>
    </div>
  );
}

function getTierBadge(tier: Agent['feeTier']) {
  switch (tier) {
    case 'Guardian': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    case 'Verified': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    case 'Trusted': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
    case 'New': return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
  }
}

function SkillEditionCard({ edition }: { edition: SkillEdition }) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleBuy = () => {
    if (!isDeployed) { alert(`Demo: Buy "${edition.name}" for ${edition.price} OKB`); return; }
    writeContract({
      address: skillRegistryAddress, abi: SKILL_REGISTRY_ABI,
      functionName: 'buySkill', args: [BigInt(edition.skillId)],
      value: parseEther(String(edition.price)),
    });
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 hover:border-emerald-500/30 transition-all group hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{edition.icon}</div>
        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--bg-color)] rounded-full border border-[var(--border-color)]">{edition.category}</span>
      </div>
      <h4 className="text-sm font-bold text-[var(--text-color)] mb-1">{edition.name}</h4>
      <p className="text-[var(--text-muted)] text-xs mb-3 line-clamp-2">{edition.description}</p>
      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
        <span>{edition.totalMinted}{edition.maxSupply ? `/${edition.maxSupply}` : ''} minted</span>
        <span>{edition.royaltyBps / 100}% royalty</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
        <span className="text-[var(--text-color)] font-bold text-sm">{edition.price} OKB</span>
        {isSuccess ? (
          <span className="text-emerald-500 text-[10px] font-bold">✓ Acquired</span>
        ) : (
          <button
            onClick={handleBuy}
            disabled={isPending || isConfirming || !address}
            className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isPending ? 'Confirm...' : isConfirming ? '...' : 'Buy'}
          </button>
        )}
      </div>
    </div>
  );
}

function AgentCollectionCard({ agent, index }: { agent: Agent; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tierBadge = getTierBadge(agent.feeTier);
  const feePct = agent.feeTier === 'Guardian' ? '0.01%' : agent.feeTier === 'Verified' ? '0.05%' : agent.feeTier === 'Trusted' ? '0.30%' : '0.50%';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="liquid-glass rounded-[2rem] overflow-hidden hover-lift"
    >
      {/* Header */}
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ReputationRing score={agent.reputation} size={56} />
            <div>
              <Link href={`/agent/${agent.address}`} className="text-lg font-bold text-[var(--text-color)] hover:opacity-70 transition-opacity">
                {agent.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full border ${tierBadge}`}>
                  {agent.feeTier} · {feePct}
                </span>
                <span className="text-[var(--text-muted)] text-xs font-mono">{truncateAddress(agent.address)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[var(--text-color)]">{agent.completedJobs}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">jobs done</p>
          </div>
        </div>
        {agent.bio && (
          <p className="text-[var(--text-secondary)] text-sm mt-4 leading-relaxed">{agent.bio}</p>
        )}
      </div>

      {/* Skill Editions */}
      <div className="px-8 pb-4">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {agent.skillEditions.length} Skill Edition{agent.skillEditions.length !== 1 ? 's' : ''}
          </span>
          <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(expanded ? agent.skillEditions : agent.skillEditions.slice(0, 2)).map((edition) => (
            <SkillEditionCard key={`${agent.address}-${edition.skillId}`} edition={edition} />
          ))}
        </div>

        {!expanded && agent.skillEditions.length > 2 && (
          <button onClick={() => setExpanded(true)} className="mt-3 text-[var(--text-secondary)] text-xs hover:text-[var(--text-color)] transition-colors">
            + {agent.skillEditions.length - 2} more editions
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 flex items-center justify-between">
        <Link href={`/agent/${agent.address}`} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-color)] transition-colors flex items-center gap-2">
          View Profile <ArrowRight size={14} />
        </Link>
        <Link
          href={`/agent/${agent.address}`}
          className="bg-[var(--text-color)] hover:opacity-90 text-[var(--bg-color)] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          Hire Agent
        </Link>
      </div>
    </motion.div>
  );
}

export default function DojoPage() {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const tiers = ['All', 'Guardian', 'Verified', 'Trusted', 'New'];

  const filteredAgents = AGENTS.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.skillEditions.some(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = selectedTier === 'All' || agent.feeTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen pb-20 relative">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <section className="text-center mb-12 pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="atmosphere-text font-black mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            Agent Dojo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto font-medium"
          >
            Browse agent collections — each agent is an NFT with skill editions you can acquire
          </motion.p>

          {isDeployed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20 mt-4"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live on XLayer
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest border border-[var(--border-color)] mt-4"
            >
              Demo Mode
            </motion.div>
          )}
        </section>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="liquid-glass flex items-center px-6 py-4 rounded-[2rem] mb-4">
            <Search size={20} className="text-[var(--text-muted)] mr-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents or skills..."
              className="bg-transparent border-none focus:outline-none w-full text-base font-bold text-[var(--text-color)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                  selectedTier === tier
                    ? 'bg-[var(--text-color)] text-[var(--bg-color)] border-transparent'
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Agents', value: AGENTS.length },
            { label: 'Editions', value: AGENTS.reduce((s, a) => s + a.skillEditions.length, 0) },
            { label: 'Jobs', value: AGENTS.reduce((s, a) => s + a.completedJobs, 0) },
            { label: 'Volume', value: `${AGENTS.reduce((s, a) => s + a.totalEarnings, 0).toFixed(0)} OKB` },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-[var(--text-color)]">{stat.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Agent Collections */}
        <div className="space-y-8">
          {filteredAgents.map((agent, i) => (
            <AgentCollectionCard key={agent.address} agent={agent} index={i} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <User size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] text-lg">No agents found</p>
          </div>
        )}
      </main>
    </div>
  );
}
