import express from "express";
import { authorizeRole, isAuthenticated } from "../Middleware/auth";
import { editCourse, uploadCourse } from "../Controllers/course.Controller";

const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, authorizeRole("admin"), uploadCourse);

courseRouter.put('/edit-course/:id', isAuthenticated, authorizeRole("admin"), editCourse);



export default courseRouter;