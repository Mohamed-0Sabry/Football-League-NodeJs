import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/aiService";
import { PlayerService } from "../services/playerService";

const aiService = new AIService();
const playerService = new PlayerService();

export class AIController {
  /**
   * @swagger
   * /api/ai/plan-suggestions:
   *   get:
   *     summary: Get AI-powered team formation and tactics suggestions
   *     tags: [AI]
   *     responses:
   *       200:
   *         description: Returns formation and tactics suggestions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 formation:
   *                   type: string
   *                 tactics:
   *                   type: string
   *                 playerRoles:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       playerId:
   *                         type: integer
   *                       role:
   *                         type: string
   *                 reasoning:
   *                   type: string
   */
  async getPlanSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playerService.getAllPlayers();
      const avgFatigue = players.reduce((sum, p) => sum + (p.fatiguePercentage || 0), 0) / players.length;
      const avgPerformance = players.reduce((sum, p) => sum + (p.performance || 0), 0) / players.length;
      
      const suggestions = await aiService.getPlanSuggestions({
        avgFatigue,
        avgPerformance,
        recentResult: "Won 2-1", // This should come from match history
        players
      });
      
      res.json(suggestions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/ai/player/{id}/injury-risk:
   *   get:
   *     summary: Get AI-powered injury risk assessment for a player
   *     tags: [AI]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Player ID
   *     responses:
   *       200:
   *         description: Returns injury risk assessment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 riskLevel:
   *                   type: string
   *                 probability:
   *                   type: number
   *                 recommendations:
   *                   type: array
   *                   items:
   *                     type: string
   *                 potentialInjuries:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       type:
   *                         type: string
   *                       probability:
   *                         type: number
   */
  async getPlayerInjuryRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = parseInt(req.params.id);
      if (isNaN(playerId)) { 
        return res.status(400).json({ error: "Invalid player ID" });
      }  
      const players = await playerService.getAllPlayers();
      const player = players.find(p => p.id === playerId);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      const riskAssessment = await aiService.getPlayerInjuryRisk(player);
      res.json(riskAssessment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/ai/training-recommendations:
   *   get:
   *     summary: Get AI-powered training recommendations
   *     tags: [AI]
   *     responses:
   *       200:
   *         description: Returns training recommendations
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 focusAreas:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       area:
   *                         type: string
   *                       intensity:
   *                         type: string
   *                       duration:
   *                         type: string
   *                       targetPlayers:
   *                         type: array
   *                         items:
   *                           type: integer
   *                 schedule:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       day:
   *                         type: string
   *                       activities:
   *                         type: array
   *                         items:
   *                           type: string
   *                 expectedOutcomes:
   *                   type: array
   *                   items:
   *                     type: string
   */
  async getTrainingRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playerService.getAllPlayers();      
      const avgFatigue = players.reduce((sum, p) => sum + (p.fatiguePercentage || 0), 0) / players.length;
      const avgPerformance = players.reduce((sum, p) => sum + (p.performance || 0), 0) / players.length;
      
      const recommendations = await aiService.getTrainingRecommendations({
        avgFatigue,
        avgPerformance,
        recentResult: "Won 2-1", // This should come from match history
        players
      });
      
      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  }
}