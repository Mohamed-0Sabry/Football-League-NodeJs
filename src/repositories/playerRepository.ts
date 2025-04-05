import { db } from "../config/db";
import { players } from "../db/schema";
import { eq } from "drizzle-orm";

export class PlayerRepository {
  async fetchPlayers() {
    return await db.select().from(players);
  }
}
