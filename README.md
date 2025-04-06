# Football League Node.js Application

## Production Build and Deployment

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Environment variables configured

### Building for Production

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```
   This will compile TypeScript to JavaScript in the `dist` directory.

3. Set up production environment variables:
   ```bash
   cp .env.production.example .env.production
   ```
   Edit `.env.production` with your production settings.

### Running in Production

1. Start the production server:
   ```bash
   npm run start:prod
   ```

### Deployment Options

#### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t football-league-app .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env.production football-league-app
   ```

#### Cloud Platform Deployment

For platforms like Heroku, Vercel, or AWS:

1. Set the build command to:
   ```
   npm run build
   ```

2. Set the start command to:
   ```
   npm run start:prod
   ```

3. Configure environment variables in your cloud platform's dashboard.

### Database Migrations

Before deploying to production, run database migrations:

```bash
npm run db:migrate
```

### Monitoring and Logging

For production environments, consider implementing:

- Application monitoring (e.g., New Relic, Datadog)
- Error tracking (e.g., Sentry)
- Log aggregation (e.g., ELK Stack, Papertrail)

## Development

// ... existing development instructions ... 