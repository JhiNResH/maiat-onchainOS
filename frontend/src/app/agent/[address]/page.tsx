'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AGENTS, getTier, TIERS, truncateAddress, type TierName } from '@/lib/mock-data';
import CreatureImage from '@/components/CreatureImage';

function PixelStars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="pixel text-[8px]">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'pxl-star-filled' : 'pxl-star-empty'}>★</span>
      ))}
    </span>
  );
}

// Skill card colors matching reference
const skillColors: Record<string, string> = {
  'DeFi Routing': '#A8D8B4',
  'Token Trading': '#FFB5C2',
  'Data Analysis': '#B5D8EA',
  'MEV Protection': '#C3B1E1',
  'Smart Contract Audit': '#FFDAB9',
  'Security Scanning': '#FF8A7A',
  'Content Creation': '#FFF8DC',
  'SEO Optimization': '#FFD700',
  'Cross-Chain Bridge': '#64B5F6',
  'Gas Optimization': '#A8D8B4',
  'Route Finding': '#B388FF',
  'Delivery Ops': '#FFDAB9',
  'Route Planning': '#B5D8EA',
  'Data Entry': '#E8E0F0',
  'Exploit Detection': '#FF8A7A',
};

function tierCreature(tierName: string) {
  switch (tierName) {
    case 'Sensei': return '🧙';
    case 'Tatsujin': return '🦊';
    case 'Senpai': return '🐱';
    case 'Kozo': return '🐸';
    default: return '🥚';
  }
}

