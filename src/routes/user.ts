import { Router } from "express";
import userCtrl from "../controller/userCtrl";


export const UserRoute = Router();


UserRoute.post("/sip/login", userCtrl.sipLogin);
UserRoute.post("/sip/logout", userCtrl.sipLogout);
UserRoute.post("/android/push", userCtrl.SendpushToAppAndroid);
UserRoute.post("/sms/receive", userCtrl.ReceiveMessage);
UserRoute.post("/voip/push", userCtrl.SendpushToApp);



