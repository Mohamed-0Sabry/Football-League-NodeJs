import { db } from "../db/db";
import { matches, teams } from "../db/schema";
import { eq } from "drizzle-orm";
import { Match } from "../types/match";
import { Team } from "../types/team";
import { Player } from "../types/player";

export class MatchRepository {
  async fetchMatches(): Promise<Match[]> {
    const dbMatches = await db.select().from(matches);
    return this.mapDbMatchesToMatches(dbMatches);
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

  private mapDbMatchesToMatches(dbMatches: any[]): Match[] {
    // This is a simplified version - in a real app, you'd need to fetch teams for each match
    return dbMatches.map(match => ({
      id: match.id,
      homeTeam: { id: match.homeTeamId, name: 'Home Team' } as Team, // Placeholder
      awayTeam: { id: match.awayTeamId, name: 'Away Team' } as Team, // Placeholder
      isFinished: match.isFinished,
      homeTeamScore: match.homeTeamScore || undefined,
      awayTeamScore: match.awayTeamScore || undefined,
      date: match.date,
      location: match.location,
      homeTeamPlayers: null,
      awayTeamPlayers: null
    }));
  }

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
}
