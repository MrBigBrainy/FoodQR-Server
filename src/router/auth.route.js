import { Router } from 'express';

import { loginSchema, registerSchema } from '../validations/schema.js';
import {
  loginAdmin,
  registerAdmin,
} from '../controller/adminAuth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), registerAdmin);
authRouter.post('/login', validateBody(loginSchema), loginAdmin);

export default authRouter;
