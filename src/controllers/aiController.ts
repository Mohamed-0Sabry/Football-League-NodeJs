import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/aiService";
import { PlayerService } from "../services/playerService";

const aiService = new AIService();
const playerService = new PlayerService();

export class AIController {
  async getPlanSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const suggestions = await aiService.getPlanSuggestions();
      res.json({ suggestions });
    } catch (error) {
      next(error); // Use next(error) instead of direct error response
    }
  }

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
      res.json({ riskAssessment });
    } catch (error) {
      next(error); // Use next(error) instead of direct error response
    }
  }

  async getTrainingRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await playerService.getAllPlayers();      
      const avgFatigue = players.reduce((sum, p) => sum + p.fatigue, 0) / players.length;
      const avgPerformance = players.reduce((sum, p) => sum + p.performance, 0) / players.length;
      const recentResult = "Won 2-1";
      
      const recommendations = await aiService.getTrainingRecommendations({
        avgFatigue,
        avgPerformance,
        recentResult
      });
      
      res.json({ recommendations });
    } catch (error) {
      next(error); // Use next(error) instead of direct error response
    }
  }
}