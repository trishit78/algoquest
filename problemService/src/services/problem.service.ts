

import { createProblem, deleteProblem, findByDifficulty, getAllProblems, getProblem, searchProblem, updateProblem } from "../repositories/problem.repositories";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { IProblem } from "../models/problem";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";
import { CreateProblemDto } from "../validators/problem.validator";

export async function createProblemService(problemData:CreateProblemDto){

//todo
    const sanitizedPayload = {
        ...problemData,
        description:await sanitizeMarkdown(problemData.description),
        editorial:problemData.editorial && await sanitizeMarkdown(problemData.editorial)
    }

    const problem = await createProblem(sanitizedPayload);
    return problem;
}

export async function getAllProblemsService() {
    const allProblems = await getAllProblems();
    return allProblems;
}

export async function getProblemService(problemId:string) {
    const foundProblem = await getProblem(problemId);
    
    if(!foundProblem){
        throw new NotFoundError("Problem not found");
    }
    return foundProblem;
}

export async function deleteProblemService(problemId:string) {
    const res = await deleteProblem(problemId);
    if(!res){
        throw new NotFoundError("Problem not found")
    }
    return res;
}



export async function updateProblemService(problemId:string,updateData:any) {
    const problem  = await getProblem(problemId);
    if(!problem){
        throw new NotFoundError("Problem not found");
    }


    //todo
    const sanitizedPayload :Partial<IProblem>={
        ...updateData
    };

    if(updateData.descripition){
        sanitizedPayload.description = await sanitizeMarkdown(updateData.descripition);
       
    }
    if(updateData.editorial){
        sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
    }

    const updatedProblem= await updateProblem(problemId,sanitizedPayload);
    return updatedProblem;
}


export async function findByDifficultyService(difficulty:"easy" | "medium" | "hard") {
    const problem  = await findByDifficulty(difficulty);
    return problem;
}

export async function searchProblemService(query:string) {
    if(!query || query.trim() === ""){
        throw new BadRequestError("Query is required");
    }
    const problem = await searchProblem(query);
    return problem;
}