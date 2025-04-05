import { Request, Response, NextFunction } from "express";
import { MatchService } from "../services/matchService";

const matchService = new MatchService();

export class MatchController {
  /**
   * @swagger
   * /api/matches:
   *   get:
   *     summary: Get all match data
   *     tags: [Matches]
   *     responses:
   *       200:
   *         description: Returns a list of matches.
   */
  async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const matches = await matchService.getAllMatches();
      res.json({ success: true, matches });
    } catch (error) {
      next(error);
    }
  }
}
