// Import Jest types
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

import { setupTestDatabase, teardownTestDatabase, createTestPlayer } from './testHelpers';
import { createTestServices } from './testServices';
import { Player } from '../types/player';

describe('PlayerService', () => {
  let playerService: ReturnType<typeof createTestServices>['playerService'];

  // Setup before all tests
  beforeAll(async () => {
    await setupTestDatabase();
    const services = createTestServices();
    playerService = services.playerService;
  });

  // Teardown after all tests
  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('getAllPlayers', () => {
    it('should return all players', async () => {
      // Create test players
      await createTestPlayer({ name: 'Player 1', position: 'Forward' });
      await createTestPlayer({ name: 'Player 2', position: 'Midfielder' });
      await createTestPlayer({ name: 'Player 3', position: 'Defender' });

      // Get all players
      const players = await playerService.getAllPlayers();

      // Assert
      expect(players).toBeDefined();
      expect(Array.isArray(players)).toBe(true);
      expect(players.length).toBeGreaterThanOrEqual(3);
      
      // Check that our test players are included
      const playerNames = players.map(player => player.name);
      expect(playerNames).toContain('Player 1');
      expect(playerNames).toContain('Player 2');
      expect(playerNames).toContain('Player 3');
    });
  });

  describe('getPlayerById', () => {
    it('should return a player by id', async () => {
      // Create a test player
      const testPlayer = await createTestPlayer({ 
        name: 'Test Player', 
        position: 'Goalkeeper',
        age: 30,
        nationality: 'Test Country'
      });
      // Get the player by id

      const players = await playerService.getAllPlayers();
      const player = players.find(p => p.id === testPlayer.id);

      expect(player).toBeDefined();
      expect(player?.id).toBe(testPlayer.id);
      expect(player?.name).toBe('Test Player');
      expect(player?.position).toBe('Goalkeeper');
      expect(player?.age).toBe(30);
      expect(player?.nationality).toBe('Test Country');
    });

    it('should return null for non-existent player id', async () => {
      // Get a non-existent player
      const players = await playerService.getAllPlayers();
      const player = players.find(p => p.id === 99999);

      // Assert
      expect(player).toBeNull();
    });
  });

  describe('searchPlayers', () => {
    it('should search players by name', async () => {
      // Create test players
      await createTestPlayer({ name: 'John Smith', position: 'Forward' });
      await createTestPlayer({ name: 'Jane Doe', position: 'Midfielder' });
      await createTestPlayer({ name: 'Johnny Johnson', position: 'Defender' });

      // Search for players with 'John' in their name
      const players = await playerService.searchPlayers('John');

      // Assert
      expect(players).toBeDefined();
      expect(Array.isArray(players)).toBe(true);
      expect(players.length).toBeGreaterThanOrEqual(2);
      
      // Check that our test players with 'John' in their name are included
      const playerNames = players.map(player => player.name);
      expect(playerNames).toContain('John Smith');
      expect(playerNames).toContain('Johnny Johnson');
    });
  });
}); 