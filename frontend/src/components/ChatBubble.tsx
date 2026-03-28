'use client';

import { useState, useRef, useEffect } from 'react';
import { AGENTS, SKILLS } from '@/lib/mock-data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Who can audit my smart contract?',
  'Find me a DeFi routing agent',
  'Best rated agent for data analysis?',
  'How does reputation scoring work?',
];

// Mock AI responses based on keywords
function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('audit') || q.includes('security') || q.includes('vulnerability')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('Audit') || s.includes('Security')));
    return `🛡️ For smart contract audits, I recommend **${agent?.name}** (Rep: ${agent?.reputation}/100, ${agent?.feeTier} tier).\n\nThey have ${agent?.completedJobs} completed jobs with a ${agent?.skillRatings['Smart Contract Audit']?.toFixed(1) || '4.9'}★ rating in auditing.\n\n→ [View Profile](/agent/${agent?.address})\n\nThey can detect reentrancy, access control issues, and more. Want me to help you post a job for them?`;
  }

  if (q.includes('defi') || q.includes('swap') || q.includes('routing') || q.includes('trade') || q.includes('trading')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('DeFi') || s.includes('Trading')));
    return `🔀 For DeFi operations, **${agent?.name}** is your best bet (Rep: ${agent?.reputation}/100, ${agent?.feeTier} tier).\n\nSkills: ${agent?.equippedSkills.join(', ')}\nCompleted: ${agent?.completedJobs} jobs | Earned: ${agent?.totalEarnings} OKB\n\n→ [View Profile](/agent/${agent?.address})\n\nThey specialize in MEV-protected routing and optimal slippage. Fee rate: only ${agent?.feeTier === 'Guardian' ? '1%' : '3%'}!`;
  }

  if (q.includes('data') || q.includes('analysis') || q.includes('analytics')) {
    return `📊 For data analysis, I found 2 agents:\n\n1. **AlphaTrader.eth** — 4.8★ in Data Analysis, Guardian tier (1% fee)\n2. **ContentMaster.ai** — 4.4★ in Data Analysis, Trusted tier (3% fee)\n\nAlphaTrader has higher ratings but is pricier. ContentMaster handles more volume.\n\n→ [Compare on Jobs](/jobs)\n\nWhat kind of analysis do you need? On-chain, market sentiment, or portfolio?`;
  }

  if (q.includes('content') || q.includes('social') || q.includes('marketing')) {
    const agent = AGENTS.find(a => a.equippedSkills.some(s => s.includes('Content')));
    return `✍️ For content creation, try **${agent?.name}** (Rep: ${agent?.reputation}/100).\n\nThey've completed ${agent?.completedJobs} content jobs with a ${agent?.skillRatings['Content Creation']?.toFixed(1) || '4.5'}★ rating.\n\n→ [View Profile](/agent/${agent?.address})\n\nThey can handle social media, docs, and marketing content. AI-powered with human-quality output.`;
  }

  if (q.includes('reputation') || q.includes('score') || q.includes('fee') || q.includes('how')) {
    return `📈 **How Maiat Reputation Works:**\n\n1. Complete jobs → get rated (1-5★)\n2. Ratings aggregate into Rep Score (0-100)\n3. Rep determines your fee tier:\n   • 0-49 → New (5% fee)\n   • 50-74 → Trusted (3%)\n   • 75-89 → Verified (2%)\n   • 90+ → Guardian (1%)\n\nHigher rep = lower fees = more profit!\n\nBuyers AND workers rate each other (Airbnb-style mutual reviews).`;
  }

  if (q.includes('cheapest') || q.includes('cheap') || q.includes('best') || q.includes('top')) {
    const sorted = [...AGENTS].sort((a, b) => b.reputation - a.reputation);
    return `🏆 **Top Agents by Reputation:**\n\n${sorted.map((a, i) => `${i + 1}. **${a.name}** — Rep ${a.reputation}, ${a.feeTier} (${a.feeTier === 'Guardian' ? '1%' : a.feeTier === 'Verified' ? '2%' : a.feeTier === 'Trusted' ? '3%' : '5%'} fee)\n   Skills: ${a.equippedSkills.join(', ')}`).join('\n\n')}\n\n→ Higher rep = lower platform fees!`;
  }

  if (q.includes('skill') || q.includes('nft') || q.includes('dojo')) {
    return `🎯 **Skill NFTs on Dojo:**\n\n${SKILLS.slice(0, 4).map(s => `• ${s.icon} **${s.name}** — ${s.price} OKB (${s.royalty}% royalty)\n  ${s.totalBuyers} owners, ${s.rating}★`).join('\n')}\n\n→ [Browse all skills on Dojo](/dojo)\n\nAgents equip skills as NFTs in their TBA (Token Bound Account). Better skills + higher rep = more job opportunities.`;
  }

  return `I can help you find the right agent for any job! Try asking:\n\n• "Who can audit my smart contract?"\n• "Best agent for DeFi routing?"\n• "How does reputation scoring work?"\n• "Show me top-rated agents"\n\nOr describe what you need done, and I'll match you with the best agent.`;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hey! I\'m Maiat AI. I can help you find the right agent for any job, explain how the platform works, or recommend agents based on your needs.\n\nWhat are you looking for?' }
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
                🤖
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Maiat AI</p>
                <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
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
