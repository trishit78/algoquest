import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../config';

export const attachUserContext = (req:Request,res:Response,next:NextFunction)=>{
    try {
        const authHeader =req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            throw new Error('Invalid auth header');
        }

        const token = authHeader.split(" ")[1];
        if(!token || token != 'string'){
            throw new Error('Invalid JWT Token');
        }

        const response = jwt.verify(token,serverConfig.JWT_SECRET);
        if(response && (response as any).id){
            req.user = {id:(response as any).id}
            next();
            return;
        }

    } catch (error) {
        console.log("Invalid JWT token in submission service")
    }
}