import apn from "apn";
import fs from "fs";
const key_file = process.env.APN_AUTH_KEY ? Buffer.from(process.env.APN_AUTH_KEY.replace(/\\n/g, "\n")) : fs.readFileSync(__dirname + "/AuthKey.p8");
const appprovider: any = new apn.Provider({
	token:{
		keyId: process.env.APN_KEY_ID || "",
		teamId: process.env.APN_TEAM_ID || "",
		key:key_file
	},
	production:true
});
const appprovider_devlopment: any = new apn.Provider({
	token:{
		keyId: process.env.APN_KEY_ID || "",
		teamId: process.env.APN_TEAM_ID || "",
		key:key_file
	},
	production:false
});
const sendPushNotificationios = async (title: any, body: any, myTokens: any, mydata: any,token_development:any) => {
	try {
		console.log("send notification function called ios")
	let registrationTokens = [...new Set(myTokens)];
	let registration_token_development = [...new Set(token_development)];
	let notification = new apn.Notification();
    notification.topic = "com.corepbx.voip";   // Make sure to append .voip here!
	notification.expiry = 0;
	notification.badge = 0;
	notification.sound = "default";
	notification.alert = "Incoming Call";
	notification.priority = 10;
	notification.payload = mydata;

	
		let apiresponse_debugg:any = await appprovider_devlopment.send(notification,registration_token_development)
	.then((response:any) => {
		console.log("push response ios devlopment",JSON.stringify(response))
			return response;
	});
	
		let apiresponse:any = await appprovider.send(notification,registrationTokens)
	.then((response:any) => {
		console.log("push response ios production",JSON.stringify(response))
			return response;
	});
	return {development:apiresponse_debugg ,production:apiresponse}
	
} catch (error:any) {
	console.log("error",error)
}
}

export default sendPushNotificationios;






