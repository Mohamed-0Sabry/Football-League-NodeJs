import { db } from "../config/db";
import { matches } from "../db/schema";

export class MatchRepository {
  async fetchMatches() {
    return await db.select().from(matches);
  }
}
