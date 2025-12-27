import type { Request, Response } from "express";
import { signUpService } from "../services/user.service.js";

export const signUpHandler = async(req:Request,res:Response)=>{
    try {
        const response = await signUpService(req.body);
        res.status(200).json({
            success:true,
            message:'User signed up successfully',
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