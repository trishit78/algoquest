import { Request, Response } from "express";
import { createProblemService, deleteProblemService, findByDifficultyService, getAllProblemsService, getProblemService, searchProblemService, updateProblemService } from "../services/problem.service";

export async function createProblemHandler(req:Request, res:Response) {
    // call the service layer

     const problemResponse = await createProblemService(req.body);

    // send the response
    res.status(201).json({
        message:"Problem created successfully",
        data:problemResponse,
        success:true,
    })
}


export async function getAllProblemsHandler(req:Request,res:Response) {
    const allProblems = await getAllProblemsService();

    res.status(200).json({
        message:"All Problems fetched",
        data:allProblems,
        success:true
    })
    
}


export async function getProblemHandler(req:Request,res:Response) {

    

    const {id} = req.params;
    const problems = await getProblemService(id);

    res.status(200).json({
        message:"This Problem is fetched",
        data:problems,
        success:true
    })
    
}


export async function updateProblemHandler(req:Request,res:Response){
    const {id} = req.params;
    const updatedProblem = await updateProblemService(id, req.body);

    res.status(200).json({
        message:"The updated problem",
        data:updatedProblem,
        success:true
    })
}


export async function deleteProblemHandler(req:Request,res:Response){
    const { id } = req.params;
    const deleted = await deleteProblemService(id);

  

    res.status(200).json({
      message: "Problem deleted successfully",
      data:deleted,
      success: true
    });
}

export async function findByDifficultyHandler(req:Request,res:Response):Promise<void>{
    const problems = await findByDifficultyService(req.params.difficulty as "easy" | "medium" | "hard");

    res.status(200).json({
        message:"Problems fetched successfully",
        data:problems,
        success:true
    })
}

export async function searchProblemHandler(req:Request,res:Response):Promise<void>{
    const problems = await searchProblemService(req.query.query as string);
    res.status(200).json({
        message:"Problems fetched successfully",
        data:problems,
        success:true
    })
}
