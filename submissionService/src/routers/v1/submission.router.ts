import express from "express";
import { createSubmissionHandler, deleteSubmissionByIdHandler, getSubmissionByIdHandler, getSubmissionByProblemIdHandler, updateSubmissionStatusHandler } from "../../controllers/submission.controller";
import { validateQueryParams, validateRequestBody } from "../../validators";
import { createSubmissionSchema, submissionQuerySchema, updateSubmissionStatusSchema } from "../../validators/submission.validator";


const submissionRouter = express.Router();

submissionRouter.post("/",validateRequestBody(createSubmissionSchema),createSubmissionHandler);

submissionRouter.get(
    '/:id', 
    getSubmissionByIdHandler
);

submissionRouter.get(
    '/problem/:problemId', 
    validateQueryParams(submissionQuerySchema),
    getSubmissionByProblemIdHandler
);


submissionRouter.delete(
    '/:id', 
    deleteSubmissionByIdHandler
);

submissionRouter.patch(
    '/:id/status', 
    validateRequestBody(updateSubmissionStatusSchema),
    updateSubmissionStatusHandler
);

export default submissionRouter;

