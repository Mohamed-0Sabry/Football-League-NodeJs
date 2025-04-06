import request from 'supertest';
import app from '../../app';
import { createTestPlayer, createTestMatch, createTestPerformance } from '../testHelpers';
import { setupTestDatabase } from '../setup';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock teardown function since it's not exported from testHelpers
async function teardownTestDatabase() {
  // This is a placeholder - in a real implementation, you would clean up the database
  console.log('Teardown complete');
}

describe('Performance API Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/performances', () => {
    it('should return all performances', async () => {
      // Create test performances
      const performance1 = await createTestPerformance();
      const performance2 = await createTestPerformance();

      // Make request to API
      const response = await request(app).get('/api/performances');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.performances)).toBe(true);
      expect(response.body.performances.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/performances/player/:playerId', () => {
    it('should return performances for a specific player', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'Performance Player' });
      
      // Create a test performance for this player
      const performance = await createTestPerformance({ playerId: player.id });

      // Make request to API
      const response = await request(app).get(`/api/performances/player/${player.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.performances)).toBe(true);
      expect(response.body.performances.length).toBeGreaterThan(0);
      expect(response.body.performances[0].playerId).toBe(player.id);
    });
  });

  describe('GET /api/performances/match/:matchId', () => {
    it('should return performances for a specific match', async () => {
      // Create a test match
      const match = await createTestMatch();
      
      // Create a test performance for this match
      const performance = await createTestPerformance({ matchId: match.id });

      // Make request to API
      const response = await request(app).get(`/api/performances/match/${match.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.performances)).toBe(true);
      expect(response.body.performances.length).toBeGreaterThan(0);
      expect(response.body.performances[0].matchId).toBe(match.id);
    });
  });

  describe('POST /api/performances', () => {
    it('should create a new performance', async () => {
      // Create a test player and match
      const player = await createTestPlayer({ name: 'New Performance Player' });
      const match = await createTestMatch();

      // Make request to API
      const response = await request(app)
        .post('/api/performances')
        .send({
          playerId: player.id,
          matchId: match.id,
          stats: {
            goals: 1,
            assists: 2,
            shots: 5,
            passes: 30,
            tackles: 3,
            fouls: 1,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: 90
          },
          rating: 8.5,
          minutesPlayed: 90
        });

      // Assert response
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.performance).toBeDefined();
      expect(response.body.performance.playerId).toBe(player.id);
      expect(response.body.performance.matchId).toBe(match.id);
      expect(response.body.performance.rating).toBe(8.5);
    });
  });
}); 