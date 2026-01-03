import pool from "./pool.js";




export const getAllMatchStats = async () => {
  const query = 'SELECT * FROM matches';
  const result = await pool.query(query);
    return result.rows;
};


export const getMatchStatsByDate = async (date) => {
  const query = 'SELECT * FROM matches WHERE match_date = $1';
  const result = await pool.query(query, [date]);
    return result.rows;
};

export const getMatchStatsByTeam = async (team) => {
    const query = 'SELECT * FROM matches WHERE home_team = $1 OR away_team = $1';
    const result = await pool.query(query, [team]);
    return result.rows;
};

export const getMatchStatsByYear = async (year) => {
    const query = 'SELECT * FROM matches WHERE EXTRACT(YEAR FROM match_date) = $1';
    const result = await pool.query(query, [year]);
    return result.rows;
};

export const getMatchStatsByResult = async (matchResult) => {
    const query = 'SELECT * FROM matches WHERE result = $1';
    const result = await pool.query(query, [matchResult]);
    return result.rows;
};

