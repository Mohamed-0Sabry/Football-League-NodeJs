import openai from "../config/openai";
import { Player, TeamData } from "../types/player";
import { AI_PROMPTS } from "../config/aiPrompts";
import { PlanSuggestionsResponse } from "../types/planSuggestionsResponse";
import { InjuryRiskResponse } from "../types/injuryRiskResponse";
import { TrainingRecommendationsResponse } from "../types/trainingRecommendationsResponse";

export class AIService {
  private parseJSON<T>(text: string | null, fallback: T): T {
    try {
      const parsed = JSON.parse(text || '');
      return parsed ?? fallback;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return fallback;
    }
  }

  async getPlanSuggestions(teamData: TeamData): Promise<PlanSuggestionsResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: AI_PROMPTS.COACH.SYSTEM },
        { role: "user", content: AI_PROMPTS.COACH.USER(teamData) }
      ]
    });

    const content = response.choices[0]?.message?.content?.trim() || "";

    // Attempt to parse JSON from AI output
    const match = content.match(/```json([\s\S]*?)```/) || content.match(/{[\s\S]*}/);
    const parsed = this.parseJSON<PlanSuggestionsResponse | null>(match?.[1] || match?.[0] || "", null);

    return {
      formation: parsed?.formation ?? "4-3-3",
      tactics: parsed?.tactics ?? "Possession-based attacking football",
      playerRoles: Array.isArray(parsed?.playerRoles)
        ? parsed.playerRoles
        : teamData.players.map(p => ({ playerId: p.id, role: p.position })),
      reasoning: parsed?.reasoning ?? content
    };
  }

  async getPlayerInjuryRisk(playerData: Player): Promise<InjuryRiskResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: AI_PROMPTS.SPORTS_MEDICINE.SYSTEM },
        { role: "user", content: AI_PROMPTS.SPORTS_MEDICINE.USER(playerData) }
      ],
      response_format: { type: "json_object" }
    });

    const fallback: InjuryRiskResponse = {
      riskLevel: "Low",
      probability: 0.3,
      recommendations: [
        "Increase recovery time between matches",
        "Focus on injury prevention exercises",
        "Monitor fatigue levels closely"
      ],
      potentialInjuries: [
        { type: "Muscle Strain", probability: 0.3 },
        { type: "Joint Stress", probability: 0.2 }
      ]
    };

    return this.parseJSON<InjuryRiskResponse>(response.choices[0]?.message?.content || "", fallback);
  }

  async getTrainingRecommendations(teamData: TeamData): Promise<TrainingRecommendationsResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: AI_PROMPTS.TRAINING_SPECIALIST.SYSTEM },
        { role: "user", content: AI_PROMPTS.TRAINING_SPECIALIST.USER(teamData) }
      ]
    });

    const content = response.choices[0]?.message?.content?.trim() || "";

    const fallback: TrainingRecommendationsResponse = {
      focusAreas: [
        {
          area: "Technical Skills",
          intensity: "Medium",
          duration: "60 minutes",
          targetPlayers: teamData.players.map(p => p.id)
        },
        {
          area: "Tactical Training",
          intensity: "High",
          duration: "90 minutes",
          targetPlayers: teamData.players.map(p => p.id)
        }
      ],
      schedule: [
        {
          day: "Monday",
          activities: ["Recovery Session", "Light Technical Training"]
        },
        {
          day: "Wednesday",
          activities: ["Tactical Training", "Set Pieces"]
        }
      ],
      expectedOutcomes: [
        "Improved team cohesion",
        "Enhanced tactical understanding",
        "Better recovery management"
      ]
    };

    return this.parseJSON<TrainingRecommendationsResponse>(content, fallback);
  }
}
