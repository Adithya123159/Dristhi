import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  ScanLine, 
  MapPin, 
  Utensils, 
  AlertTriangle,
  Key,
  CheckCircle2,
  ShieldCheck,
  Feather,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Eye,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import ConfidenceMeter from '../components/ConfidenceMeter';
import PredictionChart from '../components/PredictionChart';
import { getStatusBadge } from '../utils/statusBadges';

const STAGES = [
  { id: 1, label: 'Uploading Image' },
  { id: 2, label: 'Validating Quality' },
  { id: 3, label: 'YOLO Bird Detection' },
  { id: 4, label: 'Grad-CAM Heatmap' },
  { id: 5, label: 'Classifying Species' }
];

export default function IdentifyBird({ setSelectedSpeciesModal }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isNotBird, setIsNotBird] = useState(false);
  const [samples, setSamples] = useState([]);
  const [viewMode, setViewMode] = useState('annotated'); // 'annotated', 'gradcam', 'cropped', 'original'
  const [apiKey, setApiKey] = useState('');
  const [showKeyBar, setShowKeyBar] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    async function initKey() {
      const saved = localStorage.getItem('avian_gemini_api_key') || '';
      if (saved) {
        setApiKey(saved);
      } else {
        try {
          const status = await api.getApiKeyStatus();
          if (status && status.has_key) {
            setApiKey(status.masked_key || 'configured-on-server');
          }
        } catch (e) {
          console.warn('API key check notice:', e);
        }
      }
    }
    initKey();

    async function loadSamples() {
      try {
        const data = await api.getSampleImages();
        setSamples(data.samples || []);
      } catch (e) {
        console.warn('Could not load samples', e);
      }
    }
    loadSamples();
  }, []);

  const handleSaveApiKey = async (val) => {
    const trimmed = (val || '').trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('avian_gemini_api_key', trimmed);
      await api.saveApiKey(trimmed);
      setShowKeyBar(false);
    } else {
      localStorage.removeItem('avian_gemini_api_key');
      await api.saveApiKey('');
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid JPG, JPEG, or PNG image.');
      setIsNotBird(false);
      return;
    }
    setError(null);
    setIsNotBird(false);
    setPredictionResult(null);
    setSelectedFile(file);
    setViewMode('annotated');

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPredictionResult(null);
    setError(null);
    setIsNotBird(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSampleClick = async (sample) => {
    try {
      setError(null);
      setIsNotBird(false);
      setPredictionResult(null);
      const res = await fetch(`${api.getBaseUrl()}${sample.image_path}`);
      const blob = await res.blob();
      const file = new File([blob], `${sample.species_id}.jpg`, { type: 'image/jpeg' });
      handleFileSelect(file);
    } catch (e) {
      setError('Failed to load sample image.');
    }
  };

  const handleClassify = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setIsNotBird(false);
    setCurrentStage(1);

    const t1 = setTimeout(() => setCurrentStage(2), 400);
    const t2 = setTimeout(() => setCurrentStage(3), 900);
    const t3 = setTimeout(() => setCurrentStage(4), 1600);
    const t4 = setTimeout(() => setCurrentStage(5), 2200);

    try {
      const response = await api.identifyBird(selectedFile, apiKey);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      setCurrentStage(5);
      if (response.success) {
        setPredictionResult(response);
      } else {
        setError(response.detail || 'Classification failed.');
      }
    } catch (err) {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      const msg = err.message || 'Error communicating with backend.';
      setError(msg);
      if (err.isNotBird || msg.toLowerCase().includes('no bird') || msg.toLowerCase().includes('invalid image')) {
        setIsNotBird(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Determine active visual to display
  const getActiveImageSrc = () => {
    if (!predictionResult) return imagePreview;
    if (viewMode === 'annotated' && predictionResult.annotated_image_url) {
      return `${api.getBaseUrl()}${predictionResult.annotated_image_url}`;
    }
    if (viewMode === 'gradcam' && predictionResult.gradcam_url) {
      return `${api.getBaseUrl()}${predictionResult.gradcam_url}`;
    }
    if (viewMode === 'cropped' && predictionResult.cropped_image_url) {
      return `${api.getBaseUrl()}${predictionResult.cropped_image_url}`;
    }
    return imagePreview;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Neural Avian Vision Classifier
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                YOLOv8 bird localization &bull; MobileNetV2 species classification &bull; Grad-CAM explainability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {apiKey.trim() ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gemini Vision Connected</span>
              </span>
              <button
                type="button"
                onClick={() => setShowKeyBar(!showKeyBar)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 underline font-medium"
              >
                {showKeyBar ? 'Hide' : 'Change Key'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowKeyBar(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all flex items-center gap-1.5 animate-pulse"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Enter Gemini API Key</span>
            </button>
          )}

          <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            YOLOv8 Active
          </span>
        </div>
      </div>

      {/* ─── GEMINI API KEY SETUP BANNER ─── */}
      <div className={`p-4 rounded-3xl border transition-all space-y-3 ${
        apiKey.trim() 
          ? 'bg-emerald-50/50 border-emerald-200/90' 
          : 'bg-amber-50/80 border-amber-300/80 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs text-white ${
              apiKey.trim() ? 'bg-emerald-600' : 'bg-amber-500'
            }`}>
              <Key className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Google Gemini Multimodal AI Integration
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  apiKey.trim() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200/80 text-amber-900'
                }`}>
                  {apiKey.trim() ? 'Ready for Single Identification' : 'Recommended'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {apiKey.trim()
                  ? 'Your Gemini API key is active. Drishti will identify the exact single bird species with calibrated confidence.'
                  : 'Enter your Google Gemini API key to identify this bird accurately (e.g. owls, raptors, songbirds) with high precision.'}
              </p>
            </div>
          </div>

          {!apiKey.trim() && (
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 self-start sm:self-center"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Input bar: always open if no key, or toggled open */}
        {(!apiKey.trim() || showKeyBar) && (
          <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              placeholder="Paste Google Gemini API Key here (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono shadow-2xs"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSaveApiKey(apiKey)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                Save &amp; Activate Key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => handleSaveApiKey('')}
                  className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold border border-rose-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── UPLOAD AND PREVIEW COLUMN ─── */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Upload Avian Photograph</span>
              </h3>
              {selectedFile && (
                <button
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden min-h-[260px] ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : imagePreview
                  ? 'border-emerald-200 bg-slate-100/80'
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 cursor-pointer'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />

              {imagePreview ? (
                <div className="relative w-full h-[280px] bg-slate-100 flex items-center justify-center">
                  <img
                    src={getActiveImageSrc()}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* View Mode Overlay Tabs if prediction results are present */}
                  {predictionResult && (
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-xl p-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-sm">
                      <button
                        onClick={() => setViewMode('annotated')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          viewMode === 'annotated' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        YOLO Bounding Box
                      </button>

                      {predictionResult.gradcam_url && (
                        <button
                          onClick={() => setViewMode('gradcam')}
                          className={`px-2.5 py-1 rounded-lg transition-colors ${
                            viewMode === 'gradcam' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Grad-CAM Heatmap
                        </button>
                      )}

                      <button
                        onClick={() => setViewMode('original')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          viewMode === 'original' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Original
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag and drop bird photo here, or click to browse
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      JPG, PNG, WebP up to 15MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* Run Classification Button */}
            <button
              onClick={handleClassify}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                !selectedFile || isAnalyzing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.01]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" />
                  <span>Run Multimodal Bird Classification</span>
                </>
              )}
            </button>
          </div>

          {/* 5-Stage Progress Tracker */}
          {isAnalyzing && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Vision Pipeline Stage {currentStage} of 5</span>
                <span className="text-emerald-600">{STAGES[currentStage - 1]?.label}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStage / 5) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-5 gap-1 pt-1">
                {STAGES.map((s) => (
                  <div
                    key={s.id}
                    className={`text-[9px] text-center font-medium p-1 rounded-md ${
                      s.id <= currentStage ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection / Error Card */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">
                    {isNotBird ? 'Image Rejected by YOLO Gatekeeper' : 'Classification Error'}
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
              {isNotBird && (
                <div className="mt-2 p-2 rounded-xl bg-rose-100/60 text-[11px] text-rose-800 font-medium">
                  <strong>Enforced Rule:</strong> Non-bird objects (humans, vehicles, dogs, architecture) are rejected to ensure model integrity. Please upload a clear photo containing a bird.
                </div>
              )}
            </div>
          )}

          {/* Quick Test Samples */}
          {samples.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Or Try Sample Indian Birds:</span>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {samples.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSampleClick(s)}
                    className="flex-shrink-0 w-20 cursor-pointer group text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group-hover:border-emerald-500 transition-colors bg-slate-100 mb-1.5">
                      <img
                        src={`${api.getBaseUrl()}${s.image_path}`}
                        alt={s.common_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 block truncate">
                      {s.common_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── RESULTS COLUMN ─── */}
        <div className="lg:col-span-7 space-y-6">
          {predictionResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Neural Identification Verified
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    predictionResult.confidence_tier === 'high'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : predictionResult.confidence_tier === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {(predictionResult.confidence_tier || 'HIGH').toUpperCase()} CONFIDENCE
                </span>
              </div>

              {/* Single Predicted Species Display */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Family: {predictionResult.prediction.family || 'Aves'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    Order: {predictionResult.prediction.order || 'Passeriformes'}
                  </span>
                  {predictionResult.prediction.conservation_status && (
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold">
                      {predictionResult.prediction.conservation_status}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {predictionResult.prediction.common_name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 italic mt-0.5">
                    {predictionResult.prediction.scientific_name}
                  </p>
                </div>

                {/* Prominent Confidence Score Display */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Identification Confidence Score
                      </span>
                      <div className="text-4xl font-black text-emerald-600 mt-0.5">
                        {(predictionResult.prediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        AI Provider
                      </span>
                      <span className="text-xs font-bold text-slate-700 block mt-0.5">
                        {predictionResult.validated_by || (apiKey ? 'Google Gemini Vision AI' : 'Local Avian Vision')}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-700 shadow-xs"
                      style={{ width: `${Math.min(100, Math.max(5, predictionResult.prediction.confidence * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Description / Plumage Overview if available */}
                {predictionResult.prediction.description && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Species Overview:</span>
                    <p>{predictionResult.prediction.description}</p>
                    {predictionResult.prediction.physical_characteristics && (
                      <p className="mt-2 text-slate-600">
                        <strong className="text-slate-800">Plumage:</strong> {predictionResult.prediction.physical_characteristics}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Ecological Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Native Habitat</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {predictionResult.prediction.habitat || 'Tropical forests, open woodlands, scrublands'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dietary Niche</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {predictionResult.prediction.diet || 'Insects, seeds, small rodents, fruits'}
                  </p>
                </div>
              </div>

              {/* Open Full Profile Modal Button */}
              <button
                onClick={() => setSelectedSpeciesModal && setSelectedSpeciesModal(predictionResult.prediction)}
                className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Full Species Encyclopedia Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <ScanLine className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Awaiting Bird Photograph</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                Upload any bird photograph to detect bounding boxes, extract Grad-CAM attention maps, and classify species across 100 Indian avian species.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
