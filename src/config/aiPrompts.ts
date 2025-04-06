import { Player, TeamData } from "../types/player";

export const AI_PROMPTS = {
  COACH: {
    SYSTEM: `You are an elite football tactics analyst and AI assistant.
Your job is to evaluate team data and optimize formation, player roles, and tactics.
Use knowledge of modern football strategies (e.g. high pressing, inverted fullbacks, false 9s) and make adjustments based on fatigue and performance.`,

    USER: (teamData: TeamData) => `### TEAM DATA ###
Average Team Fatigue: ${teamData.avgFatigue}/100  
Average Team Performance: ${teamData.avgPerformance}/100  
Recent Match Result: ${teamData.recentResult}

Players:
${teamData.players.map((p: Player) => `- ${p.name} (${p.position}) | Performance: ${p.performance}/100 | Fatigue: ${p.fatiguePercentage}/100`).join('\n')}

### INSTRUCTIONS ###
1. Suggest the most suitable **formation** (e.g., 4-3-3, 3-5-2).
2. Assign key roles based on player strengths and fatigue.
3. Suggest tactical approach (e.g., possession, counter-attack, press).
4. Explain why this setup is optimal for the current team condition.`
  },

  SPORTS_MEDICINE: {
    SYSTEM: `You are an AI sports medicine expert specializing in football.
Your task is to analyze players for injury risks and generate prevention strategies.

You must return a response in strict JSON format:
{
  "riskLevel": "Low" | "Medium" | "High",
  "probability": number between 0 and 1,
  "recommendations": string[],
  "potentialInjuries": Array<{
    "type": string,
    "probability": number between 0 and 1
  }>
}

Base your response on position-specific injuries, fatigue, age, performance, and recent match load.`,

    USER: (playerData: Player) => `### PLAYER DATA ###
Name: ${playerData.name}  
Position: ${playerData.position}  
Age: ${playerData.age}  
Fatigue: ${playerData.fatiguePercentage}/100  
Performance: ${playerData.performance}/100  
Match Load: ${playerData.matchLoad}/100  
Health Condition: ${playerData.healthCondition}  
Recent Injuries: ${playerData.injured ? 'Yes' : 'No'}

### ANALYSIS GUIDELINES ###
- Consider typical injuries for this position.
- Account for fatigue, age, and performance trends.
- Be specific and use probabilities grounded in realistic football scenarios.
- Return only the JSON response as specified.`
  },

  TRAINING_SPECIALIST: {
    SYSTEM: `You are an AI football training and periodization expert.
You design weekly training plans that balance performance optimization with injury prevention.

Plans should account for team fatigue, match results, and individual player needs.`,

    USER: (teamData: TeamData) => `### TEAM SNAPSHOT ###
Average Fatigue: ${teamData.avgFatigue}/100  
Average Performance: ${teamData.avgPerformance}/100  
Recent Match Result: ${teamData.recentResult}

Players:
${teamData.players.map((p: Player) => `- ${p.name} (${p.position}) | Perf: ${p.performance}/100 | Fatigue: ${p.fatiguePercentage}/100`).join('\n')}

### REQUEST ###
1. Create a 7-day training plan.
2. Include focus areas (e.g., tactical, recovery, endurance).
3. Outline expected goals per day.
4. Tailor workload based on team condition.
5. Keep it specific, structured, and practical.`
  }
};
