import { createProblemDTO } from "../dtos/problem.dto";
import { createProblem, deleteProblem, getAllProblems, getProblem, updateProblem } from "../repositories/problem.repositories";

export async function createProblemService(problemData:createProblemDTO){
    const problem = await createProblem(problemData);
    return problem;
}

export async function getAllProblemsService() {
    const allProblems = await getAllProblems();
    return allProblems;
}

export async function getProblemService(problemId:string) {
    const foundProblem = await getProblem(problemId);
    return foundProblem;
}

export async function deleteProblemService(problemId:string) {
    const res = await deleteProblem(problemId);
    return res;
}



export async function updateProblemService(problemId:string,updateData:any) {

    const updatedProblem= await updateProblem(problemId,updateData);
    return updatedProblem;
}
