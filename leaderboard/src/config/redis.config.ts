import {Redis} from 'ioredis';
import { serverConfig } from './index.js';


export function connectToRedis(){
    // let connection : Redis;

    try {
        const redisConfig = {
            port:serverConfig.REDIS_PORT,
            host:serverConfig.REDIS_HOST,
            maxRetriesPerRequest:null
        };
        // return ()=>{
        //     if(!connection){
        //         connection = new Redis(redisConfig);
        //         return connection;
        //     }
        //     return connection;
        // }
        const connection =  new Redis(redisConfig);
        return connection
    } catch (error) {
        console.log('error while connecting to redis',error);
        throw error;
    }
}

 






