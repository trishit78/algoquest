import express from "express";
import { createSubmissionHandler, deleteSubmissionByIdHandler, getSubmissionByProblemIdHandler, getSubmissionByUserIdAndProblemIdHandler, updateSubmissionStatusHandler } from "../../controllers/submission.controller";
import { validateQueryParams, validateRequestBody } from "../../validators";
import { submissionQuerySchema, updateSubmissionStatusSchema } from "../../validators/submission.validator";


const submissionRouter = express.Router();


submissionRouter.post("/create",createSubmissionHandler);

submissionRouter.get(
    '/problem/:problemId', 
    validateQueryParams(submissionQuerySchema),
    getSubmissionByProblemIdHandler
);
submissionRouter.get(
    '/', 
    getSubmissionByUserIdAndProblemIdHandler
);


submissionRouter.patch(
    '/:id/status', 
    validateRequestBody(updateSubmissionStatusSchema),
    updateSubmissionStatusHandler
);





submissionRouter.delete(
    '/:id', 
    deleteSubmissionByIdHandler
);





export default submissionRouter;