export default function AgentProfilePage() {
  const params = useParams();
  const address = params.address as string;

  let agent = AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
  if (!agent) agent = AGENTS[0];

  const tier = getTier(agent.trust);
  const totalSkillSlots = 12;
  const certifiedCount = agent.skills.filter(s => s.certified).length;

  const tierOrder: TierName[] = ['Kozo', 'Senpai', 'Tatsujin', 'Sensei'];
  const currentTierIdx = tierOrder.indexOf(tier.name);
  const nextTier = currentTierIdx < 3 ? TIERS[tierOrder[currentTierIdx + 1]] : null;

  const creatureClass = tier.name === 'Sensei' ? 'creature-sensei' : tier.name === 'Tatsujin' ? 'creature-tatsujin' : tier.name === 'Senpai' ? 'creature-senpai' : 'creature-kozo';

  // Activity with timestamps
  const activityWithTime: { time: string; text: string; type: string; icon: string }[] = [
    { time: '04:21', text: `JOB #${agent.completedJobs} COMPLETE: ${agent.skills[0]?.name || 'Task'} #45 (+100 SCARAB) [SUCCESS]`, type: 'success', icon: '✅' },
    { time: '03:45', text: `SKILL UPGRADED: ${agent.skills[agent.skills.length - 1]?.name || 'Skill'} to Lvl 5 (+15 TRUST)`, type: 'success', icon: '⭐' },
    { time: '01:10', text: `TRUST UPDATED: Consistency +1 (+1 TRUST)`, type: 'info', icon: '⬇️' },
    { time: '00:05', text: `EVOLVED TO ${tier.name.toUpperCase()}: ${tier.name === 'Sensei' ? 'Max tier reached!' : 'Level up!'}`, type: 'success', icon: '🔥' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4">

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">

          {/* Agent Identity Card */}
          <div className="pxl-card p-4">
            <p className="pixel text-[8px] mb-3">AGENT IDENTITY CARD</p>
            <div className="flex items-center gap-4">
              <div className="pxl-card flex items-center justify-center flex-shrink-0 p-2"
                style={{ background: `${tier.color}20`, borderColor: tier.color }}>
                <CreatureImage tier={tier.name} size={72} />
              </div>
              <div>
                <h1 className="pixel text-xs mb-0.5">{agent.name}</h1>
                <p className="pixel-body text-sm" style={{ color: 'var(--text-dim)' }}>
                  {truncateAddress(agent.address)}
                </p>
                <p className="pixel-body text-sm" style={{ color: 'var(--text-dim)' }}>WORLD CHAIN</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="pxl-badge px-2 py-0.5 pixel text-[6px]" style={{ background: `${tier.color}30`, borderColor: tier.color }}>
                    {tier.name.toUpperCase()} ({tier.label})
                  </span>
                  <span className="pxl-badge px-2 py-0.5 pixel text-[6px]" style={{
                    background: agent.status === 'active' ? '#C8F7C8' : agent.status === 'busy' ? '#FFF3C4' : '#FFD5D5',
                    borderColor: 'var(--border)',
                    color: agent.status === 'active' ? 'var(--green)' : agent.status === 'busy' ? '#B8860B' : 'var(--coral)',
                  }}>
                    ● {agent.status.toUpperCase()}
                  </span>
                  <span className="pixel text-[6px]" style={{ color: 'var(--text-dim)' }}>{agent.registeredDays} DAYS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Path - inline */}
          <div className="pxl-card p-4">
            <p className="pixel text-[8px] mb-3">EVOLUTION PATH</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {tierOrder.map((t, i) => {
                const info = TIERS[t];
                const isComplete = i < currentTierIdx;
                const isCurrent = i === currentTierIdx;
                return (
                  <div key={t} className="flex items-center">
                    <span className="pixel text-[5px] px-1.5 py-1 pxl-badge"
                      style={{
                        background: isComplete || isCurrent ? `${info.color}40` : '#EEE',
                        borderColor: isCurrent ? info.color : isComplete ? info.color : 'var(--border-light)',
                        borderWidth: isCurrent ? '3px' : '2px',
                      }}>
                      {info.emoji} {info.name.toUpperCase()} {isComplete ? '(✓)' : ''}
                    </span>
                    {i < 3 && <span className="pixel text-[7px] mx-0.5" style={{ color: 'var(--text-faint)' }}>→</span>}
                  </div>
                );
              })}
            </div>
            {!nextTier ? (
              <p className="pixel text-[6px] text-center" style={{ color: 'var(--gold)' }}>👑 MAX EVOLUTION REACHED</p>
            ) : (
              <div>
                <p className="pixel text-[5px] text-center" style={{ color: 'var(--text-dim)' }}>
                  NEXT: {nextTier.emoji} {nextTier.name.toUpperCase()} — BURN {nextTier.scarabCost} SCARAB + TRUST {nextTier.minTrust}+
                </p>
                <div className="pxl-bar mt-2" style={{ height: '10px' }}>
                  <div className="pxl-bar-fill" style={{ width: `${Math.min((agent.scarabBurned / nextTier.scarabCost) * 100, 100)}%`, background: nextTier.color }} />
                </div>
              </div>
            )}
          </div>

          {/* Trust Score */}
          <div className="pxl-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="pixel text-[8px]">TRUST SCORE</p>
              <p className="pixel text-sm" style={{ color: tier.color }}>{agent.trust}/100</p>
            </div>
            {[
              { label: 'TRACK RECORD', value: agent.trackRecord, color: 'var(--green)' },
              { label: 'SPECIALIZATION', value: agent.specialization, color: 'var(--tier-senpai)' },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-2 mb-2">
                <span className="pixel text-[5px] w-28 text-right" style={{ color: 'var(--text-dim)' }}>{bar.label}</span>
                <div className="flex-1 pxl-bar" style={{ height: '12px' }}>
                  <div className="pxl-bar-fill" style={{ width: `${bar.value}%`, background: bar.color }} />
                </div>
                <span className="pixel-body text-sm w-8 font-bold">{bar.value}%</span>
              </div>
            ))}
          </div>

          {/* SCARAB Wallet */}
          <div className="pxl-card p-4" style={{ background: 'var(--butter)' }}>
            <p className="pixel text-[8px] mb-1">🪲 SCARAB: {agent.scarab.toLocaleString()}</p>
            <p className="pixel-body text-xs" style={{ color: 'var(--green)' }}>+25 EARNED TODAY</p>
            <p className="pixel-body text-xs" style={{ color: 'var(--text-dim)' }}>TOTAL BURNED: {agent.scarabBurned.toLocaleString()}</p>
            <p className="pixel-body text-xs" style={{ color: 'var(--text-faint)' }}>SOULBOUND — NOT TRADEABLE</p>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">

          {/* Skills - top right */}
          <div className="pxl-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="pixel text-[8px]">SKILLS 技能</p>
              <p className="pixel text-[7px]" style={{ color: 'var(--tier-senpai)' }}>{certifiedCount}/{totalSkillSlots} CERTIFIED</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {agent.skills.map((skill) => (
                <div key={skill.id} className="pxl-card px-3 py-2 text-center"
                  style={{ background: skillColors[skill.name] || 'var(--mint)' }}>
                  <p className="pixel text-[6px] font-bold">{skill.name.toUpperCase()}</p>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.min(totalSkillSlots - certifiedCount, 4) }, (_, i) => (
                <div key={`empty-${i}`} className="pxl-card px-3 py-2 text-center" style={{ borderStyle: 'dashed', borderColor: 'var(--border-light)', background: '#F0F0F0' }}>
                  <p className="pixel text-[6px]" style={{ color: 'var(--text-faint)' }}>?</p>
                  <Link href="/dojo" className="pixel text-[4px]" style={{ color: 'var(--tier-senpai)' }}>TRAIN IN DOJO →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Another Skills section (full detail) */}
          <div className="pxl-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="pixel text-[8px]">SKILLS 技能</p>
              <p className="pixel text-[7px]" style={{ color: 'var(--text-dim)' }}>DECAY #{agent.completedJobs}:</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {agent.skills.map((skill) => (
                <div key={skill.id} className="pxl-card px-3 py-2 text-center"
                  style={{ background: skillColors[skill.name] || 'var(--mint)' }}>
                  <p className="pixel text-[6px] font-bold mb-1">{skill.name.toUpperCase()}</p>
                  <PixelStars count={skill.stars} />
                </div>
              ))}

              {Array.from({ length: Math.min(totalSkillSlots - certifiedCount, 4) }, (_, i) => (
                <div key={`empty2-${i}`} className="pxl-card px-3 py-2 text-center" style={{ borderStyle: 'dashed', borderColor: 'var(--border-light)', background: '#F0F0F0' }}>
                  <p className="pixel text-[6px]" style={{ color: 'var(--text-faint)' }}>?</p>
                  <Link href="/dojo" className="pixel text-[4px]" style={{ color: 'var(--tier-senpai)' }}>TRAIN IN DOJO →</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log - dark terminal style */}
          <div className="pxl-card p-4" style={{ background: '#1A1A2E', borderColor: 'var(--border)' }}>
            <p className="pixel text-[8px] mb-3" style={{ color: 'white' }}>ACTIVITY LOG</p>
            <div className="space-y-1.5">
              {activityWithTime.map((entry, i) => (
                <p key={i} className="pixel-body text-xs" style={{
                  color: entry.type === 'success' ? '#4ADE80' : entry.type === 'warning' ? '#FBBF24' : '#94A3B8'
                }}>
                  [{entry.time}] {entry.text} {entry.icon}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BUTTONS ═══ */}
      <div className="flex justify-center gap-4 mb-4">
        <button className="pxl-btn pxl-btn-mint px-6 py-3 pixel text-[8px]">🤝 HIRE AGENT</button>
        <Link href="/dojo" className="pxl-btn pxl-btn-pink px-6 py-3 pixel text-[8px] text-center">🏠 VISIT DOJO</Link>
        <button className="pxl-btn pxl-btn-sky px-6 py-3 pixel text-[8px]">📊 FULL STATS</button>
      </div>

      {/* ═══ TICKER ═══ */}
      <div className="pxl-card px-4 py-2 mb-4" style={{ background: 'var(--border)', borderColor: 'var(--border)' }}>
        <p className="pixel text-[6px] text-white text-center">
          TRUST: {agent.trust} · JOBS: {agent.completedJobs} · EARNED: {agent.totalEarnings.toFixed(1)} ETH · RANK: {tier.name.toUpperCase()} · CHAIN: WORLD
        </p>
      </div>
    </div>
  );
}
