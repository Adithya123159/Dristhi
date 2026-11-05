import React from 'react';
import { ScanLine, Menu, Sparkles, Home, LogIn, UserPlus, LogOut, User } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed, 
  isServerOnline,
  currentUser,
  onLogout
}) {
  const titles = {
    landing: 'Home',
    dashboard: 'Dashboard',
    identify: 'Identify Bird',
    species: 'Supported Species',
    encyclopedia: 'Bird Encyclopedia',
    history: 'Classification History',
    about: 'About Project',
    settings: 'Settings',
    login: 'Sign In',
    register: 'Create Account'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {titles[currentTab] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Return to Landing Page button */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Landing Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mr-1">
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{isServerOnline ? 'Ready' : 'Offline'}</span>
        </div>

        {currentTab !== 'identify' && (
          <button
            onClick={() => setCurrentTab('identify')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Identify</span>
          </button>
        )}

        {/* User Auth controls */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
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
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentTab('login')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
