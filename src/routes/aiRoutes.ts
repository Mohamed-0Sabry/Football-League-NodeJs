import express from "express";
import { AIController } from "../controllers/aiController";

const router = express.Router();
const aiController = new AIController();

router.get("/plan-suggestions", aiController.getPlanSuggestions.bind(aiController));
// router.get("/injury-risk/:id", aiController.getPlayerInjuryRisk.bind(aiController));
router.get("/training-recommendations", aiController.getTrainingRecommendations.bind(aiController));

export default router;