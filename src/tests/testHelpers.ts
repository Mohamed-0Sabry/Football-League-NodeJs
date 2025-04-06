import { testDb, resetTestDatabase, closeTestDatabase } from '../config/testDb';
import { players, teams, matches, playerPerformances, notifications } from '../db/schema';
import { Player } from '../types/player';
import { Team } from '../types/team';
import { Match } from '../types/match';
import { Performance } from '../repositories/performanceRepository';
import { Notification } from '../repositories/notificationRepository';

// Mock data for testing
const mockData = {
  players: [] as Player[],
  teams: [] as Team[],
  matches: [] as Match[],
  performances: [] as Performance[],
  notifications: [] as Notification[],
};

// Setup function to run before tests
export async function setupTestDatabase() {
  await resetTestDatabase();
  // Clear mock data
  mockData.players = [];
  mockData.teams = [];
  mockData.matches = [];
  mockData.performances = [];
  mockData.notifications = [];
}

// Teardown function to run after tests
export async function teardownTestDatabase() {
  await closeTestDatabase();
}

// Helper functions to create test data
export async function createTestPlayer(playerData: Partial<Player> = {}): Promise<Player> {
  const defaultPlayer = {
    id: mockData.players.length + 1,
    name: 'Test Player',
    position: 'Forward',
    age: 25,
    nationality: 'Test Country',
    team: 'Test Team',
    ability: 80,
    stamina: 80,
    performance: 80,
    matchLoad: 50,
    averageRating: 7.5,
    hoursPlayed: 100,
    fatiguePercentage: 30,
    fitnessLevel: 90,
    condition: 'good',
    playing: false,
    injured: false,
    stats: {},
    rating: {},
    goals: 10,
    assists: 5,
  };

  const player = {
    ...defaultPlayer,
    ...playerData,
  } as Player;
  
  mockData.players.push(player);
  
  // Mock the database insert
  if (process.env.NODE_ENV === 'test') {
    return player;
  }
  
  const result = await testDb.insert(players).values(player).returning();
  return result[0] as unknown as Player;
}

export async function createTestTeam(teamData: Partial<Team> = {}): Promise<Team> {
  const defaultTeam = {
    id: mockData.teams.length + 1,
    name: 'Test Team',
    nationality: 'Test Country',
    coach: 'Test Coach',
    stadium: 'Test Stadium',
    formation: '4-4-2',
    rating: 80,
    points: 0,
    goalsScored: 0,
    goalsConceded: 0,
    matchesPlayed: 0,
    matchesWon: 0,
    matchesLost: 0,
    matchesDrawn: 0,
  };

  const team = {
    ...defaultTeam,
    ...teamData,
  } as Team;
  
  mockData.teams.push(team);
  
  // Mock the database insert
  if (process.env.NODE_ENV === 'test') {
    return team;
  }
  
  const result = await testDb.insert(teams).values(team).returning();
  return result[0] as unknown as Team;
}

export async function createTestMatch(matchData: Partial<Match> = {}): Promise<Match> {
  const homeTeam = await createTestTeam();
  const awayTeam = await createTestTeam();

  const defaultMatch = {
    id: mockData.matches.length + 1,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    isFinished: false,
    homeTeamScore: 0,
    awayTeamScore: 0,
    date: new Date(),
    location: 'Test Stadium',
  };

  const match = {
    ...defaultMatch,
    ...matchData,
    homeTeam,
    awayTeam,
    homeTeamPlayers: null,
    awayTeamPlayers: null,
  } as Match;
  
  mockData.matches.push(match);
  
  // Mock the database insert
  if (process.env.NODE_ENV === 'test') {
    return match;
  }
  
  const result = await testDb.insert(matches).values(defaultMatch).returning();
  return {
    ...result[0],
    homeTeam,
    awayTeam,
    homeTeamPlayers: null,
    awayTeamPlayers: null,
  } as unknown as Match;
}

export async function createTestPerformance(performanceData: Partial<Performance> = {}): Promise<Performance> {
  const player = await createTestPlayer();
  const match = await createTestMatch();

  const defaultPerformance = {
    id: mockData.performances.length + 1,
    playerId: player.id,
    matchId: match.id,
    stats: {
      goals: 0,
      assists: 0,
      shots: 0,
      passes: 0,
      tackles: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 90,
    },
    rating: 7.0,
    minutesPlayed: 90,
  };

  const performance = {
    ...defaultPerformance,
    ...performanceData,
    player: null,
    match: null,
  } as Performance;
  
  mockData.performances.push(performance);
  
  // Mock the database insert
  if (process.env.NODE_ENV === 'test') {
    return performance;
  }
  
  const result = await testDb.insert(playerPerformances).values(defaultPerformance).returning();
  return {
    ...result[0],
    player: null,
    match: null,
  } as unknown as Performance;
}

export async function createTestNotification(notificationData: Partial<Notification> = {}): Promise<Notification> {
  const player = await createTestPlayer();

  const defaultNotification = {
    id: mockData.notifications.length + 1,
    playerId: player.id,
    title: 'Test Notification',
    message: 'This is a test notification',
    type: 'TEST',
    isRead: false,
  };

  const notification = {
    ...defaultNotification,
    ...notificationData,
    player: null,
  } as Notification;
  
  mockData.notifications.push(notification);
  
  // Mock the database insert
  if (process.env.NODE_ENV === 'test') {
    return notification;
  }
  
  const result = await testDb.insert(notifications).values(defaultNotification).returning();
  return {
    ...result[0],
    player: null,
  } as unknown as Notification;
} 