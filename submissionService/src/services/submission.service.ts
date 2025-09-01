import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { ISubmission, ISubmissionData, SubmissionLanguage, SubmissionStatus } from "../models/submission.model";
import { addSubmissionJob } from "../producers/submission.producer";
import { createSubmission, deleteById, findById, findProblemById, updateStatus } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";


export async function createSubmissionService(submissionData:Partial<ISubmission>):Promise<ISubmission> {
    //checking if the problem exists or not
    if(!submissionData.problemId){
        throw new BadRequestError("problem ID is required");
    }

    if(!submissionData.code){
        throw new BadRequestError("code is required");
    }
    if(!submissionData.language){
        throw new BadRequestError("language is required");
    }

    const problem = await getProblemById(submissionData.problemId);
    if(!problem){
        throw new NotFoundError("Problem not found or something went wrong");
    }
    
    //get the problem from the problemService ---> in the apis/problem.api.ts


    //add the submission payload to the db

    const submission = await createSubmission(submissionData);
    

    // submission to redis queue
    const jobId = await addSubmissionJob({
        submissionId:submission._id,
        problem,
        code:submissionData.code || "",
        language:submissionData.language || SubmissionLanguage.CPP

    })

    logger.info(`Submission job added: ${jobId}`);
    

    return submission;

}

export async function getSubmissionByIdService(id:string):Promise<ISubmission| null> {
    const submission  = await findById(id);
    if(!submission){
        throw new NotFoundError("Submission not found");
    }
    return submission;
}

export async function getSubmissionByProblemIdService(problemId:string):Promise<ISubmission[]> {
    const submission = await findProblemById(problemId);
    return submission;
} 

export async function deleteSubmissionByIdService(id:string):Promise<boolean> {
    const result = await deleteById(id);
    if(!result){
        throw new NotFoundError("Submission not found");
    }
    return result;
}

export async function updateSubmissionStatusService(id:string,status:SubmissionStatus, submissionData: ISubmissionData):Promise<ISubmission | null> {
    const submission = await updateStatus(id,status,submissionData);
    if(!submission){
        throw new NotFoundError("Submission not found");
    }
    return submission;
}
