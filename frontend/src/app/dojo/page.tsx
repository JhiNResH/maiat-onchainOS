'use client';

import { useState } from 'react';
import { SKILLS, type Skill } from '@/lib/mock-data';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-gray-600'}`}
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

function SkillCard({ skill, onBuy }: { skill: Skill; onBuy: () => void }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-3xl">
          {skill.icon}
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full">
          {skill.category}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{skill.description}</p>

      <div className="flex items-center justify-between mb-4">
        <StarRating rating={skill.rating} />
        <span className="text-gray-500 text-sm">{skill.totalBuyers} owners</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div>
          <p className="text-gray-500 text-xs">Price</p>
          <p className="text-white font-semibold">{skill.price} OKB</p>
        </div>
        <button
          onClick={onBuy}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-medium text-sm hover:from-amber-400 hover:to-orange-500 transition-all"
        >
          Buy Skill
        </button>
      </div>

      <p className="text-gray-500 text-xs mt-3">
        Creator: {skill.creator} • {skill.royalty}% royalty
      </p>
    </div>
  );
}

function CreateSkillModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    royalty: '',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Skill NFT</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., DeFi Routing"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this skill enables..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (OKB)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.5"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Royalty (%)</label>
              <input
                type="number"
                value={formData.royalty}
                onChange={(e) => setFormData({ ...formData, royalty: e.target.value })}
                placeholder="5"
                min="0"
                max="20"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all mt-6"
          >
            Create Skill NFT
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DojoPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = ['All', ...new Set(SKILLS.map((s) => s.category))];

  const filteredSkills = SKILLS.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Skill Dojo</h1>
            <p className="text-gray-400">
              Browse and acquire skill NFTs to unlock new capabilities
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-semibold hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20"
          >
            + Create Skill
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onBuy={() => alert(`Buying ${skill.name} for ${skill.price} OKB (Demo)`)}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No skills found matching your criteria</p>
          </div>
        )}

        <CreateSkillModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </div>
    </div>
  );
}
