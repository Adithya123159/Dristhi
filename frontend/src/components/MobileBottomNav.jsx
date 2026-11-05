import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  ScanLine, 
  Bird, 
  History, 
  Menu 
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentTab, 
  setCurrentTab, 
  onOpenMobileDrawer 
}) {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around lg:hidden shadow-lg shadow-slate-900/10 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {/* Home / Landing */}
      <button
        onClick={() => setCurrentTab('landing')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentTab === 'landing'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Home</span>
      </button>

      {/* Dashboard */}
      <button
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentTab === 'dashboard'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Dashboard</span>
      </button>

      {/* Center Elevated Identify Action Button */}
      <button
        onClick={() => setCurrentTab('identify')}
        className="relative -top-3.5 flex flex-col items-center justify-center group"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
          currentTab === 'identify'
            ? 'bg-emerald-600 text-white shadow-emerald-600/40 ring-4 ring-emerald-100'
            : 'bg-emerald-600 text-white shadow-emerald-600/30'
        }`}>
          <ScanLine className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Identify</span>
      </button>

      {/* Species (100) */}
      <button
        onClick={() => setCurrentTab('species')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
          currentTab === 'species'
            ? 'text-emerald-700 font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Bird className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Species</span>
      </button>

      {/* More / Menu Drawer Toggle */}
      <button
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">More</span>
      </button>
    </nav>
  );
}
