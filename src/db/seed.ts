import { db, testConnection } from './db';
import { players, teams, matches, teamLineups, playerPerformances, notifications, playerStatistics } from './schema';

// Define types for our models using the newer approach
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
    
    // Check if tables exist
    try {
      await db.select().from(teams).limit(1);
      console.log('Tables already exist, checking if data exists...');
      
      // Check if data already exists
      const existingTeams = await db.select().from(teams);
      if (existingTeams.length > 0) {
        console.log('Database already contains data. Skipping seed operation.');
        return;
      }
    } catch (error) {
      console.log('Tables do not exist or are empty. Proceeding with seeding...');
    }

    // Create teams
    const teamData: Team[] = [
      {
        name: 'Manchester United',
        nationality: 'England',
        coach: 'Erik ten Hag',
        stadium: 'Old Trafford',
        formation: '4-3-3',
        rating: 85.5,
      },
      {
        name: 'Liverpool',
        nationality: 'England',
        coach: 'Jurgen Klopp',
        stadium: 'Anfield',
        formation: '4-3-3',
        rating: 86.0,
      },
    ];

    const [team1, team2] = await db.insert(teams).values(teamData).returning();
    console.log('Teams created:', team1.id, team2.id);


    const brunoFernandes: Player = {
      name: 'Bruno Fernandes',
      age: 29,
      position: 'Midfielder',
      nationality: 'Portugal',
      team: team1.name,
      photo: 'https://example.com/photos/bruno.jpg',
      ability: 88,
      stamina: 85,
      healthCondition: 'Excellent',
      performance: 86,
      matchLoad: 75,
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
        passesCompleted: 1500,
        keyPasses: 65,
        shots: 80,
        tackles: 30,
        matchesLast10Days: 2,
        distanceCovered: 12.5,        
        sprints: 23,                  
        injuriesThisSeason: 2,
        restRatio: 0.28,              
        playedFullMatch: true
      },
      rating: {
        whoscored: 7.9,
        sofascore: 8.1
      },
      goals: 10,
      assists: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    
    // Create players for each team
    const team1PlayerData: Player[] = [
      {
        name: 'Marcus Rashford',
        position: 'Forward',
        nationality: 'England',
        team: team1.name,
        age: 26,
        ability: 85,
        stamina: 88,
      },
      brunoFernandes
    ];

    const team2PlayerData: Player[] = [
      {
        name: 'Mohamed Salah',
        position: 'Forward',
        nationality: 'Egypt',
        team: team2.name,
        age: 31,
        ability: 89,
        stamina: 87,
      },
      {
        name: 'Virgil van Dijk',
        position: 'Defender',
        nationality: 'Netherlands',
        team: team2.name,
        age: 32,
        ability: 90,
        stamina: 86,
      },
    ];

    const team1Players = await db.insert(players).values(team1PlayerData).returning();
    const team2Players = await db.insert(players).values(team2PlayerData).returning();
    console.log('Players created:', [...team1Players, ...team2Players].map(p => p.id));

    // Create a match
    const matchData: Match = {
      homeTeamId: team1.id,
      awayTeamId: team2.id,
      date: new Date('2024-04-10'),
      location: 'Old Trafford',
      homeTeamScore: 2,
      awayTeamScore: 1,
      isFinished: true,
    };

    const [match] = await db.insert(matches).values(matchData).returning();
    console.log('Match created:', match.id);

    // Create team lineups
    const lineupData: TeamLineup[] = [
      {
        matchId: match.id,
        teamId: team1.id,
        formation: '4-3-3',
        players: team1Players.map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      },
      {
        matchId: match.id,
        teamId: team2.id,
        formation: '4-3-3',
        players: team2Players.map(p => ({ id: p.id, position: p.position })),
        isConfirmed: true,
      },
    ];

    const [homeLineup, awayLineup] = await db.insert(teamLineups).values(lineupData).returning();
    console.log('Team lineups created:', homeLineup.id, awayLineup.id);

    // Create player performances
    const performanceData: PlayerPerformance[] = [
      ...team1Players.map(p => ({
        playerId: p.id,
        matchId: match.id,
        stats: {
          goals: Math.floor(Math.random() * 2),
          assists: Math.floor(Math.random() * 2),
          shots: Math.floor(Math.random() * 5),
          passes: Math.floor(Math.random() * 50) + 20,
        },
        rating: Math.random() * 2 + 7,
        minutesPlayed: 90,
      })),
      ...team2Players.map(p => ({
        playerId: p.id,
        matchId: match.id,
        stats: {
          goals: Math.floor(Math.random() * 2),
          assists: Math.floor(Math.random() * 2),
          shots: Math.floor(Math.random() * 5),
          passes: Math.floor(Math.random() * 50) + 20,
        },
        rating: Math.random() * 2 + 7,
        minutesPlayed: 90,
      })),
    ];

    const performances = await db.insert(playerPerformances).values(performanceData).returning();
    console.log('Player performances created:', performances.map(p => p.id));

    // Create player statistics
    const statisticsData: PlayerStatistic[] = [
      ...team1Players.map(p => ({
        playerId: p.id,
        pace: Math.floor(Math.random() * 20) + 70,
        shooting: Math.floor(Math.random() * 20) + 70,
        passing: Math.floor(Math.random() * 20) + 70,
        dribbling: Math.floor(Math.random() * 20) + 70,
        defending: Math.floor(Math.random() * 20) + 70,
        physical: Math.floor(Math.random() * 20) + 70,
      })),
      ...team2Players.map(p => ({
        playerId: p.id,
        pace: Math.floor(Math.random() * 20) + 70,
        shooting: Math.floor(Math.random() * 20) + 70,
        passing: Math.floor(Math.random() * 20) + 70,
        dribbling: Math.floor(Math.random() * 20) + 70,
        defending: Math.floor(Math.random() * 20) + 70,
        physical: Math.floor(Math.random() * 20) + 70,
      })),
    ];

    const statistics = await db.insert(playerStatistics).values(statisticsData).returning();
    console.log('Player statistics created:', statistics.map(s => s.id));

    // Create notifications
    const notificationData: Notification[] = [
      ...team1Players.map(p => ({
        playerId: p.id,
        title: 'Match Performance Review',
        message: `Great performance in the match against ${team2.name}!`,
        type: 'performance',
      })),
      ...team2Players.map(p => ({
        playerId: p.id,
        title: 'Match Performance Review',
        message: `Good effort in the match against ${team1.name}.`,
        type: 'performance',
      })),
    ];

    const notifs = await db.insert(notifications).values(notificationData).returning();
    console.log('Notifications created:', notifs.map(n => n.id));

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed(); 