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
   *         description: Returns a list of all players
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 players:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Player'
   */
  async getPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playerService.getAllPlayers();
      res.json({ success: true, players });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/players/search:
   *   get:
   *     summary: Search for players
   *     tags: [Players]
   *     parameters:
   *       - in: query
   *         name: query
   *         schema:
   *           type: string
   *         description: Search query for player name
   *     responses:
   *       200:
   *         description: Returns matching players
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 players:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Player'
   */
  async searchPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      const players = await playerService.searchPlayers(query as string);
      res.json({ success: true, players });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/players/{id}/statistics:
   *   get:
   *     summary: Get player statistics
   *     tags: [Players]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Returns player statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 statistics:
   *                   $ref: '#/components/schemas/PlayerStats'
   */
  async getPlayerStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const statistics = await playerService.getPlayerStatistics(parseInt(id));
      res.json({ success: true, statistics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/players/{id}/predictions:
   *   get:
   *     summary: Get player predictions
   *     tags: [Players]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Returns player predictions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 predictions:
   *                   type: object
   *                   properties:
   *                     performance:
   *                       type: number
   *                     injuryRisk:
   *                       type: number
   *                     fatiguePrediction:
   *                       type: number
   */
  async getPlayerPredictions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const predictions = await playerService.getPlayerPredictions(parseInt(id));
      res.json({ success: true, predictions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/players/{id}/injury-risk:
   *   get:
   *     summary: Get player injury risk assessment
   *     tags: [Players]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Returns player injury risk assessment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 injuryRisk:
   *                   type: object
   *                   properties:
   *                     riskPercentage:
   *                       type: number
   *                     potentialInjuries:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           type:
   *                             type: string
   *                           probability:
   *                             type: number
   */
  async getPlayerInjuryRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const injuryRisk = await playerService.getPlayerInjuryRisk(parseInt(id));
      res.json({ success: true, injuryRisk });
    } catch (error) {
      next(error);
    }
  }
}