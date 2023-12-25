import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../Models/layout.Model";
import  cloudinary from "cloudinary";




// create a layout api
export const createLayout = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        
        const  {type} = req.body;

        const typeExisit = await LayoutModel.findOne({type});

        if(typeExisit){
            return next(new ErrorHandler(`${type} already existed`, 400));
        };

        if(type==='Banner'){
            const {image, title, subTitle} = req.body;
            // upload image to cloudinary.
            const myCloud = await cloudinary.v2.uploader.upload(image,{
                folder: 'layout',
            });

            const banner = {
                image:{
                    public_id: myCloud.public_id,
                    url:myCloud.secure_url,
                },
                title,
                subTitle,
            }
            await LayoutModel.create(banner);
        };

        if (type==='FAQ') {
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return{
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create({type: 'FAQ', faq:faqItems});
        };

        if(type==='Categories'){
            const {categories} = req.body;
            const categoriesItem = await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.create({type:'Categories', categories: categoriesItem});
        };

        res.status(201).json({
            success:true,
            message: 'Layout created successfully',
        });


    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})