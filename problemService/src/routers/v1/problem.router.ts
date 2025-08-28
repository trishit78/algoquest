import express from "express";
import {
  createProblemHandler,
  deleteProblemHandler,
  findByDifficultyHandler,
  getAllProblemsHandler,
  getProblemHandler,
  searchProblemHandler,
  updateProblemHandler,
} from "../../controllers/problem.controller";
import { validateRequestBody, validateRequestParams } from "../../validators";
import {
  createProblemSchema,
  findByDifficultySchema,
  updateProblemSchema,
} from "../../validators/problem.validator";

const problemRouter = express.Router();

problemRouter.post(
  "/create",
  validateRequestBody(createProblemSchema),
  createProblemHandler
);


problemRouter.get("/", getAllProblemsHandler);
problemRouter.get("/search", searchProblemHandler);
problemRouter.get(
    "/difficulty/:difficulty",
    validateRequestParams(findByDifficultySchema),
    findByDifficultyHandler
  );

problemRouter.get("/:id", getProblemHandler);
problemRouter.put(
  "/:id",
  validateRequestBody(updateProblemSchema),
  updateProblemHandler
);
problemRouter.delete("/:id", deleteProblemHandler);




export default problemRouter;
