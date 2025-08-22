import mongoose, { Document } from "mongoose";


export interface ITestcases extends Document{
    input:string,
    output:string
}

export interface IProblem extends Document{
    title:string,
    difficulty:string,
    description:string,
    testcases:ITestcases[],
    createdAt:string,
    updatedAt:string
}


const problemSchema = new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,'Title is req']
    },
    description:{
        type:String,
        required:[true,'description is req']
    },
    difficulty:{
        type:String,
        required:[true,'difficulty is req']
    },
    
    testcases:[
        {
            input:{
                type:String,
                required:[true,'input is required']
            },
            output:{
                type:String,
                required:[true,'output is req']
            }
        }
    ]
},{timestamps:true})

export const problem = mongoose.model<IProblem>('Problem',problemSchema)