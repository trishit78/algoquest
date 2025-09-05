import { Request, Response } from "express";
import { createSubmissionService, deleteSubmissionByIdService, getSubmissionByIdService, getSubmissionByProblemIdService, updateSubmissionStatusService } from "../services/submission.service";
import logger from "../config/logger.config";


export async function createSubmissionHandler(req:Request,res:Response) {
    const createSubmission = await createSubmissionService(req.body);

    res.status(201).json({
        message:"Problem submitted successfully",
        data:createSubmission,
        success:true,
    })
}

export async function getSubmissionByIdHandler(req:Request,res:Response) {
    
    const {id} = req.params;
    const submission = await getSubmissionByIdService(id);

    res.status(200).json({
        message:"Problem fetched successfully",
        data:submission,
        success:true
    })
}


export async function getSubmissionByProblemIdHandler(req:Request,res:Response) {
    const {id} = req.params;
    const submission = await getSubmissionByProblemIdService(id);

    res.status(200).json({
        message:"Submission fetched successfully",
        data:submission,
        success:true
    })

}

export async function deleteSubmissionByIdHandler(req:Request,res:Response) {
    const {id} = req.params;
    
    const submission = await deleteSubmissionByIdService(id);

    res.status(200).json({
        message:"Submission deleted successfully",
        data:submission,
        success:true
    })

}


export async function updateSubmissionStatusHandler(req:Request,res:Response) {
    
    const {id} = req.params;
    const {status,submissionData} = req.body;
    
    const submission = await updateSubmissionStatusService(id,status,submissionData);

    logger.info("submission fetched successfully", {
        submissionId:id,
        status
    })

    
    res.status(200).json({
        message:"submission updated successfully",
        data:submission,
        success:true
    })


}