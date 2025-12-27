import bcrypt from "bcryptjs";

export async function hashPassword(userpassword:string){
    return await bcrypt.hash(userpassword,10);
}