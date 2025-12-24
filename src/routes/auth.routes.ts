import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../utils/validationSchemas';

const router = Router();

router.post('/signup', validate(registerSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;
