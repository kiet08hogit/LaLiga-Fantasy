import React from 'react';
import './PlayerCard.scss';

const PlayerCard = ({ player, onClick, isSelected, showAdd = true }) => {
  return (
    <div 
      className={`player-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        {/* Rating Badge */}
        <div className="rating-badge">
          {player.rating}
        </div>

        {/* Position Badge */}
        <div className="position-badge">
          {player.position}
        </div>

        {/* Player Image */}
        <div className="player-image">
          <img 
            src={player.image || 'https://via.placeholder.com/150'} 
            alt={player.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>

        {/* Team Badge */}
        <div className="team-badge">
          <img 
            src={player.teamBadge || 'https://via.placeholder.com/30'} 
            alt={player.team}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/30';
            }}
          />
        </div>

        {/* Player Name */}
        <div className="player-name">
          {player.name}
        </div>

        {/* League Badge */}
        <div className="league-badge">
          <img 
            src={player.leagueBadge || 'https://via.placeholder.com/25'} 
            alt="LaLiga"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/25';
            }}
          />
        </div>
      </div>

      {showAdd && !isSelected && (
        <div className="add-overlay">
          <span className="add-icon">+</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
