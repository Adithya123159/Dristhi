import React, { useState, useEffect } from 'react';
import { Search, Filter, Bird, LayoutGrid, List, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { getStatusBadge } from '../utils/statusBadges';

export default function SupportedSpecies({ setSelectedSpeciesModal }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const statuses = ['ALL', 'Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered'];

  useEffect(() => {
    async function fetchSpecies() {
      setLoading(true);
      try {
        const data = await api.getSpecies({
          search: searchTerm,
          letter: selectedLetter !== 'ALL' ? selectedLetter : undefined,
          status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
          limit: 100
        });
        setSpeciesList(data.species || []);
      } catch (err) {
        console.error('Failed to load species:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchSpecies();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedLetter, selectedStatus]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            100 Supported Indian Species
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete catalogue of indigenous and migratory species with IUCN conservation ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        {/* Search Bar & Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by common name, scientific name, or family..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="ALL">All Conservation Statuses</option>
              {statuses.slice(1).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Alphabetical Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLetter === letter
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Species Count & Grid/List */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing {speciesList.length} of 100 Species
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Bird className="w-10 h-10 animate-bounce text-emerald-500 mb-3" />
            <span className="text-sm font-semibold">Loading Species Catalog...</span>
          </div>
        ) : speciesList.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-slate-200/80 text-center p-8">
            <Bird className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-base">No Matching Birds Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, alphabetical letter, or conservation status filter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {speciesList.map((species) => {
              const badge = getStatusBadge(species.conservation_status);
              return (
                <div
                  key={species.species_id}
                  onClick={() => setSelectedSpeciesModal(species)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm card-hover cursor-pointer group flex flex-col"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={species.image_url}
                      alt={species.common_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md bg-white/95 ${badge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                        {species.species_id}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                        {species.common_name}
                      </h4>
                      <p className="text-xs text-slate-500 italic mt-0.5 font-serif">
                        {species.scientific_name}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[140px]">Family: {species.family || 'Aves'}</span>
                      <span className="font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {speciesList.map((species) => {
              const badge = getStatusBadge(species.conservation_status);
              return (
                <div
                  key={species.species_id}
                  onClick={() => setSelectedSpeciesModal(species)}
                  className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={species.image_url}
                        alt={species.common_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{species.species_id}</span>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors truncate">
                          {species.common_name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 italic font-serif truncate mt-0.5">
                        {species.scientific_name} • Family: {species.family || 'Aves'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <button className="p-2 rounded-xl text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
