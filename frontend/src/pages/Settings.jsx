import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const [threshold, setThreshold] = useState(50);
  const [status, setStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('avian_api_url') || 'http://localhost:8000';
    const savedThreshold = localStorage.getItem('avian_confidence_threshold') || 50;
    setApiUrl(savedUrl);
    setThreshold(Number(savedThreshold));
    testConnection(savedUrl);
  }, []);

  const testConnection = async (urlToTest = apiUrl) => {
    setIsTesting(true);
    setStatus(null);
    try {
      const start = performance.now();
      const res = await fetch(`${urlToTest}/api/health`);
      const latency = Math.round(performance.now() - start);

      if (res.ok) {
        setStatus({
          type: 'success',
          msg: `Connected (${latency}ms)`
        });
      } else {
        setStatus({
          type: 'error',
          msg: `Error ${res.status}`
        });
      }
    } catch {
      setStatus({
        type: 'error',
        msg: `Could not reach ${urlToTest}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('avian_api_url', apiUrl);
    localStorage.setItem('avian_confidence_threshold', threshold);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
      <div className="space-y-6 max-w-2xl mx-auto pb-12">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Settings
            </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure backend API connection and confidence thresholds.
              </p>
            </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Backend API URL
                      </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            placeholder="http://localhost:8000"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                          <button
                            onClick={() => testConnection()}
                            disabled={isTesting}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 flex items-center gap-1.5"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                            <span>Test</span>
                          </button>
                        </div>

                        {status && (
                            <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                              {status.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                              ) : (
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                              )}
                              <span>{status.msg}</span>
                            </div>
          )}
                          </div>

                            <div className="pt-4 border-t border-slate-100">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                                <span>Low Confidence Threshold</span>
                                <span className="text-emerald-600 font-bold">{threshold}%</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="80"
                                step="5"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                className="w-full accent-emerald-600 cursor-pointer"
                              />
                            </div>

                              <div className="pt-2 flex items-center justify-between">
                                {saveSuccess ? (
                                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Saved
                                  </span>
                                ) : <span />}

                                <button
                                  onClick={handleSave}
                                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save Settings</span>
                                </button>
                              </div>
                              </div>
                            </div>
                          );
}
