import type { UserDataDTO, UserSigninDTO } from "../DTO/user.DTO.js";
import { getUserByEmail, signUpRepo } from "../repositories/user.repository.js";
import { comparePassword, createToken, hashPassword } from "../utils/auth.js";


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


export const signInService = async(userData:UserSigninDTO)=>{
    try {
        const userDetails = await getUserByEmail(userData);
        if(!userDetails){
            throw new Error('no user records found');
        }
        const response = comparePassword(userData.password,userDetails.password);
        if(!response){
            throw new Error('Wrong Password..');
        }

        const token  = createToken({id:userDetails._id.toString(),email:userDetails.email});

        return {userDetails,token}
    } catch (error) {
        if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in service layer');
        }
            
    }  
}
