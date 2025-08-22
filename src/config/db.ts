import mongoose from 'mongoose'
import { serverConfig } from '.';

export async function connectDB() {
    try{
        
        await mongoose.connect(serverConfig.MONGO_URI);
        console.log("monogdb connected");
    }catch(error){
        console.log(error)
        throw error;
    }
}