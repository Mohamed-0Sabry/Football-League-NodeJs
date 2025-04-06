import { db } from "../db/db";
import { matches, teams } from "../db/schema";
import { eq } from "drizzle-orm";
import { Match } from "../types/match";
import { Team } from "../types/team";

export class MatchRepository {
  async fetchMatches(): Promise<Match[]> {
    const dbMatches = await db.select().from(matches);
    return await this.mapDbMatchesToMatches(dbMatches);
  }

  async fetchMatchById(id: number): Promise<Match | null> {
    const result = await db.select().from(matches).where(eq(matches.id, id));
    if (!result[0]) return null;
    
    // Fetch home and away teams
    const homeTeam = await db.select().from(teams).where(eq(teams.id, result[0].homeTeamId || 0));
    const awayTeam = await db.select().from(teams).where(eq(teams.id, result[0].awayTeamId || 0));
    
    return this.mapDbMatchToMatch(result[0], homeTeam[0], awayTeam[0]);
  }

  async createMatch(matchData: Omit<Match, 'id'>): Promise<Match> {
    const result = await db.insert(matches).values({
      homeTeamId: matchData.homeTeam.id,
      awayTeamId: matchData.awayTeam.id,
      isFinished: matchData.isFinished,
      homeTeamScore: matchData.homeTeamScore || null,
      awayTeamScore: matchData.awayTeamScore || null,
      date: matchData.date,
      location: matchData.location
    }).returning();
    
    // Fetch home and away teams
    const homeTeam = await db.select().from(teams).where(eq(teams.id, result[0].homeTeamId || 0));
    const awayTeam = await db.select().from(teams).where(eq(teams.id, result[0].awayTeamId || 0));
    
    return this.mapDbMatchToMatch(result[0], homeTeam[0], awayTeam[0]);
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match | null> {
    await db.update(matches)
      .set({
        homeTeamScore: matchData.homeTeamScore,
        awayTeamScore: matchData.awayTeamScore,
        isFinished: matchData.isFinished,
        updatedAt: new Date()
      })
      .where(eq(matches.id, id));
    
    return this.fetchMatchById(id);
  }

  async deleteMatch(id: number): Promise<boolean> {
    const result = await db.delete(matches).where(eq(matches.id, id)).returning();
    return result.length > 0;
  }

  async getMatchById(id: number): Promise<Match | null> {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, id));
    
    if (!match) return null;
    
    // Fetch home and away teams
    const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId || 0));
    const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId || 0));
    
    return this.mapDbMatchToMatch(match, homeTeam[0], awayTeam[0]);
  }

  // Helper methods to map database types to application types
  private mapDbMatchToMatch(dbMatch: any, homeTeam: any, awayTeam: any): Match {
    return {
      id: dbMatch.id,
      homeTeam: this.mapDbTeamToTeam(homeTeam),
      awayTeam: this.mapDbTeamToTeam(awayTeam),
      isFinished: dbMatch.isFinished,
      homeTeamScore: dbMatch.homeTeamScore || undefined,
      awayTeamScore: dbMatch.awayTeamScore || undefined,
      date: dbMatch.date,
      location: dbMatch.location,
      homeTeamPlayers: null, // These would need to be fetched separately
      awayTeamPlayers: null  // These would need to be fetched separately
    };
  }

  private async mapDbMatchesToMatches(dbMatches: any[]): Promise<Match[]> {
    const matchesWithTeams = await Promise.all(
      dbMatches.map(async (match) => {
        // Fetch home and away teams
        const homeTeam = await db.select().from(teams).where(eq(teams.id, match.homeTeamId || 0));
        const awayTeam = await db.select().from(teams).where(eq(teams.id, match.awayTeamId || 0));
        
        return this.mapDbMatchToMatch(match, homeTeam[0], awayTeam[0]);
      })
    );
    
    return matchesWithTeams;
  }

  private mapDbTeamToTeam(dbTeam: any): Team {
    if (!dbTeam) {
      throw new Error("Team data is required");
    }
    
    return {
      id: dbTeam.id,
      name: dbTeam.name,
      nationality: dbTeam.nationality || null,
      photo: dbTeam.photo || null,
      coach: dbTeam.coach || null,
      stadium: dbTeam.stadium || null,
      formation: dbTeam.formation || null,
      rating: dbTeam.rating || null,
      points: dbTeam.points || null,
      goalsScored: dbTeam.goalsScored || null,
      goalsConceded: dbTeam.goalsConceded || null,
      matchesPlayed: dbTeam.matchesPlayed || null,
      matchesWon: dbTeam.matchesWon || null,
      matchesLost: dbTeam.matchesLost || null,
      matchesDrawn: dbTeam.matchesDrawn || null,
      matchesPlayedHome: dbTeam.matchesPlayedHome || null,
      matchesPlayedAway: dbTeam.matchesPlayedAway || null,
      matchesWonHome: dbTeam.matchesWonHome || null,
      matchesWonAway: dbTeam.matchesWonAway || null,
      matchesLostHome: dbTeam.matchesLostHome || null,
      matchesLostAway: dbTeam.matchesLostAway || null,
      matchesDrawnHome: dbTeam.matchesDrawnHome || null,
      matchesDrawnAway: dbTeam.matchesDrawnAway || null,
      lastMatchPlayed: dbTeam.lastMatchPlayed || null,
      nextMatch: dbTeam.nextMatch || null,
      players: []  // Players will be populated separately when needed
    };
  }
}
