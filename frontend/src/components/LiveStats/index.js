import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';

const LiveStats = () => {
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiveMatches = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/live-stats/live');
                
                // Format the API response to match your component structure
                const formattedMatches = response.data.response?.map((match) => ({
                    id: match.fixture.id,
                    homeTeam: match.teams.home.name,
                    awayTeam: match.teams.away.name,
                    homeScore: match.goals.home,
                    awayScore: match.goals.away,
                    status: match.fixture.status.short,
                    minute: match.fixture.status.elapsed || 0
                })) || [];
                
                setLiveMatches(formattedMatches);
                setError(null);
            } catch (err) {
                console.error('Error fetching live matches:', err);
                setError(err.message);
                setLiveMatches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveMatches();
        // Refresh every 30 seconds for live updates
        const interval = setInterval(fetchLiveMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="livestats-container">
            <div className="text-zone">
                <h1>Live Stats</h1>
                <p>Real-time match statistics and scores</p>
            </div>

            <div className="matches-container">
                {loading ? (
                    <p>Loading live matches...</p>
                ) : error ? (
                    <p className="error-message">Error: {error}</p>
                ) : liveMatches.length > 0 ? (
                    <div className="matches-grid">
                        {liveMatches.map(match => (
                            <div key={match.id} className="match-card">
                                <div className="match-status">
                                    <span className="status-badge">{match.status}</span>
                                    <span className="minute">{match.minute}'</span>
                                </div>
                                
                                <div className="match-score">
                                    <div className="team home-team">
                                        <h3>{match.homeTeam}</h3>
                                        <p className="score">{match.homeScore}</p>
                                    </div>
                                    
                                    <div className="divider">vs</div>
                                    
                                    <div className="team away-team">
                                        <h3>{match.awayTeam}</h3>
                                        <p className="score">{match.awayScore}</p>
                                    </div>
                                </div>

                                <div className="match-stats">
                                    <button className="stats-btn">View Stats</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-matches">No live matches at the moment</p>
                )}
            </div>
        </div>
    );
};

export default LiveStats;
