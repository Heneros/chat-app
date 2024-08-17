import express from 'express';
import authUser from '../controllers/users/authController.js';
import registerUser from '../controllers/users/registerController.js';
import logout from '../controllers/users/logoutController.js';

const router = express.Router();

router.route('/login').post(authUser);
router.route('/registration').post(registerUser);
router.route('/logout').get(logout);

export default router;
