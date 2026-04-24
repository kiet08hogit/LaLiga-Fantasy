import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './index.scss';
import AnimatedLetters from '../AnimatedLetters';
import teamsAsset from '../../data/teams.json';
import { API_BASE_URL } from '../../config';
import { PlayerDashboard } from './PlayerDashboard';
import { MatchDashboard } from './MatchDashboard';

const POSITION_LABELS = {
  GK: 'Goalkeepers',
  DF: 'Defenders',
  MF: 'Midfielders',
  FW: 'Forwards',
};

const TeamData = () => {
  const letterClass = 'text-animate';
  const [searchParams, setSearchParams] = useSearchParams();
  const teamParam = searchParams.get('team');
  const positionParam = searchParams.get('position');
  const nameParam = searchParams.get('name');
  const viewParam = searchParams.get('view');

  // Tab state: 'players' or 'matches'
  const [activeTab, setActiveTab] = useState(viewParam === 'matches' ? 'matches' : 'players');

  // Player data state
  const [playerData, setPlayerData] = useState([]);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [playerError, setPlayerError] = useState(null);

  // Match data state
  const [matchData, setMatchData] = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [matchError, setMatchError] = useState(null);

  const teamMeta = useMemo(() => {
    if (!teamParam) return null;
    const raw = decodeURIComponent(teamParam).trim();
    const exact = teamsAsset.teams.find((t) => t.title === raw);
    if (exact) return exact;
    const lower = raw.toLowerCase();
    return teamsAsset.teams.find((t) => t.title.toLowerCase() === lower) ?? null;
  }, [teamParam]);

  const teamDisplayName = teamMeta
    ? teamMeta.title
    : teamParam
      ? decodeURIComponent(teamParam).trim()
      : null;

  // Friendly label for position filtering
  const positionDisplayName = positionParam
    ? POSITION_LABELS[positionParam.toUpperCase()] || positionParam
    : null;

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    if (tab === 'matches') {
      params.set('view', 'matches');
    } else {
      params.delete('view');
    }
    setSearchParams(params, { replace: true });
  };

  // Sync tab from URL on mount / param change
  useEffect(() => {
    setActiveTab(viewParam === 'matches' ? 'matches' : 'players');
  }, [viewParam]);

  // Fetch player data — supports team, position, and name filters
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setPlayerLoading(true);
        let url = `${API_BASE_URL}/players/`;
        if (teamParam) {
          url = `${API_BASE_URL}/players/team/${encodeURIComponent(teamParam)}`;
        } else if (positionParam) {
          url = `${API_BASE_URL}/players/position/${encodeURIComponent(positionParam)}`;
        } else if (nameParam) {
          url = `${API_BASE_URL}/players/name/${encodeURIComponent(nameParam)}`;
        }
        const response = await axios.get(url);
        setPlayerData(response.data);
        setPlayerLoading(false);
      } catch (err) {
        console.error('Error fetching players:', err);
        setPlayerError('Failed to load player data');
        setPlayerLoading(false);
      }
    };

    fetchPlayers();
  }, [teamParam, positionParam, nameParam]);

  // Fetch match data
  useEffect(() => {
    const fetchMatches = async () => {
      if (positionParam || nameParam) {
        setMatchLoading(false);
        return;
      }

      try {
        setMatchLoading(true);
        let url = `${API_BASE_URL}/matches/`;
        if (teamParam) {
          url = `${API_BASE_URL}/matches/team/${encodeURIComponent(teamParam)}`;
        }
        const response = await axios.get(url);
        setMatchData(response.data);
        setMatchLoading(false);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setMatchError('Failed to load match data');
        setMatchLoading(false);
      }
    };

    fetchMatches();
  }, [teamParam]);

  // Determine the page heading
  const headingText = teamDisplayName
    ? teamDisplayName
    : positionDisplayName
      ? positionDisplayName
      : nameParam
        ? `Results for "${nameParam}"`
        : activeTab === 'players'
          ? 'Player Stats'
          : 'Match Stats';

  return (
    <div className="fade-in team-data-page">
      <div className="team-data-shell w-full max-w-none px-2 pb-12 pt-12 sm:px-4 sm:pt-14 lg:px-6 lg:pt-16 xl:px-8">
        <header className="team-data-header mb-3 sm:mb-4">
          {teamMeta ? (
            <div className="team-data-title-row">
              <img
                src={teamMeta.cover}
                alt={`${teamMeta.title} crest`}
                className="team-data-logo"
                width={72}
                height={72}
                decoding="async"
              />
              <div className="team-data-title-text">
                <h1 className="team-data-name">{teamMeta.title}</h1>
                <p className="team-data-sub">
                  {activeTab === 'players' ? 'Player stats' : 'Match stats'}
                </p>
              </div>
            </div>
          ) : teamParam ? (
            <div className="team-data-title-row">
              <div className="team-data-title-text">
                <h1 className="team-data-name">{decodeURIComponent(teamParam).trim()}</h1>
                <p className="team-data-sub">
                  {activeTab === 'players' ? 'Player stats' : 'Match stats'}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="page-title text-white">
              <AnimatedLetters
                letterClass={letterClass}
                strArray={headingText.split('')}
                idx={12}
              />
            </h1>
          )}

          {/* ── Tab toggle ── */}
          {(!positionParam && !nameParam) && (
            <div className="team-data-tabs">
              <button
                type="button"
                className={`team-data-tab ${activeTab === 'players' ? 'active' : ''}`}
                onClick={() => handleTabChange('players')}
              >
                Player Data
              </button>
              <button
                type="button"
                className={`team-data-tab ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => handleTabChange('matches')}
              >
                Match Stats
              </button>
            </div>
          )}
        </header>

        {/* ── Player Data View ── */}
        {activeTab === 'players' && (
          <>
            {playerLoading ? (
              <div className="loading-message text-white/80">Loading player data...</div>
            ) : playerError ? (
              <div className="error-message text-red-200">{playerError}</div>
            ) : (
              <PlayerDashboard data={playerData} />
            )}
          </>
        )}

        {/* ── Match Stats View ── */}
        {activeTab === 'matches' && (
          <>
            {matchLoading ? (
              <div className="loading-message text-white/80">Loading match data...</div>
            ) : matchError ? (
              <div className="error-message text-red-200">{matchError}</div>
            ) : (
              <MatchDashboard data={matchData} teamName={teamDisplayName} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamData;
