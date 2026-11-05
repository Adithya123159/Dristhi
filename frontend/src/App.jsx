import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import SpeciesModal from './components/SpeciesModal';

import DashboardHome from './pages/DashboardHome';
import IdentifyBird from './pages/IdentifyBird';
import SupportedSpecies from './pages/SupportedSpecies';
import BirdEncyclopedia from './pages/BirdEncyclopedia';
import ClassificationHistory from './pages/ClassificationHistory';
import AboutProject from './pages/AboutProject';
import Settings from './pages/Settings';

import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [selectedSpeciesModal, setSelectedSpeciesModal] = useState(null);

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isServerOnline={isServerOnline}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isServerOnline={isServerOnline}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Interactive Species Detail Modal */}
      <SpeciesModal
        species={selectedSpeciesModal}
        isOpen={Boolean(selectedSpeciesModal)}
        onClose={() => setSelectedSpeciesModal(null)}
      />
    </div>
  );
}
