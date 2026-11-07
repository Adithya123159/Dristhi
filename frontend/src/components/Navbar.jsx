import React, { useState, useRef, useEffect } from 'react';
import { 
  Bird,
  LayoutDashboard, 
  ScanLine, 
  Volume2, 
  BookOpen, 
  History, 
  ShieldCheck, 
  Info, 
  Settings, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  LogIn, 
  UserPlus
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isServerOnline,
  currentUser,
  onLogout
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'identify', label: 'Identify Bird', icon: ScanLine },
    { id: 'identify-audio', label: 'Identify Audio', icon: Volume2 },
    { id: 'species', label: 'Species Catalog', icon: Bird },
    { id: 'encyclopedia', label: 'Encyclopedia', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
  ];

  const secondaryNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
    { id: 'about', label: 'About Project', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setIsMoreOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isMoreActive = secondaryNavItems.some(item => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo & Title (Navigates to Landing Page) */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          title="Return to Drishti Landing Page"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xs shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Bird className="w-5 h-5 drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Drishti
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>100 Species</span>
              </span>
            </div>
            <p className="hidden md:block text-[9px] font-bold uppercase tracking-wider text-emerald-700/80">
              Avian Ecological Intelligence
            </p>
          </div>
        </div>

        {/* Center: Desktop Top Bar Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* "More" Dropdown Menu (Admin, About, Settings) */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all whitespace-nowrap ${
                isMoreActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Server Status & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Server Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-bold px-2.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80">
            <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-rose-500'}`} />
            <span className="hidden md:inline">{isServerOnline ? 'Ready' : 'Offline'}</span>
          </div>

          {/* User Profile / Auth Actions */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div 
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs border border-slate-200/60 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-1.5 text-xs sm:text-[13px] font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-[13px] font-bold transition-all shadow-sm shadow-emerald-600/30 ring-1 ring-emerald-400/30"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </p>
          {[...primaryNavItems, ...secondaryNavItems].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}