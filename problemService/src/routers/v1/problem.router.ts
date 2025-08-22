import express from "express"
import { createProblemHandler, deleteProblemHandler, getAllProblemsHandler, getProblemHandler, updateProblemHandler } from "../../controllers/problem.controller"

const problemRouter = express.Router()
problemRouter.post('/create',createProblemHandler)
problemRouter.get('/',getAllProblemsHandler)



problemRouter.get('/:id',getProblemHandler)
problemRouter.put('/:id',updateProblemHandler)
problemRouter.delete('/:id',deleteProblemHandler)





export default problemRouter;