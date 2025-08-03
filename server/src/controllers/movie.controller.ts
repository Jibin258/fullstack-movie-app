import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

// Create movie for a specific user
export const createMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await prisma.movie.create({
      data: {
        ...req.body,
        userId,
      },
    });

    res.status(200).json({ message: `${req.body.type} added successfully` });
  } catch (err) {
    console.error("Create Movie Error:", err);
    res.status(500).json({ error: "Failed to create movie" });
  }
};

// Get movies for the authenticated user only
export const getUserMovies = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const type = req.query.type as string;

    const movies = await prisma.movie.findMany({
      where: {
        userId,
        ...(search && {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }),
        ...(type && { type }),
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sanitizedMovies = movies.map((movie) => ({
      ...movie,
      budget: movie.budget?.toString(),
    }));

    res.json(sanitizedMovies);
  } catch (err) {
    console.error("Fetch Movies Error:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// Update movie only if it belongs to the user
export const updateMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const userId = req.user?.id;
    if (!userId || isNaN(movieId)) return res.status(400).json({ error: "Invalid request" });

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie || movie.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized or movie not found" });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: req.body,
    });

    res.json(updatedMovie);
  } catch (err) {
    console.error("Update Movie Error:", err);
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// Delete movie only if it belongs to the user
export const deleteMovie = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const userId = req.user?.id;
    if (!userId || isNaN(movieId)) return res.status(400).json({ error: "Invalid request" });

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie || movie.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized or movie not found" });
    }

    await prisma.movie.delete({
      where: { id: movieId },
    });

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Delete Movie Error:", err);
    res.status(500).json({ error: "Failed to delete movie" });
  }
};
