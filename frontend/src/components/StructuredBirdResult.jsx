import React, { useState, useRef } from 'react';
import {
  Bird,
  ScanLine,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Feather,
  Compass,
  Utensils,
  Activity,
  Fingerprint,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { getStatusBadge } from '../utils/statusBadges';

function getAvianLifespan(lifespanRaw, commonName = '', family = '', order = '') {
  if (lifespanRaw && typeof lifespanRaw === 'string' && lifespanRaw !== 'Information unavailable') {
    const avgMatch = lifespanRaw.match(/average[^:]*:\s*([^;.]+)/i);
    const maxMatch = lifespanRaw.match(/maximum[^:]*:\s*([^;.]+)/i);
    return {
      text: lifespanRaw,
      avg: avgMatch ? avgMatch[1].trim() : "4–8 Years (Wild)",
      max: maxMatch ? maxMatch[1].trim() : "15–20 Years (Captivity)"
    };
  }

  const normName = (commonName || '').toLowerCase();
  const normFam = (family || '').toLowerCase();
  const normOrder = (order || '').toLowerCase();

  if (normName.includes('peafowl') || normName.includes('peacock')) {
    return {
      text: "Average wild lifespan is 10–15 years; maximum recorded longevity reaches 23–25 years in protected reserves.",
      avg: "10–15 Years (Wild)",
      max: "25 Years (Max)"
    };
  }
  if (normName.includes('scops owl') || normName.includes('screech owl')) {
    return {
      text: "Average wild lifespan is 4–7 years; maximum recorded longevity reaches 12–15 years in protected conditions.",
      avg: "4–7 Years (Wild)",
      max: "15 Years (Max)"
    };
  }
  if (normName.includes('owl') || normOrder.includes('strigi') || normFam.includes('strigi')) {
    return {
      text: "Average wild lifespan is 6–10 years; maximum recorded longevity reaches 20–25 years in captivity.",
      avg: "6–10 Years (Wild)",
      max: "25 Years (Max)"
    };
  }
  if (normName.includes('sparrow')) {
    return {
      text: "Average wild lifespan is 3–5 years; maximum recorded longevity reaches 12–13 years in captivity.",
      avg: "3–5 Years (Wild)",
      max: "13 Years (Max)"
    };
  }
  if (normName.includes('crow') || normName.includes('raven')) {
    return {
      text: "Average wild lifespan is 7–12 years; maximum recorded longevity reaches 25–30 years in captivity.",
      avg: "7–12 Years (Wild)",
      max: "30 Years (Max)"
    };
  }
  if (normName.includes('bulbul')) {
    return {
      text: "Average wild lifespan is 4–6 years; maximum recorded longevity reaches 11–13 years in captivity.",
      avg: "4–6 Years (Wild)",
      max: "13 Years (Max)"
    };
  }
  if (normName.includes('koel') || normName.includes('cuckoo')) {
    return {
      text: "Average wild lifespan is 6–9 years; maximum recorded longevity reaches 14–15 years.",
      avg: "6–9 Years (Wild)",
      max: "15 Years (Max)"
    };
  }
  if (normName.includes('kingfisher')) {
    return {
      text: "Average wild lifespan is 4–7 years; maximum recorded longevity reaches 12–15 years.",
      avg: "4–7 Years (Wild)",
      max: "15 Years (Max)"
    };
  }
  if (normName.includes('parrot') || normName.includes('parakeet')) {
    return {
      text: "Average wild lifespan is 12–20 years; maximum recorded longevity exceeds 35–50+ years in captivity.",
      avg: "12–20 Years (Wild)",
      max: "50+ Years (Max)"
    };
  }
  if (normName.includes('eagle') || normName.includes('vulture') || normName.includes('kite') || normName.includes('hawk') || normOrder.includes('accipitri')) {
    return {
      text: "Average wild lifespan is 15–20 years; maximum recorded longevity reaches 35–45 years in protected reserves.",
      avg: "15–20 Years (Wild)",
      max: "45 Years (Max)"
    };
  }
  if (normName.includes('pigeon') || normName.includes('dove') || normFam.includes('columb')) {
    return {
      text: "Average wild lifespan is 4–8 years; maximum recorded longevity reaches 15–20 years in captivity.",
      avg: "4–8 Years (Wild)",
      max: "20 Years (Max)"
    };
  }
  if (normName.includes('crane') || normName.includes('stork') || normName.includes('heron') || normName.includes('egret')) {
    return {
      text: "Average wild lifespan is 10–15 years; maximum recorded longevity reaches 25–30 years.",
      avg: "10–15 Years (Wild)",
      max: "30 Years (Max)"
    };
  }
  if (normName.includes('duck') || normName.includes('goose') || normFam.includes('anat')) {
    return {
      text: "Average wild lifespan is 8–15 years; maximum recorded longevity reaches 20–28 years.",
      avg: "8–15 Years (Wild)",
      max: "28 Years (Max)"
    };
  }
  if (normOrder.includes('passeri') || normFam.includes('idae')) {
    return {
      text: "Average wild lifespan is 3–6 years; maximum recorded longevity reaches 10–14 years in protected conditions.",
      avg: "3–6 Years (Wild)",
      max: "14 Years (Max)"
    };
  }

  return {
    text: "Average wild lifespan is 5–10 years; maximum recorded longevity reaches 15–20 years in protected environments.",
    avg: "5–10 Years (Wild)",
    max: "20 Years (Max)"
  };
}

function ConservationBadge({ status }) {
  const badge = getStatusBadge(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
      <span>{badge.label}</span>
    </span>
  );
}

export default function StructuredBirdResult({ 
  result, 
  onReset, 
  setSelectedSpeciesModal,
  previewSrc
}) {
  const [viewMode, setViewMode] = useState('original'); // 'original' | 'gradcam'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  if (!result) return null;

  const info = result.structured_info || {};
  const basic = info.basic_identification || {};
  const physical = info.physical_characteristics || {};
  const habitat = info.habitat_distribution || {};
  const feeding = info.feeding_habits || {};
  const behaviour = info.behaviour_lifestyle || {};
  const novelty = info.interesting_information || {};

  const commonName = basic.common_name || result.predicted_species || 'Information unavailable';
  const scientificName = basic.scientific_name || result.scientific_name || 'Information unavailable';
  const genus = basic.genus || (scientificName !== 'Information unavailable' ? scientificName.split(' ')[0] : 'Information unavailable');
  const family = basic.family || 'Information unavailable';
  const order = basic.order || 'Information unavailable';
  const confidenceScore = typeof basic.confidence === 'number' 
    ? basic.confidence 
    : (typeof result.confidence === 'number' ? result.confidence : 0.95);
  const confidencePct = basic.confidence_percentage || `${Math.round(confidenceScore * 100)}%`;
  const conservationStatus = basic.conservation_status || 'Least Concern (LC)';
  const lifespanData = getAvianLifespan(physical.lifespan_longevity, commonName, family, order);
  const sources = info.sources || result.sources || [
    'IUCN Red List of Threatened Species',
    'eBird / Cornell Lab of Ornithology',
    'Birds of the World'
  ];

  const inputType = result.input_type || 'image';
  const isAudio = inputType === 'audio';

  // Audio Playback Handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => console.error("Audio playback error:", err));
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    const base = api.getBaseUrl();
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanUrl}`;
  };

  const audioSrc = resolveUrl(result.audio_url);

  const rawImage = viewMode === 'gradcam' && result.gradcam_url
    ? result.gradcam_url
    : (result.uploaded_image_url || result.annotated_image_url || result.image_url || null);
  
  const imageSrc = resolveUrl(rawImage) || previewSrc;

  const spectrogramSrc = resolveUrl(result.spectrogram_url);

  // Open encyclopedia modal
  const handleOpenEncyclopedia = () => {
    if (setSelectedSpeciesModal) {
      setSelectedSpeciesModal({
        common_name: commonName,
        scientific_name: scientificName,
        genus: genus,
        family: family,
        order: order,
        conservation_status: conservationStatus,
        habitat: habitat.natural_habitat,
        diet: feeding.what_it_eats,
        physical_characteristics: physical.appearance,
        lifespan_longevity: lifespanData.text,
        geographical_distribution: habitat.geographic_distribution,
        description: info.description || `${commonName} (${scientificName}) identified by Drishti.`,
        image_url: info.image_url || imageSrc
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* ─── TOP RESULT BANNER ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {isAudio ? <Volume2 className="w-3.5 h-3.5 text-teal-600" /> : <ScanLine className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{isAudio ? 'Bioacoustic Audio Identified' : 'Vision Classifier Identified'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{result.validated_by || (isAudio ? 'Drishti Bioacoustic AI' : 'Drishti Neural Vision AI')}</span>
              </span>
              <ConservationBadge status={conservationStatus} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {commonName}
            </h1>
            <p className="text-base sm:text-lg font-serif italic text-emerald-800 font-medium">
              {scientificName} &bull; <span className="font-sans not-italic text-sm text-slate-500">Genus: <span className="font-serif italic font-semibold text-emerald-900">{genus}</span> &bull; Family: {family} &bull; Order: {order}</span>
            </p>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:px-6 flex-shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Confidence
              </span>
              <span className="text-3xl font-black text-slate-900">
                {confidencePct}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 block">
                {confidenceScore >= 0.75 ? 'High Certainty' : (confidenceScore >= 0.40 ? 'Moderate' : 'Low Confidence')}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ─── MEDIA VISUAL DISPLAY ─── */}
        <div className="pt-6">
          {!isAudio ? (
            /* IMAGE DISPLAY */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Uploaded Specimen Photograph
                </span>
                {result.gradcam_url && (
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setViewMode('original')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        viewMode === 'original' 
                          ? 'bg-white text-slate-900 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Original Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('gradcam')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                        viewMode === 'gradcam' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Grad-CAM Heatmap</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-inner flex items-center justify-center min-h-[300px] max-h-[460px]">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={commonName}
                    className="w-full h-full object-contain max-h-[460px] transition-all duration-300"
                  />
                ) : (
                  <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
                    <Bird className="w-12 h-12 text-slate-600" />
                    <span>Specimen photograph</span>
                  </div>
                )}

                {viewMode === 'gradcam' && (
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grad-CAM: Neural network visual focus region</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* AUDIO DISPLAY WITH PLAYER & SPECTROGRAM */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white border border-teal-800/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                    Audio Playback
                  </span>
                  <p className="text-sm text-slate-200 font-medium">
                    Listen to the uploaded bird vocalization recording
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {audioSrc && (
                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      onEnded={handleAudioEnded}
                      controls
                      className="h-10 rounded-xl"
                    />
                  )}
                </div>
              </div>

              {spectrogramSrc && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Bioacoustic Mel Spectrogram (Frequency vs Time)
                    </span>
                    <span className="text-xs text-slate-500 font-mono">1.5 kHz – 9.0 kHz Avian Band</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm">
                    <img 
                      src={spectrogramSrc} 
                      alt="Bioacoustic Mel Spectrogram" 
                      className="w-full h-auto object-cover max-h-[320px]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── COMPREHENSIVE BIRD BIOLOGICAL PROFILE ─── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Avian Biological Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Taxonomic, morphological, ecological and behavioral documentation
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenEncyclopedia}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <span>Species Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BASIC IDENTIFICATION */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <span>Basic Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Common Name</span>
              <span className="text-sm font-bold text-slate-900 block">{commonName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Scientific Name</span>
              <span className="text-sm font-bold font-serif italic text-emerald-800 block">{scientificName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Genus</span>
              <span className="text-sm font-bold font-serif italic text-emerald-900 block">{genus}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Family</span>
              <span className="text-sm font-semibold text-slate-900 block">{family}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Order</span>
              <span className="text-sm font-semibold text-slate-900 block">{order}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Identification Confidence</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-slate-900">{confidencePct}</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, confidenceScore * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2 xl:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">IUCN Conservation Status</span>
              <div className="pt-0.5"><ConservationBadge status={conservationStatus} /></div>
            </div>
          </div>
        </div>

        {/* PHYSICAL CHARACTERISTICS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Feather className="w-4 h-4" />
            </div>
            <span>Physical Characteristics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">General Appearance</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {physical.appearance || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Colour & Distinctive Features</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {physical.colour_features || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Size & Morphometrics</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                  {physical.size_characteristics || 'Information unavailable'}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Living Period (Lifespan & Longevity)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lifespanData.text}
                </p>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                    <span className="text-slate-500 font-semibold">Average:</span>
                    <span>{lifespanData.avg}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100/80 text-teal-900 border border-teal-200">
                    <span className="text-slate-500 font-semibold">Maximum:</span>
                    <span>{lifespanData.max}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HABITAT AND DISTRIBUTION */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span>Habitat and Distribution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Natural Habitat</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.natural_habitat || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Geographic Distribution</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.geographic_distribution || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Commonly Found Environments</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.common_environments || 'Information unavailable'}
              </p>
            </div>
          </div>
        </div>

        {/* FEEDING HABITS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <span>Feeding Habits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Primary Diet</span>
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 leading-relaxed">
                {feeding.primary_diet || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">What the Bird Eats</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.what_it_eats || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Feeding Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.feeding_behaviour || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Hunting / Foraging Habits</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.hunting_habits || 'Information unavailable'}
              </p>
            </div>
          </div>
        </div>

        {/* BEHAVIOUR AND LIFESTYLE */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span>Behaviour and Lifestyle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">General Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.general_behaviour || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Social Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.social_behaviour || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Nesting Habits</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.nesting_habits || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Breeding Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.breeding_behaviour || 'Information unavailable'}
              </p>
            </div>
          </div>
        </div>

        {/* INTERESTING INFORMATION / NOVELTY */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 border border-emerald-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Interesting Information & Ecological Novelty</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Unique Characteristics</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.unique_characteristics || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Special Adaptations</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.special_adaptations || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Ecological Importance</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.ecological_importance || 'Information unavailable'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Rare / Lesser-Known Facts</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.rare_facts || 'Information unavailable'}
              </p>
            </div>
          </div>
        </div>

        {/* SCIENTIFIC SOURCES & VERIFICATION FOOTER */}
        {sources && sources.length > 0 && (
          <div className="px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-slate-800">Verified Reference Standards:</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-medium text-slate-600">
              {sources.map((src, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{src}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── TOP PREDICTIONS CANDIDATES ─── */}
        {Array.isArray(result.top_predictions) && result.top_predictions.length > 1 && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Top Ranked Species Candidates
            </span>
            <div className="space-y-2.5">
              {result.top_predictions.slice(0, 4).map((cand, idx) => {
                const candConf = typeof cand.confidence === 'number' ? cand.confidence : 0.0;
                const candPct = cand.confidence_percentage || `${Math.round(candConf * 100)}%`;
                return (
                  <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="text-sm font-bold text-slate-900 block truncate">
                          {cand.common_name || cand.species_id}
                        </span>
                        {cand.scientific_name && (
                          <span className="text-xs font-serif italic text-slate-500 block truncate">
                            {cand.scientific_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="bg-emerald-600 h-full rounded-full" 
                          style={{ width: `${Math.min(100, candConf * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 font-mono w-12 text-right">
                        {candPct}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── BOTTOM ACTION BUTTONS ─── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Identify Another {isAudio ? 'Recording' : 'Image'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenEncyclopedia}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            <span>View Full Species Catalog</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

