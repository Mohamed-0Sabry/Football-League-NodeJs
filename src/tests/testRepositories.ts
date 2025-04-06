import { testDb } from '../config/testDb';
import { PlayerRepository } from '../repositories/playerRepository';
import { TeamRepository } from '../repositories/teamRepository';
import { MatchRepository } from '../repositories/matchRepository';
import { PerformanceRepository } from '../repositories/performanceRepository';
import { NotificationRepository } from '../repositories/notificationRepository';

// Create a test version of the PlayerRepository
export class TestPlayerRepository extends PlayerRepository {
  constructor() {
    super();
    // Override the db instance with the test database
    (this as any).db = testDb;
  }
}

// Create a test version of the TeamRepository
export class TestTeamRepository extends TeamRepository {
  constructor() {
    super();
    // Override the db instance with the test database
    (this as any).db = testDb;
  }
}

// Create a test version of the MatchRepository
export class TestMatchRepository extends MatchRepository {
  constructor() {
    super();
    // Override the db instance with the test database
    (this as any).db = testDb;
  }
}

// Create a test version of the PerformanceRepository
export class TestPerformanceRepository extends PerformanceRepository {
  constructor() {
    super();
    // Override the db instance with the test database
    (this as any).db = testDb;
  }
}

// Create a test version of the NotificationRepository
export class TestNotificationRepository extends NotificationRepository {
  constructor() {
    super();
    // Override the db instance with the test database
    (this as any).db = testDb;
  }
}

// Factory function to create test repositories
export function createTestRepositories() {
  return {
    playerRepository: new TestPlayerRepository(),
    teamRepository: new TestTeamRepository(),
    matchRepository: new TestMatchRepository(),
    performanceRepository: new TestPerformanceRepository(),
    notificationRepository: new TestNotificationRepository(),
  };
} 