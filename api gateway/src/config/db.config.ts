import mongoose from "mongoose"
import { serverConfig } from "./index.js"

export const connectionDB =async()=>{
    await mongoose.connect(serverConfig.MONGO_URI);
    console.log('connected to mongodb')
}