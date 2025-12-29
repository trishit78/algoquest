import { serverConfig } from "../config/index.js";
import { connectToRedis } from "../config/redis.config.js";
import type { userDataDTO } from "../DTO/leaderboardData.DTO.js";

const redis = connectToRedis();

export const createLeaderboardRepo = async(userData:userDataDTO)=>{
    try {

        

        const leaderboardData = await redis.zadd(serverConfig.KEY,userData.score,userData.userData) 
        return leaderboardData;
    } catch (error) {
        if (error instanceof Error) {
        throw new Error('error occured in repo layer while adding users to leaderboard');
    }
    }
}

export const updateLeaderboardRepo = async(userData:userDataDTO)=>{
    try {
        const leaderboardData = await redis.zincrby(serverConfig.KEY,userData.score,userData.userData) 
        return leaderboardData;
    } catch (error) {
        if (error instanceof Error) {
        throw new Error('error occured in repo layer while adding user scores to leaderboard');
    }
    }
}

export const streamLeaderboardDataRepo = async()=>{
    try {
        const leaderboardData = await redis.zrevrange(serverConfig.KEY,'0', '100','WITHSCORES'
);
        
        return leaderboardData
    } catch (error) {
        if (error instanceof Error) {
        throw new Error('error occured in repo layer while fetching leaderboard data streams');
    }
    }
}