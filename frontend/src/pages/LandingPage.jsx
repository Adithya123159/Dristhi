import React, { useState } from 'react';
import birdBackground from '../assets/bird-background.jpg';
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
  Compass
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

          {/* Right Column: Prominent Sculptural 3D Orb / Interactive Centerpiece */}
          <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center relative py-6 sm:py-0">
            
            {/* Outer Glowing Light / Ambient Telemetry Rings */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 flex items-center justify-center">
              
              {/* Outer soft ambient glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
              <div className="absolute -inset-4 rounded-full border border-emerald-400/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute -inset-8 rounded-full border border-dashed border-emerald-500/15 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />

              {/* 3D Glossy Sculpted Sphere (matching black/blue orb from reference) */}
              <div 
                onClick={() => onNavigateTab('identify')}
                className="w-56 h-56 sm:w-72 sm:h-72 xl:w-84 xl:h-84 rounded-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border-2 border-emerald-500/40 shadow-[0_20px_60px_rgba(6,78,59,0.35)] relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer group hover:scale-105 transition-all duration-500"
              >
                {/* 3D Specular Light Flare Reflection */}
                <div className="absolute top-3 left-6 w-32 h-16 bg-white/20 rounded-full blur-md rotate-[-25deg] pointer-events-none" />
                <div className="absolute bottom-4 right-6 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
                
                {/* Inner Toggle Switch Icon (matching reference toggle switch) */}
                <div className="w-14 h-7 rounded-full bg-white/15 border-2 border-white/70 p-0.5 flex items-center mb-3 shadow-inner group-hover:border-emerald-300 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-white shadow-md transform translate-x-7 transition-transform group-hover:scale-110" />
                </div>

                {/* Inner Text Label */}
                <span className="text-xs sm:text-sm font-black tracking-widest text-white uppercase drop-shadow-md group-hover:text-emerald-300 transition-colors">
                  ACTIVATE DRISHTI
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400/90 tracking-wider uppercase mt-1">
                  Neural Vision
                </span>
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