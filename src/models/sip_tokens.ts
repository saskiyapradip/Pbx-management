import mongoose, { Schema,Document  } from "mongoose";

export interface sip_tokens{
        username:String;
        password:String;
        device_id:String,
        push_token:String;
        push_type:Number;
        didNumber:String;
        envrironment:String;
}

export interface User_sip_tokensModel extends sip_tokens , Document {}

const prepSchema:Schema = new Schema({
  username: {
      type: String,
      required: "token is required"
    },
    password: {
      type: String,
      required: "token is required"
    },
    device_id: {
      type: String,
      required: "token is required"
    },
    push_token:{
      type: String,
      required: "token is required"
    },
    push_type: {
      type: Number,
      default: 1 // 1 for android 2 ios
    },
    didNumber:{
      type: String,
      default:""
    },
    envrironment:{
      type: String,
      required: "envrironment is required" //0 for Development 1 for Live
    }
  }, {
    timestamps: true
  })

export default mongoose.model<User_sip_tokensModel>("sip_tokens", prepSchema)