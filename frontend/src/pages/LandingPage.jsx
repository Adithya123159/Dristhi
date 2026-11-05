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
  Eye
} from 'lucide-react';

const FEATURED_SPECIMENS = [
  {
    id: 'peafowl',
    commonName: 'Indian Peafowl',
    scientificName: 'Pavo cristatus',
    family: 'Phasianidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 99.4,
    diet: 'Omnivorous (grains, seeds, insects, small reptiles)',
    habitat: 'Deciduous forests, open scrublands & cultivated groves',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    tag: 'National Bird of India'
  },
  {
    id: 'roller',
    commonName: 'Indian Roller',
    scientificName: 'Coracias benghalensis',
    family: 'Coraciidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    confidence: 98.8,
    diet: 'Carnivorous (beetles, grasshoppers, mantids, lizards)',
    habitat: 'Open grasslands, agricultural fields & road perches',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    tag: 'State Bird of 4 States'
  },
  {
    id: 'parakeet',
    commonName: 'Rose-ringed Parakeet',
    scientificName: 'Psittacula krameri',
    family: 'Psittaculidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 99.1,
    diet: 'Herbivorous (fruits, nuts, buds, blossoms, wild seeds)',
    habitat: 'Woodlands, cultivated farmlands & urban park canopies',
    imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
    tag: 'Common Native'
  },
  {
    id: 'bustard',
    commonName: 'Great Indian Bustard',
    scientificName: 'Ardeotis nigriceps',
    family: 'Otididae',
    status: 'Critically Endangered (CR)',
    statusBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    confidence: 96.5,
    diet: 'Omnivorous (grasshoppers, beetles, seeds, ground berries)',
    habitat: 'Arid grasslands & thorny semi-desert plains of Thar',
    imageUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80',
    tag: 'Conservation Priority'
  }
];

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [selectedSpecimen, setSelectedSpecimen] = useState(FEATURED_SPECIMENS[0]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      
      {/* ─── ELEGANT BACKGROUND (Soft ambient glows + subtle flock in the sky) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Green Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent blur-3xl" />
        <div className="absolute top-96 -left-32 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-[600px] -right-32 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

        {/* Modern Dot Matrix Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Elegant Soaring Bird Silhouette Group (Upper Left Sky) */}
        <svg 
          className="absolute top-10 left-8 sm:left-24 w-52 h-28 text-emerald-800/15" 
          viewBox="0 0 200 100" 
          fill="currentColor"
        >
          {/* Bird 1 */}
          <path d="M 30 25 Q 50 5 80 20 Q 100 5 120 25 Q 90 20 80 32 Q 70 20 30 25 Z" />
          {/* Bird 2 */}
          <path d="M 125 40 Q 140 28 160 38 Q 175 28 190 40 Q 170 36 160 48 Q 150 36 125 40 Z" />
          {/* Bird 3 (Distant) */}
          <path d="M 10 65 Q 22 55 35 63 Q 45 55 55 65 Q 40 62 35 70 Q 30 62 10 65 Z" />
        </svg>

        {/* Elegant Soaring Bird Silhouette Group (Upper Right Sky) */}
        <svg 
          className="absolute top-14 right-8 sm:right-28 w-60 h-32 text-emerald-800/15" 
          viewBox="0 0 220 110" 
          fill="currentColor"
        >
          <path d="M 150 15 Q 168 2 188 12 Q 200 2 215 15 Q 192 12 188 22 Q 180 12 150 15 Z" />
          <path d="M 90 35 Q 105 24 122 32 Q 132 24 145 35 Q 128 32 122 40 Q 115 32 90 35 Z" />
          <path d="M 40 65 Q 52 56 66 63 Q 75 56 86 65 Q 72 63 66 70 Q 60 63 40 65 Z" />
        </svg>
      </div>

      {/* ─── STANDARD MODERN HEADER ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Drishti Logo */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/25 group-hover:bg-emerald-700 transition-colors">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Drishti</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100 Species
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Avian Ecological Intelligence</p>
            </div>
          </div>

          {/* Standard Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onNavigateTab('identify')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Classifier</span>
            </button>
            <button
              onClick={() => onNavigateTab('species')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Species Catalog
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Encyclopedia
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Dashboard
            </button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onNavigateTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
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
                {/* Standard Log In */}
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>

                {/* Standard Register Button */}
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Guest &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── STANDARD, ATTRACTIVE HERO SECTION ─── */}
      <section className="relative z-10 pt-12 pb-16 sm:pt-16 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Drishti AI &bull; Deep Learning for 100 Indian Bird Species</span>
        </div>

        {/* Clean Standard Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]">
          Identify Any Indian Bird with{' '}
          <span className="text-emerald-600">
            Deep Neural Vision.
          </span>
        </h1>

        {/* Standard Balanced Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
          Upload any bird photograph to instantly reveal its common name, scientific taxonomy, dietary niche, native habitat, and IUCN conservation status.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTab('identify')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <ScanLine className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Identify a Bird Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigateTab('register')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Create Free Account</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('species')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors flex items-center justify-center gap-1"
          >
            <span>Browse 100 Species</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* ─── ATTRACTIVE SPECIMEN SHOWCASE (Clean Card + Real Bird Photos) ─── */}
        <div className="mt-12 w-full text-left">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Specimen Header & Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Live Specimen Intelligence
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Click any native species to preview its classification profile</p>
              </div>

              {/* Clean Horizontal Switcher Tabs */}
              <div className="flex sm:flex-wrap gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 overflow-x-auto scrollbar-none pb-1.5 sm:pb-1.5">
                {FEATURED_SPECIMENS.map((bird) => (
                  <button
                    key={bird.id}
                    onClick={() => setSelectedSpecimen(bird)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSpecimen.id === bird.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {bird.commonName}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen Profile Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Full Bird Photo */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xs h-60 bg-slate-100 border border-slate-200">
                <img 
                  src={selectedSpecimen.imageUrl} 
                  alt={selectedSpecimen.commonName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                    {selectedSpecimen.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {selectedSpecimen.confidence}% Match
                  </span>
                </div>
              </div>

              {/* Biological Profile Intel */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {selectedSpecimen.commonName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedSpecimen.statusBadge}`}>
                      {selectedSpecimen.status}
                    </span>
                  </div>
                  <p className="text-xs italic text-slate-500 font-serif mt-1">
                    {selectedSpecimen.scientificName} &bull; Family {selectedSpecimen.family}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1 font-semibold uppercase text-[10px] tracking-wide">
                      Dietary Niche
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{selectedSpecimen.diet}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1 font-semibold uppercase text-[10px] tracking-wide">
                      Native Habitat
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{selectedSpecimen.habitat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onNavigateTab('identify')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Test Identification</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('species')}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium text-xs transition-colors"
                  >
                    View in Species Catalog &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 STANDARD ATTRACTIVE PILLARS ─── */}
      <section className="relative z-10 py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Built for Avian Ecology
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              High-accuracy transfer learning tuned for the avifauna of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Sub-50ms CPU Latency
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                MobileNetV2 neural architecture designed for lightning-fast inference on any device without high-end GPU hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                100 Indian Species
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Comprehensive biological profiles with full IUCN conservation ratings, dietary niches, and distribution across 46 families.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Non-Bird Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Dual-layer object gatekeeper detects and rejects non-bird images (vehicles, humans, furniture) to prevent false predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <section className="relative z-10 py-14 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Bird className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            Ready to identify your first bird?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-sm mx-auto font-normal">
            Upload an image to start classifying or register to preserve your observation history.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('identify')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ScanLine className="w-4 h-4 text-emerald-700" />
              <span>Launch Classifier</span>
            </button>

            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-500/60 transition-colors"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3 py-3 text-white/90 hover:text-white text-xs font-semibold transition-colors"
                >
                  Sign In &rarr;
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── STANDARD MINIMAL FOOTER ─── */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-slate-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800 font-bold">Drishti</span>
            <span>&bull; Indian Bird Species Intelligence System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button onClick={() => onNavigateTab('about')} className="hover:text-slate-900 transition-colors">
              About
            </button>
            <button onClick={() => onNavigateTab('species')} className="hover:text-slate-900 transition-colors">
              Species
            </button>
            <button onClick={() => onNavigateTab('dashboard')} className="hover:text-slate-900 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
