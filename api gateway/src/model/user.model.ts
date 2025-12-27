import mongoose from 'mongoose';

export interface IUser extends Document{
    username:string,
    email:string,
    password:string,
    submission_count?:number
    createdAt:string,
    updatedAt:string
}


const userSchema =new mongoose.Schema<IUser>({
    username:{
        type:String,
        required:[true,'userName is required'],
        unique:[true,'username has to be unique'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'email has to be unique'],
        trim:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true
    },
    submission_count:{
        type:Number,
        default:0
    }
    },{
        timestamps:true
    }
)

export const User = mongoose.model<IUser>("User",userSchema);