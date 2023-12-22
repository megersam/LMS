import express from "express";
import { authorizeRole, isAuthenticated } from "../Middleware/auth";
import { addAnswer, addQuestion, editCourse, getAllCourses, getCoursesByUser, getSingleCourse, uploadCourse } from "../Controllers/course.Controller";

const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, authorizeRole("admin"), uploadCourse);

courseRouter.put('/edit-course/:id', isAuthenticated, authorizeRole("admin"), editCourse);

courseRouter.get('/get-course/:id', getSingleCourse);

courseRouter.get('/get-courses', getAllCourses);

courseRouter.get('/get-courses-content/:id', isAuthenticated, getCoursesByUser);

courseRouter.put('/add-question', isAuthenticated, addQuestion);

courseRouter.put('/add-answer', isAuthenticated, addAnswer);



export default courseRouter;