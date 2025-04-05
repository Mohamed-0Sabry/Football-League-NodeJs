import express from "express";
import { PerformanceController } from "../controllers/performanceController";

const router = express.Router();
const performanceController = new PerformanceController();

router.get("/team", performanceController.getTeamPerformance.bind(performanceController));
router.get("/player/:id", performanceController.getPlayerStatistics.bind(performanceController));
router.get("/players", performanceController.getAllPlayersStatistics.bind(performanceController));
router.get("/player/:id/predictions", performanceController.getPlayerPredictions.bind(performanceController));
router.get("/fatigue", performanceController.getFatiguePredictions.bind(performanceController));
router.get("/injuries", performanceController.getPotentialInjuries.bind(performanceController));
router.get("/training", performanceController.getTrainingImprovements.bind(performanceController));

export default router;