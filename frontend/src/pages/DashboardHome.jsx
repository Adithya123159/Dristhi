import React, { useState, useEffect } from 'react';
import {
  ScanLine,
  Volume2,
  Bird,
  History,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardHome({ setCurrentTab, setSelectedSpeciesModal }) {
  const [stats, setStats] = useState({
    total_classifications: 0,
    supported_species_count: 100
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [sampleSpecies, setSampleSpecies] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, historyData, speciesData] = await Promise.all([
          api.getStats(),
          api.getHistory(4, 0),
          api.getSpecies({ limit: 4 })
        ]);
        setStats(statsData);
        setRecentHistory(historyData.history || []);
        setSampleSpecies(speciesData.species || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Section - Clean & Minimal */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            Deep Learning System
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Bird Species Classification
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Upload an image to identify bird species and view biological details.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('identify')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              <span>Identify Bird</span>
            </button>

            <button
              onClick={() => setCurrentTab('species')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <span>Species Catalog (100)</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Icon */}
        <div className="hidden md:flex w-28 h-28 rounded-2xl bg-emerald-50 text-emerald-600 items-center justify-center flex-shrink-0">
          <Bird className="w-14 h-14" />
        </div>
      </div>

      {/* Stats Row - 4 Clean Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Supported Species</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">100</span>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">Indian birds</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Model</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">MobileNetV2</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">Transfer Learning</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Speed</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">&lt; 100ms</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">Fast inference</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total Classified</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.total_classifications}</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5 block">Saved in history</span>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setCurrentTab('identify')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ScanLine className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
            Identify Bird
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload an image to get species predictions and confidence scores.
          </p>
        </div>

        <div
          onClick={() => setCurrentTab('species')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <Bird className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
            Supported Species
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse and search all 100 supported bird species.
          </p>
        </div>

        <div
          onClick={() => setCurrentTab('history')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
            History
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            View past image classifications and downloaded results.
          </p>
        </div>
      </div>

      {/* Sample Species Preview */}
      {sampleSpecies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Sample Species</h2>
            <button
              onClick={() => setCurrentTab('species')}
              className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1"
            >
              <span>View all 100</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sampleSpecies.map((sp) => (
              <div
                key={sp.species_id}
                onClick={() => setSelectedSpeciesModal(sp)}
                className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="h-32 rounded-xl bg-slate-100 overflow-hidden mb-2.5">
                  <img
                    src={sp.image_url}
                    alt={sp.common_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>
                <h4 className="font-semibold text-xs text-slate-900 truncate group-hover:text-emerald-600">
                  {sp.common_name}
                </h4>
                <p className="text-[11px] text-slate-400 italic truncate font-serif mt-0.5">
                  {sp.scientific_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
      }

      {/* Recent Identifications (Only if exists) */}
      {
        recentHistory.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Recent Identifications</h2>
              <button
                onClick={() => setCurrentTab('history')}
                className="text-xs text-emerald-600 font-medium hover:underline"
              >
                View all
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {recentHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 px-4 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={`${api.getBaseUrl()}${item.image_url}`}
                        alt={item.predicted_common_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 block truncate">
                        {item.predicted_common_name}
                      </span>
                      <span className="text-[11px] text-slate-400 italic font-serif truncate block">
                        {item.predicted_scientific_name || item.predicted_species_id}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-emerald-600 block">
                      {(item.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
