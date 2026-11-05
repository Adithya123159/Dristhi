import React from 'react';
import { ScanLine, Menu } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, isCollapsed, setIsCollapsed, isServerOnline }) {
  const titles = {
    dashboard: 'Dashboard',
    identify: 'Identify Bird',
    species: 'Supported Species',
    encyclopedia: 'Bird Encyclopedia',
    history: 'Classification History',
    about: 'About Project',
    settings: 'Settings',
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
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{isServerOnline ? 'Ready' : 'Offline'}</span>
        </div>

        {currentTab !== 'identify' && (
          <button
            onClick={() => setCurrentTab('identify')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Identify</span>
          </button>
        )}
      </div>
    </header>
  );
}
