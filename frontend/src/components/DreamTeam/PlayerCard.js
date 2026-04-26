import React from 'react';
import './PlayerCard.scss';

const PlayerCard = ({ player, onClick, isSelected, showAdd = true }) => {
  return (
    <div 
      className={`player-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {/* Card image area */}
      <div className="card-inner">
        {player.image ? (
          <img 
            src={player.image} 
            alt={player.name}
            className="fut-card-full-image"
            onError={(e) => {
              // If image fails, show fallback bg with position text
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback UI — always rendered, hidden when image exists */}
        <div
          className="card-fallback"
          style={{ display: player.image ? 'none' : 'flex' }}
        >
          <div className="position-badge">{player.position}</div>
          <div className="player-image">
            <img src="/playercard.png" alt={player.name} />
          </div>
        </div>

        {showAdd && !isSelected && (
          <div className="add-overlay">
            <span className="add-icon">+</span>
          </div>
        )}
      </div>

      {/* Player name always shown below the card */}
      <div className="card-name-label">
        {player.name}
      </div>
    </div>
  );
};

export default PlayerCard;
