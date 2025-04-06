import request from 'supertest';
import app from '../../app';
import { createTestTeam, createTestMatch, createTestPlayer } from '../testHelpers';
import { setupTestDatabase } from '../setup';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock teardown function since it's not exported from testHelpers
async function teardownTestDatabase() {
  // This is a placeholder - in a real implementation, you would clean up the database
  console.log('Teardown complete');
}

describe('Match Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/matches', () => {
    it('should return all matches', async () => {
      // Create test matches
      const match1 = await createTestMatch();
      const match2 = await createTestMatch();

      // Make request to API
      const response = await request(app).get('/api/matches');

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.matches)).toBe(true);
      expect(response.body.matches.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/matches/:id', () => {
    it('should return a specific match', async () => {
      // Create a test match
      const match = await createTestMatch();

      // Make request to API
      const response = await request(app).get(`/api/matches/${match.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.match).toBeDefined();
      expect(response.body.match.id).toBe(match.id);
    });

    it('should return 404 for non-existent match', async () => {
      // Make request to API with non-existent match ID
      const response = await request(app).get('/api/matches/99999');

      // Assert response
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/matches/team/:teamId', () => {
    it('should return matches for a specific team', async () => {
      // Create a test team
      const team = await createTestTeam();
      
      // Create a test match with this team
      const match = await createTestMatch({ 
        homeTeam: team,
        awayTeam: await createTestTeam()
      });

      // Make request to API
      const response = await request(app).get(`/api/matches/team/${team.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.matches)).toBe(true);
      expect(response.body.matches.length).toBeGreaterThan(0);
      expect(response.body.matches[0].id).toBe(match.id);
    });
  });
}); 