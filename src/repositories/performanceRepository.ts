import { db } from "../config/db";
import { players } from "../db/schema";
import { eq } from "drizzle-orm";

export class PerformanceRepository {
  async fetchTeamPerformance() {
    const result = await db.execute(
      `SELECT date, AVG(performance) as team_performance 
       FROM matches m
       JOIN players p ON m.id = p.match_id
       GROUP BY date
       ORDER BY date ASC`
    );
    return result.rows;
  }

  async fetchPlayerStatistics(playerId: number) {
    const player = await db.select().from(players).where(eq(players.id, playerId));
    
    // Mock data for FIFA-style spider graph
    return {
      ...player[0],
      stats: {
        pace: Math.floor(Math.random() * 40) + 60,
        shooting: Math.floor(Math.random() * 40) + 60, 
        passing: Math.floor(Math.random() * 40) + 60,
        dribbling: Math.floor(Math.random() * 40) + 60,
        defending: Math.floor(Math.random() * 40) + 60,
        physical: Math.floor(Math.random() * 40) + 60
      }
    };
  }

  async fetchAllPlayersStatistics() {
    const allPlayers = await db.select().from(players);
    
    return allPlayers.map(player => ({
      ...player,
      stats: {
        pace: Math.floor(Math.random() * 40) + 60,
        shooting: Math.floor(Math.random() * 40) + 60, 
        passing: Math.floor(Math.random() * 40) + 60,
        dribbling: Math.floor(Math.random() * 40) + 60,
        defending: Math.floor(Math.random() * 40) + 60,
        physical: Math.floor(Math.random() * 40) + 60
      }
    }));
  }

  async fetchPlayerPredictions(playerId: number) {
    const player = await db.select().from(players).where(eq(players.id, playerId));
    
    return {
      ...player[0],
      predictions: {
        nextMatch: {
          performance: (player[0].performance * 0.8 + Math.random() * 2).toFixed(1),
          fatigue: (player[0].fatigue * 1.2).toFixed(1)
        },
        seasonAverage: {
          performance: (player[0].performance * 0.9 + Math.random()).toFixed(1)
        }
      }
    };
  }

  async fetchFatiguePredictions() {
    const allPlayers = await db.select().from(players);
    
    return allPlayers.map(player => ({
      ...player,
      fatiguePrediction: {
        nextMatch: (player.fatigue * 1.1).toFixed(1),
        afterRestDay: (player.fatigue * 0.7).toFixed(1)
      }
    }));
  }

  async fetchPotentialInjuries() {
    const allPlayers = await db.select().from(players);
    
    return allPlayers.map(player => ({
      id: player.id,
      name: player.name,
      position: player.position,
      currentFatigue: player.fatigue,
      injuryRisk: player.fatigue > 80 ? "High" : player.fatigue > 60 ? "Medium" : "Low",
      injuryProbability: player.fatigue > 80 ? Math.floor(Math.random() * 20) + 30 : 
                          player.fatigue > 60 ? Math.floor(Math.random() * 15) + 10 : 
                          Math.floor(Math.random() * 10)
    }));
  }

  async fetchTrainingImprovements() {
    return [
      { 
        trainingType: "High Intensity", 
        benefits: "Improved stamina and speed",
        recommendedFor: "Forwards and wingers",
        risks: "Higher fatigue and injury risk"
      },
      { 
        trainingType: "Technical Focus", 
        benefits: "Better ball control and passing accuracy",
        recommendedFor: "Midfielders",
        risks: "Less physical development"
      },
      { 
        trainingType: "Defensive Positioning", 
        benefits: "Better team structure and fewer goals conceded",
        recommendedFor: "Defenders and defensive midfielders",
        risks: "Lower attacking contribution"
      },
      { 
        trainingType: "Recovery Sessions", 
        benefits: "Faster fatigue recovery and injury prevention",
        recommendedFor: "Players with fatigue > 70%",
        risks: "Less skill development"
      }
    ];
  }
}