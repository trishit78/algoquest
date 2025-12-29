import type { Request, Response } from "express";
import { createLeaderboardService, getLeaderboardDataService, updateLeaderboardService } from "../service/leaderboard.service.js";

export const createLeaderboardHandler = async(req:Request,res:Response)=>{
    try {
        const response = await createLeaderboardService(req.body);
        res.status(200).json({
            success:true,
            message:'User added to leaderboard',
            data:response
        })
     } catch (error) {
            if(error instanceof Error){
                res.status(400).json({
                    success:false,
                    message:"Internal Server Error",
                    data:error.message
                })
            }
     }
}


export const updateLeaderboardHandler = async(req:Request,res:Response)=>{
     try {
        const response = await updateLeaderboardService(req.body);
        res.status(200).json({
            success:true,
            message:'User points added to leaderboard',
            data:response
        })
     } catch (error) {
            if(error instanceof Error){
                res.status(400).json({
                    success:false,
                    message:"Internal Server Error",
                    data:error.message
                })
            }
     }
}

export const getLeaderboardDataHandler = async(_req:Request,res:Response)=>{
    try {
         const response = await getLeaderboardDataService();
        res.status(200).json({
            success:true,
            message:'Leaderboard data fetched',
            data:response
        })
} catch (error) {
            if(error instanceof Error){
                res.status(400).json({
                    success:false,
                    message:"Internal Server Error",
                    data:error.message
                })
            }
     }
}