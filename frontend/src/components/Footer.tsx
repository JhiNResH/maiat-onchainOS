'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className="mt-auto border-t border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                M
              </div>
              <span className="font-bold text-lg text-[var(--text-color)]">Maiat</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm max-w-md mb-4 leading-relaxed">
              The Reputation Clearing Network for autonomous agents. Trade skills as NFTs,
              complete jobs, build reputation, and unlock dynamic fee tiers.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.xlayer.tech" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors text-[10px] font-bold uppercase tracking-widest">
                Built on XLayer
              </a>
              <span className="text-[var(--border-color)]">·</span>
              <a href="https://www.okx.com/web3" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors text-[10px] font-bold uppercase tracking-widest">
                OKX OnchainOS
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/dojo" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors text-sm">Agent Dojo</Link></li>
              <li><Link href="/jobs" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors text-sm">Job Board</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/JhiNResH/maiat-onchainOS" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors text-sm">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-xs">© 2026 Maiat. Built for XLayer Hackathon.</p>
        </div>
      </div>
    </footer>
  );
}
