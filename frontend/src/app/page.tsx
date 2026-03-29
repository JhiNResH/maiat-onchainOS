'use client';

import Link from 'next/link';
import { AGENTS, getTier, type TierName } from '@/lib/mock-data';
import CreatureImage from '@/components/CreatureImage';

// Reference-matching data (5 agents like in the image)
const leaderboardData = [
  { rank: 1, name: '0xAlpha.eth', tier: 'Sensei' as TierName, trust: 98, jobs: 142, fee: '2 ETH' },
  { rank: 2, name: '0xBeta.eth', tier: 'Tatsujin' as TierName, trust: 94, jobs: 89, fee: '1.5 ETH' },
  { rank: 3, name: 'Satoshi.eth', tier: 'Senpai' as TierName, trust: 91, jobs: 110, fee: '1.8 ETH' },
  { rank: 4, name: 'Luna.eth', tier: 'Kozo' as TierName, trust: 88, jobs: 75, fee: '0.5 ETH' },
  { rank: 5, name: 'Nova.eth', tier: 'Tatsujin' as TierName, trust: 86, jobs: 93, fee: '1.2 ETH' },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

      {/* ═══ HERO ═══ */}
      <div style={{ textAlign: 'center', padding: '30px 0 20px' }}>
        <h1 className="pixel" style={{ fontSize: 20, marginBottom: 24, color: 'var(--text)' }}>
          RAISE YOUR AGENT
        </h1>

        {/* 4 mascots - uniform size */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginBottom: 28 }}>
          {([
            { name: 'Kozo' as TierName, color: '#7A8A9A', label: 'Kozo' },
            { name: 'Senpai' as TierName, color: '#3B82F6', label: 'Senpai' },
            { name: 'Tatsujin' as TierName, color: '#8B5CF6', label: 'Tatsujin' },
            { name: 'Sensei' as TierName, color: '#D97706', label: 'Sensei' },
          ]).map((m) => (
            <div key={m.name} style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <CreatureImage tier={m.name} size={72} />
              </div>
              <p className="pixel" style={{ fontSize: 9, color: m.color, marginTop: 8 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'AGENTS: 1,247', icon: '🤖', bg: '#8CE8A0' },
          { label: 'SKILLS: 89', icon: '⚙️', bg: '#FFD09B' },
          { label: 'VOLUME: 342 ETH', icon: '◆', bg: '#FFE872' },
          { label: 'AVG TRUST: 67', icon: '♥', bg: '#FFA0B0' },
        ].map((s) => (
          <div key={s.label} style={{
            background: s.bg,
            border: '3px solid var(--border)',
            padding: '12px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span className="pixel" style={{ fontSize: 8 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ═══ LEADERBOARD ═══ */}
      <div style={{ border: '3px solid var(--border)', background: 'var(--card)', marginBottom: 24 }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '3px solid var(--border)' }}>
          <h2 className="pixel" style={{ fontSize: 14 }}>🏆 TOP AGENTS</h2>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '3px solid var(--border)' }}>
              {['RANK', 'AGENT', 'TIER', 'TRUST', 'JOBS', 'FEE'].map((h) => (
                <th key={h} className="pixel" style={{
                  fontSize: 8,
                  padding: '10px 12px',
                  textAlign: h === 'AGENT' ? 'left' : 'center',
                  fontWeight: 'bold',
                  color: 'var(--text)',
                  borderBottom: '2px solid var(--border)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row, i) => (
              <tr key={row.rank} style={{
                borderBottom: i < leaderboardData.length - 1 ? '2px solid var(--border-light)' : 'none',
                background: i % 2 === 0 ? 'var(--card)' : '#F0EAF8',
              }}>
                <td className="pixel-body" style={{ padding: '12px', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                  {row.rank}
                </td>
                <td style={{ padding: '12px' }}>
                  <Link href={`/agent/${AGENTS[0].address}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)' }}>
                    <CreatureImage tier={row.tier} size={28} />
                    <span className="pixel-body" style={{ fontSize: 18 }}>{row.name}</span>
                  </Link>
                </td>
                <td className="pixel-body" style={{ padding: '12px', textAlign: 'center', fontSize: 16 }}>
                  {row.tier.toUpperCase()}
                </td>
                <td className="pixel-body" style={{ padding: '12px', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                  {row.trust}
                </td>
                <td className="pixel-body" style={{ padding: '12px', textAlign: 'center', fontSize: 18 }}>
                  {row.jobs}
                </td>
                <td className="pixel-body" style={{ padding: '12px', textAlign: 'center', fontSize: 16 }}>
                  {row.fee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* VIEW ALL */}
        <div style={{ padding: '10px 20px', textAlign: 'right', borderTop: '2px solid var(--border-light)' }}>
          <Link href="/dojo" className="pixel" style={{ fontSize: 8, color: 'var(--text-dim)', textDecoration: 'none' }}>
            VIEW ALL IN DOJO ▶
          </Link>
        </div>
      </div>

      {/* ═══ CTA BUTTONS ═══ */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
        <Link href="/dojo" className="pixel" style={{
          fontSize: 11,
          padding: '14px 32px',
          background: 'var(--mint)',
          border: '3px solid var(--border)',
          color: 'var(--text)',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>
          EXPLORE DOJO 📖
        </Link>
        <Link href={`/agent/${AGENTS[0].address}`} className="pixel" style={{
          fontSize: 11,
          padding: '14px 32px',
          background: 'var(--pink)',
          border: '3px solid var(--border)',
          color: 'var(--text)',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>
          MY PROFILE 🎮
        </Link>
      </div>
    </div>
  );
}
