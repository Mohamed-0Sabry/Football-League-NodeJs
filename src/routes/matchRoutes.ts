import express from "express";
import { MatchController } from "../controllers/matchController";

const router = express.Router();
const matchController = new MatchController();

router.get("/", matchController.getMatches.bind(matchController));

export default router;
