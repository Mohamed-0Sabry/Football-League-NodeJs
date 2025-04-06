import { sql } from "drizzle-orm";
import { db } from "../db/db";
import { notifications, players } from "../db/schema";
import { eq } from "drizzle-orm";
import { Player } from "../types/player";

export interface Notification {
  id: number;
  playerId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  player?: Player | null;
}

export class NotificationRepository {
  async fetchNotifications(): Promise<Notification[]> {
    const dbNotifications = await db.select().from(notifications);
    return this.mapDbNotificationsToNotifications(dbNotifications);
  }

  async fetchNotificationById(id: number): Promise<Notification | null> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id));
    return result[0] ? this.mapDbNotificationToNotification(result[0]) : null;
  }

  async fetchNotificationsByPlayerId(playerId: number): Promise<Notification[]> {
    const dbNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.playerId, playerId));
    return this.mapDbNotificationsToNotifications(dbNotifications);
  }

  async fetchUnreadNotifications(): Promise<Notification[]> {
    const dbNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.isRead, false));
    return this.mapDbNotificationsToNotifications(dbNotifications);
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'player'>): Promise<Notification> {
    const result = await db.insert(notifications).values({
      ...notificationData,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return this.mapDbNotificationToNotification(result[0]);
  }

  async markAsRead(id: number): Promise<Notification | null> {
    await db.update(notifications)
      .set({
        isRead: true,
        updatedAt: new Date()
      })
      .where(eq(notifications.id, id));
    
    return this.fetchNotificationById(id);
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
    return result.length > 0;
  }

  async fetchPlayerWarnings() {
    const warnings = await db.execute(
      `SELECT p.id, p.name, p.position, p.fatigue,
        CASE
          WHEN p.fatigue > 80 THEN 'High risk of injury'
          WHEN p.fatigue > 60 THEN 'Moderate risk of injury'
          ELSE 'Low risk of injury'
        END as warning
       FROM players p
       WHERE p.fatigue > 50
       ORDER BY p.fatigue DESC`
    );
    
    return warnings.rows;
  }

  // Helper methods to map database types to application types
  private mapDbNotificationToNotification(dbNotification: any): Notification {
    return {
      id: dbNotification.id,
      playerId: dbNotification.playerId,
      title: dbNotification.title,
      message: dbNotification.message,
      type: dbNotification.type,
      isRead: dbNotification.isRead,
      createdAt: dbNotification.createdAt,
      updatedAt: dbNotification.updatedAt,
      player: null // This would need to be fetched separately
    };
  }

  private mapDbNotificationsToNotifications(dbNotifications: any[]): Notification[] {
    return dbNotifications.map(notification => this.mapDbNotificationToNotification(notification));
  }
}