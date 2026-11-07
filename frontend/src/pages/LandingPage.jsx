import React, { useState, useEffect } from 'react';
import birdBackground from '../assets/bird-background.jpg';
import { 
  Bird, 
  ScanLine, 
  ArrowRight, 
  LogIn, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage({ 
  onNavigateTab, 
  currentUser, 
  onLogout 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dbStats, setDbStats] = useState({ total_classifications: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await api.getStats();
        setDbStats(stats);
      } catch (err) {
        console.warn('Could not load db stats:', err);
      }
    }
    loadStats();
  }, []);

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

      {/* ─── 1. TOP NAVBAR (LOGO LEFT, AUTH RIGHT) ─── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between flex-shrink-0">
        
        {/* Brand Logo (Left) */}
        <div 
          onClick={() => onNavigateTab('landing')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Bird className="w-5 h-5 drop-shadow-xs" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            Drishti
          </span>
        </div>

        {/* User Auth: Sign In or Register (Right) */}
        <nav className="hidden sm:flex items-center gap-3 flex-shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => onNavigateTab('dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors shadow-2xs border border-slate-200/80"
                title="Open Dashboard"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 hover:text-emerald-700 transition-colors"
              >
                DASHBOARD
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('login')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider text-slate-700 hover:text-slate-950 uppercase transition-colors"
              >
                SIGN IN
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
          className="sm:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Dropdown - Auth actions only */}
      {isMobileMenuOpen && (
        <div className="sm:hidden relative z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2">
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => { onNavigateTab('dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-emerald-600 rounded-xl"
              >
                Open Dashboard
              </button>
              <button
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { onNavigateTab('login'); setIsMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigateTab('register'); setIsMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── 2. MAIN HERO SECTION ─── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-4 sm:py-8 flex flex-col justify-between">
        
        {/* Main Content Row: Left-Aligned Hero Section */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl lg:max-w-3xl my-auto py-8 sm:py-16">
          
          {/* Eyebrow Label */}
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-700 mb-3 sm:mb-4">
            ACTIVATE THE POWER OF DRISHTI AI
          </p>

          {/* Massive Bold Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-2xl">
            Identify Any Bird Worldwide with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Neural Vision.
            </span>
          </h1>

          {/* Sub-paragraph */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            Upload any bird photograph or vocalization to instantly discover its common name, scientific taxonomy, dietary niche, native habitat, and IUCN conservation rating with multimodal deep learning.
          </p>

          {/* Primary Action Button */}
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

        {/* ─── 3. LOWER SECTION (DYNAMIC TELEMETRY BOTTOM-LEFT, CTAS BOTTOM-RIGHT) ─── */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-6 sm:pt-4 border-t border-slate-200/60 flex-shrink-0">
          
          {/* Bottom-Left: Dynamic Telemetry Badge connected to real DB stats */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {dbStats.total_classifications > 0
                ? `${dbStats.total_classifications} Database Records • Multimodal AI`
                : 'Multimodal Avian AI • Neural Recognition'}
            </span>
          </div>

          {/* Bottom-Right: Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('identify')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-300/90 hover:border-emerald-300 font-bold text-xs tracking-wider uppercase shadow-sm hover:shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Bird className="w-3.5 h-3.5" />
              </div>
              <span>START IDENTIFICATION</span>
            </button>

            <button
              onClick={() => onNavigateTab('dashboard')}
              className="w-full sm:w-auto min-w-[200px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-102 transition-all text-center flex items-center justify-center gap-2"
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
