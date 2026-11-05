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

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Home shortcut button (hidden on mobile, visible on tablet/desktop) */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Landing Page</span>
        </button>

        {/* Server status pill */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="hidden sm:inline">{isServerOnline ? 'Ready' : 'Offline'}</span>
        </div>

        {/* Quick Identify Button */}
        {currentTab !== 'identify' && (
          <button
            onClick={() => setCurrentTab('identify')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Identify</span>
          </button>
        )}

        {/* User Auth controls */}
        {currentUser ? (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentTab('login')}
              className="px-2 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
