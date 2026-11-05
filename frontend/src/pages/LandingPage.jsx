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
  Compass, 
  ExternalLink,
  ChevronRight,
  Layers,
  Activity
} from 'lucide-react';

const FEATURED_SPECIMENS = [
  {
    id: 'peafowl',
    commonName: 'Indian Peafowl',
    scientificName: 'Pavo cristatus',
    family: 'Phasianidae',
    status: 'Least Concern (LC)',
    statusColor: 'emerald',
    confidence: 99.4,
    diet: 'Omnivorous (seeds, insects, small reptiles)',
    habitat: 'Deciduous forests, open scrublands & cultivated lands',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accentBorder: 'border-emerald-500/30'
  },
  {
    id: 'roller',
    commonName: 'Indian Roller',
    scientificName: 'Coracias benghalensis',
    family: 'Coraciidae',
    status: 'Least Concern (LC)',
    statusColor: 'blue',
    confidence: 98.8,
    diet: 'Carnivorous (insects, beetles, arachnids)',
    habitat: 'Open grasslands, agricultural fields & scrub forests',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    accentBorder: 'border-cyan-500/30'
  },
  {
    id: 'bustard',
    commonName: 'Great Indian Bustard',
    scientificName: 'Ardeotis nigriceps',
    family: 'Otididae',
    status: 'Critically Endangered (CR)',
    statusColor: 'rose',
    confidence: 96.5,
    diet: 'Omnivorous (grasshoppers, beetles, seeds)',
    habitat: 'Semi-arid arid grasslands and thorny scrub of Thar',
    gradient: 'from-rose-500/20 to-amber-500/20',
    accentBorder: 'border-rose-500/30'
  },
  {
    id: 'parakeet',
    commonName: 'Rose-ringed Parakeet',
    scientificName: 'Psittacula krameri',
    family: 'Psittaculidae',
    status: 'Least Concern (LC)',
    statusColor: 'emerald',
    confidence: 99.1,
    diet: 'Herbivorous (fruits, seeds, buds, flowers)',
    habitat: 'Woodlands, urban gardens & agricultural farms',
    gradient: 'from-lime-500/20 to-emerald-500/20',
    accentBorder: 'border-lime-500/30'
  }
];

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [selectedSpecimen, setSelectedSpecimen] = useState(FEATURED_SPECIMENS[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Background organic light glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-emerald-600/10 via-teal-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Floating Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">AvianAI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.1
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Ecological Intelligence</p>
            </div>
          </div>

          {/* Quick nav pills */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-2xl">
            <button
              onClick={() => onNavigateTab('identify')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Classifier</span>
            </button>
            <button
              onClick={() => onNavigateTab('species')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              100 Species
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              Encyclopedia
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              Dashboard
            </button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Go to App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 p-2 transition-colors"
                  title="Logout"
                >
                  <LogIn className="w-4 h-4 rotate-180" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5 border border-transparent hover:border-slate-800"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all items-center gap-1.5"
                >
                  <span>Explore</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>MobileNetV2 Neural Vision &bull; 100 Indian Bird Species</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Identify Any Bird in Seconds with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Deep Neural Vision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Upload an image to identify native Indian birds with sub-50ms latency. 
          Get instant biological taxonomy, IUCN conservation status, diet, and ecological profiling.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('identify')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <ScanLine className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>Identify a Bird Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigateTab('register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Create Free Account</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('species')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Browse 100 Species</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Simple reassurance note */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span>&bull; No credit card required</span>
          <span>&bull; SQLite history saved</span>
          <span>&bull; Dual-layer verification</span>
        </div>

        {/* Creative Interactive Showcase: "Live Specimen Radar" */}
        <div className="mt-14 w-full max-w-4xl">
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-left">
            {/* Header of showcase */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live Specimen Radar
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Interactive Species Intelligence
                </h3>
              </div>

              {/* Selector pills */}
              <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                {FEATURED_SPECIMENS.map((bird) => (
                  <button
                    key={bird.id}
                    onClick={() => setSelectedSpecimen(bird)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedSpecimen.id === bird.id
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {bird.commonName}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen details display */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left: Biological Profile */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-extrabold text-white">
                      {selectedSpecimen.commonName}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedSpecimen.status}
                    </span>
                  </div>
                  <p className="text-sm italic text-slate-400 mt-0.5">
                    {selectedSpecimen.scientificName} &bull; Family {selectedSpecimen.family}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                    <span className="text-slate-400 block mb-1 font-medium">Dietary Niche</span>
                    <span className="text-slate-200 font-medium">{selectedSpecimen.diet}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                    <span className="text-slate-400 block mb-1 font-medium">Native Habitat</span>
                    <span className="text-slate-200 font-medium">{selectedSpecimen.habitat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigateTab('identify')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Test Identification</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('species')}
                    className="px-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
                  >
                    View in Species Catalog
                  </button>
                </div>
              </div>

              {/* Right: Simulated Confidence Score & Sensor */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-pulse flex items-center justify-center">
                    <span className="text-xl font-black text-white">{selectedSpecimen.confidence}%</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  Model Confidence Tier: High
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Latency: 42ms on CPU
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Unique Pillars */}
      <section className="py-16 border-t border-slate-800/80 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why AvianAI is Different
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Engineered specifically for the ecological diversity of the Indian subcontinent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Sub-50ms MobileNetV2 Latency
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lightweight inverted residual architecture fine-tuned on native bird morphology for rapid, accurate edge classification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                100 Indian Species &amp; IUCN Telemetry
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Covers common backyard birds to critically endangered avifauna, enriched with taxonomic classification and habitats.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/80 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Dual Multimodal Validation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Offline ImageNet-1k object gatekeeper detects non-bird photos with zero hallucination, complemented by optional Gemini Vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">100</div>
              <div className="text-xs text-slate-400 mt-1">Species Classified</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">&lt;50ms</div>
              <div className="text-xs text-slate-400 mt-1">Inference Latency</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-teal-400">46</div>
              <div className="text-xs text-slate-400 mt-1">Taxonomic Families</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Free &amp; Open Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <Bird className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Explore the Skies?
            </h2>
            <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
              Start identifying Indian bird species instantly or create an account to save your ecological observation history.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigateTab('identify')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <ScanLine className="w-4 h-4" />
                <span>Launch Classifier</span>
              </button>

              {!currentUser ? (
                <>
                  <button
                    onClick={() => onNavigateTab('register')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Register New Account</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('login')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
                  >
                    Sign In &rarr;
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Simple, Minimal Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-400 font-semibold">AvianAI</span>
            <span>&mdash; Indian Bird Species Intelligence System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigateTab('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => onNavigateTab('species')} className="hover:text-white transition-colors">
              Species
            </button>
            <button onClick={() => onNavigateTab('settings')} className="hover:text-white transition-colors">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

