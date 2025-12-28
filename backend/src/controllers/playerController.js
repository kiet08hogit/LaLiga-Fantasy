import { getAllPlayers, getPlayerbyName, getPlayerbyTeam, getPlayerbyPossition } from '../db/players.js';

export const getAllPlayersController = async (req, res) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlayerByNameController = async (req, res) => {
  try {
    const player = await getPlayerbyName(req.params.name);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlayersByTeamController = async (req, res) => {
  try {
    const players = await getPlayerbyTeam(req.params.team);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlayersByPositionController = async (req, res) => {
  try {
    const players = await getPlayerbyPossition(req.params.position);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlayersByNationController = async (req, res) => {
  try {
    const players = await getPlayerbyNation(req.params.nation);
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getPlayerByIdController = async (req, res) => {
  try {
    const player = await getPlayersbyId(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



