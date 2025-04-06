import { LineupRepository } from "../repositories/lineupRepository";
import { TeamRepository } from "../repositories/teamRepository";
import { MatchRepository } from "../repositories/matchRepository";
import { PlayerRepository } from "../repositories/playerRepository";

export class LineupService {
  private lineupRepository: LineupRepository;
  private teamRepository: TeamRepository;
  private matchRepository: MatchRepository;
  private playerRepository: PlayerRepository;

  constructor() {
    this.lineupRepository = new LineupRepository();
    this.teamRepository = new TeamRepository();
    this.matchRepository = new MatchRepository();
    this.playerRepository = new PlayerRepository();
  }

  async getTeamLineup() {
    return this.lineupRepository.fetchTeamLineup();
  }

  async updateTeamLineup(playerId: number, playing: boolean) {
    return this.lineupRepository.updateTeamLineup(playerId, playing);
  }

  async getLineupPlan() {
    return this.lineupRepository.fetchLineupPlan();
  }

  async getMatchLineups(matchId: number) {
    const match = await this.matchRepository.fetchMatchById(matchId);
    if (!match) {
      throw new Error("Match not found");
    }
    return await this.lineupRepository.getMatchLineups(matchId);
  }

  async getTeamMatchLineup(teamId: number, matchId: number) {
    const team = await this.teamRepository.fetchTeamById(teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const match = await this.matchRepository.fetchMatchById(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    return await this.lineupRepository.getTeamMatchLineup(teamId, matchId);
  }

  async createLineup(data: any) {
    const team = await this.teamRepository.fetchTeamById(data.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const match = await this.matchRepository.fetchMatchById(data.matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    // Validate that all players belong to the team
    const playerIds = data.players.map((p: { id: number }) => p.id);
    const players = await this.playerRepository.getPlayersByIds(playerIds);
    if (!players || players.length === 0) {
      throw new Error("Players not found");
    }

    const invalidPlayers = players.filter(p => p.team !== team.name);
    if (invalidPlayers.length > 0) {
      throw new Error(`Some players do not belong to team ${team.name}`);
    }

    return await this.lineupRepository.createLineup({
      teamId: data.teamId,
      matchId: data.matchId,
      formation: data.formation,
      players: data.players,
      isConfirmed: data.isConfirmed || false
    });
  }
}
