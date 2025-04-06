# API Testing Guide

This directory contains tests for the Football League API endpoints. These tests use Jest and Supertest to test the API routes in isolation.

## Test Structure

The tests are organized by route:

- `playerRoutes.test.ts` - Tests for player-related endpoints
- `matchRoutes.test.ts` - Tests for match-related endpoints
- `notificationRoutes.test.ts` - Tests for notification-related endpoints
- `aiRoutes.test.ts` - Tests for AI-related endpoints
- `performanceRoutes.test.ts` - Tests for performance-related endpoints
- `lineupRoutes.test.ts` - Tests for lineup-related endpoints

Each test file follows a similar structure:
1. Setup the test database before tests
2. Run tests for each endpoint
3. Teardown the test database after tests

## Running the Tests

You can run the API tests using the following npm scripts:

```bash
# Run all API tests
npm run test:api

# Run API tests in watch mode (tests will re-run when files change)
npm run test:api:watch
```

## Test Database

The tests use a separate test database to avoid affecting your development or production data. The test database is created and reset before each test run.

Make sure your `.env.test` file is properly configured with the test database connection details:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=football_league_test
```

## Writing New Tests

When adding new API endpoints, create a new test file or add tests to an existing one following the same pattern:

1. Import necessary dependencies
2. Use the test helpers to create test data
3. Make requests to the API endpoints
4. Assert the expected responses

Example:

```typescript
describe('GET /api/new-endpoint', () => {
  it('should return expected data', async () => {
    // Create test data
    const testData = await createTestData();
    
    // Make request to API
    const response = await request(app).get('/api/new-endpoint');
    
    // Assert response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});
```

## Troubleshooting

If you encounter issues with the tests:

1. Make sure the test database is properly configured
2. Check that all required tables exist in the test database
3. Verify that the API endpoints are correctly implemented
4. Check for any TypeScript errors in the test files 