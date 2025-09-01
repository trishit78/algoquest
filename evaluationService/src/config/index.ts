// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    PROBLEM_SERIVCE:string,
    SUBMISSION_SERIVCE:string,
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3002,
    PROBLEM_SERIVCE:process.env.PROBLEM_SERIVCE || "http://localhost:3000/api/v1",
    SUBMISSION_SERIVCE:process.env.SUBMISSION_SERIVCE || "http://localhost:3001/api/v1"

};