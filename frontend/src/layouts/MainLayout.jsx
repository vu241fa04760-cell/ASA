import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import ParticleBackground from '../components/3d/ParticleBackground';
import AddSubjectModal from '../components/common/AddSubjectModal';
import YouTubePlayerModal from '../components/common/YouTubePlayerModal';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-navy text-white flex flex-col bg-mesh-dark relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 60fps Particle Background */}
      <ParticleBackground />

      {/* Floating Accent Glows in Electric Blue & Cyan */}
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-500/12 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300 relative z-10">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Add Subject Modal */}
      <AddSubjectModal />

      {/* Global YouTube Lecture Video Player Modal */}
      <YouTubePlayerModal />
    </div>
  );
};

export default MainLayout;
