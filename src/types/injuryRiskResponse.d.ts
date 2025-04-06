export interface InjuryRiskResponse {
  riskLevel: string;
  probability: number;
  recommendations: string[];
  potentialInjuries: Array<{ type: string; probability: number }>;
} 