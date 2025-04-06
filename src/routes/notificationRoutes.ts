import express from "express";
import { NotificationController } from "../controllers/notificationController";

const router = express.Router();
const notificationController = new NotificationController();

router.get("/", notificationController.getNotifications.bind(notificationController));
router.get("/unread", notificationController.getUnreadNotifications.bind(notificationController));
router.post("/:id/read", notificationController.markAsRead.bind(notificationController));
router.get("/warnings", notificationController.getPlayerWarnings.bind(notificationController));
router.post("/", notificationController.createNotification.bind(notificationController));

export default router;
