import React, { useEffect, useState } from 'react';
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

  const [playlist, setPlaylist] = useState(() => {
    return PLAYLISTS.find(p => p.id === id) || null;
  });
  const [loading, setLoading] = useState(!playlist);

  useEffect(() => {
    // If playlist not found in static list, attempt backend lookup or construct fallback
    if (!playlist && id) {
      setLoading(true);
      fetch(`/api/playlists/search?q=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(data => {
          const found = (data.playlists || []).find(p => p.id === id) || data.playlists?.[0];
          if (found) {
            setPlaylist(found);
          } else {
            setPlaylist(PLAYLISTS[0]);
          }
        })
        .catch(() => setPlaylist(PLAYLISTS[0]))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (playlist) {
      addRecentViewed({
        id: playlist.id,
        type: 'playlist',
        title: playlist.title || 'Playlist Details',
        thumbnail: playlist.thumbnail
      });
    }
  }, [playlist?.id]);

  if (loading || !playlist) {
    return (
      <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center' }}>
        <span style={{ fontSize: '28px' }}>⏳</span>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Loading playlist details...</p>
      </div>
    );
  }

  const bookmarked = isBookmarked(playlist.id, 'playlist');
  const compared = isComparePlaylist(playlist.id);

  const title = playlist.title || 'YouTube Learning Playlist';
  const creator = playlist.creator || playlist.channelTitle || 'YouTube Creator';
  const thumbnail = playlist.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80';
  const creatorAvatar = playlist.creatorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator)}&background=4F46E5&color=fff`;
  const videoCount = playlist.videoCount || playlist.itemCount || 12;
  const totalDuration = playlist.totalDuration || '10 hours';
  const estimatedCompletion = playlist.estimatedCompletion || '1-2 weeks';
  const qualityScore = playlist.qualityScore || playlist.score || 90;
  const category = playlist.category || 'Education';
  const difficulty = playlist.difficulty || 'All levels';

  const topicsCovered = playlist.topicsCovered || [
    { name: 'Core Foundations & Setup', depth: 95 },
    { name: 'Hands-on Projects & Labs', depth: 90 },
    { name: 'Best Practices & Deployment', depth: 85 }
  ];

  const missingTopics = playlist.missingTopics || [
    'Advanced enterprise scaling microservices require supplementary docs.'
  ];

  const aiSummary = playlist.aiSummary || 'Curated structured learning course with high retention rating and step-by-step video sequences.';

  const viewerSentiment = playlist.viewerSentiment || {
    positive: 94,
    neutral: 5,
    negative: 1
  };

  const videosRoadmap = playlist.videosRoadmap || [
    { step: 1, title: `${title} - Part 1: Getting Started`, type: 'Video Tutorial', duration: '24:15' },
    { step: 2, title: `${title} - Part 2: Building Core Features`, type: 'Hands-on Lab', duration: '42:10' },
    { step: 3, title: `${title} - Part 3: Testing & Deployment`, type: 'Project Workshop', duration: '35:00' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="soft-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={thumbnail}
            alt={title}
            style={{ width: '220px', height: '130px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
          />

          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="quality-chip quality-chip-good">{category}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)' }}>
                {difficulty}
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', margin: 0, lineHeight: 1.25 }}>
              {title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src={creatorAvatar} alt={creator} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                <strong>{creator}</strong>
              </span>
              <span>•</span>
              <span>{videoCount} Videos</span>
              <span>•</span>
              <span>Total {totalDuration}</span>
            </div>

            <div className="soft-inset" style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
              <span>⏱️ Estimated Pace:</span>
              <strong style={{ color: 'var(--primary)' }}>{estimatedCompletion}</strong>
            </div>
          </div>

          {/* Actions & Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px' }}>
            <QualityGauge score={qualityScore} size={84} strokeWidth={8} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleComparePlaylist(playlist)}
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
        summary={aiSummary}
        keyPoints={[
          "Ideal for learners seeking structured course progression.",
          "High retention rate across fundamental and advanced capstone modules.",
          "Includes real-world practical examples and references."
        ]}
      />

      {/* Topic Coverage & Missing Topics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Topic Coverage Horizontal Bars */}
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Topic Coverage Depth
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topicsCovered.map((topic, i) => {
              const name = typeof topic === 'object' ? topic.name : topic;
              const depth = typeof topic === 'object' ? topic.depth || 90 : 85;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-main)' }}>{name}</span>
                    <span style={{ color: 'var(--primary)' }}>{depth}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
                    <div style={{ width: `${depth}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Topics & Sentiment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="soft-card-static" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚨</span> Topics Missing or Not Covered
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {missingTopics.map((topic, i) => (
                <WarningCard key={i} title="Missing Topic" description={topic} type="warning" />
              ))}
            </div>
          </div>

          <SentimentCard sentiment={viewerSentiment} />
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
          {videosRoadmap.map((item, idx) => (
            <div key={item.step || idx} className="soft-inset" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.step || idx + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type: {item.type || 'Video'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-subtle)' }}>⏱️ {item.duration || '20m'}</span>
                {playlist.playlistUrl ? (
                  <a href={playlist.playlistUrl} target="_blank" rel="noopener noreferrer" className="soft-btn-primary" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>
                    Watch on YouTube ↗
                  </a>
                ) : (
                  <button className="soft-btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Watch Video
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
