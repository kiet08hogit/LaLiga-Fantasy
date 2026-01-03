import {
  createDreamTeam,
  getUserDreamTeams,
  getDreamTeamById,
  updateDreamTeam,
  deleteDreamTeam,
  addPlayerToTeam,
  getTeamPlayers,
  removePlayerFromTeam,
  updatePlayerInTeam,
  getTeamTotalPoints,
  updateTeamTotalPoints,
  getTeamComposition,
} from '../db/dreamteam.js';

export const createDreamTeamController = async (req, res) => {
  try {
    const { userId, teamName, formation } = req.body;

    if (!userId || !teamName) {
      return res.status(400).json({ error: 'userId and teamName are required' });
    }

    const dreamTeam = await createDreamTeam(userId, teamName, formation);
    res.status(201).json({ message: 'Dream team created successfully', data: dreamTeam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserDreamTeamsController = async (req, res) => {
  try {
    const { userId } = req.params;

    const dreamTeams = await getUserDreamTeams(userId);
    res.json({ data: dreamTeams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDreamTeamController = async (req, res) => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const players = await getTeamPlayers(teamId);
    const stats = await getTeamTotalPoints(teamId);

    res.json({
      data: {
        ...dreamTeam,
        players,
        stats,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDreamTeamController = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { teamName, formation, captainId, viceCaptainId } = req.body;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const updatedTeam = await updateDreamTeam(teamId, {
      teamName,
      formation,
      captainId,
      viceCaptainId,
    });

    res.json({ message: 'Dream team updated successfully', data: updatedTeam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDreamTeamController = async (req, res) => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    await deleteDreamTeam(teamId);
    res.json({ message: 'Dream team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addPlayerToTeamController = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { playerId, position, squadOrder } = req.body;

    if (!playerId || !position) {
      return res.status(400).json({ error: 'playerId and position are required' });
    }

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const teamPlayers = await getTeamPlayers(teamId);
    if (teamPlayers.length >= 11) {
      return res.status(400).json({ error: 'Team already has 11 players' });
    }

    const playerInTeam = teamPlayers.find(p => p.player_id === playerId);
    if (playerInTeam) {
      return res.status(400).json({ error: 'Player already in team' });
    }

    const newPlayer = await addPlayerToTeam(teamId, playerId, position, squadOrder);
    await updateTeamTotalPoints(teamId);

    res.status(201).json({
      message: 'Player added to team successfully',
      data: newPlayer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamPlayersController = async (req, res) => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const players = await getTeamPlayers(teamId);
    res.json({ data: players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removePlayerFromTeamController = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const removed = await removePlayerFromTeam(teamId, playerId);
    if (!removed) {
      return res.status(404).json({ error: 'Player not found in team' });
    }

    await updateTeamTotalPoints(teamId);

    res.json({ message: 'Player removed from team successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePlayerInTeamController = async (req, res) => {
  try {
    const { teamId, playerId } = req.params;
    const { position, squadOrder } = req.body;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const updated = await updatePlayerInTeam(teamId, playerId, {
      position,
      squadOrder,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Player not found in team' });
    }

    res.json({
      message: 'Player updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamPointsController = async (req, res) => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(teamId);
    if (!dreamTeam) {
      return res.status(404).json({ error: 'Dream team not found' });
    }

    const stats = await getTeamTotalPoints(teamId);
    const composition = await getTeamComposition(teamId);

    res.json({
      data: {
        totalPoints: stats?.total_points || 0,
        playerCount: stats?.player_count || 0,
        avgPoints: stats?.avg_points || 0,
        composition,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
