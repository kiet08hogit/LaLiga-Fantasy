import express from 'express';
import { getUserTeamController, addPlayerToTeamController, removePlayerFromTeamController } from '../controllers/teamController.js';

const router = express.Router();

router.get('/:userId', getUserTeamController);
router.post('/', addPlayerToTeamController);
router.delete('/:userId/:playerId', removePlayerFromTeamController);

export default router;
