import { Request, Response } from 'express';
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

export const createDreamTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, teamName, formation } = req.body;

    if (!userId || !teamName) {
      res.status(400).json({ error: 'userId and teamName are required' });
      return;
    }

    const dreamTeam = await createDreamTeam(userId, teamName, formation);
    res.status(201).json({ message: 'Dream team created successfully', data: dreamTeam });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getUserDreamTeamsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const dreamTeams = await getUserDreamTeams(Number(userId));
    res.json({ data: dreamTeams });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getDreamTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const players = await getTeamPlayers(Number(teamId));
    const stats = await getTeamTotalPoints(Number(teamId));

    res.json({
      data: {
        ...dreamTeam,
        players,
        stats,
      },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const updateDreamTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { teamName, formation, captainId, viceCaptainId } = req.body;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const updatedTeam = await updateDreamTeam(Number(teamId), {
      teamName,
      formation,
      captainId,
      viceCaptainId,
    });

    res.json({ message: 'Dream team updated successfully', data: updatedTeam });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const deleteDreamTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    await deleteDreamTeam(Number(teamId));
    res.json({ message: 'Dream team deleted successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const addPlayerToTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { playerId, position, squadOrder } = req.body;

    if (!playerId || !position) {
      res.status(400).json({ error: 'playerId and position are required' });
      return;
    }

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const teamPlayers = await getTeamPlayers(Number(teamId));
    if (teamPlayers.length >= 11) {
      res.status(400).json({ error: 'Team already has 11 players' });
      return;
    }

    const playerInTeam = teamPlayers.find(p => p.player_id === playerId);
    if (playerInTeam) {
      res.status(400).json({ error: 'Player already in team' });
      return;
    }

    const newPlayer = await addPlayerToTeam(Number(teamId), playerId, position, squadOrder);
    await updateTeamTotalPoints(Number(teamId));

    res.status(201).json({
      message: 'Player added to team successfully',
      data: newPlayer,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getTeamPlayersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const players = await getTeamPlayers(Number(teamId));
    res.json({ data: players });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const removePlayerFromTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, playerId } = req.params;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const removed = await removePlayerFromTeam(Number(teamId), Number(playerId));
    if (!removed) {
      res.status(404).json({ error: 'Player not found in team' });
      return;
    }

    await updateTeamTotalPoints(Number(teamId));

    res.json({ message: 'Player removed from team successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const updatePlayerInTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId, playerId } = req.params;
    const { position, squadOrder } = req.body;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const updated = await updatePlayerInTeam(Number(teamId), Number(playerId), {
      position,
      squadOrder,
    });

    if (!updated) {
      res.status(404).json({ error: 'Player not found in team' });
      return;
    }

    res.json({
      message: 'Player updated successfully',
      data: updated,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getTeamPointsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const dreamTeam = await getDreamTeamById(Number(teamId));
    if (!dreamTeam) {
      res.status(404).json({ error: 'Dream team not found' });
      return;
    }

    const stats = await getTeamTotalPoints(Number(teamId));
    const composition = await getTeamComposition(Number(teamId));

    res.json({
      data: {
        totalPoints: stats?.total_points || 0,
        playerCount: stats?.player_count || 0,
        avgPoints: stats?.avg_points || 0,
        composition,
      },
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};
