import express from 'express';
import { getLiveMatches, getStandings, getFixtures } from '../controllers/liveStatsController.js';

const router = express.Router();

// Get live matches
router.get('/live', getLiveMatches);

// Get league standings
router.get('/standings', getStandings);

// Get fixtures by round
router.get('/fixtures', getFixtures);

export default router;
