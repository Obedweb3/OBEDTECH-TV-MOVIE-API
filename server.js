import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Static landing page
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Swagger docs route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Movie model
const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  poster: String,
  genre: String,
  year: Number,
});
const Movie = mongoose.model("Movie", movieSchema);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: Returns all movies
 */
app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               poster: { type: string }
 *               genre: { type: string }
 *               year: { type: number }
 *     responses:
 *       201:
 *         description: Movie added
 */
app.post("/api/movies", async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.status(201).json(movie);
});

// Redirect root to docs
app.get("/", (req, res) => res.redirect("/docs"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
