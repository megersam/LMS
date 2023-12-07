import  express  from "express";
import { activateUser, loginUser, logoutUser, registrationUser } from "../Controllers/User.Controller";
import { isAuthenticated } from "../Middleware/auth";
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', isAuthenticated, logoutUser);

export default userRouter;