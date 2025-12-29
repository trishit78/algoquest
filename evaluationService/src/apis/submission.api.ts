import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

export async function updateSubmission(submissionId:string,status:string,output:Record<string,string>) {
    try {
        const url = `${serverConfig.SUBMISSION_SERIVCE}/submissions/${submissionId}/status`;
        logger.info("Getting problem by ID",{url});
        const res =  await axios.patch(url,{
            status,submissionData: output
        })
        if(res.status !== 200 ){
            throw new InternalServerError("Failed to update submission");
        }
        console.log("Submission updated successfully",res.data);
        return;

        //await updateSubmission()

    } catch (error) {
        logger.error(`Failed to update submission: ${error}`);
        return null;
    }
}


export async function getUserByID(userId:string) {
    try {
        const url = `${serverConfig.API_GATEWAY}/api/v1/user/${userId}`;
        const userName = await axios.get(url);
        if(!userName){
            throw new InternalServerError('Failed to get UserName')
        }
        return userName.data
    } catch (error) {
        logger.error(`Failed to get UserName: ${error}`);
        return error;
    }
}



export async function addScoresToLeaderboard(name:string) {
    try {
        const url = `${serverConfig.API_GATEWAY}/leaderboard/api/v1/increment`;
        await axios.post(url,{
            userData:name,
            score: '10'
        })

        return;
    } catch (error) {
        logger.error(`Failed to add scores in leaderboard: ${error}`);
        return error;
    }
}