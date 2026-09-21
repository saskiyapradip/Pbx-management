import { Request, Response, NextFunction } from "express";
import sendPushNotificationios from '../helper/sendPushNotificationios'
import sendPushNotification from '../helper/sendPushNotification'
import sip_tokens from "../models/sip_tokens";
import { emitHandler } from "../socket";
import axios from "axios";
import { config } from "../config";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

const sipLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body
  let sip_username: any = data.sip_username
  let sip_password: any = data.sip_password
  let device_id: any = data.device_id
  let push_token:any = data.push_token
  let push_type: any = data.push_type
  let envrironment:any = data.envrironment

  if (sip_username !== undefined &&
    sip_password !== undefined &&
    device_id !== undefined &&
    push_token !== undefined &&
    push_type !== undefined &&
    envrironment !== undefined
  ) {

    let chck_userSipdetail:any = await sip_tokens.findOne({
      username:sip_username,
      password:sip_password,
      push_token:push_token
    })
    let get_user_username:any = sip_username.split("-")
    if(chck_userSipdetail){
      let sip_user_detail:any = await sip_tokens.findOneAndUpdate({
        username:sip_username,
        password:sip_password,
        push_token:push_token
      },{
        push_token:push_token,
        device_id:device_id,
        push_type:push_type,
        envrironment:envrironment
      },{
        new:true
      })
      res.status(200).send({
        success: 1,
        message: "User Login Successfully"
      });
    }else{
      const sip_post = new sip_tokens();
      sip_post.device_id = device_id
      sip_post.username = sip_username;
      sip_post.password = sip_password;
      sip_post.push_token = push_token;
      sip_post.push_type = push_type ? push_type : 0;
      sip_post.envrironment = envrironment;
      await sip_post.save();
      res.status(200).send({
        success: 1,
        message: "User Login Successfully"
      });
    }
  } else {
    res.status(401).send({
      success: 0,
      message: "Some Params Missing"
    });
  }
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal server Error"
    });
  }
}
const sipLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body
    let sip_username: any = data.sip_username
    let sip_password: any = data.sip_password
    let push_token:any = data.push_token
  
    if (sip_username !== undefined &&
      sip_password !== undefined 
    ) {
      let check_sip_user:any = await sip_tokens.findOne({
        username:sip_username,
        password:sip_password,
        push_token:push_token
      })
  
      if(!check_sip_user){
        return res.status(404).send({
          success: 1,
          message: "Sip User Not Exists"
        });
      }
  
      let sip_user_detail:any = await sip_tokens.findOneAndDelete({
        username:sip_username,
        password:sip_password,
        push_token:push_token
      })
       
        return res.status(200).send({
          success: 1,
          message: "User Logout Successfully"
        });
    } else {
      res.status(401).send({
        success: 0,
        message: "Some Params Missing"
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal server Error"
    });
  }
}
const SendpushToAppAndroid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("send push to android app api called", req.body);
  // console.log("send push to android app api called json Parse", JSON.parse(req.body));
    try {
    let data: any = req.body;
    let androidErrorCount: any = 0;
    let iosErrorCount:any = 0;
    let caller_id:any = data.caller_id 
    let sip_username: any = data.sip_username
    let sip_password:any = data.sip_password
    
    let get_sip_tokens_android:any = await sip_tokens.find({
      username:sip_username,
      password:sip_password,
      push_type:0
    })
    let push_tokens_detail:any [] = [];
    await Promise.all(get_sip_tokens_android.map(async (item: any) => {
      push_tokens_detail.push(item.push_token.toString())
    }));
    let token: any[] = push_tokens_detail

    console.log("get_sip_tokens_android",get_sip_tokens_android)
    let notification_data: any = {
      call_id: caller_id.toString(),
      caller_number: data.caller_number?.toString(),
      caller_name: data.caller_name.toString(),
      call_type:"0"
    };
    if(get_sip_tokens_android.length > 0){
      let sendpush_response_android: any = await sendPushNotification(
        "Incoming Call",
        data.caller_number?.toString(),
        token,
        notification_data
      );
      console.log("sendpush_response_android", sendpush_response_android);
      if (sendpush_response_android?.failureCount > 0) {
        androidErrorCount = sendpush_response_android?.failureCount;
      }
    }
    let get_sip_tokens_ios: any = await sip_tokens.find({
      username: sip_username,
      password:sip_password,
      push_type: 1
    });
    if (get_sip_tokens_ios.length > 0 ) {
      console.log("get_sip_tokens_ios", get_sip_tokens_ios);
      let push_tokens_detail: any[] = [];
      let push_token_debug:any[] = [];
      await Promise.all(get_sip_tokens_ios.map(async (item: any) => {
        if(item.envrironment == "0"){
          push_token_debug.push(item.push_token.toString());
        }else{
          push_tokens_detail.push(item.push_token.toString());
        }
      
      }));
      let token: any[] = push_tokens_detail;
      let caller_number_parsed:any = parseInt(data.caller_number)
      let uuid4: string = uuidv4();
      
      let notification_data: any = {
        "caller_number": data.caller_number.toString(),
        "call-id": caller_id.toString(),
        "session_id": uuid4.toString(),
        "call_type": 0,
        "caller_id": caller_number_parsed,
        "signal_type": "startCall",
        "caller_name": data.caller_number.toString(),
        "call_opponents": data.caller_number.toString(),
        "user_info": data.caller_number.toString()
      };
     
      console.log("ready to send push", notification_data, );
      let sendpush_response_ios: any = await sendPushNotificationios(
        "Incoming Call",
        data.caller_number?.toString(),
        token,
        notification_data,
        push_token_debug
      );
      console.log("sendpush_response_ios", sendpush_response_ios);
      if (sendpush_response_ios.development.failed.length > 0 || sendpush_response_ios.production.failed.length > 0) {
        iosErrorCount = sendpush_response_ios.development.failed.length + sendpush_response_ios.production.failed.length;
      }
    }
    return res.status(200).send({
      success: 1,
      message: "Send Push Success",
      androidErrorCount: androidErrorCount,
      iosErrorCount:iosErrorCount
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
}
const ReceiveMessage = async (req: Request, res: Response) => {
  try {
    const {
      from_number,
      to_username,
      to_password,
      description,
      direction,
      filetype,
      messagetype,
      message_id,
      message_time
    } = req.body;

    if (from_number === undefined) {
      res.status(400).json({
        success: 0,
        message: "from_number is required",
      });
      return;
    }
    if (to_username === undefined) {
      res.status(400).json({
        success: 0,
        message: "to_username is required",
      });
      return;
    }
    
    if (description === undefined) {
      res.status(400).json({
        success: 0,
        message: "description is required",
      });
      return;
    }
    
    if (filetype === undefined) {
      res.status(400).json({
        success: 0,
        message: "filetype is required",
      });
      return;
    }
    if (messagetype === undefined) {
      res.status(400).json({
        success: 0,
        message: "messagetype is required",
      });
      return;
    }

    if (message_id === undefined) {
      res.status(400).json({
        success: 0,
        message: "message_id is required",
      });
      return;
    }

    if (message_time === undefined) {
      res.status(400).json({
        success: 0,
        message: "message_time is required",
      });
      return;
    }

    console.log("ready to send sms")
    await emitHandler("sms_received", {
      from_number,
      to_username,
      to_password:"",
      description,
      direction:"inbound",
      filetype,
      messagetype,
      message_id,
      message_time
    });

    res.status(200).json({
      success: 1,
      message: "Successfully receive message",
    });
  } catch (error) {
    res.status(500).json({
      success: 0,
      message: "Internal server error",
    });
    console.log(error);
  }
};
const SendpushToApp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("send push to app api called", req.body);
  // console.log("send push to android app api called json Parse", JSON.parse(req.body));
    try {
    let data: any = req.body;
    let androidErrorCount: any = 0;
    let iosErrorCount:any = 0;
    let caller_id:any = data.caller_id 
    let caller_name:any = data.caller_name
    let caller_number:any = data.caller_number
    let android_push_tokens:any = data.android_push_tokens
    let ios_push_tokens:any = data.ios_push_tokens
    
    let get_sip_tokens_android:any = await sip_tokens.find({
      push_token:{$in:android_push_tokens},
      push_type:0
    })
    let push_tokens_detail:any [] = [];
    await Promise.all(get_sip_tokens_android.map(async (item: any) => {
      push_tokens_detail.push(item.push_token.toString())
    }));
    let token: any[] = push_tokens_detail

    console.log("get_sip_tokens_android",get_sip_tokens_android)
    let notification_data: any = {
      call_id: caller_id.toString(),
      caller_number: caller_number.toString(),
      caller_name: caller_name.toString(),
      call_type:"0"
    };
    if(get_sip_tokens_android.length > 0){
      let sendpush_response_android: any = await sendPushNotification(
        "incoming Call",
        data.caller_number?.toString(),
        token,
        notification_data
      );
      console.log("sendpush_response_android", sendpush_response_android);
      if (sendpush_response_android?.failureCount > 0) {
        androidErrorCount = sendpush_response_android?.failureCount;
      }
    }
    let get_sip_tokens_ios: any = await sip_tokens.find({
      push_token:{$in:ios_push_tokens},
      push_type: 1
    });
    if (get_sip_tokens_ios.length > 0 ) {
      console.log("get_sip_tokens_ios", get_sip_tokens_ios);
      let push_tokens_detail: any[] = [];
      let push_token_debug:any[] = [];
      await Promise.all(get_sip_tokens_ios.map(async (item: any) => {
        if(item.envrironment == "0"){
          push_token_debug.push(item.push_token.toString());
        }else{
          push_tokens_detail.push(item.push_token.toString());
        }
      
      }));
      let token: any[] = push_tokens_detail;
      let caller_number_parsed:any = parseInt(data.caller_number)
      let uuid4: string = uuidv4();
      
      let notification_data: any = {
        "caller_number": caller_number.toString(),
        "call-id": caller_id.toString(),
        "session_id": uuid4.toString(),
        "call_type": 0,
        "caller_id": caller_number_parsed,
        "signal_type": "startCall",
        "caller_name": caller_name.toString(),
        "call_opponents": caller_number.toString(),
        "user_info": caller_number.toString()
      };
     
      console.log("ready to send push", notification_data, );
      let sendpush_response_ios: any = await sendPushNotificationios(
        "Incoming Call",
        data.caller_number?.toString(),
        token,
        notification_data,
        push_token_debug
      );
      console.log("sendpush_response_ios", sendpush_response_ios);
      if (sendpush_response_ios.development.failed.length > 0 || sendpush_response_ios.production.failed.length > 0) {
        iosErrorCount = sendpush_response_ios.development.failed.length + sendpush_response_ios.production.failed.length;
      }
    }
    return res.status(200).send({
      success: 1,
      message: "Send Push Success",
      androidErrorCount: androidErrorCount,
      iosErrorCount:iosErrorCount
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
}
export default {
  sipLogin,
  sipLogout,
  SendpushToAppAndroid,
  ReceiveMessage,
  SendpushToApp
};
