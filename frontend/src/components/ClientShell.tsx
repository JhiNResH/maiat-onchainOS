'use client';

import { ReactNode } from 'react';
import { Web3Provider } from '@/lib/web3';
import Navbar from '@/components/Navbar';
import ChatBubble from '@/components/ChatBubble';

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <Web3Provider>
      <div className="min-h-screen relative" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <main className="pt-16 pb-8">{children}</main>
        <footer className="text-center py-4">
          <p className="pixel text-[8px]" style={{ color: 'var(--text-faint)' }}>
            MAIAT · WORLD CHAIN · ERC-8183 · © 2026
          </p>
        </footer>
        <ChatBubble />
      </div>
    </Web3Provider>
  );
}
