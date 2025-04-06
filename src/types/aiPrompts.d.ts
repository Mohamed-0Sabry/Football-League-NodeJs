import { Player, TeamData } from "./player";

export interface AIPrompts {
  COACH: {
    SYSTEM: string;
    USER: (teamData: TeamData) => string;
  };
  SPORTS_MEDICINE: {
    SYSTEM: string;
    USER: (playerData: Player) => string;
  };
  TRAINING_SPECIALIST: {
    SYSTEM: string;
    USER: (teamData: TeamData) => string;
  };
} 