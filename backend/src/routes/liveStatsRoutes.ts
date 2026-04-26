import express from 'express';
import { getLiveMatches, getRecentMatches, getStandings, getFixtures } from '../controllers/liveStatsController.js';

const router = express.Router();

// Get live matches (IN_PLAY / PAUSED)
router.get('/live', getLiveMatches);

// Get recent finished matches
router.get('/recent', getRecentMatches);

// Get league standings
router.get('/standings', getStandings);

// Get upcoming fixtures
router.get('/fixtures', getFixtures);

export default router;
