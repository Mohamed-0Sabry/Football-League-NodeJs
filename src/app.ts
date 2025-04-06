import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import playerRoutes from "./routes/playerRoutes";
import matchRoutes from "./routes/matchRoutes";
import aiRoutes from "./routes/aiRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import lineupRoutes from "./routes/lineupRoutes";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

setupSwagger(app); 

app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/lineups", lineupRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

export default app;
