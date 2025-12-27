import dotenv from 'dotenv';


type ServerConfig = {
    PORT:number,
    MONGO_URI:string,
    JWT_SECRET:string,
    JWT_EXPIRY:string,

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
}