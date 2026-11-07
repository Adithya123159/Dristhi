import React from 'react';
import { ScanLine, Menu, Home, LogIn, UserPlus, LogOut, User } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed, 
  isServerOnline,
  currentUser,
  onLogout,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen
}) {
  const titles = {
    landing: 'Home',
    dashboard: 'Dashboard',
    identify: 'Identify Bird',
    species: 'Species Catalog',
    encyclopedia: 'Encyclopedia',
    history: 'History',
    about: 'About',
    settings: 'Settings',
    login: 'Sign In',
    register: 'Create Account'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-none">
          {titles[currentTab] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Home shortcut button (hidden on mobile, visible on tablet/desktop) */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-2xs"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span>Landing Page</span>
        </button>

        {/* Server status pill */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold px-2.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80">
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-rose-500'}`} />
          <span className="hidden sm:inline">{isServerOnline ? 'Ready' : 'Offline'}</span>
        </div>

        {/* Quick Identify Button */}
        {currentTab !== 'identify' && (
          <button
            onClick={() => setCurrentTab('identify')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs sm:text-sm hover:from-emerald-500 hover:to-teal-400 transition-all shadow-md shadow-emerald-600/20 ring-1 ring-emerald-400/30 hover:scale-102"
          >
            <ScanLine className="w-4 h-4" />
            <span className="hidden sm:inline">Identify</span>
          </button>
        )}

        {/* User Auth controls */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs border border-slate-200/60">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentTab('login')}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-emerald-600/30 hover:scale-102 ring-1 ring-emerald-400/30"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
