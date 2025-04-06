import { Request, Response, NextFunction } from "express";
import { LineupService } from "../services/lineupService";

const lineupService = new LineupService();

export class LineupController {
  /**
   * @swagger
   * /api/lineup:
   *   get:
   *     summary: Get the current team lineup
   *     tags: [Lineup]
   *     responses:
   *       200:
   *         description: Returns the current team lineup.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 lineup:
   *                   type: array
   *                   items:
   *                     type: object
   */
  async getTeamLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const lineup = await lineupService.getTeamLineup();
      res.json({ success: true, lineup });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/lineup:
   *   post:
   *     summary: Update the team lineup
   *     tags: [Lineup]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               playerId:
   *                 type: integer
   *               playing:
   *                 type: boolean
   *               substitution:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Successfully updated the team lineup.
   */
  async updateTeamLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId, playing } = req.body;
      await lineupService.updateTeamLineup(playerId, playing);
      res.json({ success: true, message: "Lineup updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/lineup/plan:
   *   get:
   *     summary: Get the team lineup plan (formation)
   *     tags: [Lineup]
   *     responses:
   *       200:
   *         description: Returns the team formation plan.
   */
  async getLineupPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await lineupService.getLineupPlan();
      res.json({ success: true, plans });
    } catch (error) {
      next(error);
    }
  }

  async getMatchLineups(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = parseInt(req.params.matchId);
      const lineups = await lineupService.getMatchLineups(matchId);
      res.json({ success: true, lineups });
    } catch (error) {
      next(error);
    }
  }

  async getTeamMatchLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = parseInt(req.params.teamId);
      const matchId = parseInt(req.params.matchId);
      const lineup = await lineupService.getTeamMatchLineup(teamId, matchId);
      res.json({ success: true, lineup });
    } catch (error) {
      next(error);
    }
  }

  async createLineup(req: Request, res: Response, next: NextFunction) {
    try {
      const lineup = await lineupService.createLineup(req.body);
      res.status(201).json({ success: true, lineup });
    } catch (error) {
      next(error);
    }
  }
}
