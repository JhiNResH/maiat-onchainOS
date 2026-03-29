'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [demoConnected, setDemoConnected] = useState(false);
  const demoAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'var(--card)',
      border: '3px solid var(--border)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link href="/" className="pixel" style={{ fontSize: 16, color: 'var(--text)', textDecoration: 'none', letterSpacing: 2 }}>
        MAIAT
      </Link>

      {/* Nav links - dot separated */}
      <div className="pixel" style={{ fontSize: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/" style={{
          color: pathname === '/' ? 'var(--text)' : 'var(--text-dim)',
          textDecoration: pathname === '/' ? 'underline' : 'none',
          textUnderlineOffset: 4,
        }}>
          HOME
        </Link>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <Link href="/dojo" style={{
          color: pathname === '/dojo' ? 'var(--text)' : 'var(--text-dim)',
          textDecoration: pathname === '/dojo' ? 'underline' : 'none',
          textUnderlineOffset: 4,
        }}>
          DOJO
        </Link>
        <span style={{ color: 'var(--text-dim)' }}>·</span>
        <Link href={`/agent/${demoAddress}`} style={{
          color: pathname.startsWith('/agent/') ? 'var(--text)' : 'var(--text-dim)',
          textDecoration: pathname.startsWith('/agent/') ? 'underline' : 'none',
          textUnderlineOffset: 4,
        }}>
          PROFILE
        </Link>
      </div>

      {/* Connect button */}
      {demoConnected ? (
        <button onClick={() => setDemoConnected(false)} className="pixel" style={{
          fontSize: 8,
          padding: '6px 14px',
          background: 'var(--mint)',
          border: '3px solid var(--border)',
          color: 'var(--text)',
          cursor: 'pointer',
        }}>
          <span style={{ color: 'var(--green)' }}>●</span> {truncate(demoAddress)}
        </button>
      ) : (
        <button onClick={() => setDemoConnected(true)} className="pixel" style={{
          fontSize: 8,
          padding: '6px 14px',
          background: 'var(--mint)',
          border: '3px solid var(--border)',
          color: 'var(--text)',
          cursor: 'pointer',
        }}>
          CONNECT 🔗
        </button>
      )}
    </nav>
  );
}
