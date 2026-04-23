import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './index.scss';
import { API_BASE_URL } from '../../config';
import teamsAsset from '../../data/teams.json';

// Map DB team names → teams.json titles for logo lookup
const TEAM_ALIAS = {
  'Ath Bilbao': 'Athletic Bilbao',
  'Ath Madrid': 'Atlético Madrid',
  'Vallecano': 'Rayo Vallecano',
  'Girona': 'Girona FC',
  'Celta': 'Celta Vigo',
  'Betis': 'Real Betis',
  'Sociedad': 'Real Sociedad',
  'Valladolid': 'Real Valladolid',
  'Espanol': 'Espanyol',
};

function getTeamLogo(dbName) {
  const resolved = TEAM_ALIAS[dbName] || dbName;
  const team = teamsAsset.teams.find(
    (t) => t.title.toLowerCase() === resolved.toLowerCase()
  );
  return team?.cover || null;
}

const LiveStats = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [liveError, setLiveError] = useState(null);

  // Fetch live matches from RapidAPI
  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLiveLoading(true);
        const response = await axios.get(`${API_BASE_URL}/live-stats/live`);
        const formatted =
          response.data.response?.map((match) => ({
            id: match.fixture.id,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            homeLogo: match.teams.home.logo,
            awayLogo: match.teams.away.logo,
            homeScore: match.goals.home,
            awayScore: match.goals.away,
            status: match.fixture.status.short,
            minute: match.fixture.status.elapsed || 0,
          })) || [];
        setLiveMatches(formatted);
        setLiveError(null);
      } catch (err) {
        console.error('Error fetching live matches:', err);
        setLiveError(err.message);
        setLiveMatches([]);
      } finally {
        setLiveLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Always fetch recent matches from your DB
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setRecentLoading(true);
        const response = await axios.get(`${API_BASE_URL}/matches/`);
        // Sort by date descending, take most recent 20
        const sorted = response.data.sort(
          (a, b) => new Date(b.match_date) - new Date(a.match_date)
        );
        setRecentMatches(sorted.slice(0, 20));
      } catch (err) {
        console.error('Error fetching recent matches:', err);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecent();
  }, []);

  // Group recent matches by matchday (date)
  const groupedByDate = useMemo(() => {
    const groups = {};
    recentMatches.forEach((m) => {
      const dateKey = new Date(m.match_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return groups;
  }, [recentMatches]);

  const hasLive = liveMatches.length > 0;

  return (
    <div className="livestats-container fade-in">
      {/* ── Header ── */}
      <header className="livestats-header">
        <div className="livestats-header-text">
          <h1>Live Stats</h1>
          <p>Real-time match scores & recent results</p>
        </div>
      </header>

      {/* ── Live Matches Section ── */}
      <section className="livestats-section">
        <div className="section-label">
          <span className={`live-dot ${hasLive ? 'active' : ''}`} />
          <h2>{hasLive ? 'Live Now' : 'No Live Matches'}</h2>
        </div>

        {liveLoading ? (
          <div className="status-message">Checking for live matches...</div>
        ) : liveError ? (
          <div className="status-message muted">
            Unable to fetch live data — showing recent results below
          </div>
        ) : hasLive ? (
          <div className="matches-grid">
            {liveMatches.map((match) => (
              <div key={match.id} className="match-card live">
                <div className="match-card-status">
                  <span className="status-badge live-badge">LIVE</span>
                  <span className="match-minute">{match.minute}'</span>
                </div>
                <div className="match-card-teams">
                  <div className="match-team">
                    {match.homeLogo && (
                      <img src={match.homeLogo} alt="" className="team-logo-sm" />
                    )}
                    <span className="team-name">{match.homeTeam}</span>
                  </div>
                  <div className="match-score-display">
                    <span>{match.homeScore}</span>
                    <span className="score-sep">–</span>
                    <span>{match.awayScore}</span>
                  </div>
                  <div className="match-team away">
                    <span className="team-name">{match.awayTeam}</span>
                    {match.awayLogo && (
                      <img src={match.awayLogo} alt="" className="team-logo-sm" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="status-message muted">
            No La Liga matches are being played right now.
          </div>
        )}
      </section>

      {/* ── Recent Matches Section ── */}
      <section className="livestats-section recent-section">
        <div className="section-label">
          <h2>Recent Results</h2>
        </div>

        {recentLoading ? (
          <div className="status-message">Loading recent matches...</div>
        ) : recentMatches.length === 0 ? (
          <div className="status-message muted">No recent matches found.</div>
        ) : (
          <div className="recent-matchdays">
            {Object.entries(groupedByDate).map(([dateLabel, matches]) => (
              <div key={dateLabel} className="matchday-group">
                <h3 className="matchday-label">{dateLabel}</h3>
                <div className="matchday-cards">
                  {matches.map((match, idx) => {
                    const homeLogo = getTeamLogo(match.home_team);
                    const awayLogo = getTeamLogo(match.away_team);

                    let resultClass = '';
                    if (match.result === 'H') resultClass = 'result-home';
                    else if (match.result === 'A') resultClass = 'result-away';
                    else if (match.result === 'D') resultClass = 'result-draw';

                    return (
                      <div key={idx} className="match-card recent">
                        <div className="match-card-status">
                          <span className="status-badge ft-badge">FT</span>
                        </div>
                        <div className="match-card-teams">
                          <div className="match-team">
                            {homeLogo && (
                              <img src={homeLogo} alt="" className="team-logo-sm" />
                            )}
                            <span className="team-name">{match.home_team}</span>
                          </div>
                          <div className={`match-score-display ${resultClass}`}>
                            <span className="score-home">{match.home_goals}</span>
                            <span className="score-sep">–</span>
                            <span className="score-away">{match.away_goals}</span>
                          </div>
                          <div className="match-team away">
                            <span className="team-name">{match.away_team}</span>
                            {awayLogo && (
                              <img src={awayLogo} alt="" className="team-logo-sm" />
                            )}
                          </div>
                        </div>
                        <div className="match-card-stats">
                          <span>Shots: {match.home_shots ?? '—'} – {match.away_shots ?? '—'}</span>
                          <span>Corners: {match.home_corners ?? '—'} – {match.away_corners ?? '—'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LiveStats;
