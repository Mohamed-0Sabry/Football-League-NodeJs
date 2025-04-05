import express from "express";
import { PlayerController } from "../controllers/playerController";

const router = express.Router();
const playerController = new PlayerController();

router.get("/", playerController.getPlayers.bind(playerController));

export default router;
