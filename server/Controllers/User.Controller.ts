require('dotenv').config();
import { Response, Request, NextFunction } from "express";
import userModel, {IUser} from "../Models/User.Model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import  Jwt, { Secret }  from "jsonwebtoken";
import ejs from 'ejs';
import path from "path";
import sendMail from "../utils/sendMail";

// register user
interface IRegistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export const registrationUser = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {name, email, password} = req.body;

        // check email is exist.
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler('Email already existed', 400));
        };
        const user:IRegistrationBody = {
            name,
            email,
            password,
        };

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode

        const data = {user: {name:user.name}, activationCode};
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation.mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your Account",
                template: "activation.mail.ejs",
                data,

            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: activationToken.token,
            })
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface IActivationToken{
    token: string,
    activationCode: string,
}
export const createActivationToken = (user:any):IActivationToken =>{
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = Jwt.sign({
        user,activationCode
    }, process.env.ACTIVATION_SECRET as Secret,{
        expiresIn:"5m"
    });
    return {token, activationCode}
}

// activate user
interface IActivationRequest{
    activation_token:string;
    activation_code:string;
}

export const activateUser = CatchAsyncErrors(async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const {activation_token,activation_code} = req.body as IActivationRequest;

        const newUser: {user:IUser; activationCode:string} = Jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as {user: IUser; activationCode:string};

    

        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation", 400));
        }
        const {name,email,password} = newUser.user;
        
        const existUser = await userModel.findOne({email});
        if(existUser){
            return next(new ErrorHandler("Email Already Exist", 400));
        } 
        const user = await userModel.create({
            name,
            email,
            password
        });
        res.status(201).json({
            success:true
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
})
