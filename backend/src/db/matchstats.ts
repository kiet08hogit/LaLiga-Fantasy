import pool from "./pool.js";
import { Match } from '../types/index.js';

const mapMatchRow = (row: any): Match => ({
  ...row,
  home_score: row.fthg,
  away_score: row.ftag,
  result: row.ftr,
  home_shots: row.hs,
  away_shots: row.away_shots,
  home_yellow_cards: row.hy,
  away_yellow_cards: row.ay,
  home_red_cards: row.hr,
  away_red_cards: row.ar,
});

export const getAllMatchStats = async (): Promise<Match[]> => {
  const query = 'SELECT * FROM laliga_matches_24_25';
  const result = await pool.query(query);
  return result.rows.map(mapMatchRow);
};

export const getMatchStatsByDate = async (date: string): Promise<Match[]> => {
  const query = 'SELECT * FROM laliga_matches_24_25 WHERE match_date = $1';
  const result = await pool.query(query, [date]);
  return result.rows.map(mapMatchRow);
};

export const getMatchStatsByTeam = async (team: string): Promise<Match[]> => {
  const query = 'SELECT * FROM laliga_matches_24_25 WHERE home_team = $1 OR away_team = $1';
  const result = await pool.query(query, [team]);
  return result.rows.map(mapMatchRow);
};

export const getMatchStatsByYear = async (year: number): Promise<Match[]> => {
  const query = 'SELECT * FROM laliga_matches_24_25 WHERE EXTRACT(YEAR FROM match_date) = $1';
  const result = await pool.query(query, [year]);
  return result.rows.map(mapMatchRow);
};

export const getMatchStatsByResult = async (matchResult: string): Promise<Match[]> => {
  const query = 'SELECT * FROM laliga_matches_24_25 WHERE ftr = $1';
  const result = await pool.query(query, [matchResult]);
  return result.rows.map(mapMatchRow);
};

