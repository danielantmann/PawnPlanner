import { Router } from 'express';
import { register } from '../../controllers/auth/register';
import { login } from '../../controllers/auth/login';
import { refresh } from '../../controllers/auth/refresh';
import { forgotPassword } from '../../controllers/auth/forgotPassword';
import { resetPassword } from '../../controllers/auth/resetPassword';
import { changePassword } from '../../controllers/auth/changePassword';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);

export default router;
