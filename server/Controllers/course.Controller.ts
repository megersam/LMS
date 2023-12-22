
import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary'
import { createCourse } from "../services/course.service";
import CourseModel from "../Models/course.Model";
import { redis } from "../utils/redis";
import mongoose, { mongo } from "mongoose";
import { idText } from "typescript";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";



// create course
export const uploadCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });;
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }
        createCourse(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// edit course
export const editCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if(thumbnail){
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder: 'courses',
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(
            courseId,
            {
                $set: data,
            },
            { new: true}
        );
        res.status(201).json({
            success: true,
            course,
        });
  } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// get single course --without purchase.
export const getSingleCourse = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    
    try {

        const  courseId = req.params.id;
        const isCatchExist = await redis.get(courseId);

        if(isCatchExist){
            const course = JSON.parse(isCatchExist);
            res.status(200).json({
                success:true,
                course,
            });
        }
        else{
            const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set(courseId, JSON.stringify(course));
            res.status(200).json({
                success:true,
                course
            });
        }

       
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get all courses
export const getAllCourses = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {

    
        const isCatchExist = await redis.get("allCourses");
        if (isCatchExist) {
            const course = JSON.parse(isCatchExist);
        }else{
            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            
            await redis.set("allCourse", JSON.stringify(courses));
            res.status(200).json({
                success:true,
                courses,
            });
        }

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// get course content only for valid users
export const getCoursesByUser = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExist = userCourseList?.find((course:any) => course._id.toString() === courseId);

        if(!courseExist){
            return next (new ErrorHandler("Your are not Eligible to access !" , 400));
        }

        const course = await CourseModel.findById(courseId);
        const content  = course?.courseData;

        res.status(200).json({
            success: true,
            content,
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// add questions in courses.
interface IAddQuestionData{
    question:string,
    courseId:string,
    contentId:string,
}

export const addQuestion = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {question, courseId, contentId} : IAddQuestionData = req.body;
        const course = await CourseModel.findById(courseId);


        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return next(new ErrorHandler('Invalid content Id', 400));
        }
        const courseContent = course?.courseData?.find((item:any)=> item._id.equals(contentId));

        if(!courseContent){
            return next(new ErrorHandler('Invalid content id', 400));
        }

        // create a new question.
        const newQuestion:any = {
            question,
            user:req.user,
            questionReplies:[],
        };
        // add this question object to course.
        courseContent.questions.push(newQuestion);

        // save the updated course
        await  course?.save();

        res.status(200).json({
            success:true,
            course,
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// create a question reply interface and api
interface IAddAnswerDate{
    answer:string,
    courseId:string,
    contentId:string,
    questionId:string,
}

export const addAnswer = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {answer, courseId, contentId, questionId}: IAddAnswerDate = req.body;
        const course = await CourseModel.findById(courseId);


        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return next(new ErrorHandler('Invalid content id', 400));
        }

        const courseContent =  course?.courseData?.find((item:any)=> item._id.equals(contentId));

        if(!courseContent){
            return next(new ErrorHandler('Invalid content Id', 400));
        }

        const question = courseContent?.questions?.find((item: any)=> item._id.equals(questionId));

        if(!question){
            return next(new ErrorHandler('Invalid question id', 400));
        }

        // create a new answer object
        const newAnswer:any = {
            user: req.user,
            answer,
        }

        // add this new object to our course content
        question.questionReplies.push(newAnswer);
        // save the data to mongo db
        await course?.save();

        if(req.user?._id === question.user._id){
            // create a notification center here...

        }else{
            const data = {
                name: question.user?.name,
                title: courseContent.title,
            }
            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            } catch (error:any) {
                return next(new ErrorHandler(error.message, 400));
            }
        };

        res.status(200).json({
            success:true,
            course,
        });

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
})