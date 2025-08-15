import express from "express";
import { getNotifications, deleteNotification } from "../controllers/notification.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// public routes
router.get("/", getNotifications);

// protected routes
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
