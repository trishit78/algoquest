import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../config"; 

export const attachUserContext = (req:Request, res:Response, next:NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
        const payload = jwt.verify(token, serverConfig.JWT_SECRET) as { id: number, email: string };
        if(payload && payload.id) {
             req.user = { id: payload.id };
             next();
             return;
        }
    } catch (error) {
        console.warn("Invalid token provided in local booking service call:", error);
    }
  }
 
  next();
};