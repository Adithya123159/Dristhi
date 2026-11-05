import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  Square, 
  Upload, 
  Play, 
  Pause, 
  Music, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Sliders,
  ExternalLink,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

const STAGES = [
  { id: 1, label: 'Uploading Audio' },
  { id: 2, label: 'Validating Recording' },
  { id: 3, label: 'Detecting Bird Vocalizations' },
  { id: 4, label: 'Extracting Mel Spectrogram' },
  { id: 5, label: 'Classifying Avian Species' }
];

export default function IdentifyAudio({ setSelectedSpeciesModal }) {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Pipeline execution state
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle audio playback updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processSelectedFile(selected);
  };

  const processSelectedFile = (selected) => {
    setFile(selected);
    setError(null);
    setResult(null);
    const objectUrl = URL.createObjectURL(selected);
    setAudioUrl(objectUrl);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Drag and Drop
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([audioBlob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' });
        processSelectedFile(recordedFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied or not supported in this browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  // Submit Pipeline
  const handleIdentify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStage(1);

    // Progress stage simulation for UX
    const t1 = setTimeout(() => setCurrentStage(2), 500);
    const t2 = setTimeout(() => setCurrentStage(3), 1100);
    const t3 = setTimeout(() => setCurrentStage(4), 1800);
    const t4 = setTimeout(() => setCurrentStage(5), 2400);

    try {
      const data = await api.identifyAudio(file);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      setCurrentStage(5);
      setResult(data);
    } catch (err) {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      setError(err.message || 'Audio identification could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* ─── HEADER TITLE ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Bioacoustic Bird Audio Classifier
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Upload avian songs, chirps or field recordings for Mel Spectrogram neural classification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Librosa 1.0 + Mel Spectrogram CNN
          </span>
        </div>
      </div>

      {/* ─── UPLOAD & RECORDING PANEL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          {/* Dropzone Card */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 transition-all text-center flex flex-col items-center justify-center min-h-[260px] ${
              file ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-emerald-400 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.flac,.ogg,.m4a"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
              <Music className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-800">
              {file ? file.name : 'Drag and drop bird audio recording'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports high-fidelity bird audio: WAV, MP3, FLAC (1s to 120s duration)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Select Audio File</span>
              </button>

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-sm ${
                  isRecording 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording ({recordingSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-600" />
                    <span>Record from Mic</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Audio Player Preview Card */}
          {audioUrl && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayback}
                    className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px] sm:max-w-[300px]">
                      {file?.name || 'Audio Recording'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setAudioUrl(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Seek Bar */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />

              {/* Run Classification Button */}
              <button
                onClick={handleIdentify}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Activity className="w-4 h-4" />
                <span>{loading ? 'Analyzing Bioacoustic Features...' : 'Identify Bird from Audio'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* ─── 5-STAGE PROGRESS INDICATOR ─── */}
          {loading && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Processing Pipeline Stage {currentStage} of 5</span>
                <span className="text-emerald-600">{STAGES[currentStage - 1]?.label}</span>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStage / 5) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-2">
                {STAGES.map((s) => (
                  <div
                    key={s.id}
                    className={`text-[10px] text-center font-medium p-1 rounded-lg ${
                      s.id <= currentStage ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── ERROR BANNER ─── */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Audio Identification Blocked</h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
                <div className="mt-2.5 p-2 rounded-xl bg-rose-100/60 text-[11px] text-rose-800 font-medium">
                  <strong>Tip:</strong> Ensure your recording contains clear bird songs or chirps. Unrelated recordings (human speech, traffic noise, silence) are rejected to maintain ecological integrity.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── RESULTS PANEL ─── */}
        <div className="lg:col-span-5 space-y-5">
          {result ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              {/* Header result badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Acoustic Identification Complete
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    result.confidence_tier === 'high'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : result.confidence_tier === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {result.confidence_tier.toUpperCase()} CONFIDENCE
                </span>
              </div>

              {/* Main Species Header */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {result.prediction.common_name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 italic mt-0.5">
                  {result.prediction.scientific_name} &bull; Family {result.prediction.family}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="text-3xl font-black text-emerald-600">
                    {(result.prediction.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">
                    Calibrated Bioacoustic Match
                    <br />
                    Order: <span className="font-semibold text-slate-700">{result.prediction.order || 'Passeriformes'}</span>
                  </div>
                </div>
              </div>

              {/* Mel Spectrogram Preview */}
              {result.spectrogram_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Extracted Mel Spectrogram</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">300 Hz - 10,000 Hz</span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src={`${api.getBaseUrl()}${result.spectrogram_url}`}
                      alt="Mel Spectrogram"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Acoustic Telemetry Card */}
              {result.acoustic_telemetry && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bioacoustic Signal Telemetry</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block">Spectral Centroid</span>
                      <span className="font-bold text-slate-800">
                        {result.acoustic_telemetry.spectral_centroid_hz} Hz
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block">Avian Frequency Ratio</span>
                      <span className="font-bold text-emerald-600">
                        {(result.acoustic_telemetry.bird_band_energy_ratio * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top-5 Predictions Ranking */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">Top Species Candidates</span>
                <div className="space-y-2">
                  {result.top_predictions.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{p.common_name}</span>
                        <span className="font-bold text-emerald-600">{(p.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${p.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Full Profile Modal Trigger */}
              <button
                onClick={() => setSelectedSpeciesModal(result.prediction)}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>View Full Ecological Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Activity className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Awaiting Audio Submission</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Upload or record an avian vocalization to see Mel Spectrograms, bioacoustic telemetry, and species classification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

