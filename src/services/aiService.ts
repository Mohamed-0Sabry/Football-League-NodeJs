import openai from "../config/openai";
import { Player, TeamData } from "../types/player";
import { AI_PROMPTS } from "../config/aiPrompts";

export class AIService {
  async getPlanSuggestions(teamData: TeamData): Promise<{
    formation: string;
    tactics: string;
    playerRoles: Array<{playerId: number, role: string}>;
    reasoning: string;
  }> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: AI_PROMPTS.COACH.SYSTEM
        },
        { 
          role: "user", 
          content: AI_PROMPTS.COACH.USER(teamData)
        }
      ]
    });

    const suggestion = response.choices[0]?.message?.content || "No suggestion available.";
    
    // Parse the AI response into structured data
    return {
      formation: "4-3-3", // Default fallback
      tactics: "Possession-based attacking football",
      playerRoles: teamData.players.map(p => ({
        playerId: p.id,
        role: p.position
      })),
      reasoning: suggestion
    };
  }

  async getPlayerInjuryRisk(playerData: Player): Promise<{
    riskLevel: string;
    probability: number;
    recommendations: string[];
    potentialInjuries: Array<{type: string, probability: number}>;
  }> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: AI_PROMPTS.SPORTS_MEDICINE.SYSTEM
        },
        { 
          role: "user", 
          content: AI_PROMPTS.SPORTS_MEDICINE.USER(playerData)
        }
      ],
      response_format: { type: "json_object" }
    });

    try {
      const assessment = JSON.parse(response.choices[0]?.message?.content || "{}");
      
      // Validate and ensure the response matches the expected structure
      return {
        riskLevel: assessment.riskLevel || "Low",
        probability: Math.min(1, Math.max(0, assessment.probability || 0)),
        recommendations: Array.isArray(assessment.recommendations) ? assessment.recommendations : [
          "Increase recovery time between matches",
          "Focus on injury prevention exercises",
          "Monitor fatigue levels closely"
        ],
        potentialInjuries: Array.isArray(assessment.potentialInjuries) ? assessment.potentialInjuries.map((injury: { type: string; probability: number }) => ({
          type: injury.type || "Unknown",
          probability: Math.min(1, Math.max(0, injury.probability || 0))
        })) : [
          {
            type: "Muscle Strain",
            probability: 0.3
          },
          {
            type: "Joint Stress",
            probability: 0.2
          }
        ]
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // Return a safe default response if parsing fails
      return {
        riskLevel: "Low",
        probability: 0.3,
        recommendations: [
          "Increase recovery time between matches",
          "Focus on injury prevention exercises",
          "Monitor fatigue levels closely"
        ],
        potentialInjuries: [
          {
            type: "Muscle Strain",
            probability: 0.3
          },
          {
            type: "Joint Stress",
            probability: 0.2
          }
        ]
      };
    }
  }

  async getTrainingRecommendations(teamData: TeamData): Promise<{
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
  }> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: AI_PROMPTS.TRAINING_SPECIALIST.SYSTEM
        },
        { 
          role: "user", 
          content: AI_PROMPTS.TRAINING_SPECIALIST.USER(teamData)
        }
      ]
    });

    const recommendations = response.choices[0]?.message?.content || "No recommendations available.";
    
    // Parse the AI response into structured data
    return {
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
  }
}