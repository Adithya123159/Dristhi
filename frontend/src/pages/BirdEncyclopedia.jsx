import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Utensils, 
  Feather, 
  Compass, 
  Shield, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { getStatusBadge } from '../utils/statusBadges';

export default function BirdEncyclopedia({ setSelectedSpeciesModal }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getSpecies({ limit: 100 });
        const all = data.species || [];
        setSpeciesList(all);

        // Extract unique families
        const fams = Array.from(new Set(all.map((b) => b.family).filter(Boolean))).sort();
        setFamilies(['ALL', ...fams]);
      } catch (e) {
        console.error('Failed to load encyclopedia data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredSpecies = speciesList.filter((b) => {
    const matchesSearch = 
      b.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.habitat && b.habitat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.diet && b.diet.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFamily = selectedFamily === 'ALL' || b.family === selectedFamily;

    return matchesSearch && matchesFamily;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Field Knowledge Base</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Indian Avian Encyclopedia
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In-depth biological profiles, behavioral patterns, feeding habits, and habitat dynamics 
            for the 100 species in our classification domain.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across descriptions, habitats, diets, or species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              {families.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Taxonomic Families' : `Family: ${f}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Encyclopedia Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {filteredSpecies.length} Species Profile Entries
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <BookOpen className="w-10 h-10 animate-pulse text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">Loading Encyclopedia...</p>
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <h4 className="font-bold text-slate-800">No Encyclopedia Entries Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or family filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSpecies.map((bird) => {
              const badge = getStatusBadge(bird.conservation_status);
              return (
                <div
                  key={bird.species_id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Common Name & Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                          {bird.species_id} • {bird.family || 'Aves'}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 truncate">
                          {bird.common_name}
                        </h3>
                        <p className="text-xs font-serif italic text-emerald-700 font-medium">
                          {bird.scientific_name}
                        </p>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${badge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Description Paragraph */}
                    {bird.description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {bird.description}
                      </p>
                    )}

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px] block">Habitat</span>
                          <span className="text-slate-800 line-clamp-2 mt-0.5">{bird.habitat}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                        <Utensils className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 uppercase text-[10px] block">Diet</span>
                          <span className="text-slate-800 line-clamp-2 mt-0.5">{bird.diet}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Distribution: {bird.geographical_distribution?.split(';')[0] || 'India'}</span>
                    <button
                      onClick={() => setSelectedSpeciesModal(bird)}
                      className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Full Bio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
