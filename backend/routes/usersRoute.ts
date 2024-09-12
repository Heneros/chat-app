import express from 'express';
import authUser from '../controllers/users/authController';
import registerUser from '../controllers/users/registerController';
import logout from '../controllers/users/logoutController';

const router = express.Router();

router.route('/login').post(authUser);
router.route('/registration').post(registerUser);
router.route('/logout').get(logout);

export default router;
