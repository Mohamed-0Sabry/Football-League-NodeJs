import { db } from "../db/db";
import { players } from "../db/schema";
import { eq, like, inArray } from "drizzle-orm";
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

  async getPlayersByIds(ids: number[]): Promise<Player[]> {
    const dbPlayers = await db
      .select()
      .from(players)
      .where(inArray(players.id, ids));
    return this.mapDbPlayersToPlayers(dbPlayers);
  }

  async getAllPlayers(): Promise<Player[]> {
    const dbPlayers = await db.select().from(players);
    return this.mapDbPlayersToPlayers(dbPlayers);
  }

  async getPlayerById(id: number): Promise<Player | null> {
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, id));
    return player ? this.mapDbPlayerToPlayer(player) : null;
  }

  // Helper methods to map database types to application types
  private mapDbPlayerToPlayer(dbPlayer: any): Player {
    return {
      id: dbPlayer.id,
      name: dbPlayer.name,
      age: dbPlayer.age || null,
      position: dbPlayer.position,
      nationality: dbPlayer.nationality || null,
      team: dbPlayer.team || null,
      photo: dbPlayer.photo || null,
      ability: dbPlayer.ability || null,
      stamina: dbPlayer.stamina || null,
      healthCondition: dbPlayer.healthCondition || null,
      performance: dbPlayer.performance || null,
      matchLoad: dbPlayer.matchLoad || null,
      averageRating: dbPlayer.averageRating || null,
      hoursPlayed: dbPlayer.hoursPlayed || null,
      fatiguePercentage: dbPlayer.fatiguePercentage || null,
      fitnessLevel: dbPlayer.fitnessLevel || null,
      condition: dbPlayer.condition || null,
      playing: dbPlayer.playing || false,
      injured: dbPlayer.injured || false,
      injuredTime: dbPlayer.injuredTime || null,
      injuredReason: dbPlayer.injuredReason || null,
      timeForRecover: dbPlayer.timeForRecover || null,
      stats: dbPlayer.stats || null,
      rating: dbPlayer.rating || null,
      goals: dbPlayer.goals || null,
      assists: dbPlayer.assists || null,
      injuryHistory: dbPlayer.injuryHistory || null,
      medicalNotes: dbPlayer.medicalNotes || null,
      lastMedicalCheck: dbPlayer.lastMedicalCheck || null,
      physicalAssessment: dbPlayer.physicalAssessment || null,
      trainingHistory: dbPlayer.trainingHistory || null
    };
  }

  private mapDbPlayersToPlayers(dbPlayers: any[]): Player[] {
    return dbPlayers.map(player => this.mapDbPlayerToPlayer(player));
  }
}
