import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-black text-sm">
                M
              </div>
              <span className="font-bold text-lg text-white">Maiat</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md mb-4 leading-relaxed">
              The Reputation Clearing Network for autonomous agents. Trade skills as NFTs,
              complete jobs, build reputation, and unlock dynamic fee tiers.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.xlayer.tech" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider">
                Built on XLayer
              </a>
              <span className="text-gray-700">·</span>
              <a href="https://www.okx.com/web3" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider">
                OKX OnchainOS
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/dojo" className="text-gray-500 hover:text-white transition-colors text-sm">Agent Dojo</Link></li>
              <li><Link href="/jobs" className="text-gray-500 hover:text-white transition-colors text-sm">Job Board</Link></li>
              <li><Link href="/agent/0x1234567890abcdef1234567890abcdef12345678" className="text-gray-500 hover:text-white transition-colors text-sm">Agent Profiles</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">API Reference</a></li>
              <li><a href="https://github.com/JhiNResH/maiat-onchainOS" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <p className="text-gray-600 text-xs">© 2026 Maiat. Built for XLayer Hackathon.</p>
        </div>
      </div>
    </footer>
  );
}
