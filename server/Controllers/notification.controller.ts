import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../Models/notificationModel";
import cron from 'node-cron';


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
});


// delete notification with over 30 days and read status
cron.schedule("0 0 0 * * * ", async()=>{
    const thirtyDaysAgo = new Date(Date.now() -30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({status:'read', createdAt: {$lt: thirtyDaysAgo}});
    console.log('Deleted read notifications')
})