import { db } from "../config/db";
import { teamLineup } from "../db/schema";
import { eq } from "drizzle-orm";

export class LineupRepository {
  async fetchTeamLineup() {
    return await db.select().from(teamLineup);
  }

  async updateTeamLineup(playerId: number, playing: boolean, substitution: boolean) {
    return await db
      .update(teamLineup)
      .set({ playing, substitution })
      .where(eq(teamLineup.playerId, playerId));
  }

  async fetchLineupPlan() {
    return ["4-3-3", "4-2-2"];
  }
}
