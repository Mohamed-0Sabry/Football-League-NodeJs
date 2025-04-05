import { Request, Response } from "express";
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
  async getNotifications(req: Request, res: Response) {
    try {
      const notifications = await notificationService.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
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
  async getPlayerWarnings(req: Request, res: Response) {
    try {
      const warnings = await notificationService.getPlayerWarnings();
      res.json(warnings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player warnings" });
    }
  }
}
