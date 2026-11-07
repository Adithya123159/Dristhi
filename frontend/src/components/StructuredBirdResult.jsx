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
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { getStatusBadge } from '../utils/statusBadges';

export default function StructuredBirdResult({ 
  result, 
  onReset, 
  setSelectedSpeciesModal 
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

  const commonName = basic.common_name || result.predicted_species || 'Identified Bird';
  const scientificName = basic.scientific_name || result.scientific_name || 'Aves indet.';
  const family = basic.family || 'Aves';
  const species = basic.species || scientificName;
  const confidenceScore = typeof basic.confidence === 'number' 
    ? basic.confidence 
    : (typeof result.confidence === 'number' ? result.confidence : 0.95);
  const confidencePct = basic.confidence_percentage || `${Math.round(confidenceScore * 100)}%`;
  const conservationStatus = basic.conservation_status || 'Least Concern (LC)';

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

  const audioSrc = result.audio_url 
    ? (result.audio_url.startsWith('http') ? result.audio_url : `${api.getBaseUrl()}${result.audio_url}`) 
    : null;

  const imageSrc = viewMode === 'gradcam' && result.gradcam_url
    ? `${api.getBaseUrl()}${result.gradcam_url}`
    : (result.uploaded_image_url 
        ? `${api.getBaseUrl()}${result.uploaded_image_url}` 
        : (result.annotated_image_url ? `${api.getBaseUrl()}${result.annotated_image_url}` : null));

  const spectrogramSrc = result.spectrogram_url 
    ? `${api.getBaseUrl()}${result.spectrogram_url}` 
    : null;

  // Open encyclopedia modal
  const handleOpenEncyclopedia = () => {
    if (setSelectedSpeciesModal) {
      setSelectedSpeciesModal({
        common_name: commonName,
        scientific_name: scientificName,
        family: family,
        conservation_status: conservationStatus,
        habitat: habitat.natural_habitat,
        diet: feeding.what_it_eats,
        physical_characteristics: physical.appearance,
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
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAudio ? 'Acoustic CNN' : 'MobileNetV2 Deep Learning'}</span>
              </span>
              {getStatusBadge(conservationStatus)}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {commonName}
            </h1>
            <p className="text-base sm:text-lg font-serif italic text-emerald-800 font-medium">
              {scientificName} &bull; <span className="font-sans not-italic text-sm text-slate-500">Family: {family}</span>
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

      {/* ─── 6 STRUCTURED BIRD INFORMATION SECTIONS (A THROUGH F) ─── */}
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

        {/* SECTION A: BASIC IDENTIFICATION */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <span>Section A &bull; Basic Identification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Common Name</span>
              <span className="text-sm font-bold text-slate-900 block">{commonName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Scientific Name</span>
              <span className="text-sm font-bold font-serif italic text-emerald-800 block">{scientificName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Species</span>
              <span className="text-sm font-semibold text-slate-900 block">{species}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Bird Family</span>
              <span className="text-sm font-semibold text-slate-900 block">{family}</span>
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

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">IUCN Status</span>
              <div className="pt-0.5">{getStatusBadge(conservationStatus)}</div>
            </div>
          </div>
        </div>

        {/* SECTION B: PHYSICAL CHARACTERISTICS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Feather className="w-4 h-4" />
            </div>
            <span>Section B &bull; Physical Characteristics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">General Appearance</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {physical.appearance || 'Robust avian structure adapted to environmental niche.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Colour & Distinctive Features</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {physical.colour_features || 'Characteristic plumage markings and diagnostic coloration.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Size & Morphometrics</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {physical.size_characteristics || 'Proportional body length and wingspan suited for native habitats.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION C: HABITAT AND DISTRIBUTION */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span>Section C &bull; Habitat and Distribution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Natural Habitat</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.natural_habitat || 'Tropical and subtropical forest tracts, open woodlands, and rural trees.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Geographic Distribution</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.geographic_distribution || 'Endemic or resident across the Indian Subcontinent.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Commonly Found Environments</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {habitat.common_environments || 'Agricultural edges, village groves, scrub forests, and national parks.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION D: FEEDING HABITS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <span>Section D &bull; Feeding Habits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Primary Diet</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.primary_diet || 'Omnivorous forage'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">What the Bird Eats</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.what_it_eats || 'Insects, seeds, wild fruits, and small invertebrates.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Feeding Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.feeding_behaviour || 'Actively forages ground or foliage surfaces for sustenance.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Hunting / Foraging Habits</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feeding.hunting_habits || 'Diurnal foraging rhythm synchronized with seasonal food availability.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION E: BEHAVIOUR AND LIFESTYLE */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span>Section E &bull; Behaviour and Lifestyle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">General Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.general_behaviour || 'Diurnal activity with distinct roosting and perching routines.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Social Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.social_behaviour || 'Monogamous pairs, small family units, or loose foraging parties.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Nesting Habits</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.nesting_habits || 'Constructs specialized nests in sheltered tree forks, cavities, or dense scrub.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Breeding Behaviour</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {behaviour.breeding_behaviour || 'Seasonal breeding courtship during favorable climate and monsoon intervals.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION F: INTERESTING INFORMATION / NOVELTY */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 border border-emerald-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Section F &bull; Interesting Information & Ecological Novelty</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Unique Characteristics</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.unique_characteristics || 'Distinctive traits celebrated across South Asian biodiversity documentation.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Special Adaptations</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.special_adaptations || 'Specialized plumage, sensory perception, and anatomical adaptations.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Ecological Importance</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.ecological_importance || 'Vital ecological role as seed disperser, insect controller, and trophic regulator.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Rare / Lesser-Known Facts</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {novelty.rare_facts || 'Documented in ornithological literature as an indispensable native species.'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── TOP PREDICTIONS CANDIDATES ─── */}
        {result.top_predictions && result.top_predictions.length > 1 && (
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
