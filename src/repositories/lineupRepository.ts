import { db } from "../db/db";
import { teamLineups, players } from "../db/schema";
import { eq, and } from "drizzle-orm";

export interface Lineup {
  id: number;
  teamId: number;
  matchId: number;
  formation: string;
  players: Array<{
    id: number;
    position: string;
  }>;
  isConfirmed: boolean;
}

export class LineupRepository {
  async fetchTeamLineup() {
    return await db.select().from(teamLineups);
  }

  async updateTeamLineup(playerId: number, playing: boolean) {
    // Update the player's playing status in the players table
    return await db
      .update(players)
      .set({ playing })
      .where(eq(players.id, playerId));
  }

  async fetchLineupPlan() {
    return ["4-3-3", "4-2-2"];
  }

  async getMatchLineups(matchId: number): Promise<Lineup[]> {
    const dbLineups = await db
      .select()
      .from(teamLineups)
      .where(eq(teamLineups.matchId, matchId));
    return this.mapDbLineupsToLineups(dbLineups);
  }

  async getTeamMatchLineup(teamId: number, matchId: number): Promise<Lineup | null> {
    const [dbLineup] = await db
      .select()
      .from(teamLineups)
      .where(
        and(
          eq(teamLineups.teamId, teamId),
          eq(teamLineups.matchId, matchId)
        )
      );
    return dbLineup ? this.mapDbLineupToLineup(dbLineup) : null;
  }

  async createLineup(data: Omit<Lineup, "id">): Promise<Lineup> {
    const [dbLineup] = await db
      .insert(teamLineups)
      .values({
        teamId: data.teamId,
        matchId: data.matchId,
        formation: data.formation,
        players: data.players,
        isConfirmed: data.isConfirmed
      })
      .returning();
    return this.mapDbLineupToLineup(dbLineup);
  }

  private mapDbLineupToLineup(dbLineup: any): Lineup {
    return {
      id: dbLineup.id,
      teamId: dbLineup.teamId,
      matchId: dbLineup.matchId,
      formation: dbLineup.formation,
      players: dbLineup.players,
      isConfirmed: dbLineup.isConfirmed
    };
  }

  private mapDbLineupsToLineups(dbLineups: any[]): Lineup[] {
    return dbLineups.map(lineup => this.mapDbLineupToLineup(lineup));
  }
}
