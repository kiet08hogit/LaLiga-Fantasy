import express from 'express';
import { oauthLoginController, oauthCallbackController, logoutController } from '../controllers/authController.js';
const router = express.Router();

router.get('/login', oauthLoginController);
router.get('/callback', oauthCallbackController);
router.get('/logout', logoutController);

export default router;
