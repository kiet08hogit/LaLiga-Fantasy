import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "react-loaders";
import "./index.scss";
import AnimatedLetters from "../AnimatedLetters";
import teamData from "../../data/teams.json";

const MatchStats = () => {
    const navigate = useNavigate();
    const [letterClass, setLetterClass] = useState('text-animate');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [dateRange, setDateRange] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass("text-animate-hover");
        }, 3000); 

        return () => { 
            clearTimeout(timer);
        }
    }, []);

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleDateRangeChange = (event) => {
        setDateRange(event.target.value);
    };

    const handleShowStats = () => {
        if (selectedTeam) {
            navigate(`/teamdata?team=${selectedTeam}&dateRange=${dateRange}`);
        }
    };

    return (
        <>
            <div className="container match-stats-page">
                <div className="text-zone">
                    <h1>
                        <AnimatedLetters 
                            letterClass={letterClass} 
                            strArray={"Match Stats".split("")} 
                            idx={12} 
                        />
                    </h1>
                    <p>Filter and view detailed match statistics</p>

                    <div className="filter-container">
                        <div className="filter-group">
                            <label htmlFor="team-select">Select Team:</label>
                            <select 
                                id="team-select" 
                                value={selectedTeam} 
                                onChange={handleTeamChange}
                                className="filter-input"
                            >
                                <option value="">-- Choose a Team --</option>
                                {teamData.teams.map((team, idx) => (
                                    <option key={idx} value={team.title}>
                                        {team.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="date-range">Date Range:</label>
                            <select 
                                id="date-range" 
                                value={dateRange} 
                                onChange={handleDateRangeChange}
                                className="filter-input"
                            >
                                <option value="all">All Matches</option>
                                <option value="home">Home Matches</option>
                                <option value="away">Away Matches</option>
                                <option value="recent">Win</option>
                                <option value="recent">Loss</option>
                                <option value="recent">Draw</option>    
                            </select>
                        </div>

                        <button 
                            className="view-button" 
                            onClick={handleShowStats}
                            disabled={!selectedTeam}
                        >
                            View Stats
                        </button>
                    </div>

                    {selectedTeam && (
                        <div className="stats-info">
                            <p>Ready to view stats for <strong>{selectedTeam}</strong></p>
                        </div>
                    )}
                </div>
            </div>
            <Loader type="pacman" />
        </>
    );
};

export default MatchStats;
