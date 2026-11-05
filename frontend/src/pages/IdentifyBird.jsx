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
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import ConfidenceMeter from '../components/ConfidenceMeter';
import PredictionChart from '../components/PredictionChart';
import { getStatusBadge } from '../utils/statusBadges';

export default function IdentifyBird() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isNotBird, setIsNotBird] = useState(false);
  const [samples, setSamples] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('avian_gemini_api_key') || '';
    setApiKey(savedKey);
    if (savedKey) setShowKeyInput(true);

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

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('avian_gemini_api_key', key);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, JPEG, or PNG image.');
      setIsNotBird(false);
      return;
    }
    setError(null);
    setIsNotBird(false);
    setPredictionResult(null);
    setSelectedFile(file);

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

    try {
      const response = await api.predictBird(selectedFile, apiKey);
      if (response.success) {
        setPredictionResult(response);
      } else {
        setError(response.detail || 'Classification failed.');
      }
    } catch (err) {
      const msg = err.message || 'Error communicating with backend.';
      setError(msg);
      if (msg.toLowerCase().includes('no bird') || msg.toLowerCase().includes('not a bird') || err.isNotBird) {
        setIsNotBird(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const statusBadge = predictionResult ? getStatusBadge(predictionResult.prediction.conservation_status) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Identify Bird
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload an image to validate and predict bird species.
          </p>
        </div>

        {/* API Key Toggle Button */}
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
            apiKey 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'API Key Active' : 'Add API Key'}</span>
        </button>
      </div>

      {/* Optional API Key Input Banner */}
      {showKeyInput && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Gemini / Vision API Key (For Non-Bird Image Validation)</span>
            </span>
            {apiKey && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
              value={apiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {apiKey && (
              <button
                onClick={() => handleSaveApiKey('')}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Validates whether the image contains a bird. Non-bird uploads (cars, people, objects) will be rejected.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-900">Upload Image</span>
              {selectedFile && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {!imagePreview ? (
              <div className="space-y-3">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-xs text-slate-800 text-center">
                    Tap to upload photo, or drag and drop
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPG, JPEG, PNG, or WebP</span>
                </div>

                {/* Mobile Camera Quick Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors active:scale-98"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors active:scale-98"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span>Photo Gallery</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50"
                  >
                    Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  />

                  <button
                    onClick={handleClassify}
                    disabled={isAnalyzing}
                    className={`flex-1 py-2 rounded-xl text-white font-medium text-xs flex items-center justify-center gap-1.5 ${
                      isAnalyzing
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Identify Bird</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error / Validation Warning */}
            {error && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                isNotBird 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-current" />
                <div className="space-y-0.5">
                  <span className="font-bold block">
                    {isNotBird ? 'Invalid Image' : 'Error'}
                  </span>
                  <span className="leading-relaxed block">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick test samples */}
          {samples.length > 0 && !imagePreview && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Sample Bird Images (Tap to Test)</span>
              <div className="flex sm:grid sm:grid-cols-2 gap-2 overflow-x-auto pb-1 scrollbar-none">
                {samples.slice(0, 4).map((s) => (
                  <button
                    key={s.species_id}
                    onClick={() => handleSampleClick(s)}
                    className="flex-shrink-0 min-w-[140px] sm:min-w-0 p-2 rounded-xl border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 text-xs text-slate-700 active:bg-slate-50 transition-colors"
                  >
                    <img 
                      src={`${api.getBaseUrl()}${s.image_path}`} 
                      alt={s.common_name} 
                      className="w-7 h-7 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                    />
                    <span className="truncate">{s.common_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {predictionResult ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                    {predictionResult.validated_by && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {predictionResult.validated_by}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {predictionResult.prediction.common_name}
                  </h3>
                  <p className="text-xs font-serif italic text-emerald-700 mt-0.5">
                    {predictionResult.prediction.scientific_name} • Family: {predictionResult.prediction.family}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence</span>
                  <span className="text-3xl font-extrabold text-emerald-600">
                    {(predictionResult.prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <ConfidenceMeter confidence={predictionResult.prediction.confidence} />

              {/* Predictions Bar Chart */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Species Candidates</span>
                <PredictionChart predictions={predictionResult.top_predictions} />
              </div>

              {/* Bio & Details */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                {predictionResult.prediction.description && (
                  <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {predictionResult.prediction.description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 block">Habitat</span>
                      <span className="text-slate-500 mt-0.5 block">{predictionResult.prediction.habitat}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <Utensils className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700 block">Diet</span>
                      <span className="text-slate-500 mt-0.5 block">{predictionResult.prediction.diet}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center p-6 text-center">
              <ScanLine className="w-8 h-8 text-slate-300 mb-2" />
              <p className="font-semibold text-sm text-slate-700">No Image Classified Yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload a bird photo on the left to see predictions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
