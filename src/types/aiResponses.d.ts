import { PlanSuggestionsResponse } from "./planSuggestionsResponse";
import { InjuryRiskResponse } from "./injuryRiskResponse";
import { TrainingRecommendationsResponse } from "./trainingRecommendationsResponse";

export interface AIServiceResponses {
  planSuggestions: PlanSuggestionsResponse;
  injuryRisk: InjuryRiskResponse;
  trainingRecommendations: TrainingRecommendationsResponse;
} 