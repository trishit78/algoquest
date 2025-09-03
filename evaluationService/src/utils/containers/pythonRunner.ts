//import { PYTHON_IMAGE } from "../constants";
import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createContainer.util";


const allowedListedLanguage = ['python','cpp'];
export interface RunCodeOptions{
    code:string,
    language:"python"| "cpp",
    timeout:number,
    imageName:string
}

export async function runCode(options: RunCodeOptions) {
    const {code,language,timeout,imageName} = options;

    if(!allowedListedLanguage.includes(language)){
        throw new InternalServerError(`Invalid lang`);
    }


    const container = await createNewDockerContainer({
        imageName:imageName,
        cmdExecutable:commands[language](code),
        memoryLimit:1024*1024*1024
    });

    const tle = setTimeout(()=>{
        console.log("Time limit exceeded");
         container?.kill();
    },timeout);

    console.log("Container created successfully", container?.id);

    await container?.start();
    const status =  await container?.wait();
    console.log('Container status',status);

    const logs = await container?.logs({
        stderr:true,
        stdout:true,follow:false
    });

    console.log("Container logs",logs?.toString("utf-8").trim());

    await container?.remove();

    if(status.StatusCode == 0){
        clearTimeout(tle);
        console.log("Container exited successfully");
    }else{
        clearTimeout(tle);
        console.log("Container exited with error");
    }
}