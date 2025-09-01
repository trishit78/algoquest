import axios, { AxiosResponse } from "axios";

import { serverConfig } from "../config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";



export interface ITestcase{
    input:string,
    output:string;
}

export interface IProblemDetails{
    id:string,
    title:string,
    description:string,

}

export interface IProblemResponse{
    data:IProblemDetails,
    message:string,
    success:boolean

}

export async function getProblemById(problemId:string):Promise<IProblemDetails | null>{
    try {
        const response: AxiosResponse<IProblemResponse>=
        await axios.get(`{serverConfig.PROBLEM_SERVICE}/problems/${problemId}`);

        if(response.data.success){
            return response.data.data;
        }

        throw new InternalServerError("failed to get problem details");

    } catch (error) {
        logger.error(`Failed to get problem details: ${error}`);
        return null;
        
    }
}






