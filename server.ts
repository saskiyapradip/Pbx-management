import express, { Express } from "express";
import mongoose, { mongo } from "mongoose";
import https from "http";
import cors from "cors";
import { config } from "./src/config";
import { Route } from "./src/routes";
import fs from "fs";
import helmet from "helmet";
import bodyParser from "body-parser";
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./src/utils/swagger";

const app = express();  
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    }
}));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hidePoweredBy());
  

const server = https.createServer(app)
app.use(bodyParser.json({ limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true,parameterLimit:500000}))
app.use(cors())
/** Error Hanldling  **/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/",Route)

mongoose.connect(config.mongo.uri, {
    dbName: config.db.dbname,
    serverSelectionTimeoutMS:5000
}).then(() => console.log("mongo db conneccted")).catch((error) => console.log("db not connected", error))
   


server.listen(config.server.port, function () {
    console.log("server running on", config.server.port)
})




