import { Request, Response } from 'express';
import { getAllPlayers, getPlayerbyName, getPlayerbyTeam, getPlayerbyPosition, getPlayerbyNation, getPlayersbyId } from '../db/players.js';

export const getAllPlayersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getPlayerByNameController = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await getPlayerbyName(String(req.params.name));
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json(player);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getPlayersByTeamController = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await getPlayerbyTeam(String(req.params.team));
    res.json(players);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getPlayersByPositionController = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await getPlayerbyPosition(String(req.params.position));
    res.json(players);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getPlayersByNationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await getPlayerbyNation(String(req.params.nation));
    res.json(players);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};
export const getPlayerByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await getPlayersbyId(Number(req.params.id));
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json(player);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};



