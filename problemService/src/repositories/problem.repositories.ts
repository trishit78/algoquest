import logger from "../config/logger.config";
import { createProblemDTO } from "../dtos/problem.dto";
import { problem } from "../models/problem";

export async function createProblem(problemData:createProblemDTO) {
    const createdProblem = await problem.insertOne({
       title:problemData.title,
       description:problemData.description,
       difficulty:problemData.difficulty,
       testcases:problemData.testcases
    });
    logger.info(`problem created: ${createdProblem._id}`);
    return createdProblem;
}


export async function getAllProblems() {
    const allProblems = await problem.find();
    logger.info(`all problems: ${allProblems}`)
    return allProblems;
}

export async function getProblem(problemId:string) {
    const foundProblem = await problem.findById(problemId);
    logger.info(`the problem is: ${foundProblem}`)
    return foundProblem;
}


export async function deleteProblem(problemId:string){
    const res = await problem.deleteOne({_id:problemId})
    if(res.deletedCount===0){
        console.log('no problem deleted');
        return false;
    }
    
    logger.info("problem deleted");
    return true;
}

export async function updateProblem(problemId:string,updateData:any){
    const updatedProblem = await problem.findByIdAndUpdate(
        problemId,
        updateData,
        {new :true,
            runValidators:true      // used for changing schema 
        }
    )
    logger.info(`updated problem is: ${updatedProblem}`);
    return updatedProblem;
}

export async function findByDifficulty(difficulty:string) {
    const foundProblem = await problem.find({difficulty}).sort({createdAt:-1});
    logger.info("the problem is :", foundProblem);
    return foundProblem;;
}

export async function searchProblem(query:string) {
    const regex = new RegExp(query,"i");
    const foundProblem = await problem.find({$or:[{title:regex},{descripition:regex}]}).sort({createdAt:-1})
    logger.info("the problem is",foundProblem);
    return foundProblem;

}
