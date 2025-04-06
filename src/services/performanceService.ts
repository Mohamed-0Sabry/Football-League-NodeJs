import { PerformanceRepository } from "../repositories/performanceRepository";
import { PlayerRepository } from "../repositories/playerRepository";
import { MatchRepository } from "../repositories/matchRepository";

export class PerformanceService {
  private performanceRepository: PerformanceRepository;
  private playerRepository: PlayerRepository;
  private matchRepository: MatchRepository;

  constructor() {
    this.performanceRepository = new PerformanceRepository();
    this.playerRepository = new PlayerRepository();
    this.matchRepository = new MatchRepository();
  }

  async getAllPerformances() {
    return await this.performanceRepository.getAllPerformances();
  }

  async getPlayerPerformances(playerId: number) {
    return await this.performanceRepository.getPlayerPerformances(playerId);
  }

  async getMatchPerformances(matchId: number) {
    return await this.performanceRepository.getMatchPerformances(matchId);
  }

  async createPerformance(data: any) {
    return await this.performanceRepository.createPerformance(data);
  }

  async getTeamPerformance() {
    const performances = await this.performanceRepository.getAllPerformances();
    const players = await this.playerRepository.fetchPlayers();
    
    // Calculate team performance metrics
    const totalGoals = performances.reduce((sum, p) => sum + (p.stats.goals || 0), 0);
    const totalAssists = performances.reduce((sum, p) => sum + (p.stats.assists || 0), 0);
    const averagePerformance = performances.reduce((sum, p) => sum + (p.rating || 0), 0) / performances.length;

    return {
      totalGoals,
      totalAssists,
      averagePerformance,
      playerCount: players.length,
      performanceCount: performances.length
    };
  }

  async getPlayerStatistics(playerId: number) {
    const player = await this.playerRepository.fetchPlayerById(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    const performances = await this.performanceRepository.getPlayerPerformances(playerId);
    
    // Calculate player statistics
    const pace = Math.round(performances.reduce((sum, p) => sum + (p.stats.distanceCovered || 0), 0) / performances.length);
    const shooting = Math.round(performances.reduce((sum, p) => sum + (p.stats.goals || 0), 0) / performances.length * 10);
    const passing = Math.round(performances.reduce((sum, p) => sum + (p.stats.passes || 0), 0) / performances.length);
    const dribbling = Math.round(performances.reduce((sum, p) => sum + (p.stats.sprints || 0), 0) / performances.length);
    const defending = Math.round(performances.reduce((sum, p) => sum + (p.stats.tackles || 0), 0) / performances.length * 2);
    const physical = Math.round(performances.reduce((sum, p) => sum + (p.stats.highIntensityActions || 0), 0) / performances.length * 2);

    return {
      playerId,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical
    };
  }

  async getAllPlayersStatistics() {
    const players = await this.playerRepository.fetchPlayers();
    const statistics = await Promise.all(
      players.map(player => this.getPlayerStatistics(player.id))
    );
    return statistics;
  }

  async getPlayerPredictions(playerId: number) {
    const player = await this.playerRepository.fetchPlayerById(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    const performances = await this.performanceRepository.getPlayerPerformances(playerId);
    
    // Calculate predictions based on recent performances
    const recentPerformances = performances.slice(-5); // Last 5 performances
    const predictedPerformance = recentPerformances.reduce((sum, p) => sum + (p.rating || 0), 0) / recentPerformances.length;
    const predictedGoals = Math.round(recentPerformances.reduce((sum, p) => sum + (p.stats.goals || 0), 0) / recentPerformances.length);
    const predictedAssists = Math.round(recentPerformances.reduce((sum, p) => sum + (p.stats.assists || 0), 0) / recentPerformances.length);

    return {
      playerId,
      predictedPerformance,
      predictedGoals,
      predictedAssists
    };
  }

  async getFatiguePredictions() {
    const players = await this.playerRepository.fetchPlayers();
    const performances = await this.performanceRepository.getAllPerformances();
    
    // Calculate fatigue predictions for each player
    const predictions = players.map(player => {
      const playerPerformances = performances.filter(p => p.playerId === player.id);
      const recentPerformances = playerPerformances.slice(-3); // Last 3 performances
      
      const fatigueLevel = recentPerformances.reduce((sum, p) => {
        const minutesPlayed = p.minutesPlayed || 0;
        const highIntensityActions = p.stats.highIntensityActions || 0;
        const sprints = p.stats.sprints || 0;
        return sum + (minutesPlayed * 0.4 + highIntensityActions * 0.4 + sprints * 0.2);
      }, 0) / recentPerformances.length;

      return {
        playerId: player.id,
        fatigueLevel: Math.min(100, Math.max(0, fatigueLevel)),
        recoveryTime: Math.round(fatigueLevel * 0.5), // Hours needed for recovery
        riskLevel: fatigueLevel > 80 ? "High" : fatigueLevel > 60 ? "Medium" : "Low"
      };
    });

    return predictions;
  }

  async getPotentialInjuries() {
    // This is a placeholder implementation
    // In a real application, this would analyze player health data
    const performances = await this.performanceRepository.getAllPerformances();
    return performances.map(p => ({
      playerId: p.playerId,
      injuryRisk: Math.random() * 100,
      potentialInjury: Math.random() > 0.8 ? 'Muscle Strain' : 'None',
      preventionAdvice: 'Rest and proper warm-up recommended'
    }));
  }

  async getTrainingImprovements() {
    // This is a placeholder implementation
    // In a real application, this would analyze training data
    const performances = await this.performanceRepository.getAllPerformances();
    return performances.map(p => ({
      playerId: p.playerId,
      currentRating: p.rating || 0,
      potentialRating: (p.rating || 0) + Math.random() * 2,
      improvementAreas: ['Speed', 'Stamina', 'Technique'],
      recommendedTraining: 'High-intensity interval training'
    }));
  }
}