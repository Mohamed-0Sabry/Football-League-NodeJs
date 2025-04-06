import { db } from "../db/db";
import { playerPerformances, players, matches } from "../db/schema";
import { eq } from "drizzle-orm";
import { Player } from "../types/player";
import { Match } from "../types/match";

export interface Performance {
  id: number;
  playerId: number;
  matchId: number;
  stats: {
    goals?: number | null;
    assists?: number | null;
    shots?: number | null;
    saves?: number | null;
    passes?: number | null;
    tackles?: number | null;
    fouls?: number | null;
    yellowCards?: number | null;
    redCards?: number | null;
    minutesPlayed?: number | null;
    matchesPlayed?: number | null;
  };
  rating: number | null;
  minutesPlayed: number | null;
  player?: Player | null;
  match?: Match | null;
}

export class PerformanceRepository {
  async fetchPerformances(): Promise<Performance[]> {
    const dbPerformances = await db.select().from(playerPerformances);
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async fetchPerformanceById(id: number): Promise<Performance | null> {
    const result = await db.select().from(playerPerformances).where(eq(playerPerformances.id, id));
    return result[0] ? this.mapDbPerformanceToPerformance(result[0]) : null;
  }

  async fetchPerformancesByPlayerId(playerId: number): Promise<Performance[]> {
    const dbPerformances = await db.select().from(playerPerformances).where(eq(playerPerformances.playerId, playerId));
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async fetchPerformancesByMatchId(matchId: number): Promise<Performance[]> {
    const dbPerformances = await db.select().from(playerPerformances).where(eq(playerPerformances.matchId, matchId));
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async createPerformance(performanceData: Omit<Performance, 'id' | 'player' | 'match'>): Promise<Performance> {
    const result = await db.insert(playerPerformances).values(performanceData).returning();
    return this.mapDbPerformanceToPerformance(result[0]);
  }

  async updatePerformance(id: number, performanceData: Partial<Performance>): Promise<Performance | null> {
    await db.update(playerPerformances)
      .set({
        ...performanceData,
        updatedAt: new Date()
      })
      .where(eq(playerPerformances.id, id));
    
    return this.fetchPerformanceById(id);
  }

  async deletePerformance(id: number): Promise<boolean> {
    const result = await db.delete(playerPerformances).where(eq(playerPerformances.id, id)).returning();
    return result.length > 0;
  }

  // Helper methods to map database types to application types
  private mapDbPerformanceToPerformance(dbPerformance: any): Performance {
    return {
      id: dbPerformance.id,
      playerId: dbPerformance.playerId,
      matchId: dbPerformance.matchId,
      stats: dbPerformance.stats || {},
      rating: dbPerformance.rating || null,
      minutesPlayed: dbPerformance.minutesPlayed || null,
      player: null, // This would need to be fetched separately
      match: null   // This would need to be fetched separately
    };
  }

  private mapDbPerformancesToPerformances(dbPerformances: any[]): Performance[] {
    return dbPerformances.map(performance => this.mapDbPerformanceToPerformance(performance));
  }
}