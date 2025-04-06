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

describe('Lineup API Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/lineups/match/:matchId', () => {
    it('should return lineups for a specific match', async () => {
      // Create a test match
      const match = await createTestMatch();
      
      // Create test teams
      const homeTeam = await createTestTeam({ name: 'Home Team' });
      const awayTeam = await createTestTeam({ name: 'Away Team' });

      // Make request to API
      const response = await request(app).get(`/api/lineups/match/${match.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.lineups)).toBe(true);
    });
  });

  describe('GET /api/lineups/team/:teamId/match/:matchId', () => {
    it('should return lineup for a specific team in a match', async () => {
      // Create a test match and team
      const match = await createTestMatch();
      const team = await createTestTeam({ name: 'Lineup Team' });

      // Make request to API
      const response = await request(app).get(`/api/lineups/team/${team.id}/match/${match.id}`);

      // Assert response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.lineup).toBeDefined();
      expect(response.body.lineup.teamId).toBe(team.id);
      expect(response.body.lineup.matchId).toBe(match.id);
    });
  });

  describe('POST /api/lineups', () => {
    it('should create a new lineup', async () => {
      // Create a test match and team
      const match = await createTestMatch();
      const team = await createTestTeam({ name: 'New Lineup Team' });
      
      // Create test players
      const player1 = await createTestPlayer({ name: 'Lineup Player 1', team: team.name });
      const player2 = await createTestPlayer({ name: 'Lineup Player 2', team: team.name });
      const player3 = await createTestPlayer({ name: 'Lineup Player 3', team: team.name });

      // Make request to API
      const response = await request(app)
        .post('/api/lineups')
        .send({
          matchId: match.id,
          teamId: team.id,
          formation: '4-3-3',
          players: [
            { id: player1.id, position: 'Forward' },
            { id: player2.id, position: 'Midfielder' },
            { id: player3.id, position: 'Defender' }
          ],
          isConfirmed: true
        });

      // Assert response
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.lineup).toBeDefined();
      expect(response.body.lineup.teamId).toBe(team.id);
      expect(response.body.lineup.matchId).toBe(match.id);
      expect(response.body.lineup.formation).toBe('4-3-3');
      expect(Array.isArray(response.body.lineup.players)).toBe(true);
      expect(response.body.lineup.players.length).toBe(3);
    });
  });
}); 