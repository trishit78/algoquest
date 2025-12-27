import type { UserDataDTO } from "../DTO/user.DTO.js";
import { signUpRepo } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/auth.js";


export const signUpService = async(userData:UserDataDTO)=>{
    try {
        const userPassword = userData.password;
        const hashedPassword = await hashPassword(userPassword);
        const user = await signUpRepo({
            username:userData.username,
            email:userData.email,
            password:hashedPassword,

        });
        return user;
    } catch (error) {
        if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in service layer');
        }
            
    }
}