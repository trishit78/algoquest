import { Job, Worker } from "bullmq";

import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner";
import { LANGUAGE_CONFIG } from "../config/language.config";



function matchTestCasesWithResults(testcases:TestCase[],results:EvaluationResult[]){
    
    const output:string[] = [];
    if(results.length !== testcases.length){
        console.log("WA");
        return;
    }

    testcases.map((testcase,index)=>{
        if(results[index].status ==="time_limit_exceeded"){
            output.push("TLE")
        }
        else if(results[index].status === "failed"){
            output.push("Error");
        }else{
            if(results[index].output === testcase.output){
                output.push("AC");
            }
            else{
                output.push("WA");
            }
        }
    });
    return output;
}


async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE,async(job:Job)=>{
        logger.info(`Processing job ${job.id}`);
        const data:EvaluationJob = job.data;
        console.log(data);

try {
    const testCasesRunnerPromise = data.problem.testcases.map(testcase =>{
        
    return runCode({
        code:data.code,
        language:data.language,
        timeout:LANGUAGE_CONFIG[data.language].timeout,
        imageName:LANGUAGE_CONFIG[data.language].imageName,
        input:testcase.input
    });
    });

    const testCasesRunnerResults : EvaluationResult[] = await Promise.all(testCasesRunnerPromise);
    console.log("testCasesRunnerResults",testCasesRunnerResults);


    const output = matchTestCasesWithResults(data.problem.testcases,testCasesRunnerResults)

    console.log("output",output);

} catch (error) {
    logger.error(`Evaluation job failed: ${job}`,error);
    return;
}
        
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