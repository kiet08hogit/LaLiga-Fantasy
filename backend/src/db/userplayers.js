import pool from '../db/pool.js';

export async function getUserTeam(userId) {
  const query = `
    SELECT p.* FROM players p
    INNER JOIN user_teams ut ON p.id = ut.player_id
    WHERE ut.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}
export async function addPlayerToUserTeam(userId, player_name) {
  const query = 'INSERT INTO user_teams (user_id, player_id) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [userId, playerId]);
  return result.rows[0];
}

export async function deleteAllUserPlayers() {
  const query = 'DELETE FROM user_players';
  await pool.query(query);
}

export async function deleteUserPlayerByName(name) {
  const query = 'DELETE FROM user_players WHERE player_name = $1';
  await pool.query(query, [name]);
}





