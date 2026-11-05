import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  ScanLine, 
  Volume2,
  Bird, 
  BookOpen, 
  History, 
  ShieldCheck,
  Info, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogIn,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ 
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
  const menuItems = [
    { id: 'landing', label: 'Landing Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'identify', label: 'Identify Image', icon: ScanLine },
    { id: 'identify-audio', label: 'Identify Audio', icon: Volume2 },
    { id: 'species', label: 'Supported Species', icon: Bird },
    { id: 'encyclopedia', label: 'Bird Encyclopedia', icon: BookOpen },
    { id: 'history', label: 'Classification History', icon: History },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    { id: 'about', label: 'About Project', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    if (setIsMobileDrawerOpen) {
      setIsMobileDrawerOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Scrim */}
      {isMobileDrawerOpen && (
        <div 
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar Drawer */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'w-72 lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
          <div 
            className="flex items-center gap-3 overflow-hidden cursor-pointer" 
            onClick={() => handleSelectTab('landing')}
            title="Drishti Home"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
              <Bird className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobileDrawerOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-white tracking-tight">
                  Drishti
                </span>
                <span className="text-[11px] text-slate-400 truncate">100 Species</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Mobile Close */}
          <div className="flex items-center">
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={isCollapsed && !isMobileDrawerOpen ? item.label : undefined}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {(!isCollapsed || isMobileDrawerOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/20">
          {currentUser ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {(!isCollapsed || isMobileDrawerOpen) && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                )}
              </div>
              {(!isCollapsed || isMobileDrawerOpen) && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            (!isCollapsed || isMobileDrawerOpen) && (
              <button
                onClick={() => handleSelectTab('login')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )
          )}
        </div>
      </aside>
    </>
  );
}
