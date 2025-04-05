import openai from "../config/openai";

export class AIService {
  async getPlanSuggestions(): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI football coach." },
        { role: "user", content: "Suggest the best team formation for my squad." }
      ]
    });

    return response.choices[0]?.message?.content || "No suggestion available.";
  }

  async getPlayerInjuryRisk(playerData: any): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI sports medicine specialist." },
        { 
          role: "user", 
          content: `Analyze this player's data and provide injury risk assessment:
          Name: ${playerData.name}
          Position: ${playerData.position}
          Fatigue Level: ${playerData.fatigue}/100
          Recent Performance: ${playerData.performance}/100`
        }
      ]
    });

    return response.choices[0]?.message?.content || "No assessment available.";
  }

  async getTrainingRecommendations(teamData: any): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI training specialist for football teams." },
        { 
          role: "user", 
          content: `Based on the team's average statistics:
          Average Fatigue: ${teamData.avgFatigue}/100
          Average Performance: ${teamData.avgPerformance}/100
          Recent Match Result: ${teamData.recentResult}
          Recommend training focus areas for the upcoming week.`
        }
      ]
    });

    return response.choices[0]?.message?.content || "No recommendations available.";
  }
}