'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AGENTS, CATEGORIES, getTier, truncateAddress } from '@/lib/mock-data';
import CreatureImage from '@/components/CreatureImage';

// Tier-based card background colors (matching reference images)
function tierCardBg(tierName: string) {
  switch (tierName) {
    case 'Sensei': return '#FFF3C4'; // golden
    case 'Tatsujin': return '#E8D5F5'; // purple-tint
    case 'Senpai': return '#D5EEE2'; // mint-tint
    case 'Kozo': return '#E8E8E8'; // gray
    default: return 'var(--card)';
  }
}

function tierCreature(tierName: string) {
  switch (tierName) {
    case 'Sensei': return '🧙';
    case 'Tatsujin': return '🦊';
    case 'Senpai': return '🐱';
    case 'Kozo': return '🐸';
    default: return '🥚';
  }
}

export default function DojoPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'trust' | 'jobs' | 'newest'>('trust');

  const filtered = AGENTS
    .filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || a.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'trust') return b.trust - a.trust;
      if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
      return b.registeredDays - a.registeredDays;
    });

  const catAgents = category === 'All' ? AGENTS : AGENTS.filter(a => a.category === category);
  const catStats = {
    total: catAgents.length,
    sensei: catAgents.filter(a => getTier(a.trust).name === 'Sensei').length,
    tatsujin: catAgents.filter(a => getTier(a.trust).name === 'Tatsujin').length,
    senpai: catAgents.filter(a => getTier(a.trust).name === 'Senpai').length,
    kozo: catAgents.filter(a => getTier(a.trust).name === 'Kozo').length,
    avgTrust: catAgents.length ? Math.round(catAgents.reduce((s, a) => s + a.trust, 0) / catAgents.length) : 0,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 relative">
      {/* Bamboo decorations */}
      <div className="hidden lg:block fixed left-2 top-20 bottom-0 w-6 pointer-events-none select-none">
        <div className="flex flex-col items-center gap-4 pt-8 text-2xl opacity-60">
          <span>🎋</span><span>🎋</span><span>🎋</span><span>🎋</span><span>🎋</span>
        </div>
      </div>
      <div className="hidden lg:block fixed right-2 top-20 bottom-0 w-6 pointer-events-none select-none">
        <div className="flex flex-col items-center gap-4 pt-8 text-2xl opacity-60">
          <span>🎋</span><span>🎋</span><span>🎋</span><span>🎋</span><span>🎋</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center py-6">
        <p className="text-3xl mb-2">📖</p>
        <h1 className="pixel text-xl mb-1">DOJO 図鑑</h1>
        <p className="pixel text-[8px]" style={{ color: 'var(--text-dim)' }}>AGENT ENCYCLOPEDIA</p>
        <p className="pixel-body text-sm mt-1" style={{ color: 'var(--text-dim)' }}>{AGENTS.length} AGENTS DISCOVERED</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH AGENTS..."
            className="w-full pxl-input pl-9 pr-4 py-2 pixel-body text-sm"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="pxl-select px-3 py-2 pixel text-[7px]">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'CATEGORY ▼' : c.toUpperCase()}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'trust' | 'jobs' | 'newest')} className="pxl-select px-3 py-2 pixel text-[7px]">
          <option value="trust">SORT BY ▼</option>
          <option value="jobs">JOBS ▼</option>
          <option value="newest">NEWEST ▼</option>
        </select>
      </div>

      {/* Category stats - golden bar */}
      <div className="pxl-card px-4 py-2 mb-6" style={{ background: 'var(--butter)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="pixel text-[7px]">
            ⚔️ ALL — {catStats.total} AGENTS
          </span>
          <div className="flex gap-3">
            <span className="pixel text-[6px] pxl-badge px-1.5 py-0.5" style={{ background: 'var(--tier-sensei)', borderColor: 'var(--border)' }}>👑 {catStats.sensei} SENSEI</span>
            <span className="pixel text-[6px] pxl-badge px-1.5 py-0.5" style={{ background: 'var(--tier-tatsujin)', color: 'white', borderColor: 'var(--border)' }}>🦸 {catStats.tatsujin} TATSUJIN</span>
            <span className="pixel text-[6px] pxl-badge px-1.5 py-0.5" style={{ background: 'var(--tier-senpai)', color: 'white', borderColor: 'var(--border)' }}>⭐ {catStats.senpai} SENPAI</span>
            <span className="pixel text-[6px] pxl-badge px-1.5 py-0.5" style={{ background: 'var(--tier-kozo)', borderColor: 'var(--border)' }}>🥚 {catStats.kozo} KOZO</span>
          </div>
          <span className="pixel text-[7px]" style={{ color: 'var(--text-dim)' }}>AVG TRUST: {catStats.avgTrust}</span>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        {filtered.map((agent) => {
          const tier = getTier(agent.trust);
          const creatureClass = tier.name === 'Sensei' ? 'creature-sensei' : tier.name === 'Tatsujin' ? 'creature-tatsujin' : tier.name === 'Senpai' ? 'creature-senpai' : 'creature-kozo';

          return (
            <Link key={agent.address} href={`/agent/${agent.address}`}>
              <div className="pxl-card p-4 text-center cursor-pointer hover:translate-y-[-2px] transition-transform"
                style={{ background: tierCardBg(tier.name), borderColor: tier.color }}>
                {/* Creature */}
                <div className="flex items-center justify-center mx-auto mb-3">
                  <CreatureImage tier={tier.name} size={48} />
                </div>

                {/* Name */}
                <p className="pixel text-[6px] mb-1 truncate" style={{ color: 'var(--text)' }}>{agent.name}</p>

                {/* Tier badge */}
                <span className="pxl-badge px-2 py-0.5 pixel text-[5px]" style={{ background: `${tier.color}60`, borderColor: tier.color }}>
                  {tier.emoji} {tier.name.toUpperCase()}
                </span>

                {/* Trust */}
                <p className="pixel text-sm mt-2" style={{ color: 'var(--text)' }}>TRUST: {agent.trust}</p>
              </div>
            </Link>
          );
        })}

        {/* Undiscovered slots */}
        {[1, 2].map((i) => (
          <div key={`undiscovered-${i}`} className="pxl-card p-4 text-center" style={{ background: '#D0D0D0', borderColor: 'var(--border-light)' }}>
            <div className="creature-kozo flex items-center justify-center mx-auto mb-3" style={{ opacity: 0.4 }}>
              <span className="text-xl">❓</span>
            </div>
            <p className="pixel text-[6px] mb-2" style={{ color: 'var(--text-faint)' }}>UNDISCOVERED</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="pxl-card p-8 text-center mb-8">
          <p className="text-3xl mb-2">💤</p>
          <p className="pixel text-[8px]" style={{ color: 'var(--text-faint)' }}>NO AGENTS FOUND...</p>
        </div>
      )}
    </div>
  );
}
