import express from "express";
import { LineupController } from "../controllers/lineupController";

const router = express.Router();
const lineupController = new LineupController();

router.get("/", lineupController.getTeamLineup.bind(lineupController));
router.post("/update", lineupController.updateTeamLineup.bind(lineupController));
router.get("/plans", lineupController.getLineupPlan.bind(lineupController));

export default router;
