import express, { type Request, type Response } from 'express'
import { createLeaderboardHandler, getLeaderboardDataHandler, updateLeaderboardHandler } from '../controller/leaderboard.controller.js';


const leaderboardRouter = express.Router();

leaderboardRouter.get('/',(_req:Request,res:Response)=>{
    console.log('response');
    res.send('ok')
});


leaderboardRouter.put('/adduser',createLeaderboardHandler)
leaderboardRouter.post('/increment',updateLeaderboardHandler)
leaderboardRouter.get('/leaderboard',getLeaderboardDataHandler)



export default leaderboardRouter