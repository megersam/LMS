import  express  from "express";
import { isAuthenticated } from "../Middleware/auth";
import { createOrder } from "../Controllers/order.Controller";
const orderRouter = express.Router();

orderRouter.post('/create-order', isAuthenticated, createOrder);

export default orderRouter;