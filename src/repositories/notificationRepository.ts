import { sql } from "drizzle-orm";
import { db } from "../config/db";
import { notifications } from "../db/schema";

export class NotificationRepository {
  async fetchNotifications() {
    return await db.select().from(notifications).orderBy(notifications.createdAt, sql`desc`);
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
}