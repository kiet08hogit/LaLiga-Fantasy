import React, { useState, useEffect } from 'react';
import Loader from 'react-loaders';
import AnimatedLetters from '../AnimatedLetters';
import './index.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import PlayerCard from './PlayerCard';
import playerResourceIds from '../../data/playerResourceIds.json';

const getCleanName = (name) => {
  return name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
};

const CDN_BASE = 'https://card-image.futmind.com/en/26';

const getPlayerImage = (playerName) => {
  const cleanP = getCleanName(playerName);
  const matchedKey = Object.keys(playerResourceIds).find(k => {
    const cleanK = getCleanName(k);
    return cleanK === cleanP || cleanP.includes(cleanK) || cleanK.includes(cleanP);
  });
  if (!matchedKey) return null;
  return `${CDN_BASE}/${playerResourceIds[matchedKey]}.png`;
};

const DreamTeam = () => {
  const [letterClass, setLetterClass] = useState('text-animate');
  const [formation, setFormation] = useState('4-2-1-3');
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamFilter, setTeamFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover');
    }, 3000);

    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/players`);
        setAllPlayers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setLoading(false);
      }
    };

    fetchPlayers();

    return () => clearTimeout(timer);
  }, []);

  const formations = ['4-2-1-3', '4-3-3', '4-4-2', '3-5-2', '3-4-3'];

  // Formation positions (x, y percentages for positioning)
  const formationLayouts = {
    '4-2-1-3': [
      { position: 'GK', x: 50, y: 90 },
      { position: 'LB', x: 15, y: 70 },
      { position: 'CB', x: 37, y: 75 },
      { position: 'CB', x: 63, y: 75 },
      { position: 'RB', x: 85, y: 70 },
      { position: 'CDM', x: 35, y: 50 },
      { position: 'CDM', x: 65, y: 50 },
      { position: 'CAM', x: 50, y: 30 },
      { position: 'LW', x: 20, y: 15 },
      { position: 'ST', x: 50, y: 10 },
      { position: 'RW', x: 80, y: 15 },
    ],
    '4-3-3': [
      { position: 'GK', x: 50, y: 90 },
      { position: 'LB', x: 15, y: 70 },
      { position: 'CB', x: 37, y: 75 },
      { position: 'CB', x: 63, y: 75 },
      { position: 'RB', x: 85, y: 70 },
      { position: 'CM', x: 25, y: 50 },
      { position: 'CM', x: 50, y: 50 },
      { position: 'CM', x: 75, y: 50 },
      { position: 'LW', x: 20, y: 15 },
      { position: 'ST', x: 50, y: 10 },
      { position: 'RW', x: 80, y: 15 },
    ],
    '4-4-2': [
      { position: 'GK', x: 50, y: 90 },
      { position: 'LB', x: 15, y: 70 },
      { position: 'CB', x: 37, y: 75 },
      { position: 'CB', x: 63, y: 75 },
      { position: 'RB', x: 85, y: 70 },
      { position: 'LM', x: 15, y: 45 },
      { position: 'CM', x: 37, y: 50 },
      { position: 'CM', x: 63, y: 50 },
      { position: 'RM', x: 85, y: 45 },
      { position: 'ST', x: 37, y: 15 },
      { position: 'ST', x: 63, y: 15 },
    ],
    '3-5-2': [
      { position: 'GK', x: 50, y: 93 },
      { position: 'CB', x: 25, y: 72 },
      { position: 'CB', x: 50, y: 72 },
      { position: 'CB', x: 75, y: 72 },
      { position: 'LM', x: 10, y: 50 },
      { position: 'CM', x: 30, y: 50 },
      { position: 'CM', x: 50, y: 50 },
      { position: 'CM', x: 70, y: 50 },
      { position: 'RM', x: 90, y: 50 },
      { position: 'ST', x: 37, y: 15 },
      { position: 'ST', x: 63, y: 15 },
    ],
    '3-4-3': [
      { position: 'GK', x: 50, y: 93 },
      { position: 'CB', x: 25, y: 72 },
      { position: 'CB', x: 50, y: 72 },
      { position: 'CB', x: 75, y: 72 },
      { position: 'LM', x: 20, y: 50 },
      { position: 'CM', x: 40, y: 50 },
      { position: 'CM', x: 60, y: 50 },
      { position: 'RM', x: 80, y: 50 },
      { position: 'LW', x: 20, y: 15 },
      { position: 'ST', x: 50, y: 10 },
      { position: 'RW', x: 80, y: 15 },
    ],
  };

  // Derive unique teams and positions
  const uniqueTeams = [...new Set(allPlayers.map(p => p.team))].filter(Boolean).sort();
  const uniquePositions = [...new Set(allPlayers.map(p => p.position))].filter(Boolean).sort();

  // Filter players
  const filteredPlayers = allPlayers.filter(player => {
    const matchesTeam = teamFilter ? player.team === teamFilter : true;
    const matchesPos = positionFilter ? player.position === positionFilter : true;
    return matchesTeam && matchesPos;
  });

  return (
    <>
      <div className="container dreamteam-page">
        <h1 className="page-title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Dream Team Builder'.split('')}
            idx={15}
          />
        </h1>

        <div className="dreamteam-container">
          {/* Left Side - Team Builder */}
          <div className="team-builder-section">
            <div className="builder-header">
              <h2>Dreamteam Builder</h2>
              <div className="formation-selector">
                <label>Formation</label>
                <select
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                  className="formation-dropdown"
                >
                  {formations.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Football Pitch */}
            <div className="football-pitch">
              <div className="formation-display">{formation}</div>

              {/* Player slots based on formation */}
              {formationLayouts[formation].map((slot, index) => (
                <div
                  key={index}
                  className="player-slot"
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                  }}
                >
                  <div className="empty-card">
                    <img src="/playercard.png" alt="Empty slot" />
                    <div className="position-label">{slot.position}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Squad Stats - Will be implemented later */}
            {/* <div className="squad-stats">
              <div className="stat-item">
                <span className="stat-label">Squad Rating</span>
                <span className="stat-value">0</span>
              </div>
            </div> */}
          </div>

          {/* Right Side - Available Players */}
          <div className="players-section">
            <div className="players-header">
              <h2>Available Players - LaLiga</h2>
              <div className="filters flex gap-2 mt-2">
                <select 
                  value={teamFilter} 
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="bg-gray-800 text-white rounded p-1 text-sm border border-gray-600"
                >
                  <option value="">All Teams</option>
                  {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select 
                  value={positionFilter} 
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="bg-gray-800 text-white rounded p-1 text-sm border border-gray-600"
                >
                  <option value="">All Positions</option>
                  {uniquePositions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="players-grid">
              {loading ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Loading players...</p>
              ) : filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={{
                      name: player.player_name,
                      position: player.position,
                      team: player.team,
                      rating: 0, // Placeholder as API doesn't have rating yet
                      image: getPlayerImage(player.player_name)
                    }}
                    showAdd={true}
                  />
                ))
              ) : (
                <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
                  No players found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default DreamTeam;