import type { Player } from '../types/index.js';

type Row = Record<string, unknown>;

/** Case-insensitive lookup for DB rows (pg returns mostly lowercase keys). */
function buildLowerKeyMap(row: Row): Map<string, unknown> {
  return new Map(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]));
}

function pickNum(row: Row, keys: string[]): number {
  const m = buildLowerKeyMap(row);
  for (const key of keys) {
    const v = m.get(key.toLowerCase());
    if (v === null || v === undefined || v === '') continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function pickStr(row: Row, keys: string[]): string {
  const m = buildLowerKeyMap(row);
  for (const key of keys) {
    const v = m.get(key.toLowerCase());
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (s !== '') return s;
  }
  return '';
}

function pickOptNum(row: Row, keys: string[]): number | undefined {
  const m = buildLowerKeyMap(row);
  for (const key of keys) {
    const v = m.get(key.toLowerCase());
    if (v === null || v === undefined || v === '') continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function pickAge(row: Row): number | string {
  const m = buildLowerKeyMap(row);
  const v = m.get('age');
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'string') return v.trim();
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
}

/**
 * Normalizes a raw `players` row to the API `Player` shape.
 * Handles alternate column names from imports / older schemas.
 */
export function mapPlayerRow(row: Row): Player {
  const id = pickNum(row, ['id']);
  return {
    id,
    player_name: pickStr(row, ['player_name', 'player', 'name']),
    nation: pickStr(row, ['nation', 'nationality', 'country']),
    position: pickStr(row, ['position', 'pos']),
    age: pickAge(row),
    matches_played: pickNum(row, [
      'matches_played',
      'matches',
      'mp',
      'games',
      'appearances',
      'apps',
    ]),
    starts: pickNum(row, ['starts', 'start', 'games_started']),
    minutes_played: pickNum(row, [
      'minutes_played',
      'minutes',
      'mins',
      'minute',
      'playing_time',
    ]),
    goals: pickNum(row, ['goals', 'g']),
    assists: pickNum(row, ['assists', 'a']),
    penalties_scored: pickNum(row, [
      'penalties_scored',
      'penalty_shoot',
      'penalties',
      'pens',
      'penalty_goals',
    ]),
    yellow_cards: pickNum(row, ['yellow_cards', 'yellows', 'yc']),
    red_cards: pickNum(row, ['red_cards', 'reds', 'rc']),
    expected_goals: pickNum(row, [
      'expected_goals',
      'xg',
      'x_g',
      'expected_goals_(xg)',
    ]),
    expected_assists: pickNum(row, [
      'expected_assists',
      'xag',
      'x_ag',
      'expected_assists_(xag)',
    ]),
    team: pickStr(row, ['team', 'club', 'squad']),
    market_value: pickOptNum(row, ['market_value', 'value', 'marketvalue']),
    points: pickOptNum(row, ['points', 'pts', 'fantasy_points']),
    image_url: (() => {
      const u = pickStr(row, ['image_url', 'image', 'photo', 'photo_url']);
      return u || undefined;
    })(),
  };
}
