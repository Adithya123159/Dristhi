import React, { useState } from 'react';
import birdBackground from '../assets/bird-background.jpg';
import heroPeacock from '../assets/hero-peacock.jpg';
import { 
  Bird, 
  ScanLine, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Menu,
  X,
  Compass,
  Zap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white relative">
      
      {/* ─── VISIBLE HIGH-RES AVIAN WALLPAPER & SKY ATMOSPHERE ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img 
          src={birdBackground}
          alt="Avian Wildlife Background"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply scale-102 transition-all duration-700"
        />

        {/* Ambient atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/75" />
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
        </svg>

        {/* Graceful Visible Soaring Birds (Upper Right Sky) */}
        <svg 
          className="absolute top-10 right-10 sm:right-28 w-72 h-40 text-emerald-800/40 drop-shadow-xs" 
          viewBox="0 0 220 110" 
          fill="currentColor"
        >
          <path d="M 150 15 Q 168 2 188 12 Q 200 2 215 15 Q 192 12 188 22 Q 180 12 150 15 Z" />
          <path d="M 90 35 Q 105 24 122 32 Q 132 24 145 35 Q 128 32 122 40 Q 115 32 90 35 Z" />
        </svg>
      </div>

      {/* ─── 1. TOP NAVBAR (STRUCTURE MATCHING REFERENCE: LOGO LEFT, LINKS RIGHT) ─── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between flex-shrink-0">
        
        {/* Brand Logo (Left) */}
        <div 
          onClick={() => onNavigateTab('landing')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Bird className="w-5 h-5 drop-shadow-xs" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Drishti
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>100 Species</span>
            </span>
          </div>
        </div>

        {/* Navigation Links & Action Buttons (Aligned Right) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
          <button 
            onClick={() => onNavigateTab('landing')}
            className="text-xs font-extrabold tracking-wider text-slate-800 hover:text-emerald-700 uppercase transition-colors"
          >
            HOME
          </button>
          <button 
            onClick={() => onNavigateTab('identify')}
            className="text-xs font-extrabold tracking-wider text-slate-800 hover:text-emerald-700 uppercase transition-colors"
          >
            AI CLASSIFIER
          </button>
          <button 
            onClick={() => onNavigateTab('species')}
            className="text-xs font-extrabold tracking-wider text-slate-800 hover:text-emerald-700 uppercase transition-colors"
          >
            SPECIES CATALOG
          </button>
          <button 
            onClick={() => onNavigateTab('encyclopedia')}
            className="text-xs font-extrabold tracking-wider text-slate-800 hover:text-emerald-700 uppercase transition-colors"
          >
            ENCYCLOPEDIA
          </button>
          <button 
            onClick={() => onNavigateTab('dashboard')}
            className="text-xs font-extrabold tracking-wider text-slate-800 hover:text-emerald-700 uppercase transition-colors"
          >
            DASHBOARD
          </button>

          {/* User Auth or Register Action */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-300">
              <div 
                onClick={() => onNavigateTab('dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Logout"
              >
                <LogIn className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-300">
              <button
                onClick={() => onNavigateTab('login')}
                className="text-xs font-extrabold tracking-wider text-slate-700 hover:text-slate-900 uppercase transition-colors"
              >
                LOG IN
              </button>
              <button
                onClick={() => onNavigateTab('register')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                REGISTER
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden relative z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <button 
            onClick={() => { onNavigateTab('identify'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-emerald-700"
          >
            AI Classifier
          </button>
          <button 
            onClick={() => { onNavigateTab('species'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-emerald-700"
          >
            Species Catalog (100)
          </button>
          <button 
            onClick={() => { onNavigateTab('encyclopedia'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-emerald-700"
          >
            Bird Encyclopedia
          </button>
          <button 
            onClick={() => { onNavigateTab('dashboard'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-emerald-700"
          >
            Dashboard
          </button>
          <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
            <button
              onClick={() => { onNavigateTab('login'); setIsMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
            >
              Log In
            </button>
            <button
              onClick={() => { onNavigateTab('register'); setIsMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center text-sm font-bold text-white bg-emerald-600 rounded-xl"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* ─── 2. MAIN HERO SECTION (SPLIT 2-COLUMN STRUCTURE MATCHING REFERENCE) ─── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-4 sm:py-8 flex flex-col justify-between">
        
        {/* Main Content Row: Left Column (Text & Primary CTA) + Right Column (Center Focal Orb) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto w-full">
          
          {/* Left Column (Headline, Paragraph, and Speak-to-Expert Style Button) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Eyebrow Label */}
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-700 mb-3 sm:mb-4">
              ACTIVATE THE POWER OF DRISHTI AI
            </p>

            {/* Massive Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-2xl">
              Identify Any Indian Bird with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Neural Vision.
              </span>
            </h1>

            {/* Sub-paragraph */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Upload any bird photograph to instantly discover its common name, scientific taxonomy, dietary niche, native habitat, and IUCN conservation rating in under 50ms with multimodal deep learning.
            </p>

            {/* Primary Action Button (Placed on Left below paragraph) */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => onNavigateTab('identify')}
                className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
              >
                <ScanLine className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span>IDENTIFY A BIRD NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: High-Tech Avian Neural Vision Portal */}
          <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center relative py-6 sm:py-0">
            
            {/* Outer Rotating Radar & Telemetry Orbit Rings */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 xl:w-[410px] xl:h-[410px] flex items-center justify-center">
              
              {/* Outer soft ambient radar glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
              <div className="absolute -inset-2 rounded-full border border-emerald-400/25 animate-spin" style={{ animationDuration: '35s' }} />
              <div className="absolute -inset-6 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '50s', animationDirection: 'reverse' }} />

              {/* ── 4 Orbiting Telemetry Micro-Badges ── */}
              {/* Top-Left: Sub-50ms Latency */}
              <div className="absolute -top-1 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-[11px] font-extrabold text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Sub-50ms Latency</span>
              </div>

              {/* Top-Right: 98.6% Accuracy */}
              <div className="absolute -top-1 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/95 backdrop-blur-md text-white shadow-md text-[11px] font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>98.6% Accuracy</span>
              </div>

              {/* Bottom-Left: 100 Species Mapped */}
              <div className="absolute -bottom-1 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-[11px] font-bold text-slate-700">
                <Bird className="w-3.5 h-3.5 text-emerald-600" />
                <span>100 Native Species</span>
              </div>

              {/* Bottom-Right: YOLOv8 + Gemini AI */}
              <div className="absolute -bottom-1 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md text-[11px] font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>YOLOv8 &bull; Gemini AI</span>
              </div>

              {/* ── Core Avian Neural Vision Lens ── */}
              <div 
                onClick={() => onNavigateTab('identify')}
                className="w-64 h-64 sm:w-80 sm:h-80 xl:w-92 xl:h-92 rounded-full overflow-hidden shadow-[0_25px_60px_rgba(6,78,59,0.3)] ring-4 ring-white/95 border-4 border-emerald-500/40 relative cursor-pointer group hover:shadow-[0_30px_70px_rgba(6,78,59,0.45)] transition-all duration-500"
                title="Click to Test Neural Bird Classifier"
              >
                {/* Focal Avian Artwork (Majestic Indian Peafowl) */}
                <img 
                  src={heroPeacock} 
                  alt="Neural Target: Indian Peafowl"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-700 select-none"
                />

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Animated Horizontal Scan Beam */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-pulse pointer-events-none" />

                {/* YOLOv8 Neural Bounding Box Target Overlay */}
                <div className="absolute inset-8 sm:inset-10 rounded-2xl border-2 border-emerald-400/80 pointer-events-none transition-all group-hover:border-emerald-300">
                  {/* Top Target Label */}
                  <div className="absolute -top-3.5 left-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-tight shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>AI DETECT: Indian Peafowl</span>
                  </div>

                  {/* Top-Right Confidence Pill */}
                  <div className="absolute -top-3.5 right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-emerald-300 font-mono text-[9px] sm:text-[10px] font-bold tracking-tight shadow-md border border-emerald-400/30">
                    <span>98.6%</span>
                  </div>

                  {/* Corner Reticle Brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />

                  {/* Target Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-60">
                    <div className="w-6 h-6 border border-emerald-400/40 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Center / Bottom Interactive Launch Badge */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="px-4 sm:px-5 py-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-400/80 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase shadow-xl flex items-center gap-2 group-hover:bg-emerald-600 group-hover:border-emerald-300 group-hover:scale-105 transition-all">
                    <ScanLine className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                    <span>ACTIVATE NEURAL SCAN</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. LOWER SECTION (MATCHING REFERENCE: BADGE BOTTOM-LEFT, STACKED CTAS BOTTOM-RIGHT) ─── */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-6 sm:pt-4 border-t border-slate-200/60 flex-shrink-0">
          
          {/* Bottom-Left: Telemetry Badge (Matching reference bottom-left placement) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100 Native Species &bull; Sub-50ms Neural Latency</span>
          </div>

          {/* Bottom-Right: Stacked Action Buttons (Matching reference bottom-right structure) */}
          <div className="flex flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto">
            
            {/* Top Button: Pill with circular icon badge (like SCHEDULE A DEMO in reference) */}
            <button
              onClick={() => onNavigateTab('species')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-300/90 hover:border-emerald-300 font-bold text-xs tracking-wider uppercase shadow-sm hover:shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2.5 group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Bird className="w-3.5 h-3.5" />
              </div>
              <span>BROWSE 100 SPECIES</span>
            </button>

            {/* Bottom Button: Solid button (like CONTACT US in reference) */}
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="w-full sm:w-auto min-w-[210px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-102 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>EXPLORE DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}