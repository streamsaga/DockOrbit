import React, { createContext, useContext, useState, useEffect } from 'react';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('dockorbit_bookmarks');
      return saved ? JSON.parse(saved) : [
        { id: 'fireship', type: 'channel', savedAt: '2026-08-20' },
        { id: 'react-full-course-2026', type: 'playlist', savedAt: '2026-08-21' }
      ];
    } catch {
      return [
        { id: 'fireship', type: 'channel', savedAt: '2026-08-20' },
        { id: 'react-full-course-2026', type: 'playlist', savedAt: '2026-08-21' }
      ];
    }
  });

  const [compareChannels, setCompareChannels] = useState(['fireship', '3blue1brown']);
  const [comparePlaylists, setComparePlaylists] = useState(['react-full-course-2026', 'linear-algebra-3blue1brown']);

  const [recentAnalyzed, setRecentAnalyzed] = useState([
    {
      url: 'https://youtube.com/@fireship',
      name: 'Fireship',
      type: 'channel',
      score: 96,
      date: '10 minutes ago'
    },
    {
      url: 'https://youtube.com/playlist?list=PL0vfts4VzfNiI1BsIK5u7LpdevBOH532E',
      name: 'React 19 Masterclass',
      type: 'playlist',
      score: 95,
      date: '1 hour ago'
    }
  ]);

  const [recentViewed, setRecentViewed] = useState([
    { id: 'fireship', type: 'channel', name: 'Fireship', avatar: CHANNELS[0].avatar },
    { id: '3blue1brown', type: 'channel', name: '3Blue1Brown', avatar: CHANNELS[1].avatar },
    { id: 'react-full-course-2026', type: 'playlist', title: PLAYLISTS[0].title, thumbnail: PLAYLISTS[0].thumbnail }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [theme, setTheme] = useState(() => localStorage.getItem('dockorbit_theme') || 'light');
  const [toastMessage, setToastMessage] = useState(null);

  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@dockorbit.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    plan: 'Pro Analyst',
    interests: ['Programming', 'Cybersecurity', 'Education', 'Science']
  });

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
