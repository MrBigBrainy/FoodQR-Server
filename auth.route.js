import { Router } from 'express';
import { getMe, login, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validations/schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRoute = Router();

authRoute.post('/register', validateBody(registerSchema), register);
authRoute.post('/login', validateBody(loginSchema), login);
authRoute.get('/me', authMiddleware, getMe);

export default authRoute;
