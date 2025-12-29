import { Request, Response } from "express";
import {   createSubmissionService, deleteSubmissionByIdService, getSubmissionByIdService, getSubmissionByProblemIdService, updateSubmissionStatusService } from "../services/submission.service";
import logger from "../config/logger.config";
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export async function createSubmissionHandler(req:Request,res:Response) {
 const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
      res.status(401).json({
       success: false,
       message: 'Unauthorized'
     });
     return;
  }

  const submissionData = {
    ...req.body,
    userId:authReq.user.id
  }
     const createSubmission = await createSubmissionService(submissionData);
    res.status(201).json({
        message:"Problem submitted successfully",
        data:createSubmission,
        success:true
    })
}

export async function getSubmissionByUserIdAndProblemIdHandler(req:Request,res:Response) {
    const authReq = req as AuthenticatedRequest;

    const problemId = req.body?.problemId || req.query?.problemId;

  if (!problemId) {
     res.status(400).json({
      success: false,
      message: 'problemId is required',
    });
    return;
  }
  if (!authReq.user) {
      res.status(401).json({
       success: false,
       message: 'Unauthorized'
     });
     return;
  }
   const id =String(authReq.user.id);
    const submission = await getSubmissionByIdService({id,problemId});

    res.status(200).json({
        message:"All Problems by a user fetched successfully",
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