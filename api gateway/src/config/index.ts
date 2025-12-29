import dotenv from 'dotenv';


type ServerConfig = {
    PORT:number,
    MONGO_URI:string,
    JWT_SECRET:string,
    JWT_EXPIRY:string,
    PROBLEM_SERVICE:string,
    SUBMISSION_SERVICE:string,
    LEADERBOARD:string,
    API_GATEWAY:string,

}

function loadEnv(){
    dotenv.config();
    console.log('Environment variables are loaded');
}


loadEnv();

export const serverConfig:ServerConfig={
    PORT:Number(process.env.PORT)|| 5000,
    MONGO_URI:process.env.mongodb_uri||'mongodb://localhost:27017/algoquest_auth',
    JWT_SECRET:process.env.JWT_SECRET || 'trishit',
    JWT_EXPIRY:process.env.JWT_EXPIRY || '7d',
    PROBLEM_SERVICE:process.env.PROBLEM_SERVICE || '"http://localhost:4000"',
    SUBMISSION_SERVICE:process.env.SUBMISSION_SERVICE || '"http://localhost:3001"',
    LEADERBOARD:process.env.LEADERBOARD || '"http://localhost:4500"',
    API_GATEWAY:process.env.API_GATEWAY || '"http://localhost:5000"',
}