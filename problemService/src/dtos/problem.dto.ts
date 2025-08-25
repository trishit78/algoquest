import { ITestcases } from "../models/problem"

export type createProblemDTO ={
    title:string,
    difficulty:"easy"|"medium" | "hard",
    description:string,
    // testcases:{
    //     input:string,
    //     output:string
    // }[],
    testcases:ITestcases[]
}




