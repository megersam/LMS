import  express  from "express";
import { activateUser, registrationUser } from "../Controllers/User.Controller";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser);

export default userRouter;