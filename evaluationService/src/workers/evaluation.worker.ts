import { Job, Worker } from "bullmq";

import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../apis/submission.api";



function matchTestCasesWithResults(testcases:TestCase[],results:EvaluationResult[]){
    
    const output:Record<string,string> = {};
    if(results.length !== testcases.length){
        console.log("WA");
        return;
    }

    testcases.map((testcase,index)=>{
        let val= "";
        if(results[index].status ==="time_limit_exceeded"){
           val="TLE";
        }
        else if(results[index].status === "failed"){
            val="Error";
        }else{
            if(results[index].output === testcase.output){
                val="AC";
            }
            else{
                val="WA";
            }
        }

        console.log("value of testcases",val);
        output[testcase._id] = val;
    });
    return output;
}


async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE,async(job:Job)=>{
        logger.info(`Processing job ${job.id}`);
        const data:EvaluationJob = job.data;
        console.log(data);

        console.log("data problem testcases",  data.problem.testcases);

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
    // await updateSubmission(data.submissionId,"completed",output);
    if (output) {
        await updateSubmission(data.submissionId,"completed",output);
    } else {
        await updateSubmission(data.submissionId,"failed",{});
    }

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