import express from 'express';
import { getAllPlayersController, getPlayerByNameController, getPlayersByTeamController, getPlayersByPositionController } from '../controllers/playerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// router.use(authenticateToken);

router.get('/', getAllPlayersController);
router.get('/name/:name', getPlayerByNameController);
router.get('/team/:team', getPlayersByTeamController);
router.get('/position/:position', getPlayersByPositionController);

export default router;
