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
    { id: 'identify', label: 'Identify Bird', icon: ScanLine },
    { id: 'species', label: 'Supported Species', icon: Bird },
    { id: 'encyclopedia', label: 'Bird Encyclopedia', icon: BookOpen },
    { id: 'history', label: 'Classification History', icon: History },
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
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive 
                    ? 'bg-emerald-600 text-white font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={isCollapsed && !isMobileDrawerOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 lg:w-4 lg:h-4 flex-shrink-0" />
                {(!isCollapsed || isMobileDrawerOpen) && (
                  <span className="truncate text-left">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-slate-800/40">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {(!isCollapsed || isMobileDrawerOpen) && (
                  <div className="truncate text-left">
                    <span className="block text-xs font-semibold text-white truncate">
                      {currentUser.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {currentUser.email}
                    </span>
                  </div>
                )}
              </div>
              {(!isCollapsed || isMobileDrawerOpen) && (
                <button
                  onClick={() => {
                    onLogout();
                    if (setIsMobileDrawerOpen) setIsMobileDrawerOpen(false);
                  }}
                  className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleSelectTab('login')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors ${
                  isCollapsed && !isMobileDrawerOpen ? 'justify-center' : ''
                }`}
                title="Sign In"
              >
                <LogIn className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || isMobileDrawerOpen) && <span>Sign In / Register</span>}
              </button>
            </div>
          )}

          {/* Backend Status */}
          <div className={`mt-2 flex items-center gap-2 px-2 py-1 rounded-lg ${isCollapsed && !isMobileDrawerOpen ? 'justify-center' : ''}`}>
            <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            {(!isCollapsed || isMobileDrawerOpen) && (
              <span className="text-[11px] text-slate-400">
                {isServerOnline ? 'Model Online' : 'Backend Offline'}
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
