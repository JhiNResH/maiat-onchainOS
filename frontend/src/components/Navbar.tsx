'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address } = useAccount();

  const navLinks = [
    { href: '/dojo', label: 'Dojo' },
    { href: '/jobs', label: 'Jobs' },
    ...(address ? [{ href: `/agent/${address}`, label: 'Profile' }] : []),
  ];

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(60px) saturate(180%)',
        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
        boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.02), 0 30px 100px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <span className="text-black font-bold text-sm">M</span>
        </div>
        <span className="font-bold text-white tracking-tight">Maiat</span>
      </Link>

      {/* Desktop Navigation — macOS dock style */}
      <div className="hidden md:flex items-center gap-0.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href.split('/').slice(0, 2).join('/') + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2 rounded-full"
            >
              <span className={`nav-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <ConnectKitButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255, 255, 255, 0.10)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            background: 'rgba(10, 10, 10, 0.90)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-xl nav-link ${isActive ? 'active' : ''}`}
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
