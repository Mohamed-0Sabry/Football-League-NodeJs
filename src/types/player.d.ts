export interface PlayerStats {
  goals?: number | null;
  assists?: number | null;
  shots?: number | null;
  saves?: number | null;
  passes?: number | null;
  tackles?: number | null;
  fouls?: number | null;
  yellowCards?: number | null;
  redCards?: number | null;
  minutesPlayed?: number | null;
  matchesPlayed?: number | null;
}

export interface PlayerRating {
  overall?: number | null;
  pace?: number | null;
  shooting?: number | null;
  passing?: number | null;
  dribbling?: number | null;
  physicality?: number | null;
  attacking?: number | null;
  midfield?: number | null;
  defending?: number | null;
  goalkeeping?: number | null;
}

export interface Player {
  id: number;
  name: string;
  age?: number;
  position: string;
  nationality?: string;
  team?: string | null;
  photo?: string | null;
  ability?: number | null;
  stamina?: number | null;
  healthCondition?: string | null;
  performance?: number | null;
  matchLoad?: number | null;
  averageRating?: number | null;
  hoursPlayed?: number | null;
  fatiguePercentage?: number | null;
  fitnessLevel?: number | null;
  condition?: string | null;
  playing?: boolean;
  injured?: boolean;
  injuredTime?: number | null;
  injuredReason?: string | null;
  timeForRecover?: number | null;
  stats?: PlayerStats | null;
  rating?: PlayerRating | null;
  goals?: number | null;
  assists?: number | null;
}
