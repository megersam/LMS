import  express  from "express";
import { registrationUser } from "../Controllers/User.Controller";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

export default userRouter;