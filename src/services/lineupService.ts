import { LineupRepository } from "../repositories/lineupRepository";

const lineupRepo = new LineupRepository();

export class LineupService {
  async getTeamLineup() {
    return lineupRepo.fetchTeamLineup();
  }

  async updateTeamLineup(playerId: number, playing: boolean, substitution: boolean) {
    return lineupRepo.updateTeamLineup(playerId, playing, substitution);
  }

  async getLineupPlan() {
    return lineupRepo.fetchLineupPlan();
  }
}
