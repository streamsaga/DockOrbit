import React from 'react';
import { Link } from 'react-router-dom';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import QualityGauge from '../components/QualityGauge.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function UserDashboardPage() {
  const { user, bookmarks, recentAnalyzed, recentViewed } = useApp();

  const savedChannels = CHANNELS.filter(c => bookmarks.some(b => b.id === c.id && b.type === 'channel'));
  const savedPlaylists = PLAYLISTS.filter(p => bookmarks.some(b => b.id === p.id && b.type === 'playlist'));

  const recommendedChannels = CHANNELS.filter(c => user.interests.includes(c.category)).slice(0, 2);
  const recommendedPlaylists = PLAYLISTS.slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* User Welcome Banner */}
      <div className="soft-card-static" style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={user.avatar} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {user.plan} Account
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 4px 0' }}>
              Good Morning, {user.name}! 👋
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              You have {bookmarks.length} saved library items and 2 active learning roadmaps in progress.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/analyzer" className="soft-btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
            ⚡ Analyze New Link
          </Link>
          <Link to="/bookmarks" className="soft-btn" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
            🔖 View Saved Library
          </Link>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            📖 Continue Learning Progress
          </h2>
          <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 700 }}>2 Courses Active</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          <div className="soft-inset" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                Intermediate • 65% Completed
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>14h 25m total</span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Complete React 19 & Next.js App Router Masterclass
            </h4>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Next: Server Actions & Form Handling</span>
              <Link to="/playlist/react-full-course-2026" className="soft-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Resume
              </Link>
            </div>
          </div>

          <div className="soft-inset" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981', background: 'var(--success-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                Beginner • 40% Completed
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>3h 40m total</span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Essence of Linear Algebra (3Blue1Brown)
            </h4>
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Next: Matrix Multiplication</span>
              <Link to="/playlist/linear-algebra-3blue1brown" className="soft-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          💡 Recommended for You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            🔖 Your Saved Library Overview
          </h2>
          <Link to="/bookmarks" className="soft-btn" style={{ fontSize: '13px' }}>Manage Library →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {savedChannels.slice(0, 2).map(ch => (
            <ChannelCard key={ch.id} channel={ch} />
          ))}
          {savedPlaylists.slice(0, 1).map(pl => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </div>

      {/* Recently Analyzed Links */}
      {recentAnalyzed.length > 0 && (
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            ⚡ Recently Analyzed Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentAnalyzed.map((item, idx) => (
              <div key={idx} className="soft-inset" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
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
