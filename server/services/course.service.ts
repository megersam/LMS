import { Response } from "express";
import { CatchAsyncErrors } from "../Middleware/CatchAsyncErrors";
import CourseModel from "../Models/course.Model";

// create a course
export const createCourse = CatchAsyncErrors(async(data:any, res:Response)=>{
    const course = await CourseModel.create(data);
    res.status(201).json({
        success:true,
        course,
    });
});


// get all courses.
export const getAllCoursesServices = async(res:Response)=>{
    const courses = await CourseModel.find().sort({createdAt: -1});

    res.status(201).json({
        success:true,
        courses,
    });
};

