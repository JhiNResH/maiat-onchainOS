'use client';

import { useState, useRef, useEffect } from 'react';
import { AGENTS, SKILLS } from '@/lib/mock-data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Evaluate this agent for me',
  'Who should I hire for an audit?',
  'Is this agent trustworthy?',
  'How do you decide to approve a job?',
];

// Mock AI responses based on keywords
function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('audit') || q.includes('security') || q.includes('vulnerability')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('Audit') || s.includes('Security')));
    return `🛡️ **SecurityEvaluator ⚖️ — Domain: Security**\n*Routed by EvaluatorRegistry (skillId → Security domain)*\n\nI'm the security-specialized evaluator. My threshold is **80/100** (higher than general — security demands it).\n\n**Assessment of ${agent?.name}:**\n• Trust Score: **${agent?.reputation}/100** (threshold: 80) ${(agent?.reputation || 0) >= 80 ? '✅' : '❌'}\n• ${agent?.completedJobs} audit jobs, ${agent?.skillRatings['Smart Contract Audit']?.toFixed(1) || '4.9'}★\n• Skill NFT: Smart Contract Audit ✅ (verified in TBA)\n• Threat reports: 0\n• **Verdict: APPROVED** ✅\n\n→ [View & Hire](/agent/${agent?.address})`;
  }

  if (q.includes('defi') || q.includes('swap') || q.includes('routing') || q.includes('trade') || q.includes('trading')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('DeFi') || s.includes('Trading')));
    return `🔀 **DeFiEvaluator ⚖️ — Domain: DeFi**\n*Routed by EvaluatorRegistry (skillId → DeFi domain)*\n\nI specialize in DeFi execution quality. Threshold: **70/100**.\n\n**Assessment of ${agent?.name}:**\n• Trust Score: **${agent?.reputation}/100** (threshold: 70) ${(agent?.reputation || 0) >= 70 ? '✅' : '❌'}\n• Skills: ${agent?.equippedSkills.join(', ')}\n• ${agent?.completedJobs} jobs, ${agent?.totalEarnings} OKB volume\n• Fee: ${agent?.feeTier === 'Guardian' ? '1%' : '3%'} (${agent?.feeTier})\n• **Verdict: APPROVED** ✅\n\n→ [View & Hire](/agent/${agent?.address})`;
  }

  if (q.includes('data') || q.includes('analysis') || q.includes('analytics')) {
    return `📊 **Evaluator Assessment — 2 candidates:**\n\n**1. AlphaTrader.eth** ✅ APPROVED\n   Score: 92/100 (Guardian) · 4.8★ Data Analysis · 1% fee\n\n**2. ContentMaster.ai** ✅ APPROVED (with note)\n   Score: 75/100 (Trusted) · 4.4★ Data Analysis · 3% fee\n   ⚠️ Lower score — I'd still approve, but AlphaTrader has a stronger track record.\n\n→ [Compare on Jobs](/jobs)\n\nBoth clear my threshold (60), but the quality gap is significant.`;
  }

  if (q.includes('content') || q.includes('social') || q.includes('marketing')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('Content')));
    return `✍️ **ContentEvaluator ⚖️ — Domain: Content**\n*Routed by EvaluatorRegistry (skillId → Content domain)*\n\nContent has a lower bar. Threshold: **50/100**.\n\n**Assessment of ${agent?.name}:**\n• Trust Score: **${agent?.reputation}/100** (threshold: 50) ✅\n• ${agent?.completedJobs} content jobs, ${agent?.skillRatings['Content Creation']?.toFixed(1) || '4.5'}★\n• **Verdict: APPROVED** ✅\n\n→ [View & Hire](/agent/${agent?.address})\n\nNote: Trusted tier (3% fee). Solid but not Guardian yet.`;
  }

  if (q.includes('trustworthy') || q.includes('trust') || q.includes('evaluate') || q.includes('check')) {
    return `⚖️ **How I evaluate agents:**\n\nWhen a job is submitted, I read the worker's trust score from the **TrustScoreOracle** on-chain:\n\n1. Score ≥ ${60} → **COMPLETE** (release escrow) ✅\n2. Score < ${60} → **REJECT** (refund buyer) ❌\n3. Threat reports ≥ 3 → **AUTO-REJECT** 🚫\n4. Uninitialized provider → **REJECT** (no history)\n\nI also check:\n• Score staleness (must be updated within 7 days)\n• Flash manipulation guard (1-hour minimum age)\n\nGive me an agent address and I'll run a pre-check right now.`;
  }

  if (q.includes('approve') || q.includes('reject') || q.includes('decide') || q.includes('how do you')) {
    return `⚖️ **Evaluator Routing System:**\n\nWhen a job is posted, **EvaluatorRegistry** routes it to a domain expert:\n\n🛡️ **SecurityEvaluator** — threshold 80 (audits, scanning)\n🔀 **DeFiEvaluator** — threshold 70 (swaps, trading)\n✍️ **ContentEvaluator** — threshold 50 (content, social)\n⚖️ **GeneralEvaluator** — threshold 60 (everything else)\n\nEvery evaluator runs the same core logic:\n\nif (threats ≥ 3) → REJECT 🚫\nif (!initialized) → REJECT ❌\nif (score ≥ domain_threshold) → COMPLETE ✅\nif (score < domain_threshold) → REJECT ❌\n\nSecurity jobs need **80+** to pass. Content needs **50+**.\nSame contract logic, different standards per domain.`;
  }

  if (q.includes('reputation') || q.includes('score') || q.includes('fee')) {
    return `📈 **Reputation → Economic Consequences:**\n\nI read scores from TrustScoreOracle. Here's what they mean:\n\n| Score | Tier | Fee | My Verdict |\n|-------|------|-----|------------|\n| 90+ | Guardian | 1% | ✅ Auto-approve |\n| 75-89 | Verified | 2% | ✅ Approve |\n| 50-74 | Trusted | 3% | ✅ Approve |\n| 0-49 | New | 5% | ⚠️ Risky — may reject |\n\nBad reputation doesn't just hurt your ego — it directly increases your fees and may get your jobs rejected by me.\n\nThis is "Yelp for Agents" with teeth.`;
  }

  if (q.includes('cheapest') || q.includes('cheap') || q.includes('best') || q.includes('top')) {
    const sorted = [...AGENTS].sort((a, b) => b.reputation - a.reputation);
    return `🏆 **Evaluator Rankings — by Trust Score:**\n\n${sorted.map((a, i) => `${i + 1}. **${a.name}** — Score ${a.reputation}/100 ${a.reputation >= 60 ? '✅' : '❌'}\n   ${a.feeTier} tier · ${a.feeTier === 'Guardian' ? '1%' : a.feeTier === 'Verified' ? '2%' : a.feeTier === 'Trusted' ? '3%' : '5%'} fee · ${a.equippedSkills.join(', ')}`).join('\n\n')}\n\nAll 3 clear my approval threshold (60). I'd green-light jobs for any of them.`;
  }

  if (q.includes('skill') || q.includes('nft') || q.includes('dojo')) {
    return `🎯 **Skill NFTs (Dojo):**\n\n${SKILLS.slice(0, 4).map(s => `• ${s.icon} **${s.name}** — ${s.price} OKB (${s.royalty}% royalty)\n  ${s.totalBuyers} holders · ${s.rating}★`).join('\n')}\n\n→ [Browse Dojo](/dojo)\n\nSkills are ERC-1155 NFTs equipped to an agent's Token Bound Account (ERC-6551). When I evaluate a job, I can verify the worker actually holds the required skill on-chain.`;
  }

  return `I'm the Maiat Evaluator — I read every agent's on-chain reputation before approving jobs.\n\nTry asking me:\n\n• "Evaluate this agent for me"\n• "Who should I hire for an audit?"\n• "Is this agent trustworthy?"\n• "How do you decide to approve a job?"\n\nDescribe what you need, and I'll evaluate who's most qualified based on their trust score, job history, and skill ratings.`;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '⚖️ I\'m the **Maiat Evaluator** — the on-chain judge of this platform.\n\nI read every agent\'s trust score, review history, and threat reports before deciding whether a job gets approved or rejected.\n\nNeed to hire someone? Tell me what you need, and I\'ll evaluate who\'s qualified — the same way I evaluate jobs on-chain.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm">
                ⚖️
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Maiat Evaluator</p>
                <p className="text-amber-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  ERC-8183 · On-Chain
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-gray-950 rounded-br-md'
                    : 'bg-gray-800 text-gray-200 rounded-bl-md'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1.5' : ''}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={k} className={msg.role === 'user' ? 'font-bold' : 'text-white font-semibold'}>{part.slice(2, -2)}</strong>
                          : part.split(/(\[.*?\]\(.*?\))/).map((seg, l) => {
                              const linkMatch = seg.match(/\[(.*?)\]\((.*?)\)/);
                              if (linkMatch) {
                                return <a key={l} href={linkMatch[2]} className="text-amber-400 underline hover:text-amber-300">{linkMatch[1]}</a>;
                              }
                              return <span key={l}>{seg}</span>;
                            })
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs hover:text-white hover:border-amber-500/30 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask me anything..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 ${
          isOpen
            ? 'bg-gray-800 border border-gray-700 shadow-black/50'
            : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/30'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}

        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-gray-950 animate-pulse" />
        )}
      </button>
    </>
  );
}
