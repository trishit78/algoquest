import express from 'express';
import { signUpHandler } from '../../controllers/user.controller.js';

const authRouter = express.Router()


authRouter.post('/signup',signUpHandler);

export default authRouter;