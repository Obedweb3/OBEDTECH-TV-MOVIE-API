import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  year: Number,
  category: String,
  poster: String,
  videoUrl: String,
});

export default mongoose.model("Movie", movieSchema);
