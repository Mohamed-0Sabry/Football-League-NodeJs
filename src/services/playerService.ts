import { PlayerRepository } from "../repositories/playerRepository";

const playerRepo = new PlayerRepository();

export class PlayerService {
  async getAllPlayers() {
    return playerRepo.fetchPlayers();
  }
}
