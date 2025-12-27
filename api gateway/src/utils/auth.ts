import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'; 
import type { inputDataDTO } from "../DTO/user.DTO.js";


export async function hashPassword(userpassword:string){
    return await bcrypt.hash(userpassword,10);
}


export function comparePassword(userPassword:string,encryptedPassword:string){
    return bcrypt.compare(userPassword,encryptedPassword);
}

export function createToken(inputData:inputDataDTO){
    return jwt.sign(inputData,"JWT_SECRET",{expiresIn:'7d'})
}