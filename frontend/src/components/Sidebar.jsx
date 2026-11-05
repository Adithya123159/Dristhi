import React from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  Bird, 
  BookOpen, 
  History, 
  Info, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, isCollapsed, setIsCollapsed, isServerOnline }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'identify', label: 'Identify Bird', icon: ScanLine },
    { id: 'species', label: 'Supported Species', icon: Bird },
    { id: 'encyclopedia', label: 'Bird Encyclopedia', icon: BookOpen },
    { id: 'history', label: 'Classification History', icon: History },
    { id: 'about', label: 'About Project', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-200 transition-all duration-200 ease-in-out border-r border-slate-800 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        <div 
          className="flex items-center gap-3 overflow-hidden cursor-pointer" 
          onClick={() => setCurrentTab('dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <Bird className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base text-white tracking-tight">
                Bird Classifier
              </span>
              <span className="text-[11px] text-slate-400 truncate">100 Species</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isActive 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate text-left">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Backend Status Footer */}
      <div className="p-3 border-t border-slate-800">
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          {!isCollapsed && (
            <span className="text-xs text-slate-400">
              {isServerOnline ? 'Model Online' : 'Backend Offline'}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
