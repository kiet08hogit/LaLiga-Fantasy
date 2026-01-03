import express from 'express';
import {
  createDreamTeamController,
  getUserDreamTeamsController,
  getDreamTeamController,
  updateDreamTeamController,
  deleteDreamTeamController,
  addPlayerToTeamController,
  getTeamPlayersController,
  removePlayerFromTeamController,
  updatePlayerInTeamController,
  getTeamPointsController,
} from '../controllers/dreamteamController.js';

const router = express.Router();

// ========== DREAM TEAM ROUTES ==========
router.post('/', createDreamTeamController);
router.get('/user/:userId', getUserDreamTeamsController);
router.get('/:teamId', getDreamTeamController);
router.put('/:teamId', updateDreamTeamController);
router.delete('/:teamId', deleteDreamTeamController);

// ========== TEAM PLAYERS ROUTES ==========
router.post('/:teamId/players', addPlayerToTeamController);
router.get('/:teamId/players', getTeamPlayersController);
router.delete('/:teamId/players/:playerId', removePlayerFromTeamController);
router.put('/:teamId/players/:playerId', updatePlayerInTeamController);

// ========== TEAM STATISTICS ROUTES ==========
router.get('/:teamId/points', getTeamPointsController);

export default router;
