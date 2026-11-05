import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Calendar,
  ArrowRight,
  Download,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  ExternalLink,
  Layers,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export default function ClassificationHistory({ setSelectedSpeciesModal }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'audio', 'rejected'
  const [activeAudioPlaying, setActiveAudioPlaying] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [filterType]);

  async function loadHistory() {
    setLoading(true);
    try {
      const params = {};
      if (filterType === 'image') params.input_type = 'image';
      if (filterType === 'audio') params.input_type = 'audio';
      if (filterType === 'rejected') params.detection_status = 'rejected';

      const data = await api.getHistory(params);
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
      setHistoryItems((prev) => prev.filter((item) => (item.identification_id || item.id) !== id));
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
    downloadAnchor.setAttribute("download", `drishti_multimodal_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleAudio = (audioUrl, id) => {
    if (activeAudioPlaying?.id === id) {
      activeAudioPlaying.element.pause();
      setActiveAudioPlaying(null);
    } else {
      if (activeAudioPlaying) {
        activeAudioPlaying.element.pause();
      }
      const audio = new Audio(`${api.getBaseUrl()}${audioUrl}`);
      audio.play();
      audio.onended = () => setActiveAudioPlaying(null);
      setActiveAudioPlaying({ id, element: audio });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Multimodal Identification History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Persisted MongoDB log of vision and bioacoustic identification sessions, including bounding boxes and Mel Spectrograms.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit border border-slate-200/60">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          All Identifications
        </button>

        <button
          onClick={() => setFilterType('image')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'image' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Vision (Images)</span>
        </button>

        <button
          onClick={() => setFilterType('audio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'audio' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Bioacoustics (Audio)</span>
        </button>

        <button
          onClick={() => setFilterType('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'rejected' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Rejections</span>
        </button>
      </div>

      {/* History Items Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading identification history...</p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <History className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No History Records Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {filterType === 'all'
              ? 'Uploaded bird images and audio recordings will appear here automatically.'
              : `No identification records found for category '${filterType}'.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {historyItems.map((item) => {
            const isAudio = item.input_type === 'audio';
            const isRejected = item.detection_status !== 'success';
            const itemId = item.identification_id || item.id;
            const isPlayingThis = activeAudioPlaying?.id === itemId;

            return (
              <div
                key={itemId}
                className="group p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isAudio
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                    >
                      {isAudio ? <Volume2 className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{isAudio ? 'Audio Bioacoustics' : 'Image Vision'}</span>
                    </span>

                    <button
                      onClick={(e) => handleDelete(itemId, e)}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Media Visual / Player Preview */}
                  <div className="relative mb-3.5 rounded-2xl overflow-hidden bg-slate-100 h-36 flex items-center justify-center border border-slate-100">
                    {isAudio ? (
                      item.spectrogram_url ? (
                        <div className="relative w-full h-full">
                          <img
                            src={`${api.getBaseUrl()}${item.spectrogram_url}`}
                            alt="Mel Spectrogram"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => toggleAudio(item.media_url, itemId)}
                            className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/50 flex items-center justify-center transition-colors text-white"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                              {isPlayingThis ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </div>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleAudio(item.media_url, itemId)}
                          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md"
                        >
                          {isPlayingThis ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </button>
                      )
                    ) : (
                      <img
                        src={`${api.getBaseUrl()}${item.annotated_url || item.media_url}`}
                        alt={item.predicted_species}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Species Name or Rejection Reason */}
                  {isRejected ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Input Rejected by Gatekeeper</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.rejection_reason || 'Non-bird object or non-avian audio detected.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-slate-900 tracking-tight">
                        {item.predicted_species || item.predicted_common_name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 italic">
                        {item.scientific_name || item.predicted_scientific_name || 'Aves'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Telemetry */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })
                        : 'Recent'}
                    </span>
                  </div>

                  {!isRejected && (
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <span>{((item.confidence_score || item.confidence || 0.95) * 100).toFixed(1)}%</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
