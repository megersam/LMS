import express from "express";
import { authorizeRole, isAuthenticated } from "../Middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../Controllers/layout.controller";
const layoutRouter = express.Router();

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  authorizeRole("admin"),
  createLayout
);

layoutRouter.put(
  "/update-layout",
  isAuthenticated,
  authorizeRole("admin"),
  editLayout
);

layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;
