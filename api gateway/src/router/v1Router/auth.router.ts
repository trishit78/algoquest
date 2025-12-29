import express, { type Request, type Response } from 'express';
import { getUserByIdHandler, signInHandler, signUpHandler } from '../../controllers/user.controller.js';
import { authRequest } from '../../middleware/auth.middleware.js';

const authRouter = express.Router()


authRouter.post('/signup',signUpHandler);
authRouter.post('/signin',signInHandler);
authRouter.get('/',authRequest,(_req:Request,res:Response)=>{
    res.send('hello');
    console.log('ok')
});
authRouter.get('/user/:id',getUserByIdHandler);

export default authRouter;
