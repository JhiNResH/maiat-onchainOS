'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { AGENTS, type Agent, type SkillEdition, getFeeTierColor, getReputationColor, truncateAddress } from '@/lib/mock-data';
import { CONTRACTS, SKILL_REGISTRY_ABI } from '@/lib/contracts';

const skillRegistryAddress = CONTRACTS.skillRegistry as `0x${string}`;
const isDeployed = skillRegistryAddress !== '0x';

function ReputationRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-800" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={circumference - filled} strokeLinecap="round"
          className={score >= 90 ? 'text-amber-400' : score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-blue-400' : 'text-gray-400'}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${getReputationColor(score)}`}>{score}</span>
      </div>
    </div>
  );
}

function SkillEditionCard({ edition, agentAddress }: { edition: SkillEdition; agentAddress: string }) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleBuy = () => {
    if (!isDeployed) {
      alert(`Demo: Buy "${edition.name}" for ${edition.price} OKB`);
      return;
    }
    writeContract({
      address: skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: 'buySkill',
      args: [BigInt(edition.skillId)],
      value: parseEther(String(edition.price)),
    });
  };

  return (
    <div className="rounded-xl p-4 transition-all group hover-lift" style={{ background: 'rgba(13, 14, 23, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{edition.icon}</div>
        <span className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 rounded-full">{edition.category}</span>
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{edition.name}</h4>
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{edition.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{edition.totalMinted}{edition.maxSupply ? `/${edition.maxSupply}` : ''} minted</span>
        <span>{edition.royaltyBps / 100}% royalty</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <span className="text-white font-semibold text-sm">{edition.price} OKB</span>
        {isSuccess ? (
          <span className="text-emerald-400 text-xs font-medium">✓ Acquired</span>
        ) : (
          <button
            onClick={handleBuy}
            disabled={isPending || isConfirming || !address}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.2), rgba(184, 134, 11, 0.1))', color: '#e8b84a', border: '1px solid rgba(212, 160, 23, 0.2)' }}
          >
            {isPending ? 'Confirm...' : isConfirming ? '...' : 'Buy Edition'}
          </button>
        )}
      </div>
    </div>
  );
}

function AgentCollectionCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);

  const tierColor = getFeeTierColor(agent.feeTier);
  const feePct = agent.feeTier === 'Guardian' ? '0.01%' : agent.feeTier === 'Verified' ? '0.05%' : agent.feeTier === 'Trusted' ? '0.30%' : '0.50%';

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Collection Header */}
      <div className="p-6" style={{ background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.03), rgba(13, 14, 23, 0.5))' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ReputationRing score={agent.reputation} size={56} />
            <div>
              <Link href={`/agent/${agent.address}`} className="text-lg font-bold text-white hover:text-amber-400 transition-colors">
                {agent.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${tierColor}`}>
                  {agent.feeTier} · {feePct} fee
                </span>
                <span className="text-gray-500 text-xs">{truncateAddress(agent.address)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{agent.completedJobs} jobs</p>
            <p className="text-gray-500 text-xs">{agent.totalEarnings} OKB earned</p>
          </div>
        </div>
        {agent.bio && (
          <p className="text-gray-400 text-sm mt-3">{agent.bio}</p>
        )}
      </div>

      {/* Skill Editions */}
      <div className="p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="text-sm font-medium text-gray-300">
            {agent.skillEditions.length} Skill Edition{agent.skillEditions.length !== 1 ? 's' : ''}
          </span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Always show first 2, expand for rest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(expanded ? agent.skillEditions : agent.skillEditions.slice(0, 2)).map((edition) => (
            <SkillEditionCard key={`${agent.address}-${edition.skillId}`} edition={edition} agentAddress={agent.address} />
          ))}
        </div>

        {!expanded && agent.skillEditions.length > 2 && (
          <button onClick={() => setExpanded(true)} className="mt-3 text-amber-400 text-xs hover:text-amber-300 transition-colors">
            + {agent.skillEditions.length - 2} more editions
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <Link
          href={`/agent/${agent.address}`}
          className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
        >
          View Full Profile →
        </Link>
        <Link
          href={`/agent/${agent.address}`}
          className="btn-gold px-4 py-2 rounded-lg text-sm"
        >
          Hire Agent
        </Link>
      </div>
    </div>
  );
}

export default function DojoPage() {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  const tiers = ['All', 'Guardian', 'Verified', 'Trusted', 'New'];

  const filteredAgents = AGENTS.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.skillEditions.some(s => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = selectedTier === 'All' || agent.feeTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Agent Dojo</h1>
          <p className="text-gray-400">
            Browse agent collections — each agent is an NFT with skill editions you can acquire
          </p>
          {isDeployed ? (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live on XLayer
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Demo Mode
            </span>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Agents', value: AGENTS.length },
            { label: 'Skill Editions', value: AGENTS.reduce((sum, a) => sum + a.skillEditions.length, 0) },
            { label: 'Jobs Completed', value: AGENTS.reduce((sum, a) => sum + a.completedJobs, 0) },
            { label: 'Volume (OKB)', value: AGENTS.reduce((sum, a) => sum + a.totalEarnings, 0).toFixed(0) },
          ].map((stat) => (
            <div key={stat.label} className="stat-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents or skills..."
              className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
              style={{ background: 'rgba(13, 14, 23, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)' }}
            />
          </div>
          <div className="flex gap-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedTier === tier
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Collections */}
        <div className="space-y-6 stagger-children">
          {filteredAgents.map((agent) => (
            <AgentCollectionCard key={agent.address} agent={agent} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No agents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
