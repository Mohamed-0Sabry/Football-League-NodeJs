import { PerformanceRepository } from "../repositories/performanceRepository";

const performanceRepo = new PerformanceRepository();

export class PerformanceService {
  async getTeamPerformance() {
    return performanceRepo.fetchTeamPerformance();
  }

  async getPlayerStatistics(playerId: number) {
    return performanceRepo.fetchPlayerStatistics(playerId);
  }

  async getAllPlayersStatistics() {
    return performanceRepo.fetchAllPlayersStatistics();
  }

  async getPlayerPredictions(playerId: number) {
    return performanceRepo.fetchPlayerPredictions(playerId);
  }

  async getFatiguePredictions() {
    return performanceRepo.fetchFatiguePredictions();
  }

  async getPotentialInjuries() {
    return performanceRepo.fetchPotentialInjuries();
  }

  async getTrainingImprovements() {
    return performanceRepo.fetchTrainingImprovements();
  }
}