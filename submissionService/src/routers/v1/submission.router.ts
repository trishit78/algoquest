import express from "express";
import { createSubmissionHandler, deleteSubmissionByIdHandler, getSubmissionByIdHandler, getSubmissionByProblemIdHandler, updateSubmissionStatusHandler } from "../../controllers/submission.controller";
import { validateQueryParams, validateRequestBody } from "../../validators";
import { createSubmissionSchema, submissionQuerySchema, updateSubmissionStatusSchema } from "../../validators/submission.validator";


const submissionRouter = express.Router();




submissionRouter.post("/create",validateRequestBody(createSubmissionSchema),createSubmissionHandler);

submissionRouter.get(
    '/problem/:problemId', 
    validateQueryParams(submissionQuerySchema),
    getSubmissionByProblemIdHandler
);
submissionRouter.get(
    '/:id', 
    getSubmissionByIdHandler
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

