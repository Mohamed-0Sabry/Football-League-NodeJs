import { db, testConnection } from './db';
import { players, teams, matches, teamLineups, playerPerformances, notifications, playerStatistics } from './schema';

// Define types for our models
type Team = typeof teams.$inferInsert;
type Player = typeof players.$inferInsert;
type Match = typeof matches.$inferInsert;
type TeamLineup = typeof teamLineups.$inferInsert;
type PlayerPerformance = typeof playerPerformances.$inferInsert;
type PlayerStatistic = typeof playerStatistics.$inferInsert;
type Notification = typeof notifications.$inferInsert;

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to the database. Aborting seed operation.');
      return;
    }
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(notifications);
    await db.delete(playerPerformances);
    await db.delete(teamLineups);
    await db.delete(matches);
    await db.delete(playerStatistics);
    await db.delete(players);
    await db.delete(teams);
    console.log('Existing data cleared.');

    // Create teams
    const teamData: Team[] = [
      {
        name: 'Manchester United',
        nationality: 'England',
        photo: 'https://example.com/photos/manchester-united.jpg',
        coach: 'Erik ten Hag',
        stadium: 'Old Trafford',
        formation: '4-3-3',
        rating: 85.5,
        points: 63,
        goalsScored: 52,
        goalsConceded: 39,
        matchesPlayed: 32,
        matchesWon: 18,
        matchesLost: 8,
        matchesDrawn: 6,
        matchesPlayedHome: 16,
        matchesPlayedAway: 16,
        matchesWonHome: 11,
        matchesWonAway: 7,
        matchesLostHome: 3,
        matchesLostAway: 5,
        matchesDrawnHome: 2,
        matchesDrawnAway: 4,
        lastMatchPlayed: 'Liverpool (H) - 2-2',
        nextMatch: 'Arsenal (A)',
      },
      {
        name: 'Liverpool',
        nationality: 'England',
        photo: 'https://example.com/photos/liverpool.jpg',
        coach: 'Jurgen Klopp',
        stadium: 'Anfield',
        formation: '4-3-3',
        rating: 86.0,
        points: 67,
        goalsScored: 65,
        goalsConceded: 28,
        matchesPlayed: 32,
        matchesWon: 20,
        matchesLost: 4,
        matchesDrawn: 8,
        matchesPlayedHome: 16,
        matchesPlayedAway: 16,
        matchesWonHome: 12,
        matchesWonAway: 8,
        matchesLostHome: 1,
        matchesLostAway: 3,
        matchesDrawnHome: 3,
        matchesDrawnAway: 5,
        lastMatchPlayed: 'Manchester United (A) - 2-2',
        nextMatch: 'Brighton (H)',
      },
      {
        name: 'Arsenal',
        nationality: 'England',
        photo: 'https://example.com/photos/arsenal.jpg',
        coach: 'Mikel Arteta',
        stadium: 'Emirates Stadium',
        formation: '4-3-3',
        rating: 85.8,
        points: 71,
        goalsScored: 75,
        goalsConceded: 24,
        matchesPlayed: 32,
        matchesWon: 22,
        matchesLost: 3,
        matchesDrawn: 7,
        matchesPlayedHome: 16,
        matchesPlayedAway: 16,
        matchesWonHome: 13,
        matchesWonAway: 9,
        matchesLostHome: 1,
        matchesLostAway: 2,
        matchesDrawnHome: 2,
        matchesDrawnAway: 5,
        lastMatchPlayed: 'Brighton (H) - 3-0',
        nextMatch: 'Manchester United (H)',
      },
      {
        name: 'Manchester City',
        nationality: 'England',
        photo: 'https://example.com/photos/manchester-city.jpg',
        coach: 'Pep Guardiola',
        stadium: 'Etihad Stadium',
        formation: '4-3-3',
        rating: 87.2,
        points: 70,
        goalsScored: 71,
        goalsConceded: 31,
        matchesPlayed: 32,
        matchesWon: 21,
        matchesLost: 3,
        matchesDrawn: 8,
        matchesPlayedHome: 16,
        matchesPlayedAway: 16,
        matchesWonHome: 12,
        matchesWonAway: 9,
        matchesLostHome: 1,
        matchesLostAway: 2,
        matchesDrawnHome: 3,
        matchesDrawnAway: 5,
        lastMatchPlayed: 'Crystal Palace (A) - 4-2',
        nextMatch: 'Luton Town (H)',
      }
    ];

    const createdTeams = await db.insert(teams).values(teamData).returning();
    console.log('Teams created:', createdTeams.map(t => t.id));

    // Create players for each team
    const allPlayers: Player[] = [];

    // Manchester United players
    const manUtdPlayers: Player[] = [
      {
        name: 'Marcus Rashford',
        age: 26,
        position: 'Forward',
        nationality: 'England',
        team: 'Manchester United',
        photo: 'https://example.com/photos/rashford.jpg',
        ability: 85,
        stamina: 88,
        healthCondition: 'Excellent',
        performance: 82,
        matchLoad: 75,
        averageRating: 7.2,
        hoursPlayed: 2100,
        fatiguePercentage: 45,
        fitnessLevel: 92,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 12,
          assists: 5,
          shots: 65,
          passes: 320,
          tackles: 12,
          fouls: 15,
          yellowCards: 3,
          redCards: 0,
          minutesPlayed: 2100,
          matchesPlayed: 28,
          matchesLast10Days: 3,
          distanceCovered: 280,
          sprints: 180,
          injuriesThisSeason: 1,
          restRatio: 0.25,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-31'),
          recoveryTime: 0,
          trainingLoad: 75,
          highIntensityActions: 120,
          muscleFatigue: 35,
          jointStress: 25
        },
        rating: {
          overall: 85,
          pace: 89,
          shooting: 82,
          passing: 75,
          dribbling: 85,
          physicality: 80,
          attacking: 84,
          midfield: 70,
          defending: 45,
          goalkeeping: 10
        },
        goals: 12,
        assists: 5,
        injuryHistory: [
          {
            type: 'Ankle Sprain',
            date: new Date('2023-11-15'),
            severity: 'Low',
            recoveryTime: 7
          }
        ],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-15'),
        physicalAssessment: {
          muscleStrength: 88,
          flexibility: 82,
          balance: 85,
          endurance: 90,
          lastAssessmentDate: new Date('2024-03-01')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-30'),
            type: 'High Intensity',
            intensity: 'High',
            duration: 90
          },
          {
            date: new Date('2024-03-28'),
            type: 'Recovery',
            intensity: 'Low',
            duration: 60
          }
        ]
      },
      {
        name: 'Bruno Fernandes',
        age: 29,
        position: 'Midfielder',
        nationality: 'Portugal',
        team: 'Manchester United',
        photo: 'https://example.com/photos/bruno.jpg',
        ability: 88,
        stamina: 85,
        healthCondition: 'Excellent',
        performance: 86,
        matchLoad: 80,
        averageRating: 7.8,
        hoursPlayed: 2300,
        fatiguePercentage: 40,
        fitnessLevel: 90,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 8,
          assists: 12,
          shots: 45,
          passes: 850,
          tackles: 35,
          fouls: 25,
          yellowCards: 5,
          redCards: 0,
          minutesPlayed: 2300,
          matchesPlayed: 30,
          matchesLast10Days: 4,
          distanceCovered: 310,
          sprints: 150,
          injuriesThisSeason: 0,
          restRatio: 0.20,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-31'),
          recoveryTime: 0,
          trainingLoad: 80,
          highIntensityActions: 140,
          muscleFatigue: 40,
          jointStress: 30
        },
        rating: {
          overall: 88,
          pace: 78,
          shooting: 85,
          passing: 90,
          dribbling: 85,
          physicality: 75,
          attacking: 86,
          midfield: 90,
          defending: 65,
          goalkeeping: 10
        },
        goals: 8,
        assists: 12,
        injuryHistory: [],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-10'),
        physicalAssessment: {
          muscleStrength: 85,
          flexibility: 80,
          balance: 82,
          endurance: 88,
          lastAssessmentDate: new Date('2024-02-15')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-30'),
            type: 'Technical',
            intensity: 'Medium',
            duration: 75
          },
          {
            date: new Date('2024-03-28'),
            type: 'Tactical',
            intensity: 'Medium',
            duration: 90
          }
        ]
      },
      {
        name: 'Harry Maguire',
        age: 31,
        position: 'Defender',
        nationality: 'England',
        team: 'Manchester United',
        photo: 'https://example.com/photos/maguire.jpg',
        ability: 82,
        stamina: 80,
        healthCondition: 'Good',
        performance: 80,
        matchLoad: 70,
        averageRating: 7.0,
        hoursPlayed: 1800,
        fatiguePercentage: 35,
        fitnessLevel: 85,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 2,
          assists: 1,
          shots: 15,
          passes: 650,
          tackles: 45,
          fouls: 20,
          yellowCards: 4,
          redCards: 0,
          minutesPlayed: 1800,
          matchesPlayed: 25,
          matchesLast10Days: 3,
          distanceCovered: 220,
          sprints: 80,
          injuriesThisSeason: 1,
          restRatio: 0.30,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-31'),
          recoveryTime: 0,
          trainingLoad: 70,
          highIntensityActions: 90,
          muscleFatigue: 30,
          jointStress: 25
        },
        rating: {
          overall: 82,
          pace: 65,
          shooting: 60,
          passing: 75,
          dribbling: 65,
          physicality: 85,
          attacking: 60,
          midfield: 70,
          defending: 85,
          goalkeeping: 10
        },
        goals: 2,
        assists: 1,
        injuryHistory: [
          {
            type: 'Calf Strain',
            date: new Date('2023-12-10'),
            severity: 'Medium',
            recoveryTime: 14
          }
        ],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-05'),
        physicalAssessment: {
          muscleStrength: 90,
          flexibility: 75,
          balance: 80,
          endurance: 85,
          lastAssessmentDate: new Date('2024-02-20')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-30'),
            type: 'Defensive',
            intensity: 'Medium',
            duration: 60
          },
          {
            date: new Date('2024-03-28'),
            type: 'Recovery',
            intensity: 'Low',
            duration: 45
          }
        ]
      }
    ];

    // Liverpool players
    const liverpoolPlayers: Player[] = [
      {
        name: 'Mohamed Salah',
        age: 31,
        position: 'Forward',
        nationality: 'Egypt',
        team: 'Liverpool',
        photo: 'https://example.com/photos/salah.jpg',
        ability: 89,
        stamina: 87,
        healthCondition: 'Excellent',
        performance: 88,
        matchLoad: 85,
        averageRating: 8.2,
        hoursPlayed: 2400,
        fatiguePercentage: 35,
        fitnessLevel: 92,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 18,
          assists: 9,
          shots: 85,
          passes: 450,
          tackles: 15,
          fouls: 20,
          yellowCards: 2,
          redCards: 0,
          minutesPlayed: 2400,
          matchesPlayed: 31,
          matchesLast10Days: 4,
          distanceCovered: 290,
          sprints: 200,
          injuriesThisSeason: 0,
          restRatio: 0.20,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-31'),
          recoveryTime: 0,
          trainingLoad: 85,
          highIntensityActions: 160,
          muscleFatigue: 35,
          jointStress: 30
        },
        rating: {
          overall: 89,
          pace: 90,
          shooting: 88,
          passing: 80,
          dribbling: 90,
          physicality: 75,
          attacking: 90,
          midfield: 75,
          defending: 45,
          goalkeeping: 10
        },
        goals: 18,
        assists: 9,
        injuryHistory: [],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-20'),
        physicalAssessment: {
          muscleStrength: 85,
          flexibility: 88,
          balance: 90,
          endurance: 92,
          lastAssessmentDate: new Date('2024-03-05')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-30'),
            type: 'High Intensity',
            intensity: 'High',
            duration: 90
          },
          {
            date: new Date('2024-03-28'),
            type: 'Technical',
            intensity: 'Medium',
            duration: 75
          }
        ]
      },
      {
        name: 'Virgil van Dijk',
        age: 32,
        position: 'Defender',
        nationality: 'Netherlands',
        team: 'Liverpool',
        photo: 'https://example.com/photos/vandijk.jpg',
        ability: 90,
        stamina: 86,
        healthCondition: 'Excellent',
        performance: 89,
        matchLoad: 80,
        averageRating: 7.9,
        hoursPlayed: 2200,
        fatiguePercentage: 30,
        fitnessLevel: 90,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 3,
          assists: 2,
          shots: 20,
          passes: 750,
          tackles: 55,
          fouls: 15,
          yellowCards: 3,
          redCards: 0,
          minutesPlayed: 2200,
          matchesPlayed: 29,
          matchesLast10Days: 3,
          distanceCovered: 260,
          sprints: 100,
          injuriesThisSeason: 0,
          restRatio: 0.25,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-31'),
          recoveryTime: 0,
          trainingLoad: 80,
          highIntensityActions: 110,
          muscleFatigue: 30,
          jointStress: 25
        },
        rating: {
          overall: 90,
          pace: 80,
          shooting: 60,
          passing: 85,
          dribbling: 70,
          physicality: 90,
          attacking: 65,
          midfield: 75,
          defending: 90,
          goalkeeping: 10
        },
        goals: 3,
        assists: 2,
        injuryHistory: [
          {
            type: 'Knee Injury',
            date: new Date('2023-09-20'),
            severity: 'Medium',
            recoveryTime: 21
          }
        ],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-15'),
        physicalAssessment: {
          muscleStrength: 92,
          flexibility: 80,
          balance: 85,
          endurance: 88,
          lastAssessmentDate: new Date('2024-03-01')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-30'),
            type: 'Defensive',
            intensity: 'Medium',
            duration: 75
          },
          {
            date: new Date('2024-03-28'),
            type: 'Recovery',
            intensity: 'Low',
            duration: 60
          }
        ]
      }
    ];

    // Arsenal players
    const arsenalPlayers: Player[] = [
      {
        name: 'Bukayo Saka',
        age: 22,
        position: 'Forward',
        nationality: 'England',
        team: 'Arsenal',
        photo: 'https://example.com/photos/saka.jpg',
        ability: 87,
        stamina: 85,
        healthCondition: 'Excellent',
        performance: 86,
        matchLoad: 80,
        averageRating: 7.7,
        hoursPlayed: 2100,
        fatiguePercentage: 40,
        fitnessLevel: 88,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 14,
          assists: 8,
          shots: 70,
          passes: 380,
          tackles: 25,
          fouls: 18,
          yellowCards: 3,
          redCards: 0,
          minutesPlayed: 2100,
          matchesPlayed: 30,
          matchesLast10Days: 4,
          distanceCovered: 270,
          sprints: 170,
          injuriesThisSeason: 0,
          restRatio: 0.25,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-30'),
          recoveryTime: 0,
          trainingLoad: 80,
          highIntensityActions: 130,
          muscleFatigue: 35,
          jointStress: 30
        },
        rating: {
          overall: 87,
          pace: 88,
          shooting: 85,
          passing: 82,
          dribbling: 88,
          physicality: 75,
          attacking: 86,
          midfield: 80,
          defending: 65,
          goalkeeping: 10
        },
        goals: 14,
        assists: 8,
        injuryHistory: [],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-18'),
        physicalAssessment: {
          muscleStrength: 82,
          flexibility: 85,
          balance: 88,
          endurance: 86,
          lastAssessmentDate: new Date('2024-03-05')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-29'),
            type: 'High Intensity',
            intensity: 'High',
            duration: 90
          },
          {
            date: new Date('2024-03-27'),
            type: 'Technical',
            intensity: 'Medium',
            duration: 75
          }
        ]
      }
    ];

    // Manchester City players
    const manCityPlayers: Player[] = [
      {
        name: 'Erling Haaland',
        age: 23,
        position: 'Forward',
        nationality: 'Norway',
        team: 'Manchester City',
        photo: 'https://example.com/photos/haaland.jpg',
        ability: 91,
        stamina: 85,
        healthCondition: 'Excellent',
        performance: 90,
        matchLoad: 75,
        averageRating: 8.5,
        hoursPlayed: 1900,
        fatiguePercentage: 35,
        fitnessLevel: 90,
        condition: 'Fit',
        playing: true,
        injured: false,
        injuredTime: 0,
        injuredReason: '',
        timeForRecover: 0,
        stats: {
          goals: 22,
          assists: 5,
          shots: 95,
          passes: 280,
          tackles: 10,
          fouls: 25,
          yellowCards: 4,
          redCards: 0,
          minutesPlayed: 1900,
          matchesPlayed: 26,
          matchesLast10Days: 3,
          distanceCovered: 230,
          sprints: 150,
          injuriesThisSeason: 1,
          restRatio: 0.30,
          playedFullMatch: true,
          lastMatchDate: new Date('2024-03-30'),
          recoveryTime: 0,
          trainingLoad: 75,
          highIntensityActions: 120,
          muscleFatigue: 35,
          jointStress: 30
        },
        rating: {
          overall: 91,
          pace: 89,
          shooting: 95,
          passing: 70,
          dribbling: 80,
          physicality: 90,
          attacking: 95,
          midfield: 65,
          defending: 45,
          goalkeeping: 10
        },
        goals: 22,
        assists: 5,
        injuryHistory: [
          {
            type: 'Foot Injury',
            date: new Date('2023-12-05'),
            severity: 'Medium',
            recoveryTime: 14
          }
        ],
        medicalNotes: 'Regular check-ups, no issues',
        lastMedicalCheck: new Date('2024-03-20'),
        physicalAssessment: {
          muscleStrength: 95,
          flexibility: 80,
          balance: 85,
          endurance: 88,
          lastAssessmentDate: new Date('2024-03-10')
        },
        trainingHistory: [
          {
            date: new Date('2024-03-29'),
            type: 'High Intensity',
            intensity: 'High',
            duration: 90
          },
          {
            date: new Date('2024-03-27'),
            type: 'Recovery',
            intensity: 'Low',
            duration: 60
          }
        ]
      }
    ];

    // Combine all players
    allPlayers.push(...manUtdPlayers, ...liverpoolPlayers, ...arsenalPlayers, ...manCityPlayers);

    // Insert all players
    const createdPlayers = await db.insert(players).values(allPlayers).returning();
    console.log('Players created:', createdPlayers.map(p => p.id));

    // Create matches
    const matchData: Match[] = [
      {
        homeTeamId: createdTeams[0].id, // Manchester United
        awayTeamId: createdTeams[1].id, // Liverpool
        isFinished: true,
        homeTeamScore: 2,
        awayTeamScore: 2,
        date: new Date('2024-03-31'),
        location: 'Old Trafford',
      },
      {
        homeTeamId: createdTeams[2].id, // Arsenal
        awayTeamId: createdTeams[3].id, // Manchester City
        isFinished: true,
        homeTeamScore: 3,
        awayTeamScore: 1,
        date: new Date('2024-03-30'),
        location: 'Emirates Stadium',
      },
      {
        homeTeamId: createdTeams[1].id, // Liverpool
        awayTeamId: createdTeams[2].id, // Arsenal
        isFinished: false,
        homeTeamScore: null,
        awayTeamScore: null,
        date: new Date('2024-04-14'),
        location: 'Anfield',
      }
    ];

    const createdMatches = await db.insert(matches).values(matchData).returning();
    console.log('Matches created:', createdMatches.map(m => m.id));

    // Create team lineups
    const lineupData: TeamLineup[] = [
      {
        matchId: createdMatches[0].id,
        teamId: createdTeams[0].id,
        formation: '4-3-3',
        players: createdPlayers.filter(p => p.team === 'Manchester United').map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      },
      {
        matchId: createdMatches[0].id,
        teamId: createdTeams[1].id,
        formation: '4-3-3',
        players: createdPlayers.filter(p => p.team === 'Liverpool').map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      },
      {
        matchId: createdMatches[1].id,
        teamId: createdTeams[2].id,
        formation: '4-3-3',
        players: createdPlayers.filter(p => p.team === 'Arsenal').map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      },
      {
        matchId: createdMatches[1].id,
        teamId: createdTeams[3].id,
        formation: '4-3-3',
        players: createdPlayers.filter(p => p.team === 'Manchester City').map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      }
    ];

    const createdLineups = await db.insert(teamLineups).values(lineupData).returning();
    console.log('Team lineups created:', createdLineups.map(l => l.id));

    // Create player performances
    const performanceData: PlayerPerformance[] = [];

    // Add performances for the first match (Man Utd vs Liverpool)
    createdPlayers.forEach(player => {
      if (player.team === 'Manchester United' || player.team === 'Liverpool') {
        performanceData.push({
          playerId: player.id,
          matchId: createdMatches[0].id,
          stats: {
            goals: Math.floor(Math.random() * 2),
            assists: Math.floor(Math.random() * 2),
            shots: Math.floor(Math.random() * 5) + 1,
            passes: Math.floor(Math.random() * 30) + 20,
            tackles: Math.floor(Math.random() * 5),
            fouls: Math.floor(Math.random() * 3),
            yellowCards: Math.random() > 0.9 ? 1 : 0,
            redCards: 0,
            minutesPlayed: 90,
            distanceCovered: Math.random() * 5 + 10,
            sprints: Math.floor(Math.random() * 10) + 15,
            highIntensityActions: Math.floor(Math.random() * 15) + 10
          },
          rating: Math.random() * 1.5 + 6.5,
          minutesPlayed: 90,
          goals: Math.floor(Math.random() * 2),
          assists: Math.floor(Math.random() * 2),
          shots: Math.floor(Math.random() * 5) + 1,
          passes: Math.floor(Math.random() * 30) + 20,
          tackles: Math.floor(Math.random() * 5),
          fouls: Math.floor(Math.random() * 3),
          yellowCards: Math.random() > 0.9 ? 1 : 0,
          redCards: 0,
          distanceCovered: Math.random() * 5 + 10,
          sprints: Math.floor(Math.random() * 10) + 15,
          highIntensityActions: Math.floor(Math.random() * 15) + 10
        });
      }
    });

    // Add performances for the second match (Arsenal vs Man City)
    createdPlayers.forEach(player => {
      if (player.team === 'Arsenal' || player.team === 'Manchester City') {
        performanceData.push({
          playerId: player.id,
          matchId: createdMatches[1].id,
          stats: {
            goals: Math.floor(Math.random() * 2),
            assists: Math.floor(Math.random() * 2),
            shots: Math.floor(Math.random() * 5) + 1,
            passes: Math.floor(Math.random() * 30) + 20,
            tackles: Math.floor(Math.random() * 5),
            fouls: Math.floor(Math.random() * 3),
            yellowCards: Math.random() > 0.9 ? 1 : 0,
            redCards: 0,
            minutesPlayed: 90,
            distanceCovered: Math.random() * 5 + 10,
            sprints: Math.floor(Math.random() * 10) + 15,
            highIntensityActions: Math.floor(Math.random() * 15) + 10
          },
          rating: Math.random() * 1.5 + 6.5,
          minutesPlayed: 90,
          goals: Math.floor(Math.random() * 2),
          assists: Math.floor(Math.random() * 2),
          shots: Math.floor(Math.random() * 5) + 1,
          passes: Math.floor(Math.random() * 30) + 20,
          tackles: Math.floor(Math.random() * 5),
          fouls: Math.floor(Math.random() * 3),
          yellowCards: Math.random() > 0.9 ? 1 : 0,
          redCards: 0,
          distanceCovered: Math.random() * 5 + 10,
          sprints: Math.floor(Math.random() * 10) + 15,
          highIntensityActions: Math.floor(Math.random() * 15) + 10
        });
      }
    });

    const createdPerformances = await db.insert(playerPerformances).values(performanceData).returning();
    console.log('Player performances created:', createdPerformances.map(p => p.id));

    // Create player statistics
    const statisticsData: PlayerStatistic[] = createdPlayers.map(player => ({
      playerId: player.id,
      pace: Math.floor(Math.random() * 20) + 70,
      shooting: Math.floor(Math.random() * 20) + 70,
      passing: Math.floor(Math.random() * 20) + 70,
      dribbling: Math.floor(Math.random() * 20) + 70,
      defending: Math.floor(Math.random() * 20) + 70,
      physical: Math.floor(Math.random() * 20) + 70,
      attacking: Math.floor(Math.random() * 20) + 70,
      midfield: Math.floor(Math.random() * 20) + 70,
      goalkeeping: Math.floor(Math.random() * 20) + 70,
      overall: Math.floor(Math.random() * 20) + 70
    }));

    const createdStatistics = await db.insert(playerStatistics).values(statisticsData).returning();
    console.log('Player statistics created:', createdStatistics.map(s => s.id));

    // Create notifications
    const notificationData: Notification[] = [];

    // Add notifications for all players
    createdPlayers.forEach(player => {
      notificationData.push({
        playerId: player.id,
        title: 'Match Performance Review',
        message: `Great performance in your last match! Keep up the good work.`,
        type: 'performance',
        isRead: Math.random() > 0.5
      });

      if (player.injured) {
        notificationData.push({
          playerId: player.id,
          title: 'Injury Update',
          message: `Your injury is healing well. Expected recovery time: ${player.timeForRecover} days.`,
          type: 'injury',
          isRead: false
        });
      }

      notificationData.push({
        playerId: player.id,
        title: 'Training Schedule',
        message: `Next training session: High-intensity workout at 10:00 AM tomorrow.`,
        type: 'training',
        isRead: false
      });
    });

    const createdNotifications = await db.insert(notifications).values(notificationData).returning();
    console.log('Notifications created:', createdNotifications.map(n => n.id));

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed(); 