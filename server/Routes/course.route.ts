import express from "express";
import { authorizeRole, isAuthenticated } from "../Middleware/auth";
import { uploadCourse } from "../Controllers/course.Controller";

const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, authorizeRole("admin"), uploadCourse);



export default courseRouter;