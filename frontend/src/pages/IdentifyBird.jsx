import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanLine, 
  Volume2, 
  UploadCloud, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileAudio,
  Image as ImageIcon,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import StructuredBirdResult from '../components/StructuredBirdResult';

const IMAGE_STAGES = [
  'Validating file integrity...',
  'Scanning image for avian morphology...',
  'Extracting deep neural features...',
  'Generating Grad-CAM attention heatmap...',
  'Classifying bird species...'
];

const AUDIO_STAGES = [
  'Validating audio recording...',
  'Analyzing bioacoustic frequency bands (1.5 - 8.5 kHz)...',
  'Generating Mel Spectrogram...',
  'Matching harmonic vocalization signatures...',
  'Classifying avian sound...'
];

export default function IdentifyBird({ 
  initialInputType = 'image', 
  setSelectedSpeciesModal 
}) {
  const [activeTab, setActiveTab] = useState(initialInputType); // 'image' | 'audio'
  
  // Image State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Audio State
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

  // Common Processing State
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Sync if initialInputType changes
  useEffect(() => {
    if (initialInputType) {
      setActiveTab(initialInputType);
    }
  }, [initialInputType]);

  // Stage progress timer during inference
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setStageIndex(0);
      interval = setInterval(() => {
        setStageIndex((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // ─── FILE SELECTION HANDLERS ───

  const handleImageSelect = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, JPEG, PNG, or WebP).');
      return;
    }
    setErrorMessage(null);
    setPredictionResult(null);
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAudioSelect = (file) => {
    if (!file) return;
    const validExtensions = ['.wav', '.mp3', '.flac', '.ogg', '.m4a'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext) && !file.type.startsWith('audio/')) {
      setErrorMessage('Please upload a valid audio recording (WAV, MP3, FLAC, or M4A).');
      return;
    }
    setErrorMessage(null);
    setPredictionResult(null);
    setSelectedAudio(file);

    const objectUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (activeTab === 'image') {
        handleImageSelect(file);
      } else {
        handleAudioSelect(file);
      }
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedAudio(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl(null);
    }
    setPredictionResult(null);
    setErrorMessage(null);
    setIsAnalyzing(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    handleClear();
    setActiveTab(newTab);
  };

  // ─── CLASSIFICATION EXECUTION ───

  const handleIdentify = async () => {
    setErrorMessage(null);
    setPredictionResult(null);
    setIsAnalyzing(true);

    try {
      if (activeTab === 'image') {
        if (!selectedImage) return;
        const res = await api.identifyBird(selectedImage);
        if (res && res.success) {
          setPredictionResult(res);
        } else {
          setErrorMessage(res.detail || 'Bird identification failed. Please try again.');
        }
      } else {
        if (!selectedAudio) return;
        const res = await api.identifyAudio(selectedAudio);
        if (res && res.success) {
          setPredictionResult(res);
        } else {
          setErrorMessage(res.detail || 'Audio identification failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Classification request error:', err);
      const msg = err.message || 'An error occurred during identification.';
      // Provide clean user-facing error message matching specifications
      if (activeTab === 'image' && (msg.toLowerCase().includes('no bird') || msg.toLowerCase().includes('not a bird'))) {
        setErrorMessage('No bird detected. Please upload a valid bird image.');
      } else if (activeTab === 'audio' && (msg.toLowerCase().includes('no bird') || msg.toLowerCase().includes('sound') || msg.toLowerCase().includes('vocalization'))) {
        setErrorMessage('No recognizable bird sound detected. Please upload a valid bird recording.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* ─── HEADER: DUAL INPUT METHOD SELECTOR ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Multimodal Bird Identification</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Deep learning computer vision & bioacoustic voice analysis for 100 Indian bird species
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleTabSwitch('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'image'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScanLine className={`w-4 h-4 ${activeTab === 'image' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Bird Image Upload</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('audio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'audio'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${activeTab === 'audio' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>Bird Audio Upload</span>
            </button>
          </div>
        </div>

        {/* ─── UPLOAD VIEW (Visible when no result yet) ─── */}
        {!predictionResult && (
          <div className="pt-6 space-y-6">
            {/* ERROR ALERT BOX */}
            {errorMessage && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-900">
                    {activeTab === 'image' ? 'No Bird Detected' : 'No Bird Sound Detected'}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 1: BIRD IMAGE UPLOAD */}
            {activeTab === 'image' && (
              <div className="space-y-5">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files?.[0])}
                />

                {!imagePreview ? (
                  /* DROP ZONE */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => imageInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 ${
                      isDragging 
                        ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80 bg-slate-50/40'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-800">
                        Click to upload or drag & drop a bird image
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Supported formats: JPG, JPEG, PNG, WebP (Max 15MB)
                      </p>
                    </div>
                    <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                      Select Image File
                    </span>
                  </div>
                ) : (
                  /* IMAGE PREVIEW & ACTIONS */
                  <div className="space-y-5">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-[380px] flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Selected bird preview" 
                        className="w-full h-full object-contain max-h-[380px]"
                      />
                      <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 min-w-0">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate" title={selectedImage?.name}>
                            {selectedImage?.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {(selectedImage?.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for classification
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          type="button"
                          onClick={handleClear}
                          disabled={isAnalyzing}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap"
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={handleIdentify}
                          disabled={isAnalyzing}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Identifying...</span>
                            </>
                          ) : (
                            <>
                              <ScanLine className="w-4 h-4" />
                              <span>Identify Bird Species</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: BIRD AUDIO UPLOAD */}
            {activeTab === 'audio' && (
              <div className="space-y-5">
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/wav,audio/mp3,audio/mpeg,audio/flac,audio/ogg,audio/m4a"
                  className="hidden"
                  onChange={(e) => handleAudioSelect(e.target.files?.[0])}
                />

                {!selectedAudio ? (
                  /* DROP ZONE */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => audioInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 ${
                      isDragging 
                        ? 'border-teal-500 bg-teal-50/50 scale-[0.99]' 
                        : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/80 bg-slate-50/40'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                      <FileAudio className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-800">
                        Click to upload or drag & drop a bird audio recording
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Supported formats: WAV, MP3, FLAC, M4A, OGG (Max 25MB, up to 3 mins)
                      </p>
                    </div>
                    <span className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-teal-800 border border-teal-200 shadow-2xs">
                      Select Audio Recording
                    </span>
                  </div>
                ) : (
                  /* AUDIO PREVIEW & CONTROLS */
                  <div className="space-y-5">
                    <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                          <Volume2 className="w-6 h-6" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-100 truncate">
                            {selectedAudio.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB &bull; Audio Vocalization Clip
                          </p>
                        </div>
                      </div>

                      {/* Native Audio Player Preview */}
                      {audioPreviewUrl && (
                        <div className="flex items-center gap-2">
                          <audio 
                            src={audioPreviewUrl} 
                            controls 
                            className="h-10 rounded-xl"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={isAnalyzing}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
                      >
                        Change Recording
                      </button>

                      <button
                        type="button"
                        onClick={handleIdentify}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Analyzing Acoustics...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>Identify Bird Recording</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROCESSING PROGRESS BAR */}
            {isAnalyzing && (
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Processing Avian Telemetry</span>
                  </span>
                  <span>Step {stageIndex + 1} of 5</span>
                </div>

                <div className="bg-emerald-200/70 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((stageIndex + 1) / 5) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-emerald-800 font-medium">
                  {activeTab === 'image' ? IMAGE_STAGES[stageIndex] : AUDIO_STAGES[stageIndex]}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── IDENTIFICATION RESULT VIEW ─── */}
      {predictionResult && (
        <StructuredBirdResult
          result={predictionResult}
          onReset={handleClear}
          setSelectedSpeciesModal={setSelectedSpeciesModal}
        />
      )}
    </div>
  );
}
