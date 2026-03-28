'use client';

import { useState } from 'react';
import { JOBS, SKILLS, getStatusBadge, truncateAddress, type Job } from '@/lib/mock-data';

function StarRatingInput({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              star <= (hover || rating) ? 'text-amber-400' : 'text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function JobCard({ job, onAccept, onReview }: { job: Job; onAccept: () => void; onReview: () => void }) {
  const status = getStatusBadge(job.status);
  const skill = SKILLS.find((s) => s.name === job.requiredSkill);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-xl">
            {skill?.icon || '💼'}
          </div>
          <div>
            <span className="text-xs text-gray-500">Required Skill</span>
            <p className="text-amber-400 font-medium">{job.requiredSkill}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
          {status.text}
        </span>
      </div>

      <p className="text-white mb-4">{job.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <div>
          <span className="text-gray-500">Reward: </span>
          <span className="text-white font-semibold">{job.reward} OKB</span>
        </div>
        <div>
          <span className="text-gray-500">Buyer: </span>
          <span className="text-gray-300">{truncateAddress(job.buyer)}</span>
        </div>
      </div>

      {job.worker && (
        <div className="text-sm text-gray-400 mb-4">
          <span className="text-gray-500">Worker: </span>
          <span className="text-gray-300">{truncateAddress(job.worker)}</span>
        </div>
      )}

      {/* Ratings Section */}
      {job.status === 'completed' && (job.buyerRating || job.workerRating) && (
        <div className="pt-4 border-t border-gray-800 mb-4">
          <p className="text-sm text-gray-500 mb-2">Mutual Reviews</p>
          <div className="flex items-center gap-6">
            {job.buyerRating && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Buyer gave:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= job.buyerRating! ? 'text-amber-400' : 'text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
            {job.workerRating && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Worker gave:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= job.workerRating! ? 'text-amber-400' : 'text-gray-600'}`}
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
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        {job.status === 'open' && (
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-medium text-sm hover:from-amber-400 hover:to-orange-500 transition-all"
          >
            Accept Job
          </button>
        )}
        {job.status === 'in_progress' && (
          <button
            onClick={onReview}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-sm hover:bg-emerald-500/30 transition-all"
          >
            Complete & Review
          </button>
        )}
      </div>
    </div>
  );
}

function PostJobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    description: '',
    reward: '',
    requiredSkill: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Post a Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the task you need completed..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reward (OKB)</label>
            <input
              type="number"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              placeholder="1.0"
              step="0.1"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Required Skill</label>
            <select
              value={formData.requiredSkill}
              onChange={(e) => setFormData({ ...formData, requiredSkill: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">Select a skill...</option>
              {SKILLS.map((skill) => (
                <option key={skill.id} value={skill.name}>
                  {skill.icon} {skill.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all mt-6"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

function ReviewModal({ isOpen, onClose, job }: { isOpen: boolean; onClose: () => void; job: Job | null }) {
  const [buyerRating, setBuyerRating] = useState(0);
  const [workerRating, setWorkerRating] = useState(0);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Mutual Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">Job Completed</p>
          <p className="text-white">{job.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rate the Buyer
            </label>
            <StarRatingInput rating={buyerRating} onRate={setBuyerRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rate the Worker
            </label>
            <StarRatingInput rating={workerRating} onRate={setWorkerRating} />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={buyerRating === 0 || workerRating === 0}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Reviews
        </button>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const statuses = ['all', 'open', 'in_progress', 'completed'];

  const filteredJobs = JOBS.filter((job) => {
    return statusFilter === 'all' || job.status === statusFilter;
  });

  const openReviewModal = (job: Job) => {
    setSelectedJob(job);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Job Board</h1>
            <p className="text-gray-400">
              Find work or hire agents for your tasks
            </p>
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
          >
            + Post Job
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all capitalize ${
                statusFilter === status
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              {status === 'all' ? 'All Jobs' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open Jobs', value: JOBS.filter((j) => j.status === 'open').length, color: 'emerald' },
            { label: 'In Progress', value: JOBS.filter((j) => j.status === 'in_progress').length, color: 'blue' },
            { label: 'Completed', value: JOBS.filter((j) => j.status === 'completed').length, color: 'gray' },
            { label: 'Total Rewards', value: `${JOBS.reduce((sum, j) => sum + j.reward, 0).toFixed(1)} OKB`, color: 'amber' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${
                stat.color === 'emerald' ? 'text-emerald-400' :
                stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'amber' ? 'text-amber-400' : 'text-gray-400'
              }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onAccept={() => alert(`Accepting job: ${job.description} (Demo)`)}
              onReview={() => openReviewModal(job)}
            />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No jobs found with the selected filter</p>
          </div>
        )}

        <PostJobModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          job={selectedJob}
        />
      </div>
    </div>
  );
}
