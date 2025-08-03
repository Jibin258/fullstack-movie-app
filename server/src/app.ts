import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movie.routes";

const app = express();

app.use(cors({
    origin: 'https://fullstack-movie-app-nine.vercel.app',
    credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);

export default app;
