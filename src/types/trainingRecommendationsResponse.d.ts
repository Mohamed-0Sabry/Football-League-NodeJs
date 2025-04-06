export interface TrainingRecommendationsResponse {
  focusAreas: Array<{
    area: string;
    intensity: string;
    duration: string;
    targetPlayers: number[];
  }>;
  schedule: Array<{
    day: string;
    activities: string[];
  }>;
  expectedOutcomes: string[];
} 