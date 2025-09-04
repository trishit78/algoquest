//import { PYTHON_IMAGE } from "../constants";

import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createContainer.util";
//import { createNewDockerContainer } from "./createContainer.util";


const allowedListedLanguage = ['python','cpp'];
export interface RunCodeOptions{
    code:string,
    language:"python"| "cpp",
    timeout:number,
    imageName:string,
    input:string
}

export async function runCode(options: RunCodeOptions) {
    const {code,language,timeout,imageName,input} = options;

    if(!allowedListedLanguage.includes(language)){
        throw new InternalServerError(`Invalid lang`);
    }


    const container = await createNewDockerContainer({
        imageName:imageName,
        cmdExecutable:commands[language](code,input),
        memoryLimit:1024*1024*1024
    });

    let isTimeLimitExceeded = false;
    const tle = setTimeout(()=>{
        console.log("Time limit exceeded");
        isTimeLimitExceeded = true;
         container?.kill();
    },timeout);

   // console.log("Container created successfully", container?.id);

    await container?.start();
    const status =  await container?.wait();

    if(isTimeLimitExceeded){
      await container?.remove()
        return {
            status:"time_limit_exceeded",
            output:"Time limit exceeded"
        }
    }

    //console.log('Container status',status);

    const logs = await container?.logs({
        stderr:true,
        stdout:true,follow:false
    });

  const containerLogs = processLogs(logs);
  //console.log(containerLogs);


    //console.log("Container logs",logs?.toString("utf-8").trim());
    // const sampleOutput = "625";
    // console.log("logs string", logsString);
    // fs.writeFileSync("logs.txt",logsString || '');
    //console.log("Is matching", containerLogs === sampleOutput)
    await container?.remove();

    clearTimeout(tle);
    if(status.StatusCode == 0){
        //console.log("Container exited successfully");
        return {
            status:"success",
            output:containerLogs
        }
    }else{
        //console.log("Container exited with error");
        return {
            status:"fail",
            output:containerLogs
        }
    }
}

function processLogs(logs:Buffer |undefined){
    const logsString = logs?.toString()
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '') // Remove control characters except \n (0x0A)
    .trim();

    return logsString
}