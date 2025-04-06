import { createTestRepositories } from './testRepositories';
import { PlayerService } from '../services/playerService';
import { MatchService } from '../services/matchService';
import { PerformanceService } from '../services/performanceService';
import { NotificationService } from '../services/notificationService';
import { AIService } from '../services/aiService';
import { LineupService } from '../services/lineupService';

// Create a test version of the PlayerService
export class TestPlayerService extends PlayerService {
  constructor() {
    const { playerRepository } = createTestRepositories();
    super();
    // Override the repository with the test repository
    (this as any).playerRepository = playerRepository;
  }
}

// Create a test version of the MatchService
export class TestMatchService extends MatchService {
  constructor() {
    const { matchRepository } = createTestRepositories();
    super();
    // Override the repository with the test repository
    (this as any).matchRepository = matchRepository;
  }
}

// Create a test version of the PerformanceService
export class TestPerformanceService extends PerformanceService {
  constructor() {
    const { performanceRepository } = createTestRepositories();
    super();
    // Override the repository with the test repository
    (this as any).performanceRepository = performanceRepository;
  }
}

// Create a test version of the NotificationService
export class TestNotificationService extends NotificationService {
  constructor() {
    const { notificationRepository } = createTestRepositories();
    super();
    // Override the repository with the test repository
    (this as any).notificationRepository = notificationRepository;
  }
}

// Create a test version of the AIService
export class TestAIService extends AIService {
  constructor() {
    super();
    // AI service might not need repository overrides
  }
}

// Create a test version of the LineupService
export class TestLineupService extends LineupService {
  constructor() {
    super();
    // Lineup service might not need repository overrides
  }
}

// Factory function to create test services
export function createTestServices() {
  return {
    playerService: new TestPlayerService(),
    matchService: new TestMatchService(),
    performanceService: new TestPerformanceService(),
    notificationService: new TestNotificationService(),
    aiService: new TestAIService(),
    lineupService: new TestLineupService(),
  };
} 