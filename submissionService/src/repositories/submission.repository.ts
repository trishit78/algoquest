import { ISubmission, ISubmissionData, Submission, SubmissionStatus } from "../models/submission.model";

export async function createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission> {
    const newSubmission = await Submission.create(submissionData);
    
    return newSubmission;
}

export async function findById(id:String):Promise<ISubmission | null> {
    const submission =  await Submission.findById(id);
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