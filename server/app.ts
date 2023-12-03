import { createRequire as _createRequire } from "module";
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from "cookie-parser";
import { error } from "console";
require("dotenv").config();
import { ErrorMiddleware } from "./Middleware/error";


// body parser
app.use(express.json({limit: '50mb'}));


// cookie parser
app.use(cookieParser());


// CORS
app.use(cors({
    origin: process.env.ORIGIN
}));


// testing api
app.get('/test', (req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({
        success: true,
        message: "Test Api Working"
    });
});


// unknown routes
app.all('*', (req:Request, res:Response, next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);