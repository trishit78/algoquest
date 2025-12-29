import { model, Schema } from "mongoose";

export enum SubmissionLanguage {
    CPP="cpp",
    PYTHON="python",
}

export enum SubmissionStatus {
    PENDING = "pending",
  COMPLETED="completed"
}

export interface ISubmissionData {
    status: string;
    testCaseId:string
}
export interface ISubmission extends Document{
    _id: any;
    problemId:string,
    userId:string,
    code:string,
    language:SubmissionLanguage;
    status:SubmissionStatus;
    submissionData:ISubmissionData;
    createdAt:Date,
    updatedAt:Date
}


const submissionSchema = new Schema<ISubmission>({
    problemId:{
        type:String,
        required:[true,"Problem Is required  for the submission"]
    },
    userId:{
        type:String,
        required:[true,"UserID is required  for the submission"]
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
    },
    submissionData:{
        type:Object,
        required:true,
        default:{}
    }
},{
    timestamps:true,
});


export const Submission = model<ISubmission>("Submission",submissionSchema); 