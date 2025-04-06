import express from "express";
import { PerformanceController } from "../controllers/performanceController";

const router = express.Router();
const performanceController = new PerformanceController();

// Get all performances
router.get("/", performanceController.getAllPerformances.bind(performanceController));

// Get performances for a specific player
router.get("/player/:playerId", performanceController.getPlayerPerformances.bind(performanceController));

// Get performances for a specific match
router.get("/match/:matchId", performanceController.getMatchPerformances.bind(performanceController));

// Create a new performance
router.post("/", performanceController.createPerformance.bind(performanceController));

// Get team performance
router.get("/team", performanceController.getTeamPerformance.bind(performanceController));

// Get player statistics
router.get("/player/:id/statistics", performanceController.getPlayerStatistics.bind(performanceController));

// Get all players statistics
router.get("/players", performanceController.getAllPlayersStatistics.bind(performanceController));

// Get player predictions
router.get("/player/:id/predictions", performanceController.getPlayerPredictions.bind(performanceController));

// Get fatigue predictions
router.get("/fatigue", performanceController.getFatiguePredictions.bind(performanceController));

export default router;