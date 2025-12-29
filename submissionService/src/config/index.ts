// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    MONGO_URI:string,
    PROBLEM_SERVICE:string,
    JWT_SECRET:string
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    MONGO_URI:process.env.MONGO_URI || "mongodb://localhost:27017/submissionService",
    PROBLEM_SERVICE:process.env.PROBLEM_SERVICE ||  "http://localhost:3000/api/v1",
    JWT_SECRET:process.env.JWT_SECRET ||  "trishit"
};
