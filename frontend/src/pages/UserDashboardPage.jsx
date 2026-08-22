import React from 'react';
import { Link } from 'react-router-dom';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import QualityGauge from '../components/QualityGauge.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function UserDashboardPage() {
  const { user, bookmarks, recentAnalyzed } = useApp();

  const savedChannels = CHANNELS.filter(c => bookmarks.some(b => b.id === c.id && (b.type === 'channel' || !b.type)));
  const savedPlaylists = PLAYLISTS.filter(p => bookmarks.some(b => b.id === p.id && b.type === 'playlist'));

  const recommendedChannels = CHANNELS.slice(0, 2);
  const recommendedPlaylists = PLAYLISTS.slice(0, 2);

  const userAvatar = user?.avatarData || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '100%' }}>
      {/* User Welcome Banner */}
      <div className="soft-card-static" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: 0 }}>
          {user ? (
            <img src={userAvatar} alt={user.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', flexShrink: 0 }}>
              👤
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {user ? (user.plan || 'Free Account') : 'Guest Explorer'}
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 4px 0', wordBreak: 'break-word' }}>
              {user ? `Welcome back, ${user.name}! 👋` : 'Welcome to DockOrbit! 👋'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
              {user
                ? `You have ${bookmarks.length} item${bookmarks.length === 1 ? '' : 's'} saved in your library.`
                : 'Sign in to sync your saved channels, playlists, and custom analysis.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {user ? (
            <>
              <Link to="/analyzer" className="soft-btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
                ⚡ Analyze New Link
              </Link>
              <Link to="/bookmarks" className="soft-btn" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
                🔖 View Saved Library ({bookmarks.length})
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="soft-btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
                🔑 Sign In / Account
              </Link>
              <Link to="/analyzer" className="soft-btn" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
                ⚡ Analyze Link
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            📖 Continue Learning Progress
          </h2>
          <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 700 }}>
            {savedPlaylists.length > 0 ? `${savedPlaylists.length} Saved Playlists` : '0 Active Courses'}
          </span>
        </div>

        {savedPlaylists.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {savedPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        ) : (
          <div className="soft-inset" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🎯</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                No active learning roadmaps yet
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '480px' }}>
                Discover top structured playlists in development, science, and design to start tracking your learning progress.
              </p>
            </div>
            <Link to="/playlists" className="soft-btn-primary" style={{ padding: '8px 16px', fontSize: '13px', marginTop: '4px' }}>
              Explore Playlists →
            </Link>
          </div>
        )}
      </div>

      {/* Recommended for You */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          💡 Recommended for You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {recommendedChannels.map(ch => (
            <ChannelCard key={ch.id} channel={ch} />
          ))}
          {recommendedPlaylists.map(pl => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </div>

      {/* Saved Channels & Playlists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            🔖 Your Saved Library Overview
          </h2>
          <Link to="/bookmarks" className="soft-btn" style={{ fontSize: '13px' }}>Manage Library →</Link>
        </div>

        {savedChannels.length > 0 || savedPlaylists.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {savedChannels.slice(0, 2).map(ch => (
              <ChannelCard key={ch.id} channel={ch} />
            ))}
            {savedPlaylists.slice(0, 2).map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        ) : (
          <div className="soft-inset" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>📚</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                Your saved library is empty
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Bookmark channels or playlists while browsing to build your personal learning library.
              </p>
            </div>
            <Link to="/channels" className="soft-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Browse Channels
            </Link>
          </div>
        )}
      </div>

      {/* Recently Analyzed Links */}
      {recentAnalyzed.length > 0 && (
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            ⚡ Recently Analyzed Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentAnalyzed.map((item, idx) => (
              <div key={idx} className="soft-inset" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>{item.url} • {item.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <QualityGauge score={item.score} size={42} strokeWidth={5} showLabel={false} />
                  <Link to="/analyzer" className="soft-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
