import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Movie from "./models/Movie.js";
import TvShow from "./models/TvShow.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Swagger setup
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "swagger.json")));
swaggerDocument.info.description += "\n\n**Try out each endpoint directly below!**";
swaggerDocument.info["x-logo"] = { url: "/obedtech-logo.png", altText: "OBEDTECH" };

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: `
      .swagger-ui .topbar { background-color: #000 !important; }
      .swagger-ui .topbar-wrapper img { content: url('/obedtech-logo.png'); width: 50px; }
      .swagger-ui .info { color: #58a6ff; }
      body { background-color: #0d1117 !important; color: #e6edf3 !important; }
    `,
    customSiteTitle: "OBEDTECH API Docs",
  })
);

// ===== Movie Routes =====
app.get("/api/movies", async (req, res) => res.json(await Movie.find()));

app.get("/api/search/:title", async (req, res) => {
  const regex = new RegExp(req.params.title, "i");
  res.json(await Movie.find({ title: regex }));
});

app.get("/api/info/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.json({ success: true, movie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ===== TV Routes =====
app.get("/api/tvshows", async (req, res) => res.json(await TvShow.find()));

app.get("/api/tv/:id", async (req, res) => {
  try {
    const show = await TvShow.findById(req.params.id);
    if (!show) return res.status(404).json({ error: "TV show not found" });
    res.json(show);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post("/api/tv/add", async (req, res) => {
  try {
    const tv = new TvShow(req.body);
    await tv.save();
    res.json({ success: true, tv });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/tv/delete/:id", async (req, res) => {
  await TvShow.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ===== Admin Panel =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/", (req, res) => res.send("🎬 OBEDTECH Movie & TV API is live!"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
