import { NotificationRepository } from "../repositories/notificationRepository";
import { PlayerService } from "./playerService";
import { Player } from "../types/player";

const notificationRepo = new NotificationRepository();
const playerService = new PlayerService();

export class NotificationService {
  async getNotifications() {
    return notificationRepo.fetchNotifications();
  }

  async getPlayerWarnings() {
    const players = await playerService.getAllPlayers();
    const warnings = [];

    for (const player of players) {
      const playerWarnings = await this.analyzePlayerWarnings(player);
      if (playerWarnings.length > 0) {
        warnings.push(...playerWarnings);
      }
    }

    return warnings;
  }

  private async analyzePlayerWarnings(player: Player) {
    const warnings = [];

    // Fatigue warnings
    if (player.fatiguePercentage && player.fatiguePercentage > 80) {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        fatigue: player.fatiguePercentage,
        warning: "Critical fatigue level - Immediate rest recommended",
        type: "FATIGUE_CRITICAL"
      });
    } else if (player.fatiguePercentage && player.fatiguePercentage > 60) {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        fatigue: player.fatiguePercentage,
        warning: "High fatigue level - Consider reducing training intensity",
        type: "FATIGUE_HIGH"
      });
    }

    // Performance warnings
    if (player.performance && player.performance < 50) {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        performance: player.performance,
        warning: "Low performance level - Additional training recommended",
        type: "PERFORMANCE_LOW"
      });
    }

    // Injury risk warnings
    if (player.injured) {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        injury: player.injuredReason,
        recoveryTime: player.timeForRecover,
        warning: `Player is injured: ${player.injuredReason}. Expected recovery: ${player.timeForRecover} days`,
        type: "INJURY_CURRENT"
      });
    }

    // Match load warnings
    if (player.matchLoad && player.matchLoad > 90) {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        matchLoad: player.matchLoad,
        warning: "Extremely high match load - Risk of burnout",
        type: "MATCH_LOAD_HIGH"
      });
    }

    // Health condition warnings
    if (player.healthCondition === 'poor') {
      warnings.push({
        id: player.id,
        name: player.name,
        position: player.position,
        healthCondition: player.healthCondition,
        warning: "Poor health condition - Medical check recommended",
        type: "HEALTH_POOR"
      });
    }

    return warnings;
  }

  async createNotification(data: {
    title: string;
    message: string;
    type: string;
    playerId: number;
  }) {
    return notificationRepo.createNotification({
      ...data,
      isRead: false
    });
  }

  async markNotificationAsRead(notificationId: number) {
    return notificationRepo.markAsRead(notificationId);
  }

  async getUnreadNotifications() {
    return notificationRepo.fetchUnreadNotifications();
  }
}