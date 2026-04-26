import { Request, Response } from 'express';
import axios, { AxiosInstance } from 'axios';

// ──────────────────────────────────────────────
// football-data.org  (free tier – 10 req/min)
// Register at https://www.football-data.org/ to get a free API key
// Then set FOOTBALL_DATA_API_KEY in your .env
// ──────────────────────────────────────────────
const FD_API_KEY = process.env.FOOTBALL_DATA_API_KEY || '';
const FD_BASE = 'https://api.football-data.org/v4';
const LA_LIGA_CODE = 'PD'; // Primera División

const fdAxios: AxiosInstance = axios.create({
  baseURL: FD_BASE,
  headers: { 'X-Auth-Token': FD_API_KEY },
});

// ── Helper: safe request wrapper ──
async function fdRequest(path: string, params: Record<string, string> = {}) {
  const response = await fdAxios.get(path, { params });
  return response.data;
}

// ────────────────────────────────────────
// 1.  GET /live-stats/live
//     Returns matches that are currently IN_PLAY or PAUSED
// ────────────────────────────────────────
export const getLiveMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fdRequest(`/competitions/${LA_LIGA_CODE}/matches`, {
      status: 'LIVE',
    });
    res.json(data);
  } catch (error) {
    const err = error as any;
    console.error('Error fetching live matches:', err?.response?.status, err?.message);
    // Return empty matches array so the frontend can fallback gracefully
    res.json({ matches: [] });
  }
};

// ────────────────────────────────────────
// 2.  GET /live-stats/recent
//     Returns the most recent FINISHED matches (last 15)
// ────────────────────────────────────────
export const getRecentMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fdRequest(`/competitions/${LA_LIGA_CODE}/matches`, {
      status: 'FINISHED',
    });
    // The API returns all finished matches for the season.
    // Sort by date descending, return the last N.
    const matches = (data.matches || [])
      .sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 20);

    res.json({ ...data, matches });
  } catch (error) {
    const err = error as any;
    console.error('Error fetching recent matches:', err?.response?.status, err?.message);
    res.status(500).json({ error: 'Failed to fetch recent matches' });
  }
};

// ────────────────────────────────────────
// 3.  GET /live-stats/standings
//     Returns league standings
// ────────────────────────────────────────
export const getStandings = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fdRequest(`/competitions/${LA_LIGA_CODE}/standings`);
    res.json(data);
  } catch (error) {
    const err = error as any;
    console.error('Error fetching standings:', err?.response?.status, err?.message);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
};

// ────────────────────────────────────────
// 4.  GET /live-stats/fixtures
//     Returns upcoming scheduled matches
// ────────────────────────────────────────
export const getFixtures = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await fdRequest(`/competitions/${LA_LIGA_CODE}/matches`, {
      status: 'SCHEDULED',
    });
    // Return the next 15 upcoming matches
    const matches = (data.matches || [])
      .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
      .slice(0, 15);

    res.json({ ...data, matches });
  } catch (error) {
    const err = error as any;
    console.error('Error fetching fixtures:', err?.response?.status, err?.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
};
