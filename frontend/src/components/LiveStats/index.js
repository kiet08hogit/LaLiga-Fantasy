import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './index.scss';
import { API_BASE_URL } from '../../config';

const LiveStats = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [liveError, setLiveError] = useState(null);
  const [recentError, setRecentError] = useState(null);

  // ── Fetch live matches ──
  useEffect(() => {
    const fetchLive = async () => {
      try {
        setLiveLoading(true);
        const res = await axios.get(`${API_BASE_URL}/live-stats/live`);
        setLiveMatches(res.data.matches || []);
        setLiveError(null);
      } catch (err) {
        console.error('Error fetching live matches:', err);
        setLiveError(err.message);
        setLiveMatches([]);
      } finally {
        setLiveLoading(false);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // ── Fetch recent finished matches ──
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setRecentLoading(true);
        const res = await axios.get(`${API_BASE_URL}/live-stats/recent`);
        setRecentMatches(res.data.matches || []);
        setRecentError(null);
      } catch (err) {
        console.error('Error fetching recent matches:', err);
        setRecentError(err.message);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecent();
  }, []);

  // ── Group recent matches by matchday ──
  const groupedByMatchday = useMemo(() => {
    const groups = {};
    recentMatches.forEach((m) => {
      const key = `Matchday ${m.matchday}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [recentMatches]);

  const hasLive = liveMatches.length > 0;

  return (
    <div className="livestats-container fade-in">
      {/* ── Header ── */}
      <header className="livestats-header">
        <h1>Live Stats</h1>
        <p>Real-time La Liga match scores & recent results</p>
      </header>

      {/* ── Live Matches ── */}
      <section className="livestats-section">
        <div className="section-label">
          <span className={`live-dot ${hasLive ? 'active' : ''}`} />
          <h2>{hasLive ? 'Live Now' : 'No Live Matches'}</h2>
        </div>

        {liveLoading ? (
          <div className="status-message">Checking for live matches…</div>
        ) : hasLive ? (
          <div className="matches-grid">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} isLive />
            ))}
          </div>
        ) : (
          <div className="status-message muted">
            No La Liga matches are being played right now.
          </div>
        )}
      </section>

      {/* ── Recent Results ── */}
      <section className="livestats-section recent-section">
        <div className="section-label">
          <h2>Recent Results</h2>
        </div>

        {recentLoading ? (
          <div className="status-message">Loading recent matches…</div>
        ) : recentError ? (
          <div className="status-message muted">
            Unable to load recent matches. Check your API key configuration.
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="status-message muted">No recent matches found.</div>
        ) : (
          <div className="recent-matchdays">
            {Object.entries(groupedByMatchday).map(([label, matches]) => (
              <div key={label} className="matchday-group">
                <h3 className="matchday-label">{label}</h3>
                <div className="matchday-cards">
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// ── Match Card component ──
function MatchCard({ match, isLive = false }) {
  const [prediction, setPrediction] = useState(null);
  
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};
  const score = match.score || {};
  const ft = score.fullTime || {};

  // Fetch AI Prediction for live matches
  useEffect(() => {
    if (!isLive) return;

    // We don't get live shots/corners from the free football-data API,
    // so we simulate plausible in-game stats based on the current score
    // to feed into our Random Forest FastAPI model.
    const mockStats = {
      HS: (ft.home || 0) * 3 + Math.floor(Math.random() * 5),
      AS: (ft.away || 0) * 3 + Math.floor(Math.random() * 5),
      HST: (ft.home || 0) + Math.floor(Math.random() * 3),
      AST: (ft.away || 0) + Math.floor(Math.random() * 3),
      HF: Math.floor(Math.random() * 15),
      AF: Math.floor(Math.random() * 15),
      HC: Math.floor(Math.random() * 8),
      AC: Math.floor(Math.random() * 8),
      HY: Math.floor(Math.random() * 4),
      AY: Math.floor(Math.random() * 4),
    };

    const fetchPrediction = async () => {
      try {
        const res = await axios.post('http://localhost:8000/predict', mockStats);
        setPrediction(res.data);
      } catch (err) {
        console.error("Failed to fetch prediction:", err.message);
      }
    };

    fetchPrediction();
    const interval = setInterval(fetchPrediction, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [isLive, ft.home, ft.away]);

  // Determine status label
  let statusLabel = 'FT';
  let statusClass = 'ft-badge';
  if (isLive || match.status === 'IN_PLAY' || match.status === 'PAUSED') {
    statusLabel = match.status === 'PAUSED' ? 'HT' : 'LIVE';
    statusClass = 'live-badge';
  } else if (match.status === 'SCHEDULED' || match.status === 'TIMED') {
    const d = new Date(match.utcDate);
    statusLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    statusClass = 'scheduled-badge';
  }

  // Match date
  const matchDate = new Date(match.utcDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`match-card ${isLive ? 'live' : 'recent'}`}>
      <div className="match-card-status">
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
        <span className="match-date">{matchDate}</span>
        {isLive && match.minute && (
          <span className="match-minute">{match.minute}'</span>
        )}
      </div>

      <div className="match-card-teams">
        <div className="match-team">
          {home.crest && (
            <img src={home.crest} alt="" className="team-logo-sm" />
          )}
          <span className="team-name">{home.shortName || home.name}</span>
        </div>

        <div className="match-score-display">
          <span>{ft.home ?? '–'}</span>
          <span className="score-sep">–</span>
          <span>{ft.away ?? '–'}</span>
        </div>

        <div className="match-team away">
          <span className="team-name">{away.shortName || away.name}</span>
          {away.crest && (
            <img src={away.crest} alt="" className="team-logo-sm" />
          )}
        </div>
      </div>

      {score.halfTime && (ft.home !== null) && (
        <div className="match-card-stats">
          <span>HT: {score.halfTime.home ?? '–'} – {score.halfTime.away ?? '–'}</span>
          {match.venue && <span>{match.venue}</span>}
        </div>
      )}

      {isLive && prediction && (
        <div className="match-prediction">
          <div className="pred-header">
            <span className="pred-label"> Match Prediction</span>
          </div>
          <div className="pred-bar-container">
            <div 
              className="pred-bar home-bar" 
              style={{ width: `${(prediction.home_win_probability * 100).toFixed(1)}%` }}
            >
              {(prediction.home_win_probability * 100).toFixed(0)}%
            </div>
            <div 
              className="pred-bar away-bar"
              style={{ width: `${((1 - prediction.home_win_probability) * 100).toFixed(1)}%` }}
            >
              {((1 - prediction.home_win_probability) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveStats;
