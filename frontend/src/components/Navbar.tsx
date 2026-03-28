'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address } = useAccount();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/dojo', label: 'Dojo' },
    { href: '/jobs', label: 'Jobs' },
    ...(address ? [{ href: `/agent/${address}`, label: 'Profile' }] : []),
  ];

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full px-6 py-3 flex items-center justify-between border transition-all duration-500 ${
        isDark
          ? 'bg-white/5 border-white/[0.08] shadow-[inset_0_0_30px_rgba(255,255,255,0.02),0_30px_100px_rgba(0,0,0,0.3)]'
          : 'bg-white/70 border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
      }`}
      style={{ backdropFilter: 'blur(60px) saturate(180%)', WebkitBackdropFilter: 'blur(60px) saturate(180%)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
          M
        </div>
        <span className="font-bold text-[var(--text-color)] tracking-tight">Maiat</span>
      </Link>

      {/* Desktop Navigation — dock style */}
      <div className="hidden md:flex items-center gap-0.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href.split('/').slice(0, 2).join('/') + '/');
          return (
            <Link key={link.href} href={link.href} className="px-5 py-2 rounded-full">
              <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive
                  ? isDark ? 'text-white' : 'text-black'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-90 ${
            isDark ? 'bg-white/10 border-white/10 text-yellow-400' : 'bg-black/5 border-black/5 text-gray-500'
          }`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Connect Wallet */}
        <div className="hidden sm:block">
          <ConnectKitButton />
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black'
          }`}
        >
          {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-3xl p-4 md:hidden border ${
            isDark
              ? 'bg-black/90 border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]'
              : 'bg-white/90 border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
          }`}
          style={{ backdropFilter: 'blur(40px)' }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? isDark ? 'text-white' : 'text-black'
                      : isDark ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 px-2">
              <ConnectKitButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
