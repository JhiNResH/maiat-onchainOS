'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500"
      style={{
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.70)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(60px) saturate(180%)',
        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
        boxShadow: isDark
          ? 'inset 0 0 30px rgba(255, 255, 255, 0.02), 0 30px 100px rgba(0, 0, 0, 0.3)'
          : '0 20px 50px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500"
          style={{ background: isDark ? '#fff' : '#000', color: isDark ? '#000' : '#fff' }}
        >
          M
        </div>
        <span className="font-bold tracking-tight transition-colors duration-500" style={{ color: 'var(--text-primary)' }}>
          Maiat
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-0.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href.split('/').slice(0, 2).join('/') + '/');
          return (
            <Link key={link.href} href={link.href} className="px-5 py-2 rounded-full">
              <span className={`nav-link ${isActive ? 'active' : ''}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
          {isDark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="hidden sm:block">
          <ConnectKitButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)'}`,
            color: 'var(--text-primary)',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-3xl p-4 md:hidden"
          style={{
            background: isDark ? 'rgba(10, 10, 10, 0.90)' : 'rgba(255, 255, 255, 0.90)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)'}`,
            backdropFilter: 'blur(40px)',
            boxShadow: isDark ? '0 30px 100px rgba(0, 0, 0, 0.5)' : '0 20px 50px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-xl nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 px-2">
              <ConnectKitButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
