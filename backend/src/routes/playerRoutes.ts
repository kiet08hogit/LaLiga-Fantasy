import express from 'express';
import { getAllPlayersController, getPlayerByNameController, getPlayersByTeamController, getPlayersByPositionController,getPlayerByIdController, getPlayersByNationController } from '../controllers/playerController.js';
const router = express.Router();


router.get('/', getAllPlayersController);
router.get('/name/:name', getPlayerByNameController);
router.get('/team/:team', getPlayersByTeamController);
router.get('/position/:position', getPlayersByPositionController);
router.get('/nation/:nation', getPlayersByNationController);
router.get('/id/:id', getPlayerByIdController);

export default router;
