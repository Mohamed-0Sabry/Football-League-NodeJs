import { Request, Response, NextFunction } from "express";
import { PlayerService } from "../services/playerService";

const playerService = new PlayerService();

export class PlayerController {
  /**
   * @swagger
   * /api/players:
   *   get:
   *     summary: Get all players
   *     tags: [Players]
   *     responses:
   *       200:
   *         description: Returns a list of all players.
   */
  async getPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playerService.getAllPlayers();
      res.json({ success: true, players });
    } catch (error) {
      next(error);
    }
  }
}
