import React, { useState } from 'react';
import { 
  X, 
  Feather, 
  Utensils, 
  MapPin, 
  Compass, 
  Download, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { getStatusBadge } from '../utils/statusBadges';
import { api } from '../services/api';

export default function SpeciesModal({ species, isOpen, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !species) return null;

  const badge = getStatusBadge(species.conservation_status);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      await api.downloadSpeciesPdf(species);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.warn('Backend PDF endpoint error, falling back to printable view:', err);
      // Client-side print fallback if network / backend fails
      triggerPrintFallback(species);
    } finally {
      setIsDownloading(false);
    }
  };

  const triggerPrintFallback = (spec) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocker prevented PDF generation. Please allow popups.');
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${spec.common_name || 'Species'} — Drishti Field Dossier</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 20px; line-height: 1.5; }
          .hdr { border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; }
          .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
          .sci { font-size: 16px; font-style: italic; color: #047857; margin: 4px 0 12px 0; font-family: Georgia, serif; }
          .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 12px; }
          .label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #059669; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="hdr">
          <div><h2 style="margin:0;color:#065f46;">Drishti Avian Intelligence</h2><small>Species Field Dossier</small></div>
          <div style="text-align:right;"><small>${spec.conservation_status || 'Least Concern'}</small></div>
        </div>
        <h1 class="title">${spec.common_name || 'Bird Species'}</h1>
        <div class="sci">${spec.scientific_name || ''} &bull; Genus: ${spec.genus || 'N/A'} &bull; Family: ${spec.family || 'N/A'}</div>
        <div class="card"><div class="label">Ecological Summary</div><div>${spec.description || 'N/A'}</div></div>
        <div class="card"><div class="label">Natural Habitat</div><div>${spec.habitat || 'N/A'}</div></div>
        <div class="card"><div class="label">Diet & Ecological Niche</div><div>${spec.diet || 'N/A'}</div></div>
        <div class="card"><div class="label">Physical Traits</div><div>${spec.physical_characteristics || 'N/A'}</div></div>
        <div class="card"><div class="label">Geographical Distribution</div><div>${spec.geographical_distribution || 'N/A'}</div></div>
        <script>window.onload = function() { window.print(); window.close(); };</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

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

          {/* Action buttons (Download PDF + Close) in Top Header */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-full bg-black/45 hover:bg-emerald-600 text-white transition-colors backdrop-blur-md flex items-center gap-1.5 text-xs font-bold shadow-xs group"
              title="Download official Species Field Dossier as PDF"
            >
              {isDownloading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              )}
              <span className="hidden sm:inline">
                {isDownloading ? 'Generating...' : downloadSuccess ? 'Downloaded!' : 'Download PDF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-black/45 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              <div className="space-y-1.5 flex-1">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Physical Traits</h4>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {species.physical_characteristics || 'Distinct plumage patterns tailored for specialized flight and camouflage.'}
                  </p>
                </div>
                {species.lifespan_longevity && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-emerald-800">Living Period: </span>
                    <span>{species.lifespan_longevity}</span>
                  </div>
                )}
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
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            Species ID: {species.species_id || 'N/A'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs border ${
                downloadSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-emerald-50 border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-800'
              } disabled:opacity-50 group`}
              title="Download official Species Field Dossier as PDF"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Download className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : downloadSuccess ? 'PDF Downloaded!' : 'Download PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Close Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
