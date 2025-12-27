import type { UserDataDTO } from "../DTO/user.DTO.js";
import { User } from "../model/user.model.js";

export const signUpRepo = async(userData:UserDataDTO)=>{
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
         if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in repo layer');
        }
    }
}