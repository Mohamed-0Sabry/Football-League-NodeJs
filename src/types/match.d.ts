import { Player } from "./player";
import { Team } from "./team";

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  isFinished: boolean;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  date: Date;
  homeTeamPlayers?: Player[] | null;
  awayTeamPlayers: Player[] | null;
  location: string;
  // TODO: add more info if needed in future
}
