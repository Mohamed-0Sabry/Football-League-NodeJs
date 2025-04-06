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
    distanceCovered?: number | null;
    sprints?: number | null;
    highIntensityActions?: number | null;
  };
  rating: number | null;
  minutesPlayed: number | null;
  player?: Player | null;
  match?: Match | null;
}

export class PerformanceRepository {
  private mapDbPerformanceToPerformance(dbPerformance: any): Performance {
    return {
      id: dbPerformance.id,
      playerId: dbPerformance.playerId || 0,
      matchId: dbPerformance.matchId || 0,
      stats: {
        goals: dbPerformance.goals,
        assists: dbPerformance.assists,
        shots: dbPerformance.shots,
        passes: dbPerformance.passes,
        tackles: dbPerformance.tackles,
        fouls: dbPerformance.fouls,
        yellowCards: dbPerformance.yellowCards,
        redCards: dbPerformance.redCards,
        distanceCovered: dbPerformance.distanceCovered,
        sprints: dbPerformance.sprints,
        highIntensityActions: dbPerformance.highIntensityActions
      },
      rating: dbPerformance.rating,
      minutesPlayed: dbPerformance.minutesPlayed
    };
  }

  private mapDbPerformancesToPerformances(dbPerformances: any[]): Performance[] {
    return dbPerformances.map(p => this.mapDbPerformanceToPerformance(p));
  }

  async getAllPerformances(): Promise<Performance[]> {
    const dbPerformances = await db.select().from(playerPerformances);
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async getPlayerPerformances(playerId: number): Promise<Performance[]> {
    const dbPerformances = await db
      .select()
      .from(playerPerformances)
      .where(eq(playerPerformances.playerId, playerId));
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async getMatchPerformances(matchId: number): Promise<Performance[]> {
    const dbPerformances = await db
      .select()
      .from(playerPerformances)
      .where(eq(playerPerformances.matchId, matchId));
    return this.mapDbPerformancesToPerformances(dbPerformances);
  }

  async createPerformance(data: Partial<Performance>): Promise<Performance> {
    const [dbPerformance] = await db
      .insert(playerPerformances)
      .values({
        playerId: data.playerId,
        matchId: data.matchId,
        stats: data.stats || {},
        rating: data.rating,
        minutesPlayed: data.minutesPlayed,
        goals: data.stats?.goals || 0,
        assists: data.stats?.assists || 0,
        shots: data.stats?.shots || 0,
        passes: data.stats?.passes || 0,
        tackles: data.stats?.tackles || 0,
        fouls: data.stats?.fouls || 0,
        yellowCards: data.stats?.yellowCards || 0,
        redCards: data.stats?.redCards || 0,
        distanceCovered: data.stats?.distanceCovered || 0,
        sprints: data.stats?.sprints || 0,
        highIntensityActions: data.stats?.highIntensityActions || 0
      })
      .returning();
    return this.mapDbPerformanceToPerformance(dbPerformance);
  }

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
}