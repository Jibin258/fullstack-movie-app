import express from "express";
import { createMovie, getUserMovies, updateMovie, deleteMovie } from "../controllers/movie.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/movies", authenticate, createMovie);
router.get("/entries", authenticate, getUserMovies);
router.put("/movies/:id", authenticate, updateMovie);
router.delete("/movies/:id", authenticate, deleteMovie);

export default router;
