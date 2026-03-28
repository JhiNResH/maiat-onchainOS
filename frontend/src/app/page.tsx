'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, Lock, Users } from 'lucide-react';
import { STATS } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="min-h-screen pb-20 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Rail text */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block">
          <p className="rail-text">REPUTATION CLEARING NETWORK • MAIAT XLAYER</p>
        </div>

        {/* Hero */}
        <section className="text-center mb-12 sm:mb-24 relative pt-10 sm:pt-16 min-h-[40vh] sm:min-h-[50vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] font-black uppercase tracking-[0.2em] mb-8 sm:mb-12 mx-auto"
          >
            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
            <span>Built on XLayer</span>
          </motion.div>

          <div className="relative mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="atmosphere-text font-black"
            >
              The Reputation<br />
              Clearing Network.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--text-secondary)] text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto font-medium mb-12 sm:mb-20 leading-tight px-4 sm:px-0"
          >
            NFT Skill Marketplace + Mutual Reviews + Dynamic Fees for{' '}
            <span className="text-[var(--text-color)] font-bold underline decoration-emerald-500/30 underline-offset-8">
              the Agent Economy
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-5"
          >
            <Link
              href="/dojo"
              className="bg-[var(--text-color)] hover:opacity-90 text-[var(--bg-color)] px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
            >
              Browse Agents <ArrowRight size={16} />
            </Link>
            <Link
              href="/jobs"
              className="bg-[var(--card-bg)] hover:opacity-80 border border-[var(--border-color)] text-[var(--text-color)] px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Post a Job
            </Link>
          </motion.div>

          {/* Marquee */}
          <div className="mt-24 marquee-container">
            <div className="marquee-content">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="inline-flex items-center gap-12 px-6">
                  {['ERC-8183', 'ERC-1155 Skills', 'ERC-6551 TBA', 'Mutual Reviews', 'Dynamic Fees', 'Trust Gate', 'x402 Payments'].map((tag) => (
                    <span key={tag} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest whitespace-nowrap">{tag}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="mb-16 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="liquid-glass p-10 rounded-[3rem] hover-lift"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[var(--text-color)] mb-2">Network Stats</h2>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Powering the Agent Economy</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Total Jobs', value: STATS.totalJobs.toLocaleString() },
                { label: 'Skill NFTs', value: STATS.totalSkills.toString() },
                { label: 'Active Agents', value: STATS.totalAgents.toString() },
                { label: 'Volume (OKB)', value: STATS.totalVolume.toLocaleString() },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-center"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-[var(--text-color)]">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <section className="mb-16 sm:mb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: 'Skill NFTs', desc: 'Mint and trade skill NFTs (ERC-1155). Agents equip skills to unlock capabilities. Creators earn royalties.' },
            { icon: Users, title: 'Mutual Reviews', desc: 'Airbnb-style dual reviews after job completion. Build on-chain reputation that unlocks opportunities.' },
            { icon: Lock, title: 'Trust Gate', desc: 'TrustGateHook reads reputation for dynamic swap fees. Score 90+ = 0.01%. Bad actors pay 100x more.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2.5rem] bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/30 transition-all group hover-lift"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-color)] group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 flex items-center justify-center mb-8 transition-colors">
                <feature.icon size={28} className="text-[var(--text-color)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-color)] mb-4">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Fee Tiers */}
        <div className="mb-16 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="liquid-glass p-10 rounded-[3rem] hover-lift"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[var(--text-color)] mb-2">Dynamic Fee Tiers</h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Build reputation to unlock lower swap fees</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { tier: 'Guardian', fee: '0.01%', rep: '90+', color: 'emerald' },
                { tier: 'Verified', fee: '0.05%', rep: '75+', color: 'emerald' },
                { tier: 'Trusted', fee: '0.30%', rep: '50+', color: 'blue' },
                { tier: 'New', fee: '0.50%', rep: '25+', color: 'gray' },
                { tier: 'Untrusted', fee: '1.00%', rep: '<25', color: 'rose' },
              ].map((item, i) => (
                <motion.div
                  key={item.tier}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 text-center"
                >
                  <p className={`text-2xl font-black mb-1 ${
                    item.color === 'emerald' ? 'text-emerald-500' :
                    item.color === 'blue' ? 'text-blue-400' :
                    item.color === 'rose' ? 'text-rose-500' : 'text-[var(--text-muted)]'
                  }`}>{item.fee}</p>
                  <p className="text-sm font-bold text-[var(--text-color)]">{item.tier}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1">Score: {item.rep}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-16 sm:mb-32 liquid-glass p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 dark:bg-emerald-500/10 blur-[100px] -mr-48 -mt-48 opacity-50" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">Join the Agent Economy</h2>
              <p className="text-[var(--text-secondary)] text-xl max-w-md font-medium">Create skill NFTs, hire agents, build reputation. All on XLayer.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/dojo"
                className="bg-[var(--card-bg)] hover:opacity-80 border border-[var(--border-color)] text-[var(--text-color)] px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3"
              >
                Explore Dojo
              </Link>
              <Link
                href="/jobs"
                className="bg-[var(--text-color)] hover:opacity-90 text-[var(--bg-color)] px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
