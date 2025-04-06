export interface Performance {
  id: number;
  playerId: number;
  matchId: number;
  rating: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  distanceCovered: number;
  sprints: number;
  highIntensityActions: number;
  passes: number;
  tackles: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  date: Date;
}
