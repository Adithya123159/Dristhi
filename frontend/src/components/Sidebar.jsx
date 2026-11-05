import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  ScanLine, 
  Bird, 
  BookOpen, 
  History, 
  Info, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed, 
  isServerOnline,
  currentUser,
  onLogout 
}) {
  const menuItems = [
    { id: 'landing', label: 'Landing Page', icon: Home },
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
          onClick={() => setCurrentTab('landing')}
          title="AvianAI Home"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <Bird className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base text-white tracking-tight">
                AvianAI
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

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30">
        {currentUser ? (
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-slate-800/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!isCollapsed && (
                <div className="truncate text-left">
                  <span className="block text-xs font-medium text-white truncate">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {currentUser.email}
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setCurrentTab('login')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
              {!isCollapsed && <span>Sign In / Register</span>}
            </button>
          </div>
        )}

        {/* Backend Status */}
        <div className={`mt-2 flex items-center gap-2 px-2 py-1 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          {!isCollapsed && (
            <span className="text-[11px] text-slate-400">
              {isServerOnline ? 'Model Online' : 'Backend Offline'}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
