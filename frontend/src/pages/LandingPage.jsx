import React, { useState } from 'react';
import { 
  Bird, 
  ScanLine, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Activity,
  Feather,
  Compass
} from 'lucide-react';

const FEATURED_SPECIMENS = [
  {
    id: 'peafowl',
    commonName: 'Indian Peafowl',
    scientificName: 'Pavo cristatus',
    family: 'Phasianidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    confidence: 99.4,
    diet: 'Omnivorous (seeds, grains, insects, small reptiles)',
    habitat: 'Deciduous forests, open scrublands & village groves',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/640px-Peacock_Plumage.jpg',
    tag: 'National Bird of India'
  },
  {
    id: 'roller',
    commonName: 'Indian Roller',
    scientificName: 'Coracias benghalensis',
    family: 'Coraciidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-teal-100 text-teal-800 border-teal-300',
    confidence: 98.8,
    diet: 'Carnivorous (beetles, grasshoppers, mantids, lizards)',
    habitat: 'Open grasslands, agricultural fields & road perches',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Indian_roller_%28Coracias_benghalensis_benghalensis%29.jpg/640px-Indian_roller_%28Coracias_benghalensis_benghalensis%29.jpg',
    tag: 'State Bird of 4 States'
  },
  {
    id: 'bustard',
    commonName: 'Great Indian Bustard',
    scientificName: 'Ardeotis nigriceps',
    family: 'Otididae',
    status: 'Critically Endangered (CR)',
    statusBadge: 'bg-rose-100 text-rose-800 border-rose-300',
    confidence: 96.5,
    diet: 'Omnivorous (grasshoppers, beetles, seeds, ground berries)',
    habitat: 'Arid grasslands & thorny semi-desert of Thar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Great_Indian_Bustard_male_crop.jpg/640px-Great_Indian_Bustard_male_crop.jpg',
    tag: 'Conservation Priority'
  },
  {
    id: 'parakeet',
    commonName: 'Rose-ringed Parakeet',
    scientificName: 'Psittacula krameri',
    family: 'Psittaculidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    confidence: 99.1,
    diet: 'Herbivorous (fruits, nuts, buds, blossoms, seeds)',
    habitat: 'Woodlands, urban tree canopies & village gardens',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rose-ringed_parakeet_%28Psittacula_krameri_manillensis%29_male_Jaipur.jpg/640px-Rose-ringed_parakeet_%28Psittacula_krameri_manillensis%29_male_Jaipur.jpg',
    tag: 'Common Native'
  }
];

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [selectedSpecimen, setSelectedSpecimen] = useState(FEATURED_SPECIMENS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/40 via-green-50/50 to-emerald-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      
      {/* ─── BIRD BACKGROUND LAYER (Soaring Flocks & Branch Silhouettes) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Organic Green Ambient Gradients */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-emerald-200/40 via-green-100/20 to-transparent blur-3xl" />
        <div className="absolute top-80 -left-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute top-96 -right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />

        {/* Large Graceful Soaring Bird Silhouettes (Top Left Sky) */}
        <svg 
          className="absolute top-8 left-6 sm:left-16 w-64 h-36 text-emerald-700/25 opacity-70" 
          viewBox="0 0 260 140" 
          fill="currentColor"
        >
          {/* Bird 1 - Large Eagle/Hawk Glide */}
          <path d="M 50 35 Q 75 10 110 30 Q 140 10 170 35 Q 120 28 110 48 Q 100 28 50 35 Z" />
          {/* Bird 2 - Medium Flying Swallow */}
          <path d="M 170 55 Q 185 40 210 52 Q 225 40 240 55 Q 215 51 210 65 Q 205 51 170 55 Z" />
          {/* Bird 3 - Distant Bird in flight */}
          <path d="M 20 85 Q 32 72 50 82 Q 62 72 75 85 Q 55 82 50 92 Q 45 82 20 85 Z" />
          {/* Bird 4 - Tiny distant glider */}
          <path d="M 120 90 Q 130 80 145 88 Q 155 80 165 90 Q 148 88 145 96 Q 140 88 120 90 Z" />
        </svg>

        {/* Soaring Bird Flock (Top Right Sky) */}
        <svg 
          className="absolute top-12 right-6 sm:right-20 w-72 h-44 text-emerald-700/20 opacity-75" 
          viewBox="0 0 280 160" 
          fill="currentColor"
        >
          {/* Flocking V-Formation Birds */}
          <path d="M 210 20 Q 225 8 245 18 Q 260 8 275 20 Q 250 16 245 28 Q 240 16 210 20 Z" />
          <path d="M 160 40 Q 173 30 190 38 Q 202 30 215 40 Q 195 37 190 46 Q 185 37 160 40 Z" />
          <path d="M 110 65 Q 122 55 138 63 Q 150 55 162 65 Q 142 62 138 72 Q 133 62 110 65 Z" />
          <path d="M 70 95 Q 80 86 95 93 Q 105 86 115 95 Q 98 93 95 101 Q 92 93 70 95 Z" />
          <path d="M 20 120 Q 30 112 43 118 Q 52 112 62 120 Q 46 118 43 125 Q 40 118 20 120 Z" />
        </svg>

        {/* Delicate Tree Branch & Perching Bird Motif (Mid Right Background) */}
        <svg 
          className="absolute top-96 right-0 w-80 h-80 text-emerald-800/10 pointer-events-none hidden lg:block"
          viewBox="0 0 300 300" 
          fill="currentColor"
        >
          {/* Branch */}
          <path d="M 300 180 Q 230 170 170 200 Q 120 225 80 210 Q 50 200 10 240 L 10 250 Q 60 210 90 220 Q 130 235 180 210 Q 240 180 300 190 Z" />
          {/* Leaves on branch */}
          <path d="M 150 195 C 135 175 140 160 160 170 C 165 185 160 192 150 195 Z" />
          <path d="M 115 212 C 100 195 105 180 125 188 C 128 200 124 210 115 212 Z" />
          <path d="M 210 182 C 200 162 210 150 225 160 C 230 172 222 180 210 182 Z" />
          {/* Perching Bird Silhouette */}
          <path d="M 165 190 C 160 180 160 170 166 163 C 170 158 175 158 180 163 C 185 168 188 178 185 188 C 195 184 210 180 218 175 C 215 185 200 192 185 194 C 180 205 178 220 182 235 C 177 225 174 210 173 194 Z" />
        </svg>

        {/* Flying Heron Silhouette (Mid Left Background) */}
        <svg 
          className="absolute top-[520px] -left-10 w-96 h-64 text-emerald-800/10 pointer-events-none hidden md:block" 
          viewBox="0 0 300 180" 
          fill="currentColor"
        >
          <path d="M 30 90 Q 70 50 120 80 Q 180 40 240 85 Q 170 75 155 105 Q 140 75 30 90 Z" />
          {/* Trailing long legs of crane */}
          <path d="M 150 100 Q 180 125 210 150 L 208 152 Q 178 127 148 102 Z" />
        </svg>
      </div>

      {/* ─── CLEAN GREEN-TINTED NAVBAR ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-emerald-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-emerald-950 tracking-tight">AvianAI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100 Species
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/80 font-medium">Indian Bird Classification</p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/80 border border-emerald-200/60 p-1 rounded-xl">
            <button
              onClick={() => onNavigateTab('identify')}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Classifier</span>
            </button>
            <button
              onClick={() => onNavigateTab('species')}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 rounded-lg hover:bg-white transition-all"
            >
              100 Species
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 rounded-lg hover:bg-white transition-all"
            >
              Encyclopedia
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 rounded-lg hover:bg-white transition-all"
            >
              Dashboard
            </button>
          </nav>

          {/* Right Auth Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onNavigateTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-emerald-950 max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Open App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <LogIn className="w-4 h-4 rotate-180" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Clean Login Button */}
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/70 border border-emerald-200 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Log In</span>
                </button>

                {/* Vibrant Green Register Button */}
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex px-3 py-2 text-xs font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  Guest &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 pt-10 pb-14 sm:pt-16 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Soft Nature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-5 shadow-xs">
          <Feather className="w-3.5 h-3.5 text-emerald-700" />
          <span>Ecological Intelligence &bull; 100 Indian Bird Species</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight max-w-3xl mx-auto leading-tight">
          Explore the Avian World with{' '}
          <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
            Neural Vision.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-emerald-900/80 font-medium max-w-xl mx-auto leading-relaxed">
          Upload any bird photograph to instantly reveal its species, scientific taxonomy, dietary niche, native habitat, and IUCN conservation rating.
        </p>

        {/* Main CTA Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTab('identify')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <ScanLine className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Identify a Bird</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigateTab('register')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/90 border border-emerald-300 hover:border-emerald-400 text-emerald-950 font-bold text-sm hover:bg-emerald-50/60 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-emerald-700" />
              <span>Register Free</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('species')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-emerald-800 hover:text-emerald-950 font-semibold text-sm transition-colors flex items-center justify-center gap-1"
          >
            <span>Browse 100 Species</span>
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        {/* ─── INTERACTIVE BIRD SPECIMEN CARD WITH REAL PHOTOS ─── */}
        <div className="mt-12 w-full text-left">
          <div className="bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-sm shadow-emerald-900/5">
            {/* Header with specimen switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-emerald-100 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Live Specimen Radar
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Select a native bird to preview its biological intelligence</p>
              </div>

              {/* Bird Switcher Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-emerald-50/70 p-1.5 rounded-2xl border border-emerald-200/80">
                {FEATURED_SPECIMENS.map((bird) => (
                  <button
                    key={bird.id}
                    onClick={() => setSelectedSpecimen(bird)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSpecimen.id === bird.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-900 hover:bg-emerald-100/80'
                    }`}
                  >
                    {bird.commonName}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen Showcase: Photo + Full Biological Intel */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Bird Photo */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 sm:aspect-auto sm:h-56 bg-emerald-50 border border-emerald-200">
                <img 
                  src={selectedSpecimen.imageUrl} 
                  alt={selectedSpecimen.commonName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-emerald-800 shadow-xs border border-emerald-200">
                    {selectedSpecimen.tag}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/80 text-white backdrop-blur-xs">
                    {selectedSpecimen.confidence}% Model Match
                  </span>
                </div>
              </div>

              {/* Biological Profile Intel */}
              <div className="lg:col-span-5 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                      {selectedSpecimen.commonName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedSpecimen.statusBadge}`}>
                      {selectedSpecimen.status}
                    </span>
                  </div>
                  <p className="text-xs italic text-emerald-800 font-serif mt-0.5">
                    {selectedSpecimen.scientificName} &bull; Family {selectedSpecimen.family}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                    <span className="text-emerald-700 block mb-0.5 font-bold uppercase text-[10px] tracking-wide">
                      Dietary Niche
                    </span>
                    <span className="text-emerald-950 font-medium">{selectedSpecimen.diet}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                    <span className="text-emerald-700 block mb-0.5 font-bold uppercase text-[10px] tracking-wide">
                      Native Habitat
                    </span>
                    <span className="text-emerald-950 font-medium">{selectedSpecimen.habitat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={() => onNavigateTab('identify')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Classify Photo</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('species')}
                    className="px-3 py-2 rounded-xl text-emerald-800 hover:text-emerald-950 font-semibold text-xs transition-colors"
                  >
                    View in Species Catalog &rarr;
                  </button>
                </div>
              </div>

              {/* Right Mini Telemetry Gauge */}
              <div className="lg:col-span-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-100/70 via-green-50 to-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 flex items-center justify-center mb-2 bg-white shadow-xs">
                  <span className="text-base font-black text-emerald-800">{selectedSpecimen.confidence}%</span>
                </div>
                <span className="text-xs font-bold text-emerald-900">
                  Top-1 Confidence
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Sub-50ms CPU Latency
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 SIMPLE NATURE-THEMED PILLARS ─── */}
      <section className="relative z-10 py-12 bg-white/70 backdrop-blur-xs border-y border-emerald-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
              Why AvianAI?
            </h2>
            <p className="text-xs text-emerald-800 font-medium mt-1">
              Engineered for the rich bird biodiversity of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 mb-1">
                40ms Neural Inference
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                MobileNetV2 deep convolutional network tuned for rapid, low-latency bird species recognition.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 mb-1">
                100 Indian Species
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                Comprehensive biological profiles with IUCN conservation flags, diets, and habitats.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 mb-1">
                Smart Non-Bird Gatekeeper
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                Pre-validation layer accurately rejects non-avian uploads (vehicles, humans, objects) to prevent false positives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <section className="relative z-10 py-12 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-emerald-700 to-green-700 text-white shadow-md shadow-emerald-700/20 relative overflow-hidden">
          {/* Subtle bird watermark in banner */}
          <svg className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 10 50 Q 30 20 60 40 Q 90 20 95 50 Q 60 45 50 65 Q 40 45 10 50 Z" />
          </svg>

          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Bird className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Ready to explore your first bird?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-sm mx-auto font-medium">
            Upload an image to start classifying or register to preserve your observation history.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('identify')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ScanLine className="w-4 h-4 text-emerald-700" />
              <span>Launch Classifier</span>
            </button>

            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-500/60 transition-colors"
                >
                  Register Free
                </button>
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3 py-2.5 text-white/90 hover:text-white text-xs font-semibold transition-colors"
                >
                  Sign In &rarr;
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── MINIMAL BOTANICAL FOOTER ─── */}
      <footer className="mt-auto py-5 border-t border-emerald-200/80 bg-white/80 text-emerald-800/70 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-950 font-bold">AvianAI</span>
            <span>&bull; Indian Bird Species Intelligence System</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-800 font-semibold">
            <button onClick={() => onNavigateTab('about')} className="hover:text-emerald-950 transition-colors">
              About
            </button>
            <button onClick={() => onNavigateTab('species')} className="hover:text-emerald-950 transition-colors">
              Species
            </button>
            <button onClick={() => onNavigateTab('dashboard')} className="hover:text-emerald-950 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
