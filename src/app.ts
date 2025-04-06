import express from "express";
import cors from "cors";
import playerRoutes from "./routes/playerRoutes";
import matchRoutes from "./routes/matchRoutes";
import aiRoutes from "./routes/aiRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app); 

app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
