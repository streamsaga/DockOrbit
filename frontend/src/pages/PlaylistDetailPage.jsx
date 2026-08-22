import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PLAYLISTS } from '../data/dockorbitData.js';
import QualityGauge from '../components/QualityGauge.jsx';
import AIInsightCard from '../components/AIInsightCard.jsx';
import SentimentCard from '../components/SentimentCard.jsx';
import WarningCard from '../components/WarningCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const { isBookmarked, toggleBookmark, isComparePlaylist, toggleComparePlaylist, addRecentViewed } = useApp();

  const playlist = PLAYLISTS.find(p => p.id === id) || PLAYLISTS[0];
  const bookmarked = isBookmarked(playlist.id, 'playlist');
  const compared = isComparePlaylist(playlist.id);

  useEffect(() => {
    addRecentViewed({
      id: playlist.id,
      type: 'playlist',
      title: playlist.title,
      thumbnail: playlist.thumbnail
    });
  }, [playlist.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="soft-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            style={{ width: '220px', height: '130px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
          />

          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="quality-chip quality-chip-good">{playlist.category}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)' }}>
                {playlist.difficulty}
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', margin: 0, lineHeight: 1.25 }}>
              {playlist.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={playlist.creatorAvatar} alt={playlist.creator} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                <strong>{playlist.creator}</strong>
              </span>
              <span>•</span>
              <span>{playlist.videoCount} Videos</span>
              <span>•</span>
              <span>Total {playlist.totalDuration}</span>
            </div>

            <div className="soft-inset" style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
              <span>⏱️ Estimated Pace:</span>
              <strong style={{ color: 'var(--primary)' }}>{playlist.estimatedCompletion}</strong>
            </div>
          </div>

          {/* Actions & Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px' }}>
            <QualityGauge score={playlist.qualityScore} size={84} strokeWidth={8} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleComparePlaylist(playlist.id)}
                className="soft-btn"
                style={{ fontSize: '13px', background: compared ? 'var(--primary-light)' : 'var(--bg-surface)', color: compared ? 'var(--primary)' : 'var(--text-main)' }}
              >
                {compared ? '✓ Compared' : '📊 Compare'}
              </button>
              <button
                onClick={() => toggleBookmark(playlist.id, 'playlist')}
                className="soft-btn-primary"
                style={{ fontSize: '13px', background: bookmarked ? '#ef4444' : 'var(--primary)' }}
              >
                {bookmarked ? '❤️ Saved' : '🔖 Bookmark'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Panel */}
      <AIInsightCard
        title="AI Learning Roadmap Summary"
        summary={playlist.aiSummary}
        keyPoints={[
          "Ideal for mid-level developers transitioning to React 19 server architectures.",
          "Zero fluff, project-centric modules with code repository references.",
          "High retention rate across fundamental and advanced capstone labs."
        ]}
      />

      {/* Topic Coverage & Missing Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Topic Coverage Horizontal Bars */}
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Topic Coverage Depth
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {playlist.topicsCovered.map((topic, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-main)' }}>{topic.name}</span>
                  <span style={{ color: 'var(--primary)' }}>{topic.depth}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
                  <div style={{ width: `${topic.depth}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Topics & Sentiment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="soft-card-static" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚨</span> Topics Missing or Not Covered
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {playlist.missingTopics.map((topic, i) => (
                <WarningCard key={i} title="Missing Topic" description={topic} type="warning" />
              ))}
            </div>
          </div>

          <SentimentCard sentiment={playlist.viewerSentiment} />
        </div>
      </div>

      {/* Video Roadmap Step-by-Step */}
      <div className="soft-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Video Roadmap & Learning Journey
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Follow the recommended step-by-step sequence for maximum retention.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {playlist.videosRoadmap.map((item) => (
            <div key={item.step} className="soft-inset" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type: {item.type}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-subtle)' }}>⏱️ {item.duration}</span>
                <button className="soft-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
