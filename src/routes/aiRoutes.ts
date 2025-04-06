import express from "express";
import { AIController } from "../controllers/aiController";

const router = express.Router();
const aiController = new AIController();

router.get("/plan-suggestions", async (req, res, next) => {
  try {
    await aiController.getPlanSuggestions(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/player/:id/injury-risk", async (req, res, next) => {
  try {
    await aiController.getPlayerInjuryRisk(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/training-recommendations", async (req, res, next) => {
  try {
    await aiController.getTrainingRecommendations(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;