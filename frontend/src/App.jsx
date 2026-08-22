import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import MobileDrawer from './components/MobileDrawer.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import Toast from './components/Toast.jsx';

import HomePage from './pages/HomePage.jsx';
import ChannelDiscoveryPage from './pages/ChannelDiscoveryPage.jsx';
import ChannelDetailPage from './pages/ChannelDetailPage.jsx';
import PlaylistDiscoveryPage from './pages/PlaylistDiscoveryPage.jsx';
import PlaylistDetailPage from './pages/PlaylistDetailPage.jsx';
import LinkAnalyzerPage from './pages/LinkAnalyzerPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import BookmarksPage from './pages/BookmarksPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import UserDashboardPage from './pages/UserDashboardPage.jsx';

function AppContent() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Desktop 240px Navigation Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Sticky Top Navbar */}
        <Navbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        {/* Content Container */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/channels" element={<ChannelDiscoveryPage />} />
            <Route path="/channel/:id" element={<ChannelDetailPage />} />
            <Route path="/playlists" element={<PlaylistDiscoveryPage />} />
            <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
            <Route path="/analyzer" element={<LinkAnalyzerPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/user-dashboard" element={<UserDashboardPage />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ToastProvider>
  );
}