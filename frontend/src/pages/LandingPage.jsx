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
  Feather
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
    diet: 'Omnivorous (seeds, grains, insects, small reptiles)',
    habitat: 'Deciduous forests, open scrublands & village edges',
    accentBg: 'bg-emerald-50/60'
  },
  {
    id: 'roller',
    commonName: 'Indian Roller',
    scientificName: 'Coracias benghalensis',
    family: 'Coraciidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    confidence: 98.8,
    diet: 'Carnivorous (beetles, grasshoppers, small lizards)',
    habitat: 'Open grasslands, agricultural fields & road perches',
    accentBg: 'bg-sky-50/60'
  },
  {
    id: 'bustard',
    commonName: 'Great Indian Bustard',
    scientificName: 'Ardeotis nigriceps',
    family: 'Otididae',
    status: 'Critically Endangered (CR)',
    statusBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    confidence: 96.5,
    diet: 'Omnivorous (insects, grasshoppers, seeds, berries)',
    habitat: 'Arid grasslands & semi-desert scrublands of Thar',
    accentBg: 'bg-rose-50/60'
  },
  {
    id: 'parakeet',
    commonName: 'Rose-ringed Parakeet',
    scientificName: 'Psittacula krameri',
    family: 'Psittaculidae',
    status: 'Least Concern (LC)',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 99.1,
    diet: 'Herbivorous (fruits, nuts, buds, flowering seeds)',
    habitat: 'Woodlands, cultivated farmlands & urban parks',
    accentBg: 'bg-emerald-50/60'
  }
];

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [selectedSpecimen, setSelectedSpecimen] = useState(FEATURED_SPECIMENS[0]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent pointer-events-none" />

      {/* Clean Light Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-700 transition-colors">
              <Bird className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">AvianAI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100 Species
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Bird Classification System</p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => onNavigateTab('identify')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all flex items-center gap-1.5"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>Classifier</span>
            </button>
            <button
              onClick={() => onNavigateTab('species')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Species Catalog
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Encyclopedia
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
            >
              Dashboard
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onNavigateTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center gap-1.5"
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
                {/* Login Button */}
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>

                {/* Register Button */}
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Guest Access &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Soft Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>MobileNetV2 AI Vision &bull; 100 Indian Bird Species</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Smart Bird Identification,{' '}
          <span className="text-emerald-700">
            Simple &amp; Fast.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Upload any bird photograph to instantly discover its species name, taxonomy, native habitat, diet, and conservation status.
        </p>

        {/* Hero CTA Button Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTab('identify')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <ScanLine className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Identify a Bird</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigateTab('register')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Register Free</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('species')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors flex items-center justify-center gap-1"
          >
            <span>Explore 100 Species</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Interactive Specimen Preview Card (Simple & Unique) */}
        <div className="mt-12 w-full text-left">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm">
            {/* Header of preview card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Live Species Preview
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Click any specimen to see classification details</p>
              </div>

              {/* Specimen Switcher Buttons */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                {FEATURED_SPECIMENS.map((bird) => (
                  <button
                    key={bird.id}
                    onClick={() => setSelectedSpecimen(bird)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSpecimen.id === bird.id
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {bird.commonName}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen Information Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Details */}
              <div className="md:col-span-2 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {selectedSpecimen.commonName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedSpecimen.statusBadge}`}>
                      {selectedSpecimen.status}
                    </span>
                  </div>
                  <p className="text-xs italic text-slate-500 mt-1">
                    {selectedSpecimen.scientificName} &bull; Family {selectedSpecimen.family}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5 font-medium">Dietary Niche</span>
                    <span className="text-slate-800 font-medium">{selectedSpecimen.diet}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-0.5 font-medium">Native Habitat</span>
                    <span className="text-slate-800 font-medium">{selectedSpecimen.habitat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onNavigateTab('identify')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Test Identification</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('species')}
                    className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
                  >
                    View in Species Catalog &rarr;
                  </button>
                </div>
              </div>

              {/* Right Mini Score Box */}
              <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-emerald-800">{selectedSpecimen.confidence}%</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">
                  Confidence Tier: High
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Sub-50ms CPU Latency
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Pillars (Simple & Clean) */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Core Capabilities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Purpose-built for biodiversity research and birdwatchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Sub-50ms Neural Speed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                MobileNetV2 deep convolutional network optimized for instant inference on photos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                100 Indian Species
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Covers common backyard birds to endangered wildlife with diets, habitats, and IUCN tags.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Accurate Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart gatekeeper validates genuine bird images and rejects cars, humans, or clutter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Box */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-emerald-600 text-white shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Bird className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            Ready to identify your first bird?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
            Upload an image to start classifying or create an account to save your observation history.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('identify')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Classifier</span>
            </button>

            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-500/50 transition-colors"
                >
                  Create Account
                </button>
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-3 py-2.5 text-white/90 hover:text-white text-xs font-medium transition-colors"
                >
                  Sign In &rarr;
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Clean Minimal Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-slate-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800 font-semibold">AvianAI</span>
            <span>&bull; Indian Bird Species Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
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
