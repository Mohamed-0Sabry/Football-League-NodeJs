import express from "express";
import { LineupController } from "../controllers/lineupController";

const router = express.Router();
const lineupController = new LineupController();

// Get lineups for a specific match
router.get("/match/:matchId", lineupController.getMatchLineups.bind(lineupController));

// Get lineup for a specific team in a match
router.get("/team/:teamId/match/:matchId", lineupController.getTeamMatchLineup.bind(lineupController));

// Create a new lineup
router.post("/", lineupController.createLineup.bind(lineupController));

export default router;
