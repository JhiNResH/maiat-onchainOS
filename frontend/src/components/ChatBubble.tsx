'use client';

import { useState } from 'react';

const DEMO_MESSAGES = [
  { from: 'evaluator', text: 'WELCOME TO MAIAT. I CAN HELP YOU FIND TRUSTED AGENTS, CHECK SKILLS, OR VERIFY REPUTATION. WHAT DO YOU NEED?' },
];

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim().toUpperCase();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let response = 'I CAN HELP WITH: FIND AGENT, CHECK TRUST, VERIFY SKILL. TRY "FIND SECURITY AUDITOR"';
      if (userMsg.includes('SECURITY') || userMsg.includes('AUDIT')) {
        response = 'FOUND 2 AGENTS WITH SECURITY SKILL (TATSUJIN+):\n\n1. SATOSHI.ETH — 👑 SENSEI — TRUST: 94 — FEE: 1%\n2. BRIDGEBOT.WORLD — 🦸 TATSUJIN — TRUST: 82 — FEE: 2%\n\nRECOMMEND #1. VIEW PROFILE?';
      } else if (userMsg.includes('DEFI') || userMsg.includes('TRADING')) {
        response = 'FOUND 1 AGENT WITH DEFI SKILL (SENSEI):\n\n1. 0XALPHA.ETH — 👑 SENSEI — TRUST: 92 — FEE: 1%\n\nTOP RATED IN DEFI. VIEW PROFILE?';
      } else if (userMsg.includes('TRUST') || userMsg.includes('CHECK')) {
        response = 'ENTER AN AGENT ADDRESS OR NAME TO CHECK TRUST SCORE.\n\nEXAMPLE: "CHECK 0XALPHA.ETH"';
      }
      setMessages(prev => [...prev, { from: 'evaluator', text: response }]);
    }, 500);
  };

  return (
    <>
      {/* Floating button - purple orb */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 pixel"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9B59B6, #6C3483)',
          border: '3px solid var(--border)',
          color: 'white',
          fontSize: 7,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          boxShadow: '0 2px 8px rgba(107, 52, 131, 0.4)',
        }}
      >
        {isOpen ? '✕' : <><span style={{ fontSize: 18 }}>🔮</span><span>CHAT</span></>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-14 right-4 z-50 w-80 pxl-card flex flex-col" style={{ height: '400px' }}>
          {/* Header */}
          <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '3px solid var(--border)', background: 'var(--mint)' }}>
            <span className="pixel text-[7px]">🔮 MAIAT EVALUATOR</span>
            <span className="pixel text-[6px]" style={{ color: 'var(--green)' }}>● ONLINE</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ background: 'var(--butter)' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`pxl-bubble px-3 py-2 max-w-[90%] ${msg.from === 'evaluator' ? 'pxl-bubble-mint' : 'pxl-bubble-pink'}`}>
                  <p className="pixel-body text-sm whitespace-pre-line" style={{ color: 'var(--text)' }}>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex" style={{ borderTop: '3px solid var(--border)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="TYPE HERE..."
              className="flex-1 pxl-input px-3 py-2 pixel-body text-sm"
              style={{ border: 'none', borderRight: '3px solid var(--border)' }}
            />
            <button onClick={handleSend} className="pxl-btn pxl-btn-mint px-3 py-2 pixel text-[7px]" style={{ border: 'none' }}>
              SEND ▶
            </button>
          </div>
        </div>
      )}
    </>
  );
}
