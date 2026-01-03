import express from 'express';
import { getMatchStatsByDateController, getMatchStatsByTeamController, getMatchStatsByResultController, getMatchStatsByYearController,getAllMatchStatsController } from '../controllers/matchstatsController.js';
const router = express.Router();

router.get('/', getAllMatchStatsController);
router.get('/date/:date', getMatchStatsByDateController);
router.get('/team/:team', getMatchStatsByTeamController);
router.get('/result/:result', getMatchStatsByResultController);
router.get('/year/:year', getMatchStatsByYearController);

export default router;
