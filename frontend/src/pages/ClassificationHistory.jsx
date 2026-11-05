import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  Download, 
  Sparkles, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { formatConfidence } from '../utils/statusBadges';

export default function ClassificationHistory({ setSelectedSpeciesModal }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await api.getHistory(50, 0);
      setHistoryItems(data.history || []);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Could not delete history record');
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearHistory();
      setHistoryItems([]);
      setConfirmClear(false);
    } catch (err) {
      alert('Could not clear history');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `avian_classification_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classification History
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Persisted history of all bird images processed through the MobileNetV2 inference pipeline.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-2.5 rounded-2xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Feed */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <History className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-sm font-semibold">Retrieving history logs...</p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-slate-200/80 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-lg">No Classification Logs Found</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Classified images and model predictions will automatically be recorded here with timestamps and probability scores.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {historyItems.map((record) => {
            const conf = formatConfidence(record.confidence);
            const dateStr = new Date(record.created_at).toLocaleString();

            return (
              <div
                key={record.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                    <img
                      src={`${api.getBaseUrl()}${record.image_url}`}
                      alt={record.predicted_common_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">#{record.id}</span>
                      <h4 className="font-bold text-slate-900 text-base truncate">
                        {record.predicted_common_name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 italic font-serif mt-0.5 truncate">
                      {record.predicted_scientific_name || record.predicted_species_id}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Confidence & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Confidence
                    </span>
                    <span className={`text-lg font-extrabold ${conf.color}`}>
                      {conf.pct}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(record.id, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
