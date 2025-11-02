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

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Serve dark themed Swagger
const swaggerDarkHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OBEDTECH API Docs</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      background: #000;
      color: #fff;
      font-family: 'Poppins', sans-serif;
    }
    .swagger-ui {
      background: #000 !important;
    }
    .swagger-ui .topbar {
      background-color: #111 !important;
      border-bottom: 2px solid #2196f3;
    }
    .swagger-ui .topbar a span {
      color: #2196f3 !important;
      font-weight: bold;
    }
    .swagger-ui .opblock {
      background: #111 !important;
      border: 1px solid #2196f3 !important;
      border-radius: 10px;
    }
    .swagger-ui .opblock-summary {
      background: #151515 !important;
    }
    .swagger-ui .opblock-summary-method {
      background: #2196f3 !important;
      color: #fff !important;
    }
    .swagger-ui .response-col_description__inner {
      color: #fff !important;
    }
    .swagger-ui .model-box {
      background: #111 !important;
      color: #fff !important;
    }
    .swagger-ui .btn {
      background: #2196f3 !important;
      border-radius: 6px !important;
    }
    .swagger-ui .opblock-body pre {
      background: #1a1a1a !important;
      color: #00e0ff !important;
    }
    .swagger-ui .info hgroup.main a,
    .swagger-ui .info .title {
      color: #2196f3 !important;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
`;

app.get("/docs", (req, res) => {
  res.send(swaggerDarkHTML);
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Movie schema
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
  
