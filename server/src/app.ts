import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movie.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);

export default app;
