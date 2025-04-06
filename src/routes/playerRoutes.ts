import express from "express";
import { PlayerController } from "../controllers/playerController";

const router = express.Router();
const playerController = new PlayerController();

router.get("/", playerController.getPlayers.bind(playerController));
router.get("/search", playerController.searchPlayers.bind(playerController));
router.get("/:id/statistics", playerController.getPlayerStatistics.bind(playerController));
router.get("/:id/predictions", playerController.getPlayerPredictions.bind(playerController));
router.get("/:id/injury-risk", playerController.getPlayerInjuryRisk.bind(playerController));

export default router;
