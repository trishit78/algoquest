import express, { type Request, type Response } from 'express';

const authRouter = express.Router()


authRouter.get('/ping',(_req:Request,res:Response)=>{
    res.send('hello');
    console.log('ok')
})

export default authRouter;