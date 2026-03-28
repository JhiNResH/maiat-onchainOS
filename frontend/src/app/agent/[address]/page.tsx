'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AGENTS, JOBS, SKILLS, getAgentByAddress, getFeeTierColor, getReputationColor, truncateAddress } from '@/lib/mock-data';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-400 text-sm ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ReputationMeter({ score }: { score: number }) {
  const color = getReputationColor(score);
  const percentage = Math.min(score, 100);

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-800"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${(percentage / 100) * 352} 352`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
          <span className="text-gray-500 text-xs">Rep Score</span>
        </div>
      </div>
    </div>
  );
}

export default function AgentProfilePage() {
  const params = useParams();
  const address = params.address as string;

  // Try to find agent by address, or use first agent as fallback for demo
  let agent = getAgentByAddress(address);
  if (!agent) {
    agent = AGENTS[0];
  }

  const agentJobs = JOBS.filter(
    (job) =>
      job.worker?.toLowerCase().includes(agent!.address.toLowerCase().slice(2, 8)) ||
      job.buyer.toLowerCase().includes(agent!.address.toLowerCase().slice(2, 8))
  );

  const feeTierColor = getFeeTierColor(agent.feeTier);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-4xl font-bold text-gray-950">
                {agent.name.charAt(0)}
              </div>
              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold border ${feeTierColor}`}>
                {agent.feeTier}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{agent.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <code className="px-3 py-1 rounded-lg bg-gray-800 text-gray-400 text-sm font-mono">
                  {truncateAddress(agent.address)}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(agent!.address)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Member since {new Date(agent.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Reputation Meter */}
            <div className="md:ml-auto">
              <ReputationMeter score={agent.reputation} />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{agent.completedJobs}</p>
              <p className="text-gray-500 text-sm">Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{agent.totalEarnings.toFixed(1)} OKB</p>
              <p className="text-gray-500 text-sm">Total Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{agent.equippedSkills.length}</p>
              <p className="text-gray-500 text-sm">Skills Equipped</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${feeTierColor.split(' ')[0]}`}>
                {agent.feeTier === 'Guardian' ? '1%' : agent.feeTier === 'Verified' ? '2%' : agent.feeTier === 'Trusted' ? '3%' : '5%'}
              </p>
              <p className="text-gray-500 text-sm">Platform Fee</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Skills */}
          <div className="lg:col-span-1 space-y-6">
            {/* Equipped Skills */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Equipped Skills</h2>
              <div className="space-y-3">
                {agent.equippedSkills.map((skillName) => {
                  const skill = SKILLS.find((s) => s.name === skillName);
                  const rating = agent.skillRatings[skillName] || 0;
                  return (
                    <div
                      key={skillName}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-xl">
                        {skill?.icon || '🎯'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{skillName}</p>
                        <StarRating rating={rating} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/dojo"
                className="mt-4 w-full py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 font-medium text-sm hover:text-white hover:border-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <span>+</span> Acquire More Skills
              </Link>
            </div>

            {/* Skill Ratings */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Reputation by Skill</h2>
              <div className="space-y-4">
                {Object.entries(agent.skillRatings).map(([skill, rating]) => (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">{skill}</span>
                      <span className="text-white font-medium">{rating.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${(rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job History */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Job History</h2>
              {agentJobs.length > 0 ? (
                <div className="space-y-4">
                  {agentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-white">{job.description}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          job.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          <span className="text-gray-500">Reward:</span> {job.reward} OKB
                        </span>
                        <span className="text-gray-400">
                          <span className="text-gray-500">Skill:</span> {job.requiredSkill}
                        </span>
                        {job.buyerRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Rating received:</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-3 h-3 ${star <= job.buyerRating! ? 'text-amber-400' : 'text-gray-600'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No job history yet</p>
                  <Link
                    href="/jobs"
                    className="mt-4 inline-block px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 font-medium text-sm hover:bg-amber-500/30 transition-all"
                  >
                    Find Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Fee Tier Info */}
            <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Dynamic Fee Tier</h2>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { tier: 'New', fee: '5%', rep: '0-49', active: agent.feeTier === 'New' },
                  { tier: 'Trusted', fee: '3%', rep: '50-74', active: agent.feeTier === 'Trusted' },
                  { tier: 'Verified', fee: '2%', rep: '75-89', active: agent.feeTier === 'Verified' },
                  { tier: 'Guardian', fee: '1%', rep: '90+', active: agent.feeTier === 'Guardian' },
                ].map((item) => (
                  <div
                    key={item.tier}
                    className={`p-3 rounded-xl text-center ${
                      item.active
                        ? 'bg-amber-500/20 border-2 border-amber-500/50'
                        : 'bg-gray-800/50 border border-gray-700 opacity-50'
                    }`}
                  >
                    <p className={`text-lg font-bold ${item.active ? 'text-amber-400' : 'text-gray-400'}`}>
                      {item.fee}
                    </p>
                    <p className="text-white text-sm font-medium">{item.tier}</p>
                    <p className="text-gray-500 text-xs">{item.rep}</p>
                  </div>
                ))}
              </div>
              {agent.feeTier !== 'Guardian' && (
                <p className="mt-4 text-gray-400 text-sm text-center">
                  Complete more jobs and maintain high ratings to unlock lower fees!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
