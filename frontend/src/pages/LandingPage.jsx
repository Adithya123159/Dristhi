import React from 'react';
import birdBackground from '../assets/bird-background.jpg';
import { 
  Bird, 
  ScanLine, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  ChevronRight,
  Eye,
  Feather,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  return (
    <div className="h-screen max-h-screen overflow-y-auto lg:overflow-hidden bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white relative">
      
      {/* ─── ELEGANT VISIBLE BIRD BACKGROUND & AMBIENT ATMOSPHERE ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Real High-Resolution Avian Hero Wallpaper */}
        <img 
          src={birdBackground}
          alt="Avian Wildlife Background"
          className="w-full h-full object-cover object-center opacity-45 mix-blend-multiply scale-102 transition-all duration-700"
        />

        {/* Soft Frosted Overlays to keep text crystal clear and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/70" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent blur-3xl" />
        <div className="absolute bottom-16 -left-28 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-96 h-96 bg-teal-100/25 rounded-full blur-3xl" />

        {/* Graceful Visible Soaring Birds (Upper Left Sky) */}
        <svg 
          className="absolute top-8 left-10 sm:left-24 w-64 h-36 text-emerald-800/40 drop-shadow-xs" 
          viewBox="0 0 200 100" 
          fill="currentColor"
        >
          <path d="M 30 25 Q 50 5 80 20 Q 100 5 120 25 Q 90 20 80 32 Q 70 20 30 25 Z" />
          <path d="M 125 40 Q 140 28 160 38 Q 175 28 190 40 Q 170 36 160 48 Q 150 36 125 40 Z" />
          <path d="M 10 65 Q 22 55 35 63 Q 45 55 55 65 Q 40 62 35 70 Q 30 62 10 65 Z" />
          <path d="M 160 15 Q 172 6 186 14 Q 196 6 205 15 Q 192 13 186 20 Q 180 13 160 15 Z" />
        </svg>

        {/* Graceful Visible Soaring Birds (Upper Right Sky) */}
        <svg 
          className="absolute top-10 right-10 sm:right-28 w-72 h-40 text-emerald-800/40 drop-shadow-xs" 
          viewBox="0 0 220 110" 
          fill="currentColor"
        >
          <path d="M 150 15 Q 168 2 188 12 Q 200 2 215 15 Q 192 12 188 22 Q 180 12 150 15 Z" />
          <path d="M 90 35 Q 105 24 122 32 Q 132 24 145 35 Q 128 32 122 40 Q 115 32 90 35 Z" />
          <path d="M 40 65 Q 52 56 66 63 Q 75 56 86 65 Q 72 63 66 70 Q 60 63 40 65 Z" />
          <path d="M 185 55 Q 196 46 208 52 Q 216 46 225 55 Q 214 53 208 58 Q 202 53 185 55 Z" />
        </svg>
      </div>

      {/* ─── STANDARD HEADER ─── */}
      <header className="relative z-20 w-full h-18 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex-shrink-0 flex items-center justify-between">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          {/* Drishti Brand */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group py-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 group-hover:bg-emerald-700 transition-colors">
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

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => onNavigateTab('identify')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Classifier</span>
            </button>
            <button
              onClick={() => onNavigateTab('species')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white transition-all"
            >
              Species Catalog
            </button>
            <button
              onClick={() => onNavigateTab('encyclopedia')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white transition-all"
            >
              Encyclopedia
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white transition-all"
            >
              Dashboard
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div 
                  onClick={() => onNavigateTab('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <LogIn className="w-4 h-4 rotate-180" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Log In */}
                <button
                  onClick={() => onNavigateTab('login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>

                {/* Register */}
                <button
                  onClick={() => onNavigateTab('register')}
                  className="px-4.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>

                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hidden sm:flex px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Guest &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── BIG, PROMINENT, ATTRACTIVE CENTERED HERO (NO-SCROLL) ─── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center text-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>Drishti AI &bull; Deep Learning for 100 Indian Bird Species</span>
        </div>

        {/* Big, Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl">
          Identify Any Indian Bird with{' '}
          <span className="text-emerald-600">
            Neural Vision.
          </span>
        </h1>

        {/* Big, Clear Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Upload any bird photograph to instantly discover its common name, scientific taxonomy, dietary niche, native habitat, and IUCN conservation rating in under 50ms.
        </p>

        {/* Big Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('identify')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 hover:scale-102 transition-all flex items-center justify-center gap-2.5 group"
          >
            <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Identify a Bird Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigateTab('register')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm sm:text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Create Free Account</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('species')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base hover:bg-slate-100/70 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Browse 100 Species</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Big, Clean 4-Pillar Feature Badges Across Bottom */}
        <div className="mt-10 sm:mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 text-left">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 block">Sub-50ms Speed</span>
            <span className="text-[11px] text-slate-500 font-medium leading-snug block mt-0.5">
              MobileNetV2 neural latency
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2.5">
              <Bird className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 block">100 Native Species</span>
            <span className="text-[11px] text-slate-500 font-medium leading-snug block mt-0.5">
              Across 46 bird families
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 block">Smart Gatekeeper</span>
            <span className="text-[11px] text-slate-500 font-medium leading-snug block mt-0.5">
              Rejects non-bird uploads
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-200 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 block">IUCN Telemetry</span>
            <span className="text-[11px] text-slate-500 font-medium leading-snug block mt-0.5">
              Diet, habitat &amp; taxonomy
            </span>
          </div>
        </div>
      </main>

      {/* ─── CLEAN COMPACT SINGLE-LINE FOOTER ─── */}
      <footer className="relative z-20 w-full h-12 bg-white/90 border-t border-slate-200/80 px-4 sm:px-8 flex-shrink-0 flex items-center justify-between text-xs text-slate-500">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-800 font-bold">Drishti</span>
            <span>&bull; Indian Bird Species Intelligence System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <button onClick={() => onNavigateTab('about')} className="hover:text-slate-900 transition-colors">
              About
            </button>
            <button onClick={() => onNavigateTab('species')} className="hover:text-slate-900 transition-colors">
              100 Species
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
