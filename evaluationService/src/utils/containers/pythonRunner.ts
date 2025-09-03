import { PYTHON_IMAGE } from "../constants";
import { createNewDockerContainer } from "./createContainer.util";

export async function runPyCode(code:string) {
    const runCommand = `echo '${code}' > code.py && python3 code.py`;

    const container = await createNewDockerContainer({
        imageName:PYTHON_IMAGE,
        cmdExecutable:["/bin/bash","-c",runCommand],
        memoryLimit:1024*1024*1024
    });
    console.log("Container created successfully", container?.id);

    await container?.start();
    const status =  await container?.wait();
    console.log('Container status',status);

    const logs = await container?.logs({
        stderr:true,
        stdout:true
    });

    console.log("Container logs",logs?.toString());

    await container?.remove();
}