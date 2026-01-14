import { Request, Response } from 'express';
import { getMatchStatsByDate, getMatchStatsByResult, getMatchStatsByTeam, getMatchStatsByYear, getAllMatchStats } from '../db/matchstats.js';


export const getAllMatchStatsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const matchStats =  await getAllMatchStats();
        res.json(matchStats);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const getMatchStatsByDateController = async (req: Request, res: Response): Promise<void> => {
    try {
        const matchStats =  await getMatchStatsByDate(String(req.params.date));
        res.json(matchStats);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

export const getMatchStatsByTeamController = async (req: Request, res: Response): Promise<void> => {
    try {
        const matchStats =  await getMatchStatsByTeam(String(req.params.team));
        res.json(matchStats);
    }
    catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }

};

export const getMatchStatsByYearController = async (req: Request, res: Response): Promise<void> => {
    try {
        const matchStats =  await getMatchStatsByYear(Number(req.params.year));
        res.json(matchStats);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};  

export const getMatchStatsByResultController = async (req: Request, res: Response): Promise<void> => {
    try {
        const matchStats =  await getMatchStatsByResult(String(req.params.result)); 
        res.json(matchStats);
    }
    catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};