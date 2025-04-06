export interface PlanSuggestionsResponse {
    formation: string;
    tactics: string;
    playerRoles: Array<{ playerId: number, role: string }>;
    reasoning: string;
  }