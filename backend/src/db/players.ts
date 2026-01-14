import pool from './pool.js';
import { Player } from '../types/index.js';

export const getAllPlayers = async (): Promise<Player[]> => {
  const result = await pool.query('SELECT * FROM players');
  return result.rows;
};

export async function getPlayersbyId(id: number): Promise<Player | undefined> {
  const query = 'SELECT * FROM players WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}
export async function getPlayerbyName(name: string): Promise<Player | undefined> {
  const query = 'SELECT * FROM players WHERE player_name = $1';
  const result = await pool.query(query, [name]);
  return result.rows[0];
}

export async function getPlayerbyNation(nation: string): Promise<Player[]> {
  const query = 'SELECT * FROM players WHERE nation = $1';
  const result = await pool.query(query, [nation]);
  return result.rows;
}

export async function getPlayerbyTeam(team: string): Promise<Player[]> {
  const query = 'SELECT * FROM players WHERE team = $1';
  const result = await pool.query(query, [team]);
  return result.rows;
}

export async function getPlayerbyPosition(position: string): Promise<Player[]> {
  const query = 'SELECT * FROM players WHERE position = $1';
  const result = await pool.query(query, [position]);
  return result.rows;
}

