'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { Web3Provider } from '@/lib/web3';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';

function InnerShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FDFDFB] text-black'}`}>
      {/* Atmospheric Backgrounds — exact from app.maiat.io ClientLayout */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-blue-900/20' : 'bg-blue-100/30'}`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-purple-900/10' : 'bg-orange-50/40'}`}
      />

      <Navbar />
      <main className="w-full min-h-screen pt-24 relative z-[1]">
        {children}
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Web3Provider>
        <InnerShell>{children}</InnerShell>
      </Web3Provider>
    </ThemeProvider>
  );
}
