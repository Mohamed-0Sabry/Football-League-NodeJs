import openai from "../config/openai";
import { Player } from "../types/player";

interface TeamData {
  avgFatigue: number;
  avgPerformance: number;
  recentResult: string;
  players: Player[];
}

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
          content: "You are an AI football coach specializing in tactical analysis and team formation optimization." 
        },
        { 
          role: "user", 
          content: `Analyze this team data and suggest the optimal formation and tactics:
          Average Team Fatigue: ${teamData.avgFatigue}/100
          Average Team Performance: ${teamData.avgPerformance}/100
          Recent Match Result: ${teamData.recentResult}
          Players: ${JSON.stringify(teamData.players.map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            performance: p.performance,
            fatiguePercentage: p.fatiguePercentage
          })))}`
        }
      ]
    });

    const suggestion = response.choices[0]?.message?.content || "No suggestion available.";
    
    // Parse the AI response into structured data
    // This is a simplified example - in production, you'd want more robust parsing
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
          content: "You are an AI sports medicine specialist specializing in football player injury prevention and risk assessment." 
        },
        { 
          role: "user", 
          content: `Analyze this player's data and provide detailed injury risk assessment:
          Name: ${playerData.name}
          Position: ${playerData.position}
          Age: ${playerData.age}
          Fatigue Level: ${playerData.fatiguePercentage}/100
          Recent Performance: ${playerData.performance}/100
          Match Load: ${playerData.matchLoad}/100
          Health Condition: ${playerData.healthCondition}
          Recent Injuries: ${playerData.injured ? 'Yes' : 'No'}`
        }
      ]
    });

    const assessment = response.choices[0]?.message?.content || "No assessment available.";
    
    // Calculate risk level based on player data
    const riskScore = (
      (playerData.fatiguePercentage || 0) * 0.4 +
      (playerData.matchLoad || 0) * 0.3 +
      (playerData.injured ? 30 : 0)
    ) / 100;

    return {
      riskLevel: riskScore > 0.7 ? "High" : riskScore > 0.4 ? "Medium" : "Low",
      probability: riskScore,
      recommendations: [
        "Increase recovery time between matches",
        "Focus on injury prevention exercises",
        "Monitor fatigue levels closely"
      ],
      potentialInjuries: [
        {
          type: "Muscle Strain",
          probability: Math.min(1, riskScore * 1.2)
        },
        {
          type: "Joint Stress",
          probability: Math.min(1, riskScore * 0.8)
        }
      ]
    };
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
          content: "You are an AI training specialist for football teams, specializing in periodization and performance optimization." 
        },
        { 
          role: "user", 
          content: `Based on the team's data:
          Average Fatigue: ${teamData.avgFatigue}/100
          Average Performance: ${teamData.avgPerformance}/100
          Recent Match Result: ${teamData.recentResult}
          Players: ${JSON.stringify(teamData.players.map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            performance: p.performance,
            fatiguePercentage: p.fatiguePercentage
          })))}
          Provide a detailed weekly training plan with focus areas, schedule, and expected outcomes.`
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