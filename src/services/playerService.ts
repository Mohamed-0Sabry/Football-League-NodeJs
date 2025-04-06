import { PlayerRepository } from "../repositories/playerRepository";
import { Player, PlayerStats } from "../types/player";

const playerRepo = new PlayerRepository();

export class PlayerService {
  async getAllPlayers() {
    return playerRepo.fetchPlayers();
  }

  async searchPlayers(query: string): Promise<Player[]> {
    const players = await playerRepo.fetchPlayers();
    return players.filter(player => 
      player.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getPlayerStatistics(playerId: number): Promise<PlayerStats> {
    const player = await playerRepo.fetchPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    return player.stats || {};
  }

  async getPlayerPredictions(playerId: number) {
    const player = await playerRepo.fetchPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Calculate predictions based on player data
    const performance = this.calculatePerformancePrediction(player);
    const injuryRisk = this.calculateInjuryRisk(player);
    const fatiguePrediction = this.calculateFatiguePrediction(player);

    return {
      performance,
      injuryRisk,
      fatiguePrediction
    };
  }

  async getPlayerInjuryRisk(playerId: number) {
    const player = await playerRepo.fetchPlayerById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const riskPercentage = this.calculateInjuryRisk(player);
    const potentialInjuries = this.analyzePotentialInjuries(player);

    return {
      riskPercentage,
      potentialInjuries
    };
  }

  private calculatePerformancePrediction(player: Player): number {
    // Implement performance prediction logic based on:
    // - Recent performance
    // - Fatigue level
    // - Match load
    // - Fitness level
    const baseScore = player.performance || 0;
    const fatigueImpact = (player.fatiguePercentage || 0) / 100;
    const fitnessImpact = (player.fitnessLevel || 0) / 100;
    
    return baseScore * (1 - fatigueImpact) * fitnessImpact;
  }

  private calculateInjuryRisk(player: Player): number {
    let riskScore = 0;
  
    // Matches in last 10 days
    if (player.stats?.matchesLast10Days && player.stats.matchesLast10Days > 1) {
      riskScore += player.stats.matchesLast10Days; // +1 per match
    }
  
    // Distance covered per match
    if (player.stats?.distanceCovered && player.stats.distanceCovered > 10) {
      riskScore += 1;
    }
  
    // Sprint count
    if (player.stats?.sprints && player.stats.sprints > 20) {
      riskScore += 1;
    }
  
    // Previous injuries
    if (player.stats?.injuriesThisSeason && player.stats.injuriesThisSeason >= 2) {
      riskScore += 1;
    }
  
    // Rest ratio (days rest / days played)
    if (player.stats?.restRatio && player.stats.restRatio < 0.3) {
      riskScore += 1;
    }
  
    // Age
    if (player.age && player.age > 30) {
      riskScore += 1;
    }
  
    // Position-based risk
    if (["Defender", "Winger", "Fullback", "Wingback"].includes(player.position)) {
      riskScore += 1;
    }
  
    // Played a full match recently
    if (player.stats?.playedFullMatch) {
      riskScore += 1;
    }
  
    // Normalize to percentage
    const maxScore = 9; // 9 total risk factors
    return Math.min(1, riskScore / maxScore);
  }
  

  private calculateFatiguePrediction(player: Player): number {
    // Implement fatigue prediction based on:
    // - Current fatigue
    // - Recent match load
    // - Recovery time
    const currentFatigue = player.fatiguePercentage || 0;
    const matchLoad = player.matchLoad || 0;
    
    return Math.min(100, currentFatigue + (matchLoad * 0.5));
  }

  private analyzePotentialInjuries(player: Player): Array<{type: string, probability: number}> {
    const injuries = [];
    const fatigue = player.fatiguePercentage || 0;
    const matchLoad = player.matchLoad || 0;

    // Muscle injuries
    if (fatigue > 70 || matchLoad > 80) {
      injuries.push({
        type: 'Muscle Strain',
        probability: Math.min(1, (fatigue + matchLoad) / 200)
      });
    }

    // Joint injuries
    if (player.matchLoad && player.matchLoad > 90) {
      injuries.push({
        type: 'Joint Stress',
        probability: Math.min(1, matchLoad / 100)
      });
    }

    // Fatigue-related injuries
    if (fatigue > 85) {
      injuries.push({
        type: 'Fatigue-Related Injury',
        probability: Math.min(1, fatigue / 100)
      });
    }

    return injuries;
  }
}
