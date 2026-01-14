import pool from "./pool.js";
import { Match } from '../types/index.js';

export const getAllMatchStats = async (): Promise<Match[]> => {
  const query = 'SELECT * FROM matches';
  const result = await pool.query(query);
    return result.rows;
};


export const getMatchStatsByDate = async (date: string): Promise<Match[]> => {
  const query = 'SELECT * FROM matches WHERE match_date = $1';
  const result = await pool.query(query, [date]);
    return result.rows;
};

export const getMatchStatsByTeam = async (team: string): Promise<Match[]> => {
    const query = 'SELECT * FROM matches WHERE home_team = $1 OR away_team = $1';
    const result = await pool.query(query, [team]);
    return result.rows;
};

export const getMatchStatsByYear = async (year: number): Promise<Match[]> => {
    const query = 'SELECT * FROM matches WHERE EXTRACT(YEAR FROM match_date) = $1';
    const result = await pool.query(query, [year]);
    return result.rows;
};

export const getMatchStatsByResult = async (matchResult: string): Promise<Match[]> => {
    const query = 'SELECT * FROM matches WHERE result = $1';
    const result = await pool.query(query, [matchResult]);
    return result.rows;
};

