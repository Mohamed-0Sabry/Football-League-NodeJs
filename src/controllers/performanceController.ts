import { Request, Response } from "express";
import { PerformanceService } from "../services/performanceService";

const performanceService = new PerformanceService();

/**
 * @swagger
 * tags:
 *   name: Performance
 *   description: API endpoints for managing team and player performance metrics
 */
export class PerformanceController {
  /**
   * @swagger
   * /api/performance/team:
   *   get:
   *     summary: Get team performance metrics
   *     tags: [Performance]
   *     responses:
   *       200:
   *         description: Team performance data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalGoals:
   *                   type: integer
   *                 totalAssists:
   *                   type: integer
   *                 averagePerformance:
   *                   type: number
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getTeamPerformance(req: Request, res: Response) {
    try {
      const performance = await performanceService.getTeamPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team performance" });
    }
  }

  /**
   * @swagger
   * /api/performance/player/{id}/statistics:
   *   get:
   *     summary: Get player statistics
   *     tags: [Performance]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Player statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 pace:
   *                   type: integer
   *                 shooting:
   *                   type: integer
   *                 passing:
   *                   type: integer
   *                 dribbling:
   *                   type: integer
   *                 defending:
   *                   type: integer
   *                 physical:
   *                   type: integer
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getPlayerStatistics(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const statistics = await performanceService.getPlayerStatistics(playerId);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player statistics" });
    }
  }

  /**
   * @swagger
   * /api/performance/statistics:
   *   get:
   *     summary: Get statistics for all players
   *     tags: [Performance]
   *     responses:
   *       200:
   *         description: Statistics for all players
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   playerId:
   *                     type: integer
   *                   pace:
   *                     type: integer
   *                   shooting:
   *                     type: integer
   *                   passing:
   *                     type: integer
   *                   dribbling:
   *                     type: integer
   *                   defending:
   *                     type: integer
   *                   physical:
   *                     type: integer
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getAllPlayersStatistics(req: Request, res: Response) {
    try {
      const statistics = await performanceService.getAllPlayersStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all players statistics" });
    }
  }

  /**
   * @swagger
   * /api/performance/player/{id}/predictions:
   *   get:
   *     summary: Get performance predictions for a player
   *     tags: [Performance]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Player performance predictions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 predictedPerformance:
   *                   type: number
   *                 predictedGoals:
   *                   type: integer
   *                 predictedAssists:
   *                   type: integer
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getPlayerPredictions(req: Request, res: Response) {
    try {
      const playerId = parseInt(req.params.id);
      const predictions = await performanceService.getPlayerPredictions(playerId);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player predictions" });
    }
  }

  /**
   * @swagger
   * /api/performance/fatigue/predictions:
   *   get:
   *     summary: Get fatigue predictions for all players
   *     tags: [Performance]
   *     responses:
   *       200:
   *         description: Fatigue predictions for all players
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   playerId:
   *                     type: integer
   *                   currentFatigue:
   *                     type: number
   *                   predictedFatigue:
   *                     type: number
   *                   riskLevel:
   *                     type: string
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  async getFatiguePredictions(req: Request, res: Response) {
    try {
      const predictions = await performanceService.getFatiguePredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fatigue predictions" });
    }
  }

  async getPotentialInjuries(req: Request, res: Response) {
    try {
      const injuries = await performanceService.getPotentialInjuries();
      res.json(injuries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch potential injuries" });
    }
  }

  async getTrainingImprovements(req: Request, res: Response) {
    try {
      const improvements = await performanceService.getTrainingImprovements();
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch training improvements" });
    }
  }
}