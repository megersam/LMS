import express from 'express'
import { authorizeRole, isAuthenticated } from '../Middleware/auth';
import { getNotifications, updateNotification } from '../Controllers/notification.controller';
const notificationRoute = express.Router();


notificationRoute.get('/get-all-notifications', isAuthenticated, authorizeRole("admin"), getNotifications);

notificationRoute.put('/update-notification/:id', isAuthenticated, authorizeRole("admin"), updateNotification);

export default notificationRoute;