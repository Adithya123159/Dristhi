import React from 'react';
import { X, Globe, Feather, Utensils, Shield, MapPin, ExternalLink, Compass } from 'lucide-react';
import { getStatusBadge } from '../utils/statusBadges';

export default function SpeciesModal({ species, isOpen, onClose }) {
  if (!isOpen || !species) return null;

  const badge = getStatusBadge(species.conservation_status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner / Photo */}
        <div className="relative h-56 bg-slate-900 overflow-hidden">
          {species.image_url ? (
            <img
              src={species.image_url}
              alt={species.common_name}
              className="w-full h-full object-cover opacity-85"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-900 to-slate-900">
              <Feather className="w-16 h-16 text-emerald-400/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Species Badge & Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
              {species.genus && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md">
                  Genus: <span className="italic">{species.genus}</span>
                </span>
              )}
              {species.family && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md">
                  Family: {species.family}
                </span>
              )}
              {species.order && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md">
                  Order: {species.order}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {species.common_name}
            </h2>
            <p className="text-sm text-emerald-300 italic font-serif">
              {species.scientific_name}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Summary */}
          {species.description && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-sm text-slate-700 leading-relaxed">
              {species.description}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Habitat</h4>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {species.habitat || 'Forests, wetlands, and open plains across India.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Diet & Niche</h4>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {species.diet || 'Insects, wild berries, aquatic invertebrates, and seeds.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 mt-0.5">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Physical Traits</h4>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {species.physical_characteristics || 'Distinct plumage patterns tailored for specialized flight and camouflage.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribution</h4>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {species.geographical_distribution || 'Endemic or native resident throughout the Indian subcontinent.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Species ID: {species.species_id}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
