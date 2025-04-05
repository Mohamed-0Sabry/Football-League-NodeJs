import { Player } from "./player";

export interface Team {
  id: number;
  name: string;
  nationality?: string | null;
  photo?: string | null;

  coach?: string | null;
  stadium?: string | null;
  formation?: string | null;

  rating?: number | null;
  points?: number | null;

  goalsScored?: number | null;
  goalsConceded?: number | null;

  matchesPlayed?: number | null;
  matchesWon?: number | null;
  matchesLost?: number | null;
  matchesDrawn?: number | null;

  matchesPlayedHome?: number | null;
  matchesPlayedAway?: number | null;

  matchesWonHome?: number | null;
  matchesWonAway?: number | null;

  matchesLostHome?: number | null;
  matchesLostAway?: number | null;

  matchesDrawnHome?: number | null;
  matchesDrawnAway?: number | null;

  lastMatchPlayed?: string | null;
  nextMatch?: string | null;

  transferBudget?: number | null;
  players: Player[];
  transferList?: Player[] | null;
}
