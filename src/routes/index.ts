import { Router } from "express";
import { UserRoute } from "./user";

export const Route = Router();


Route.use("/user",UserRoute);

Route.use((req,res,next)=>{
    const error = new Error("not found")
    return res.status(404).json({message:error.message})
})



