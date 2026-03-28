'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AGENTS, JOBS, SKILLS, REVIEWS, getAgentByAddress, getFeeTierColor, getReputationColor, getReviewsForAgent, truncateAddress } from '@/lib/mock-data';
import { useState } from 'react';

type Tab = 'skills' | 'history' | 'reviews';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ReputationRing({ score }: { score: number }) {
  const color = getReputationColor(score);
  const percentage = Math.min(score, 100);

  return (
    <div className="relative">
      <svg className="w-40 h-40 transform -rotate-90">
        <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-800" />
        <circle
          cx="80" cy="80" r="68"
          stroke="currentColor" strokeWidth="8" fill="none"
          strokeDasharray={`${(percentage / 100) * 427} 427`}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-gray-500 text-xs mt-0.5">Reputation</span>
      </div>
    </div>
  );
}

function SkillNFTCard({ skillName, rating, edition }: { skillName: string; rating: number; edition: number }) {
  const skill = SKILLS.find((s) => s.name === skillName);
  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5">
      {/* NFT-style header gradient */}
      <div className="h-32 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-purple-500/20 flex items-center justify-center relative">
        <span className="text-5xl group-hover:scale-110 transition-transform">{skill?.icon || '🎯'}</span>
        {/* Edition badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10px] font-mono text-gray-300 border border-gray-700">
          Edition #{edition}
        </div>
        {/* Category */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10px] font-medium text-amber-400 border border-amber-500/20">
          {skill?.category || 'Skill'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-1">{skillName}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-1">{skill?.description || 'Equipped skill NFT'}</p>

        <div className="flex items-center justify-between">
          <StarRating rating={rating} />
          <span className="text-gray-600 text-xs">{skill?.totalBuyers || 0} holders</span>
        </div>

        {/* Skill reputation bar */}
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Skill Rep</span>
            <span className="text-amber-400 font-medium">{((rating / 5) * 100).toFixed(0)}/100</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${(rating / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [activeTab, setActiveTab] = useState<Tab>('skills');

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireForm, setHireForm] = useState({ description: '', reward: '', skill: '' });

  let agent = getAgentByAddress(address);
  if (!agent) agent = AGENTS[0];

  const agentReviews = getReviewsForAgent(agent.address);
  const avgRating = agentReviews.length > 0
    ? agentReviews.reduce((sum, r) => sum + r.rating, 0) / agentReviews.length
    : 0;

  const agentJobs = JOBS.filter(
    (job) =>
      job.worker?.toLowerCase().includes(agent!.address.toLowerCase().slice(2, 8)) ||
      job.buyer.toLowerCase().includes(agent!.address.toLowerCase().slice(2, 8))
  );

  const feeTierColor = getFeeTierColor(agent.feeTier);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* === COLLECTION BANNER === */}
        <div className="relative rounded-3xl overflow-hidden mb-8">
          {/* Banner BG */}
          <div className="h-48 md:h-56 bg-gradient-to-br from-amber-600/30 via-orange-500/20 to-purple-600/20 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            {/* Agent NFT ID */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-gray-700 text-gray-300 text-sm font-mono">
              Agent #{agent.address.slice(2, 6).toUpperCase()}
            </div>
          </div>

          {/* Profile card overlay */}
          <div className="bg-gray-950 border-t border-gray-800 px-6 md:px-8 pb-6 pt-0 relative">
            {/* Avatar — overlapping banner */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-16 md:-mt-14">
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl md:text-6xl font-bold text-gray-950 border-4 border-gray-950 shadow-2xl">
                  {agent.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-lg ${feeTierColor}`}>
                  {agent.feeTier}
                </div>
              </div>

              <div className="flex-1 pt-2 md:pt-0 md:pb-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{agent.name}</h1>
                  <div className="flex items-center gap-2">
                    <code className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs font-mono">
                      {truncateAddress(agent.address)}
                    </code>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                      ERC-8004
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                      TBA
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Registered {new Date(agent.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Token Bound Account on XLayer
                </p>
                {/* Hire Button */}
                <button
                  onClick={() => setHireModalOpen(true)}
                  className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold text-sm hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-2 w-fit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Hire This Agent
                </button>
              </div>

              {/* Reputation ring — desktop */}
              <div className="hidden md:block md:ml-auto">
                <ReputationRing score={agent.reputation} />
              </div>
            </div>

            {/* Mobile reputation ring */}
            <div className="md:hidden flex justify-center mt-4">
              <ReputationRing score={agent.reputation} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-800">
              <div className="bg-gray-900/60 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{agent.equippedSkills.length}</p>
                <p className="text-gray-500 text-xs">Skills</p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{agent.completedJobs}</p>
                <p className="text-gray-500 text-xs">Jobs Done</p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-amber-400">{agent.totalEarnings.toFixed(1)}</p>
                <p className="text-gray-500 text-xs">OKB Earned</p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-3 text-center">
                <p className={`text-xl font-bold ${feeTierColor.split(' ')[0]}`}>
                  {agent.feeTier === 'Guardian' ? '1%' : agent.feeTier === 'Verified' ? '2%' : agent.feeTier === 'Trusted' ? '3%' : '5%'}
                </p>
                <p className="text-gray-500 text-xs">Fee Rate</p>
              </div>
              <div className="bg-gray-900/60 rounded-xl p-3 text-center col-span-2 md:col-span-1">
                <p className="text-xl font-bold text-white">{agent.reputation}</p>
                <p className="text-gray-500 text-xs">Rep Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* === TAB NAVIGATION === */}
        <div className="flex items-center gap-1 mb-6 bg-gray-900/50 p-1 rounded-xl w-fit border border-gray-800">
          {([
            { key: 'skills' as Tab, label: 'Skill Editions', count: agent.equippedSkills.length },
            { key: 'history' as Tab, label: 'Job History', count: agentJobs.length },
            { key: 'reviews' as Tab, label: 'Reviews', count: agent.completedJobs },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs ${
                activeTab === tab.key ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* === SKILLS TAB — NFT GRID === */}
        {activeTab === 'skills' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agent.equippedSkills.map((skillName, idx) => (
                <SkillNFTCard
                  key={skillName}
                  skillName={skillName}
                  rating={agent.skillRatings[skillName] || 0}
                  edition={idx + 1}
                />
              ))}

              {/* Empty state / Add more */}
              <Link
                href="/dojo"
                className="flex flex-col items-center justify-center min-h-[260px] rounded-2xl border-2 border-dashed border-gray-800 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl text-gray-600 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all mb-3">
                  +
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 text-sm font-medium">
                  Acquire New Skill
                </span>
              </Link>
            </div>

            {/* Fee Tier Visual */}
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Dynamic Fee Tier — Reputation → Fee Rate</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { tier: 'New', fee: '5%', rep: '0–49', color: 'gray' },
                  { tier: 'Trusted', fee: '3%', rep: '50–74', color: 'blue' },
                  { tier: 'Verified', fee: '2%', rep: '75–89', color: 'emerald' },
                  { tier: 'Guardian', fee: '1%', rep: '90+', color: 'amber' },
                ].map((item) => {
                  const isActive = agent!.feeTier === item.tier;
                  return (
                    <div
                      key={item.tier}
                      className={`p-4 rounded-xl text-center transition-all ${
                        isActive
                          ? 'bg-amber-500/10 border-2 border-amber-500/40 shadow-lg shadow-amber-500/5'
                          : 'bg-gray-800/30 border border-gray-800 opacity-40'
                      }`}
                    >
                      <p className={`text-2xl font-bold ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>{item.fee}</p>
                      <p className={`text-sm font-medium mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.tier}</p>
                      <p className="text-gray-600 text-xs mt-0.5">Rep {item.rep}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === HISTORY TAB === */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {agentJobs.length > 0 ? agentJobs.map((job) => (
              <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium">{job.description}</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span><span className="text-gray-600">Reward:</span> {job.reward} OKB</span>
                  <span><span className="text-gray-600">Skill:</span> {job.requiredSkill}</span>
                  {job.buyerRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Rating:</span>
                      <StarRating rating={job.buyerRating} />
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <p className="text-gray-500 text-lg mb-2">No jobs yet</p>
                <Link href="/jobs" className="text-amber-400 hover:text-amber-300 text-sm font-medium">Browse open jobs →</Link>
              </div>
            )}
          </div>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === 'reviews' && (
          <div>
            {/* Review summary */}
            {agentReviews.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-400">{avgRating.toFixed(1)}</p>
                    <StarRating rating={avgRating} />
                    <p className="text-gray-500 text-xs mt-1">{agentReviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = agentReviews.filter(r => r.rating === star).length;
                      const pct = agentReviews.length > 0 ? (count / agentReviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs w-3">{star}</span>
                          <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-gray-600 text-xs w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Individual reviews */}
            <div className="space-y-3">
              {agentReviews.length > 0 ? agentReviews.map((review) => (
                <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                      {review.fromName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{review.fromName}</p>
                          <p className="text-gray-600 text-xs">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">&ldquo;{review.comment}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs">
                      {SKILLS.find(s => s.name === review.skillUsed)?.icon} {review.skillUsed}
                    </span>
                    <span className="text-gray-600 text-xs">{review.jobDescription}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-600 text-sm mt-1">Be the first to hire and review this agent</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === HIRE MODAL === */}
        {hireModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHireModalOpen(false)} />
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Hire {agent.name}</h2>
                  <p className="text-gray-500 text-sm">Post a job for this agent</p>
                </div>
                <button onClick={() => setHireModalOpen(false)} className="text-gray-400 hover:text-white p-1">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Required Skill</label>
                  <select
                    value={hireForm.skill}
                    onChange={(e) => setHireForm(prev => ({ ...prev, skill: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select a skill this agent has...</option>
                    {agent.equippedSkills.map((s) => (
                      <option key={s} value={s}>{SKILLS.find(sk => sk.name === s)?.icon} {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Job Description</label>
                  <textarea
                    value={hireForm.description}
                    onChange={(e) => setHireForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you need done..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-amber-500 focus:outline-none resize-none placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Reward (OKB)</label>
                  <input
                    type="number"
                    value={hireForm.reward}
                    onChange={(e) => setHireForm(prev => ({ ...prev, reward: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                {/* Fee preview */}
                {hireForm.reward && (
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Reward</span>
                      <span className="text-white">{hireForm.reward} OKB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Platform fee ({agent.feeTier === 'Guardian' ? '1%' : agent.feeTier === 'Verified' ? '2%' : agent.feeTier === 'Trusted' ? '3%' : '5%'})</span>
                      <span className="text-gray-500">
                        {(parseFloat(hireForm.reward) * (agent.feeTier === 'Guardian' ? 0.01 : agent.feeTier === 'Verified' ? 0.02 : agent.feeTier === 'Trusted' ? 0.03 : 0.05)).toFixed(3)} OKB
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                      <span className="text-gray-300 font-medium">Agent receives</span>
                      <span className="text-amber-400 font-medium">
                        {(parseFloat(hireForm.reward) * (1 - (agent.feeTier === 'Guardian' ? 0.01 : agent.feeTier === 'Verified' ? 0.02 : agent.feeTier === 'Trusted' ? 0.03 : 0.05))).toFixed(3)} OKB
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    alert(`Job posted for ${agent.name}! (Demo — connect wallet to post on-chain)`);
                    setHireModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all"
                >
                  Post Job & Lock Escrow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
