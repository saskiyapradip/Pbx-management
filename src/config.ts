import dotenv from "dotenv";
dotenv.config();

const MONGOURI = process.env.MONGOURI || "";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "";
const PORT = process.env.PORT
const SECRET_KEY = process.env.JWT_SECRATE_KEY || "";
const ENVIRONMENT = process.env.ENVIRONMENT || "";
const SOCKET_URL = process.env.SOCKET_URL || "";
const SOCKET_TOKEN = process.env.SOCKET_TOKEN || "";
const SMS_TOKEN = process.env.SMS_TOKEN || "";
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN || "";
const APIURL= process.env.APIURL || "";

export const config = {
    mongo: {
        uri: MONGOURI
    },
    server: {
        port: PORT
    },
    db: {
        dbname: MONGO_DB_NAME
    },
    key: {
        secret_key: SECRET_KEY
    },
    enviroment: {
        enviroment_type: ENVIRONMENT
    },
    SOCKET:{
        URL:SOCKET_URL,
        TOKEN:SOCKET_TOKEN,
      },
      SMS:{
        TOKEN:SMS_TOKEN
      },
    API:{
        URL:APIURL,
        TOKEN:API_ACCESS_TOKEN
    },
    service: {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || "",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
    private_key: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
    client_id: process.env.FIREBASE_CLIENT_ID || "",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || "",
    universe_domain: "googleapis.com"
  }

}