import pool from './pool.js';
import { Player } from '../types/index.js';
import { mapPlayerRow } from '../utils/mapPlayerRow.js';

export const getAllPlayers = async (): Promise<Player[]> => {
  const result = await pool.query('SELECT * FROM players');
  return result.rows.map((row) => mapPlayerRow(row as Record<string, unknown>));
};

export async function getPlayersbyId(id: number): Promise<Player | undefined> {
  const query = 'SELECT * FROM players WHERE id = $1';
  const result = await pool.query(query, [id]);
  const row = result.rows[0];
  return row ? mapPlayerRow(row as Record<string, unknown>) : undefined;
}
export async function getPlayerbyName(name: string): Promise<Player | undefined> {
  const query = 'SELECT * FROM players WHERE player_name = $1';
  const result = await pool.query(query, [name]);
  const row = result.rows[0];
  return row ? mapPlayerRow(row as Record<string, unknown>) : undefined;
}

export async function getPlayerbyNation(nation: string): Promise<Player[]> {
  const query = 'SELECT * FROM players WHERE nation = $1';
  const result = await pool.query(query, [nation]);
  return result.rows.map((row) => mapPlayerRow(row as Record<string, unknown>));
}

export async function getPlayerbyTeam(team: string): Promise<Player[]> {
  const query = 'SELECT * FROM players WHERE team = $1';
  const result = await pool.query(query, [team]);
  return result.rows.map((row) => mapPlayerRow(row as Record<string, unknown>));
}

export async function getPlayerbyPosition(position: string): Promise<Player[]> {
  let positionMatches: string[] = [position];

  if (position === 'FW') {
    positionMatches = ['FW', 'LW', 'RW'];
  } else if (position === 'MF') {
    positionMatches = ['MF', 'CM', 'AM', 'DM', 'LM', 'RM'];
  } else if (position === 'DF' || position === 'FO') {
    positionMatches = ['DF', 'CB', 'LB', 'RB', 'WB'];
  } else if (position === 'GK') {
    positionMatches = ['GK'];
  }

  const conditions = positionMatches.map((_, index) => `position LIKE $${index + 1}`);
  const values = positionMatches.map(pos => `%${pos}%`);

  const query = `SELECT * FROM players WHERE ${conditions.join(' OR ')}`;
  const result = await pool.query(query, values);
  return result.rows.map((row) => mapPlayerRow(row as Record<string, unknown>));
}

