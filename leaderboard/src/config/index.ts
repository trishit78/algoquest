import dotenv from 'dotenv';

type ServerConfig = {
    PORT:string
}

function loadEnv(){
    dotenv.config()
}

loadEnv()

export const serverConfig:ServerConfig ={
    PORT:process.env.PORT || '4501'
}