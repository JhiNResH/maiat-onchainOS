'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mockAddress = '0x1234...5678';

  const navLinks = [
    { href: '/dojo', label: 'Dojo' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/agent/0x1234567890abcdef1234567890abcdef12345678', label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl group-hover:bg-amber-500/30 transition-all rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-bold text-gray-950 text-xl shadow-lg shadow-amber-500/20">
                M
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-amber-400">Maiat</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href || pathname.startsWith(link.href.split('/').slice(0, 2).join('/') + '/')
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConnected(!isConnected)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isConnected
                  ? 'bg-gray-800 text-white border border-gray-700 hover:border-gray-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20'
              }`}
            >
              {isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {mockAddress}
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isConnected
                    ? 'bg-gray-800 text-white border border-gray-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950'
                }`}
              >
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {mockAddress}
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
