import React, { createContext, useContext, useState, useEffect } from 'react';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext();

export function AppProvider({ children }) {
  const auth = useAuth();
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('dockorbit_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareChannels, setCompareChannels] = useState([]);
  const [comparePlaylists, setComparePlaylists] = useState([]);

  const [recentAnalyzed, setRecentAnalyzed] = useState([]);

  const [recentViewed, setRecentViewed] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [theme, setTheme] = useState(() => localStorage.getItem('dockorbit_theme') || 'light');
  const [toastMessage, setToastMessage] = useState(null);

  const user = auth?.user || null;
  const setUser = () => {};

  useEffect(() => {
    localStorage.setItem('dockorbit_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dockorbit_theme', theme);
  }, [theme]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleBookmark = (id, type = 'channel') => {
    setBookmarks(prev => {
      const exists = prev.some(item => item.id === id && item.type === type);
      if (exists) {
        showToast(`Removed from Library`);
        return prev.filter(item => !(item.id === id && item.type === type));
      } else {
        showToast(`Saved to Library`);
        return [...prev, { id, type, savedAt: new Date().toISOString().split('T')[0] }];
      }
    });
  };

  const isBookmarked = (id, type = 'channel') => {
    return bookmarks.some(item => item.id === id && item.type === type);
  };

  const toggleCompareChannel = (id) => {
    setCompareChannels(prev => {
      if (prev.includes(id)) {
        showToast(`Removed from comparison`);
        return prev.filter(i => i !== id);
      } else {
        if (prev.length >= 4) {
          showToast(`Maximum 4 channels can be compared`);
          return prev;
        }
        showToast(`Added to channel comparison`);
        return [...prev, id];
      }
    });
  };

  const isCompareChannel = (id) => compareChannels.includes(id);

  const toggleComparePlaylist = (id) => {
    setComparePlaylists(prev => {
      if (prev.includes(id)) {
        showToast(`Removed from playlist comparison`);
        return prev.filter(i => i !== id);
      } else {
        if (prev.length >= 4) {
          showToast(`Maximum 4 playlists can be compared`);
          return prev;
        }
        showToast(`Added to playlist comparison`);
        return [...prev, id];
      }
    });
  };

  const isComparePlaylist = (id) => comparePlaylists.includes(id);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addAnalyzed = (item) => {
    setRecentAnalyzed(prev => [item, ...prev.filter(i => i.url !== item.url)].slice(0, 10));
  };

  const addRecentViewed = (item) => {
    setRecentViewed(prev => [item, ...prev.filter(i => i.id !== item.id)].slice(0, 10));
  };

  return (
    <AppContext.Provider value={{
      bookmarks,
      toggleBookmark,
      isBookmarked,
      compareChannels,
      toggleCompareChannel,
      isCompareChannel,
      comparePlaylists,
      toggleComparePlaylist,
      isComparePlaylist,
      recentAnalyzed,
      addAnalyzed,
      recentViewed,
      addRecentViewed,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      theme,
      toggleTheme,
      toastMessage,
      showToast,
      user,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
