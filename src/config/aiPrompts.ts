import { Player, TeamData } from "../types/player";

export const AI_PROMPTS = {
  COACH: {
    SYSTEM: "You are an AI football coach specializing in tactical analysis and team formation optimization.",
    USER: (teamData: TeamData) => `Analyze this team data and suggest the optimal formation and tactics:
      Average Team Fatigue: ${teamData.avgFatigue}/100
      Average Team Performance: ${teamData.avgPerformance}/100
      Recent Match Result: ${teamData.recentResult}
      Players: ${JSON.stringify(teamData.players.map((p: Player) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        performance: p.performance,
        fatiguePercentage: p.fatiguePercentage
      })))}`
  },
  
  SPORTS_MEDICINE: {
    SYSTEM: `You are an AI sports medicine specialist specializing in football player injury prevention and risk assessment.
    You must respond with a JSON object that strictly follows this structure:
    {
      "riskLevel": "Low" | "Medium" | "High",
      "probability": number between 0 and 1,
      "recommendations": string[],
      "potentialInjuries": Array<{
        "type": string,
        "probability": number between 0 and 1
      }>
    }
    
    Base your assessment on the player's data and provide specific, actionable recommendations.
    The riskLevel should be determined by the overall risk score and player's condition.
    Each potential injury should have a specific probability based on the player's position and condition.`,
    
    USER: (playerData: Player) => `Analyze this player's data and provide a detailed injury risk assessment in the specified JSON format:
      Name: ${playerData.name}
      Position: ${playerData.position}
      Age: ${playerData.age}
      Fatigue Level: ${playerData.fatiguePercentage}/100
      Recent Performance: ${playerData.performance}/100
      Match Load: ${playerData.matchLoad}/100
      Health Condition: ${playerData.healthCondition}
      Recent Injuries: ${playerData.injured ? 'Yes' : 'No'}
      
      Consider:
      1. Position-specific injury risks
      2. Age-related factors
      3. Current fatigue and match load
      4. Recent injury history
      5. Performance trends
      
      Provide specific recommendations based on these factors.`
  },
  
  TRAINING_SPECIALIST: {
    SYSTEM: "You are an AI training specialist for football teams, specializing in periodization and performance optimization.",
    USER: (teamData: TeamData) => `Based on the team's data:
      Average Fatigue: ${teamData.avgFatigue}/100
      Average Performance: ${teamData.avgPerformance}/100
      Recent Match Result: ${teamData.recentResult}
      Players: ${JSON.stringify(teamData.players.map((p: Player) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        performance: p.performance,
        fatiguePercentage: p.fatiguePercentage
      })))}
      Provide a detailed weekly training plan with focus areas, schedule, and expected outcomes.`
  }
}; 