import { MatchRepository } from "../repositories/matchRepository";

const matchRepo = new MatchRepository();

export class MatchService {
  async getAllMatches() {
    return matchRepo.fetchMatches();
  }
}
