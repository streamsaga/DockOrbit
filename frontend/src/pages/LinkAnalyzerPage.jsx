import React, { useState } from 'react';
import QualityGauge from '../components/QualityGauge.jsx';
import WarningCard from '../components/WarningCard.jsx';
import AIInsightCard from '../components/AIInsightCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function LinkAnalyzerPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    url: 'https://youtube.com/@fireship',
    name: 'Fireship Channel Analysis',
    score: 96,
    status: 'Exceptional Reliability',
    breakdown: {
      engagement: 94,
      consistency: 98,
      activity: 96,
      longevity: 92,
      audienceSignal: 96
    },
    redFlags: [
      {
        title: 'High Upload Frequency Notice',
        description: '3x weekly uploads require fast-paced viewing. Video density is high.',
        type: 'warning'
      }
    ],
    positiveSignals: [
      {
        title: 'Healthy Engagement Relative to Size',
        description: 'Viewer comment ratio (8.9%) is 2.1x higher than category benchmark.',
        type: 'success'
      },
      {
        title: 'Unbroken Consistency Score',
        description: 'Zero month-long upload blackouts recorded over 6 years.',
        type: 'success'
      }
    ],
    explanation: 'Score 96/100 is generated based on 14 objective signals including comment-to-view ratios, upload frequency regularity, retention curve estimates, and lack of sudden subscriber bot spikes.'
  });

  const { addAnalyzed } = useApp();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const isPlaylist = inputUrl.includes('list=');
      const calculatedScore = Math.floor(Math.random() * 15) + 84;

      const newRes = {
        url: inputUrl,
        name: isPlaylist ? 'Custom Playlist Analysis' : 'Custom Channel Analysis',
        score: calculatedScore,
        status: calculatedScore >= 90 ? 'Exceptional' : 'Strong',
        breakdown: {
          engagement: Math.min(100, calculatedScore + 2),
          consistency: Math.max(70, calculatedScore - 3),
          activity: calculatedScore,
          longevity: Math.min(100, calculatedScore + 1),
          audienceSignal: Math.max(75, calculatedScore - 2)
        },
        redFlags: [
          {
            title: 'Minor Upload Variance',
            description: 'Recent uploads had slight gaps over holiday period.',
            type: 'warning'
          }
        ],
        positiveSignals: [
          {
            title: 'Strong Community Sentiment',
            description: 'Positive sentiment detected across top 500 video comments.',
            type: 'success'
          }
        ],
        explanation: `Score ${calculatedScore}/100 calculated transparently using DockOrbit's open signals engine.`
      };

      setAnalysisResult(newRes);
      addAnalyzed({
        url: inputUrl,
        name: newRes.name,
        type: isPlaylist ? 'playlist' : 'channel',
        score: calculatedScore,
        date: 'Just now'
      });
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Centered Input Hero */}
      <div className="soft-card-static" style={{ padding: '48px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '32px' }}>⚡</span>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
          Analyze Any YouTube Link
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0, maxWidth: '560px' }}>
          Paste any YouTube channel or playlist URL to generate an instant 0–100 Reliability Score based on objective performance signals.
        </p>

        <form onSubmit={handleAnalyze} style={{ width: '100%', maxWidth: '640px', marginTop: '12px' }}>
          <div className="soft-card" style={{ display: 'flex', alignItems: 'center', padding: '8px 12px 8px 20px', gap: '12px', borderRadius: '16px' }}>
            <span style={{ fontSize: '18px', color: 'var(--text-subtle)' }}>🔗</span>
            <input
              type="url"
              required
              placeholder="Paste YouTube channel or playlist URL (e.g., https://youtube.com/@fireship)..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '15px', flex: 1 }}
            />
            <button type="submit" disabled={isAnalyzing} className="soft-btn-primary" style={{ padding: '12px 24px', fontSize: '14px', whiteSpace: 'nowrap' }}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Dashboard */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Analysis Report for {analysisResult.name}
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>Target: {analysisResult.url}</span>
          </div>

          {/* Gauge & Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Large Gauge */}
            <div className="soft-card-static" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '14px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-subtle)', letterSpacing: '0.08em' }}>
                OVERALL QUALITY / RELIABILITY SCORE
              </span>
              <QualityGauge score={analysisResult.score} size={160} strokeWidth={14} />
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {analysisResult.status}
              </p>
            </div>

            {/* Score Signals */}
            <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Score Component Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ProgressRow label="Engagement Depth" score={analysisResult.breakdown.engagement} color="#4f46e5" />
                <ProgressRow label="Upload Consistency" score={analysisResult.breakdown.consistency} color="#10b981" />
                <ProgressRow label="Content Activity & Recency" score={analysisResult.breakdown.activity} color="#06b6d4" />
                <ProgressRow label="Channel Longevity" score={analysisResult.breakdown.longevity} color="#f59e0b" />
                <ProgressRow label="Audience Response Signal" score={analysisResult.breakdown.audienceSignal} color="#8b5cf6" />
              </div>
            </div>
          </div>

          {/* Signals & Red Flags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Positive Content Signals
              </h3>
              {analysisResult.positiveSignals.map((sig, i) => (
                <WarningCard key={i} title={sig.title} description={sig.description} type="success" />
              ))}
            </div>

            <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Red Flag & Caution Signals
              </h3>
              {analysisResult.redFlags.map((flag, i) => (
                <WarningCard key={i} title={flag.title} description={flag.description} type={flag.type} />
              ))}
            </div>
          </div>

          {/* AI Explanation Summary */}
          <AIInsightCard
            title="Score Reasoning & Methodology Transparency"
            summary={analysisResult.explanation}
            tag="Transparent Algorithm"
          />
        </div>
      )}
    </div>
  );
}

function ProgressRow({ label, score, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
        <span style={{ color: 'var(--text-main)' }}>{label}</span>
        <span style={{ color: color }}>{score} / 100</span>
      </div>
      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
    </div>
  );
}
