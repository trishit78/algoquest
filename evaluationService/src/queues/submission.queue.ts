import { Queue } from "bullmq";
import { createNewRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";
import { SUBMISSION_QUEUE } from "../utils/constants";

export const submissionQueue = new Queue(SUBMISSION_QUEUE,{
    connection:createNewRedisConnection(),
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:2000
        }
    }
});

submissionQueue.on("error",(err)=>{
    logger.error(  `Submission queue error: ${err}`);
})

submissionQueue.on("waiting",(job)=>{
    logger.info(`Submission job waiting:${job.id}`);
});

