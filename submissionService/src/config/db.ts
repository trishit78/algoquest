import mongoose from 'mongoose'
import { serverConfig } from '.';
import logger from './logger.config';

export async function connectDB() {
    try{
        
        await mongoose.connect(serverConfig.MONGO_URI);


        mongoose.connection.on("error",(err)=>{
            logger.error("MongoDB connection error",err);
        });

        mongoose.connection.on("disconnected",(err)=>{
            logger.error("MongoDB disconnected");
        });

        process.on("SIGINT",async ()=>{
            await mongoose.connection.close();
            logger.info("mongoDB connection closed");
            process.exit(0);  // 0 -> success signal
        })

        console.log("monogdb connected");
    }catch(error){
        console.log(error)
        process.exit(1)   // 1 -> error dignal
    }
}