import  express  from "express";
import { authorizeRole, isAuthenticated } from "../Middleware/auth";
import { createOrder, getAllOrders } from "../Controllers/order.Controller";
const orderRouter = express.Router();

orderRouter.post('/create-order', isAuthenticated, createOrder);

orderRouter.get('/get-orders', isAuthenticated, authorizeRole("admin"), getAllOrders);

export default orderRouter;