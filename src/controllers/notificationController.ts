import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notificationService";

const notificationService = new NotificationService();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications and player warnings
 */
export class NotificationController {
  /**
   * @swagger
   * /api/notifications:
   *   get:
   *     summary: Get all notifications
   *     tags: [Notifications]
   *     responses:
   *       200:
   *         description: List of notifications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   title:
   *                     type: string
   *                   message:
   *                     type: string
   *                   type:
   *                     type: string
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   playerId:
   *                     type: integer
   *                     nullable: true
   *                   read:
   *                     type: boolean
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getNotifications();
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/notifications/unread:
   *   get:
   *     summary: Get unread notifications
   *     tags: [Notifications]
   *     responses:
   *       200:
   *         description: List of unread notifications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Notification'
   */
  async getUnreadNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.getUnreadNotifications();
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/notifications/{id}/read:
   *   post:
   *     summary: Mark a notification as read
   *     tags: [Notifications]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Notification ID
   *     responses:
   *       200:
   *         description: Notification marked as read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = parseInt(req.params.id);
      await notificationService.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/notifications/warnings:
   *   get:
   *     summary: Get player fatigue warnings
   *     tags: [Notifications]
   *     responses:
   *       200:
   *         description: List of player warnings based on fatigue levels
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   position:
   *                     type: string
   *                   fatigue:
   *                     type: number
   *                   warning:
   *                     type: string
   *                   type:
   *                     type: string
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getPlayerWarnings(req: Request, res: Response, next: NextFunction) {
    try {
      const warnings = await notificationService.getPlayerWarnings();
      res.json(warnings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/notifications:
   *   post:
   *     summary: Create a new notification
   *     tags: [Notifications]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               message:
   *                 type: string
   *               type:
   *                 type: string
   *               playerId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Notification created successfully
   */
  async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.createNotification(req.body);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }
}
