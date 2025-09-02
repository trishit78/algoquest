import { Worker } from "bullmq";

import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";



async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE,async(job)=>{
        logger.info(`Processing job ${job.id}`);
    },{
        connection:createNewRedisConnection()
    });

    worker.on("error",(err)=>{
        logger.error(`Evaluation worker error: ${err}`);
    });

    worker.on("completed",(job)=>{
        logger.info(`Evaluation job completed: ${job.id}`);
    })
    worker.on("failed",(job,error)=>{
        logger.error(`Evaluation job failed: ${job}`,error);
    })
}

export async function startWorkers() {
    await setupEvaluationWorker();
}