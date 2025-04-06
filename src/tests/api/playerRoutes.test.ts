import request from 'supertest';
import app from '../../app';
import { createTestPlayer } from '../testHelpers';
import { setupTestDatabase } from '../setup';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock teardown function since it's not exported from testHelpers
async function teardownTestDatabase() {
  // This is a placeholder - in a real implementation, you would clean up the database
  console.log('Teardown complete');
}

describe('Player API Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/players', () => {
    it('should return all players', async () => {
      // Create test players
      const player1 = await createTestPlayer({ name: 'Test Player 1', position: 'Forward' });
      const player2 = await createTestPlayer({ name: 'Test Player 2', position: 'Midfielder' });

      // Make request to API
      const response = await request(app).get('/api/players');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.players)).toBe(true);
      expect(response.body.players.length).toBeGreaterThanOrEqual(2);
      
      // Check if our test players are in the response
      const playerNames = response.body.players.map((p: any) => p.name);
      expect(playerNames).toContain('Test Player 1');
      expect(playerNames).toContain('Test Player 2');
    });
  });

  describe('GET /api/players/search', () => {
    it('should search players by query', async () => {
      // Create test players with specific names
      await createTestPlayer({ name: 'Unique Player Name', position: 'Forward' });
      await createTestPlayer({ name: 'Another Player', position: 'Defender' });

      // Make request to API with search query
      const response = await request(app).get('/api/players/search?query=Unique');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.players)).toBe(true);
      
      // Check if only the matching player is returned
      expect(response.body.players.length).toBeGreaterThan(0);
      expect(response.body.players[0].name).toContain('Unique');
    });

    it('should return empty array when no matches found', async () => {
      // Make request to API with search query that won't match
      const response = await request(app).get('/api/players/search?query=NonExistentPlayer123');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.players)).toBe(true);
      expect(response.body.players.length).toBe(0);
    });
  });

  describe('GET /api/players/:id/statistics', () => {
    it('should return player statistics', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'Stats Player', position: 'Forward' });

      // Make request to API
      const response = await request(app).get(`/api/players/${player.id}/statistics`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.statistics).toBeDefined();
      expect(response.body.statistics.playerId).toBe(player.id);
    });

    it('should return 404 for non-existent player', async () => {
      // Make request to API with non-existent player ID
      const response = await request(app).get('/api/players/99999/statistics');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/players/:id/predictions', () => {
    it('should return player predictions', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'Prediction Player', position: 'Forward' });

      // Make request to API
      const response = await request(app).get(`/api/players/${player.id}/predictions`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.predictions).toBeDefined();
      expect(response.body.predictions.playerId).toBe(player.id);
    });
  });

  describe('GET /api/players/:id/injury-risk', () => {
    it('should return player injury risk', async () => {
      // Create a test player
      const player = await createTestPlayer({ name: 'Injury Risk Player', position: 'Forward' });

      // Make request to API
      const response = await request(app).get(`/api/players/${player.id}/injury-risk`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.injuryRisk).toBeDefined();
      expect(response.body.injuryRisk.playerId).toBe(player.id);
    });
  });
}); 