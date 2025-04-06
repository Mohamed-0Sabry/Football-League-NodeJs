import { describe, it, expect } from '@jest/globals';
import { testDb } from '../config/testDb';
import { players } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Remote Database Tests', () => {
  it('should connect to the remote database', async () => {
    // This test simply verifies that we can connect to the database
    const result = await testDb.select().from(players).limit(1);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should insert and retrieve data', async () => {
    // Insert a test player
    const testPlayer = {
      name: 'Test Player',
      position: 'Forward',
      nationality: 'Test Country',
      dateOfBirth: new Date('1990-01-01'),
      height: 180,
      weight: 75,
      preferredFoot: 'Right',
      jerseyNumber: 10,
      teamId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [insertedPlayer] = await testDb.insert(players).values(testPlayer).returning();
    expect(insertedPlayer).toBeDefined();
    expect(insertedPlayer.name).toBe('Test Player');

    // Retrieve the player
    const [retrievedPlayer] = await testDb
      .select()
      .from(players)
      .where(eq(players.id, insertedPlayer.id));

    expect(retrievedPlayer).toBeDefined();
    expect(retrievedPlayer.name).toBe('Test Player');

    // Clean up
    await testDb.delete(players).where(eq(players.id, insertedPlayer.id));
  });
}); 