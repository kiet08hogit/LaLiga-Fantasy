import { getMatchStatsByDate,getMatchStatsByResult,getMatchStatsByTeam,getMatchStatsByYear,getAllMatchStats } from "../db/matchstats.js";


export const getAllMatchStatsController = async (req, res) => {
    try {
        const matchStats =  await getAllMatchStats();
        res.json(matchStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMatchStatsByDateController = async (req, res) => {
    try {
        const matchStats =  await getMatchStatsByDate(req.params.date);
        res.json(matchStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMatchStatsByTeamController = async (req, res) => {
    try {
        const matchStats =  await getMatchStatsByTeam(req.params.team);
        res.json(matchStats);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

};

export const getMatchStatsByYearController = async (req, res) => {
    try {
        const matchStats =  await getMatchStatsByYear(req.params.year);
        res.json(matchStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};  

export const getMatchStatsByResultController = async (req, res) => {
    try {
        const matchStats =  await getMatchStatsByResult(req.params.result); 
        res.json(matchStats);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};