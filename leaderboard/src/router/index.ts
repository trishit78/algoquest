import express, { type Request, type Response } from 'express'


const leaderboardRouter = express.Router();

leaderboardRouter.get('/',(_req:Request,res:Response)=>{
    console.log('response');
    res.send('ok')
});

export default leaderboardRouter