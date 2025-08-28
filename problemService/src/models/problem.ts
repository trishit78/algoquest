import mongoose, { Document } from "mongoose";


export interface ITestcases extends Document{
    input:string,
    output:string
}

export interface IProblem extends Document{
    title:string,
    description:string,
    difficulty:"easy" | "medium" | "hard",
    testcases:ITestcases[],
    editorial?:string,
    createdAt:string,
    updatedAt:string
}


const testSchema = new mongoose.Schema<ITestcases>({
    input:{
        type:String,
        required:[true,"Input is required"],
        trim:true
    },
    output:{
        type:String,
        required:[true,"Output is required"],
        trim:true
    }
},{
    //_id:false      -> if we dont want the _id for each input and output
})


const problemSchema = new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,'Title is req'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'description is req'],
        trim:true
    },
    difficulty:{
        type:String,
        enum:{
            values:["easy","medium","hard"],
            message:"Invalid difficulty level"
        },
        default:"easy",
        required:[true,"Invalid difficulty level"]
    },
    
    // testcases:[
    //     {
    //         input:{
    //             type:String,
    //             required:[true,'input is required']
    //         },
    //         output:{
    //             type:String,
    //             required:[true,'output is req']
    //         }
    //     }
    // ],

    testcases:[testSchema],
    editorial:{
        type:String,
        trim:true
    }
},{
    timestamps:true,
    // toJSON:{
    //     transform:(_,record)=>{
    //         delete(record as any)._v;
    //          record.id = record._id;
    //          delete record._id;
    //          return record
    //     }   
    // }

})


problemSchema.index({ title: 1 }, { unique: true }); // index on title field
problemSchema.index({ difficulty: 1 }); // index on difficulty field


export const problem = mongoose.model<IProblem>('Problem',problemSchema);