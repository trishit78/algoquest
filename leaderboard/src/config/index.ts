import dotenv from 'dotenv';

type ServerConfig = {
    PORT:number,
    REDIS_HOST:string,
    REDIS_PORT:number,
    KEY:string,

}

function loadEnv(){
    dotenv.config()
}

loadEnv()

export const serverConfig:ServerConfig ={
    PORT:Number(process.env.PORT) || 4501,
    REDIS_PORT:Number(process.env.REDIS_PORT) || 6379,
    REDIS_HOST:process.env.REDIS_HOST || 'localhost',
    KEY:process.env.KEY || '',
}