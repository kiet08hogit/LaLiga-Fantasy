import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import "./index.scss";
import AnimatedLetters from "../AnimatedLetters";
import { API_BASE_URL } from '../../config';


const MatchData = () => {
    const [matchesToShow, setMatchesToShow] = useState(10);
    const [letterClass, setLetterClass] = useState('text-animate');
    const [matchData, setMatchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const teamParam = searchParams.get('team');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                // Default to all matches if no team is selected, but usually we expect a team
                let url = `${API_BASE_URL}/matches/`;
                if (teamParam) {
                    url = `${API_BASE_URL}/matches/team/${teamParam}`;
                }
                const response = await axios.get(url);
                setMatchData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching matches:", err);
                setError("Failed to load match data");
                setLoading(false);
            }
        };

        fetchMatches();
    }, [teamParam]);

    return (
        <div className="fade-in match-data-page">
            <div className="table-container">
                <h1 className="page-title">
                    <AnimatedLetters letterClass={letterClass} strArray={teamParam ? `${teamParam} Matches`.split("") : "Match Stats".split("")} idx={12} />
                </h1>
                {loading ? (
                    <div className="loading-message">Loading match data...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Home Team</th>
                                    <th>Home Goals</th>
                                    <th>Away Team</th>
                                    <th>Away Goals</th>
                                    <th>Result</th>
                                    <th>Home Shots</th>
                                    <th>Away Shots</th>
                                    <th>Home Yellow Cards</th>
                                    <th>Away Yellow Cards</th>
                                    <th>Home Red Cards</th>
                                    <th>Away Red Cards</th>
                                    <th>Home Fouls</th>
                                    <th>Away Fouls</th>

                                </tr>
                            </thead>
                            <tbody>
                                {matchData.slice(0, matchesToShow).map((match) => (
                                    <tr key={match.id}>
                                        <td>{new Date(match.match_date).toLocaleDateString()}</td>
                                        <td>{match.home_team}</td>
                                        <td>{match.home_goals}</td>
                                        <td>{match.away_team}</td>
                                        <td>{match.away_goals}</td>
                                        <td>{match.result}</td>
                                        <td>{match.home_shots || '0'}</td>
                                        <td>{match.away_shots || '0'}</td>
                                        <td>{match.home_yellow_cards || '0'}</td>
                                        <td>{match.away_yellow_cards || '0'}</td>
                                        <td>{match.home_red_cards || '0'}</td>
                                        <td>{match.away_red_cards || '0'}</td>
                                        <td>{match.home_fouls || '0'}</td>
                                        <td>{match.away_fouls || '0'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {matchesToShow < matchData.length && (
                            <button
                                onClick={() => setMatchesToShow(matchesToShow + 10)}
                                className="show-more-button"
                                style={{ marginTop: '10px', marginBottom: '10px' }}
                            >
                                Show More
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MatchData;
