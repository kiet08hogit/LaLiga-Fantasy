import React, { useState } from 'react';
import "./index.scss";
import AnimatedLetters from "../AnimatedLetters";

const TeamData = () => {
  const [playersToShow, setPlayersToShow] = useState(10);
  const [letterClass] = useState('text-animate');
  const playerData = [];

  return (
    <div className={`fade-in`}>
    <div className="table-container">
      <h1 className = "page-title">
        <AnimatedLetters letterClass = {letterClass} strArray={"Player Data".split("")} idx={12}/>
      </h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Age</th>
            <th>Matches Played</th>
            <th>Starts</th>
            <th>Minutes Played</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Penalties Kicked</th>
            <th>Yellow Cards</th>
            <th>Red Cards</th>
            <th>Expected Goals (xG)</th>
            <th>Expected Assists (xAG)</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {playerData.slice(0, playersToShow).map(player => (
            <tr key={player.name}>
              <td>{player.name}</td>
              <td>{player.pos}</td>
              <td>{player.age}</td>
              <td>{player.mp}</td>
              <td>{player.starts}</td>
              <td>{player.min}</td>
              <td>{player.gls}</td>
              <td>{player.ast}</td>
              <td>{player.pk}</td>
              <td>{player.crdy}</td>
              <td>{player.crdr}</td>
              <td>{player.xg}</td>
              <td>{player.xag}</td>
              <td>{player.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {playersToShow < playerData.length && (
        <button onClick={() => setPlayersToShow(playersToShow + 10)} style={{ marginTop: '10px', marginBottom: '10px' }} className={`show-more-button`}>
          Show More
        </button>
      )}
    </div>
    </div>
  );
};

export default TeamData;
