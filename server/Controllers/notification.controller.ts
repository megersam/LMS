import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../Models/notificationModel";


// get all notifications  only for admins
export const getNotifications = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success:true,
            notifications,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update notification --only admin sides
export const updateNotification = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler('Notification not found', 400));
        }
        else{
            notification.status?notification.status = 'read' : notification?.status;
        }

        await notification.save();

        const notifications = await NotificationModel.find().sort({createdAt: -1});
        
        res.status(201).json({
            success:true,
            notifications
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})