import type { userDataDTO } from "../DTO/leaderboardData.DTO.js";
import { createLeaderboardRepo, streamLeaderboardDataRepo, updateLeaderboardRepo } from "../repository/leaderboard.repository.js";

export const createLeaderboardService = async (userData: userDataDTO) => {
  try {
    const leaderboardData = await createLeaderboardRepo(userData);
    return leaderboardData;

  } catch (error) {
    if (error instanceof Error) {
        throw new Error('error occured in service layer while adding users to leaderboard');
    }
  }
};


export const updateLeaderboardService = async (userData: userDataDTO) => {
  try {
    const leaderboardData = await updateLeaderboardRepo(userData);
    return leaderboardData;

  } catch (error) {
    if (error instanceof Error) {
        throw new Error('error occured in service layer while adding user scores to leaderboard');
    }
  }
};

export const getLeaderboardDataService = async()=>{
    try {
         const leaderboardData = await streamLeaderboardDataRepo();

         if(!leaderboardData){
            throw new Error('Leaderboard Data not found');
         }

          const leaderboard = [];
  for (let i = 0; i < leaderboardData.length; i += 2) {
    leaderboard.push({
      user: leaderboardData[i],
      score: Number(leaderboardData[i + 1]),
    });
  }

  console.log(leaderboard)
    return leaderboard;
    } catch (error) {
        if (error instanceof Error) {
        throw new Error('error occured in service layer while fetching leaderboard data');
    }
    }
}