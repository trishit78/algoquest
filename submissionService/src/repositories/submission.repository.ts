import { ISubmission, ISubmissionData, Submission, SubmissionStatus } from "../models/submission.model";
import { submissionDataDTO } from "../services/submission.service";

export async function createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission> {
    const newSubmission = await Submission.create(submissionData);
    console.log(newSubmission)
    return newSubmission;
}

export async function findById(submissionData:submissionDataDTO):Promise<ISubmission[] | null> {
    
    const submission =  await Submission.find({
        userId:submissionData.id,
        problemId:submissionData.problemId
    });
    return submission;
}

export async function findProblemById(problemId:string):Promise<ISubmission[]>{
    const submissions = await Submission.find({problemId});
    return submissions;
}

export async function deleteById(id:string):Promise<boolean> {
    const result = await Submission.findByIdAndDelete(id);
    return result !== null;
}
export async function updateStatus(id:string,status:SubmissionStatus,submissionData:ISubmissionData):Promise<ISubmission | null> {
    const submission = await Submission.findByIdAndUpdate(id,{status,submissionData},{new:true});
    return submission;
}