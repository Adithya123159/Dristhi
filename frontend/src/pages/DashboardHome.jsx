import React, { useState, useEffect } from 'react';
import {
  ScanLine,
  Volume2,
  History,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardHome({ setCurrentTab, onSelectIdentify }) {
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const historyData = await api.getHistory(3, 0);
        setRecentHistory(historyData.history || []);
      } catch (err) {
        console.error('Failed to load dashboard history:', err);
      }
    }
    loadData();
  }, []);

  const handleIdentifyMode = (mode) => {
    if (onSelectIdentify) {
      onSelectIdentify(mode);
    } else {
      setCurrentTab('identify');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner - Clean, Modern & Global */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Global Multimodal AI System</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Global Avian Identification
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Multimodal artificial intelligence for visual and acoustic bird species recognition worldwide with comprehensive biological profiles.
          </p>
        </div>
      </div>

      {/* Redesigned Statistics Row - Exactly Two Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: AI Engine */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">AI Engine</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 block">Multimodal AI</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Intelligent Bird Recognition</span>
          </div>
        </div>

        {/* Card 2: Identification Modes */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 border border-teal-100">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Identification Modes</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 block">Image & Audio</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Visual and Acoustic Recognition</span>
          </div>
        </div>
      </div>

      {/* Main Primary Action Section - Identify Bird (Prominent Card) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-white to-emerald-50/30 border-2 border-emerald-500/20 shadow-sm space-y-6">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1.5">
            Primary Identification
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Identify Bird
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Upload a bird image or audio recording to identify its species and explore its biological characteristics.
          </p>
        </div>

        {/* Dual Input Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Option 1: Identify Using Image */}
          <div
            onClick={() => handleIdentifyMode('image')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ScanLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Identify Using Image
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Upload photographs for visual neural detection, Grad-CAM attention analysis, and full taxonomic classification.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIdentifyMode('image');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs hover:bg-emerald-700 group-hover:bg-emerald-700 transition-all"
            >
              <ScanLine className="w-4 h-4" />
              <span>Identify Using Image</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Option 2: Identify Using Audio */}
          <div
            onClick={() => handleIdentifyMode('audio')}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Identify Using Audio
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Upload audio recordings for bioacoustic frequency matching, Mel Spectrograms, and audio playback.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIdentifyMode('audio');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xs hover:bg-emerald-800 group-hover:bg-teal-700 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Identify Using Audio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Section - History */}
      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Classification History
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review past multimodal identifications, biological data, and downloaded records.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('history')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Activity List (if records exist) */}
        {recentHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
            <div className="p-3.5 px-4 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Recent Identifications</span>
              <span>Confidence</span>
            </div>
            {recentHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentTab('history')}
                className="p-3.5 px-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">
                    {item.input_type === 'audio' ? <Volume2 className="w-4 h-4" /> : <ScanLine className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.predicted_common_name || item.predicted_species || 'Identified Avian'}
                    </span>
                    <span className="text-[11px] text-slate-400 italic font-serif truncate block">
                      {item.predicted_scientific_name || item.scientific_name || ''}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-emerald-600 block">
                    {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : '—'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
