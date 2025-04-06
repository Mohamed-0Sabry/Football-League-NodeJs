import request from 'supertest';
import app from '../../app';
import { createTestMatch, createTestTeam } from '../testHelpers';
import { setupTestDatabase } from '../setup';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock teardown function since it's not exported from testHelpers
async function teardownTestDatabase() {
  // This is a placeholder - in a real implementation, you would clean up the database
  console.log('Teardown complete');
}

describe('AI API Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/ai/generate-lineup', () => {
    it('should generate a lineup for a team', async () => {
      // Create a test team
      const team = await createTestTeam();
      
      // Create a test match
      const match = await createTestMatch();

      // Make request to API
      const response = await request(app)
        .post('/api/ai/generate-lineup')
        .send({
          teamId: team.id,
          matchId: match.id,
          formation: '4-3-3'
        });

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.lineup).toBeDefined();
      expect(response.body.lineup.teamId).toBe(team.id);
      expect(response.body.lineup.matchId).toBe(match.id);
      expect(response.body.lineup.formation).toBe('4-3-3');
      expect(Array.isArray(response.body.lineup.players)).toBe(true);
    });
  });

  describe('POST /api/ai/predict-match', () => {
    it('should predict the outcome of a match', async () => {
      // Create test teams
      const homeTeam = await createTestTeam({ name: 'Home Team' });
      const awayTeam = await createTestTeam({ name: 'Away Team' });
      
      // Create a test match
      const match = await createTestMatch();

      // Make request to API
      const response = await request(app)
        .post('/api/ai/predict-match')
        .send({
          matchId: match.id
        });

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.prediction).toBeDefined();
      expect(response.body.prediction.matchId).toBe(match.id);
      expect(response.body.prediction.homeTeamScore).toBeDefined();
      expect(response.body.prediction.awayTeamScore).toBeDefined();
      expect(response.body.prediction.winner).toBeDefined();
    });
  });

  describe('POST /api/ai/analyze-performance', () => {
    it('should analyze player performance', async () => {
      // Create a test match
      const match = await createTestMatch();

      // Make request to API
      const response = await request(app)
        .post('/api/ai/analyze-performance')
        .send({
          matchId: match.id
        });

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.analysis).toBeDefined();
      expect(response.body.analysis.matchId).toBe(match.id);
      expect(Array.isArray(response.body.analysis.playerAnalyses)).toBe(true);
    });
  });
}); 