import { model, Schema } from "mongoose";

export enum SubmissionLanguage {
    CPP="cpp",
    PYTHON="python",
}

export enum SubmissionStatus {
    PENDING = "pending",
    COMPILING = "compiling",
    RUNNING="running",
    ACCEPTED="accepted",
    WRONG_ANSWER= "wrong_answer"
}


export interface ISubmission extends Document{
    _id: any;
    problemId:string,
    code:string,
    language:SubmissionLanguage;
    status:SubmissionStatus
    createdAt:Date,
    updatedAt:Date
}


const submissionSchema = new Schema<ISubmission>({
    problemId:{
        type:String,
        required:[true,"Problem Is required  for the submission"]
    },
    code:{
        type:String,
        required:[true,"Code is required for the evaluation"]
    },
    language:{
        type:String,
        required:[true,"Language us required for evaluation"],
        enum:Object.values(SubmissionLanguage)
    },
    status:{
        type:String,
        required:true,
        default:SubmissionStatus.PENDING,
        enum:Object.values(SubmissionStatus)
    }
},{
    timestamps:true,
});

submissionSchema.index({problemId:1,language:1,status:1},{unique:true});

export const Submission = model<ISubmission>("Submission",submissionSchema); 