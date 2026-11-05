import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import SpeciesModal from './components/SpeciesModal';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardHome from './pages/DashboardHome';
import IdentifyBird from './pages/IdentifyBird';
import IdentifyAudio from './pages/IdentifyAudio';
import SupportedSpecies from './pages/SupportedSpecies';
import BirdEncyclopedia from './pages/BirdEncyclopedia';
import ClassificationHistory from './pages/ClassificationHistory';
import AdminDashboard from './pages/AdminDashboard';
import AboutProject from './pages/AboutProject';
import Settings from './pages/Settings';

import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [selectedSpeciesModal, setSelectedSpeciesModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load active user session on startup
  useEffect(() => {
    const savedUser = api.getStoredUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Health check heartbeat
  useEffect(() => {
    let isMounted = true;

    async function pingHealth() {
      try {
        const res = await api.checkHealth();
        if (isMounted) {
          setIsServerOnline(res && res.status === 'healthy');
        }
      } catch {
        if (isMounted) setIsServerOnline(false);
      }
    }

    pingHealth();
    const interval = setInterval(pingHealth, 10000); // Check every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setCurrentTab('landing');
  };

  // Full-page views
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage 
          onNavigateTab={setCurrentTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <SpeciesModal
          species={selectedSpeciesModal}
          isOpen={Boolean(selectedSpeciesModal)}
          onClose={() => setSelectedSpeciesModal(null)}
        />
      </>
    );
  }

  if (currentTab === 'login' || currentTab === 'register') {
    return (
      <AuthPage 
        initialMode={currentTab}
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentTab('landing')}
        onSkip={() => setCurrentTab('dashboard')}
      />
    );
  }

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            setCurrentTab={setCurrentTab} 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'identify':
        return (
          <IdentifyBird 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'identify-audio':
        return (
          <IdentifyAudio 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'species':
        return (
          <SupportedSpecies 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'encyclopedia':
        return (
          <BirdEncyclopedia 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'history':
        return (
          <ClassificationHistory 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutProject />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <DashboardHome 
            setCurrentTab={setCurrentTab} 
            setSelectedSpeciesModal={setSelectedSpeciesModal} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Responsive Sidebar & Mobile Drawer */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isServerOnline={isServerOnline}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
      />

      {/* Main Content Area - Mobile-Friendly Margin */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ml-0 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isServerOnline={isServerOnline}
          currentUser={currentUser}
          onLogout={handleLogout}
          isMobileDrawerOpen={isMobileDrawerOpen}
          setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Interactive Species Detail Modal */}
      <SpeciesModal
        species={selectedSpeciesModal}
        isOpen={Boolean(selectedSpeciesModal)}
        onClose={() => setSelectedSpeciesModal(null)}
      />
    </div>
  );
}
