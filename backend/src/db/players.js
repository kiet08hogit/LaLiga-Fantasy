import pool from './pool.js';

export const getAllPlayers = async () => {
  const result = await pool.query('SELECT * FROM players');
  return result.rows;
};

export async function getPlayersbyId(id) {
  const query = 'SELECT * FROM players WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}
export async function getPlayerbyName(name) {
  const query = 'SELECT * FROM players WHERE player_name = $1';
  const result = await pool.query(query, [name]);
  return result.rows[0];
}

export async function getPlayerbyNation(nation) {
  const query = 'SELECT * FROM players WHERE nation = $1';
  const result = await pool.query(query, [nation]);
  return result.rows;
}

export async function getPlayerbyTeam(team) {
  const query = 'SELECT * FROM players WHERE team = $1';
  const result = await pool.query(query, [team]);
  return result.rows;
}

export async function getPlayerbyPosition(position) {
  const query = 'SELECT * FROM players WHERE position = $1';
  const result = await pool.query(query, [position]);
  return result.rows;
}

