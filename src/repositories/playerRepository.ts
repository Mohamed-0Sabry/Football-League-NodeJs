import { db } from "../db/db";
import { players } from "../db/schema";
import { eq, like } from "drizzle-orm";
import { Player } from "../types/player";

export class PlayerRepository {
  async fetchPlayers(): Promise<Player[]> {
    const dbPlayers = await db.select().from(players);
    return this.mapDbPlayersToPlayers(dbPlayers);
  }

  async fetchPlayerById(id: number): Promise<Player | null> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0] ? this.mapDbPlayerToPlayer(result[0]) : null;
  }

  async searchPlayers(query: string): Promise<Player[]> {
    const dbPlayers = await db.select().from(players).where(like(players.name, `%${query}%`));
    return this.mapDbPlayersToPlayers(dbPlayers);
  }

  async updatePlayer(id: number, playerData: Partial<Player>): Promise<Player | null> {
    await db.update(players)
      .set({
        ...playerData,
        updatedAt: new Date()
      })
      .where(eq(players.id, id));
    
    return this.fetchPlayerById(id);
  }

  async createPlayer(playerData: Omit<Player, 'id'>): Promise<Player> {
    const result = await db.insert(players).values(playerData).returning();
    return this.mapDbPlayerToPlayer(result[0]);
  }

  async deletePlayer(id: number): Promise<boolean> {
    const result = await db.delete(players).where(eq(players.id, id)).returning();
    return result.length > 0;
  }

  // Helper methods to map database types to application types
  private mapDbPlayerToPlayer(dbPlayer: any): Player {
    return {
      id: dbPlayer.id,
      name: dbPlayer.name,
      age: dbPlayer.age || undefined,
      position: dbPlayer.position,
      nationality: dbPlayer.nationality || undefined,
      team: dbPlayer.team || undefined,
      photo: dbPlayer.photo || undefined,
      ability: dbPlayer.ability || undefined,
      stamina: dbPlayer.stamina || undefined,
      healthCondition: dbPlayer.healthCondition || undefined,
      performance: dbPlayer.performance || undefined,
      matchLoad: dbPlayer.matchLoad || undefined,
      averageRating: dbPlayer.averageRating || undefined,
      hoursPlayed: dbPlayer.hoursPlayed || undefined,
      fatiguePercentage: dbPlayer.fatiguePercentage || undefined,
      fitnessLevel: dbPlayer.fitnessLevel || undefined,
      condition: dbPlayer.condition || undefined,
      playing: dbPlayer.playing || undefined,
      injured: dbPlayer.injured || undefined,
      injuredTime: dbPlayer.injuredTime || undefined,
      injuredReason: dbPlayer.injuredReason || undefined,
      timeForRecover: dbPlayer.timeForRecover || undefined,
      stats: dbPlayer.stats || undefined,
      rating: dbPlayer.rating || undefined,
      goals: dbPlayer.goals || undefined,
      assists: dbPlayer.assists || undefined
    };
  }

  private mapDbPlayersToPlayers(dbPlayers: any[]): Player[] {
    return dbPlayers.map(player => this.mapDbPlayerToPlayer(player));
  }
}
