import express from 'express';
import { authorizeRole, isAuthenticated } from '../Middleware/auth';
import { createLayout } from '../Controllers/layout.controller';
const layoutRouter = express.Router();



layoutRouter.post('/create-layout', isAuthenticated, authorizeRole("admin"), createLayout);


export default layoutRouter;
