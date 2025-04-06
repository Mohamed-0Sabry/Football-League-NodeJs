import { Player } from "./player";
import { Team } from "./team";
import { Match } from "./match";
import { Performance } from "./performance";
import { PlanSuggestionsResponse as PlanSuggestions } from "./planSuggestionsResponse";
import { InjuryRiskResponse as InjuryRisk } from "./injuryRiskResponse";
import { TrainingRecommendationsResponse as TrainingRecommendations } from "./trainingRecommendationsResponse";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PlayerResponse extends ApiResponse<Player> {}
export interface TeamResponse extends ApiResponse<Team> {}
export interface MatchResponse extends ApiResponse<Match> {}
export interface PerformanceResponse extends ApiResponse<Performance> {}
export interface PlanSuggestionsApiResponse extends ApiResponse<PlanSuggestions> {}
export interface InjuryRiskApiResponse extends ApiResponse<InjuryRisk> {}
export interface TrainingRecommendationsApiResponse extends ApiResponse<TrainingRecommendations> {} 