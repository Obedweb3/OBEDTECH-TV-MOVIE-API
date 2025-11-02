import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  title: String,
  episodeNumber: Number,
  videoUrl: String,
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: Number,
  episodes: [episodeSchema],
});

const tvShowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: Number,
  category: String,
  poster: String,
  seasons: [seasonSchema],
});

export default mongoose.model("TvShow", tvShowSchema);
