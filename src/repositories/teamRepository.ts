import { db } from "../db/db";
import { teams } from "../db/schema";
import { eq, like } from "drizzle-orm";
import { Team } from "../types/team";
import { Player } from "../types/player";

export class TeamRepository {
  async fetchTeams(): Promise<Team[]> {
    const dbTeams = await db.select().from(teams);
    return this.mapDbTeamsToTeams(dbTeams);
  }

  async fetchTeamById(id: number): Promise<Team | null> {
    const result = await db.select().from(teams).where(eq(teams.id, id));
    return result[0] ? this.mapDbTeamToTeam(result[0]) : null;
  }

  async searchTeams(query: string): Promise<Team[]> {
    const dbTeams = await db.select().from(teams).where(like(teams.name, `%${query}%`));
    return this.mapDbTeamsToTeams(dbTeams);
  }

  async updateTeam(id: number, teamData: Partial<Team>): Promise<Team | null> {
    await db.update(teams)
      .set({
        ...teamData,
        updatedAt: new Date()
      })
      .where(eq(teams.id, id));
    
    return this.fetchTeamById(id);
  }

  async createTeam(teamData: Omit<Team, 'id' | 'players'>): Promise<Team> {
    const result = await db.insert(teams).values(teamData).returning();
    return this.mapDbTeamToTeam(result[0]);
  }

  async deleteTeam(id: number): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id)).returning();
    return result.length > 0;
  }

  // Helper methods to map database types to application types
  private mapDbTeamToTeam(dbTeam: any): Team {
    return {
      id: dbTeam.id,
      name: dbTeam.name,
      nationality: dbTeam.nationality || undefined,
      photo: dbTeam.photo || undefined,
      coach: dbTeam.coach || undefined,
      stadium: dbTeam.stadium || undefined,
      formation: dbTeam.formation || undefined,
      rating: dbTeam.rating || undefined,
      points: dbTeam.points || undefined,
      goalsScored: dbTeam.goalsScored || undefined,
      goalsConceded: dbTeam.goalsConceded || undefined,
      matchesPlayed: dbTeam.matchesPlayed || undefined,
      matchesWon: dbTeam.matchesWon || undefined,
      matchesLost: dbTeam.matchesLost || undefined,
      matchesDrawn: dbTeam.matchesDrawn || undefined,
      matchesPlayedHome: dbTeam.matchesPlayedHome || undefined,
      matchesPlayedAway: dbTeam.matchesPlayedAway || undefined,
      matchesWonHome: dbTeam.matchesWonHome || undefined,
      matchesWonAway: dbTeam.matchesWonAway || undefined,
      matchesLostHome: dbTeam.matchesLostHome || undefined,
      matchesLostAway: dbTeam.matchesLostAway || undefined,
      matchesDrawnHome: dbTeam.matchesDrawnHome || undefined,
      matchesDrawnAway: dbTeam.matchesDrawnAway || undefined,
      lastMatchPlayed: dbTeam.lastMatchPlayed || undefined,
      nextMatch: dbTeam.nextMatch || undefined,
      players: [], // This would need to be fetched separately
    };
  }

  private mapDbTeamsToTeams(dbTeams: any[]): Team[] {
    return dbTeams.map(team => this.mapDbTeamToTeam(team));
  }
} 