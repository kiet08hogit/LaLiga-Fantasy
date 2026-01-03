import { getUserTeam, addPlayerToUserTeam } from '../db/dreamteam.js';
import pool from '../db/pool.js';

export const getUserTeamController = async (req, res) => {
  try {
    const userId = req.user.id;
    const team = await getUserTeam(userId);
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addPlayerToTeamController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerId } = req.body;
    if (!playerId) {
      return res.status(400).json({ error: 'playerId is required' });
    }
    const result = await addPlayerToUserTeam(userId, playerId);
    res.json({ message: 'Player added to your team', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removePlayerFromTeamController = async (req, res) => {
  try {
    const { userId, playerId } = req.params;
    const query = 'DELETE FROM user_teams WHERE user_id = $1 AND player_id = $2 RETURNING *';
    const result = await pool.query(query, [userId, playerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Player not found in user team' });
    }
    res.json({ message: 'Player removed from your team', result: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
