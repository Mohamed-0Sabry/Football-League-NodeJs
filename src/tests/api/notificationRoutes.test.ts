import request from 'supertest';
import app from '../../app';
import { createTestNotification, createTestPlayer } from '../testHelpers';
import { setupTestDatabase } from '../setup';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock teardown function since it's not exported from testHelpers
async function teardownTestDatabase() {
  // This is a placeholder - in a real implementation, you would clean up the database
  console.log('Teardown complete');
}

describe('Notification API Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/notifications', () => {
    it('should return all notifications', async () => {
      // Create test notifications
      const notification1 = await createTestNotification({ title: 'Test Notification 1' });
      const notification2 = await createTestNotification({ title: 'Test Notification 2' });

      // Make request to API
      const response = await request(app).get('/api/notifications');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.notifications)).toBe(true);
      expect(response.body.notifications.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/notifications/player/:playerId', () => {
    it('should return notifications for a specific player', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'Notification Player' });
      
      // Create a test notification for this player
      const notification = await createTestNotification({ 
        playerId: player.id,
        title: 'Player Specific Notification'
      });

      // Make request to API
      const response = await request(app).get(`/api/notifications/player/${player.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.notifications)).toBe(true);
      expect(response.body.notifications.length).toBeGreaterThan(0);
      expect(response.body.notifications[0].id).toBe(notification.id);
    });

    it('should return empty array for player with no notifications', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'No Notifications Player' });

      // Make request to API
      const response = await request(app).get(`/api/notifications/player/${player.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.notifications)).toBe(true);
      expect(response.body.notifications.length).toBe(0);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark a notification as read', async () => {
      // Create a test notification
      const notification = await createTestNotification({ isRead: false });

      // Make request to API
      const response = await request(app).put(`/api/notifications/${notification.id}/read`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.notification).toBeDefined();
      expect(response.body.notification.id).toBe(notification.id);
      expect(response.body.notification.isRead).toBe(true);
    });
  });
}); 