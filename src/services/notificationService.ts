import { NotificationRepository } from "../repositories/notificationRepository";

const notificationRepo = new NotificationRepository();

export class NotificationService {
  async getNotifications() {
    return notificationRepo.fetchNotifications();
  }

  async getPlayerWarnings() {
    return notificationRepo.fetchPlayerWarnings();
  }
}