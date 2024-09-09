import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    mainImage: {
      type: String,
      required: false,
    },
    tabImage: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.portfolio ||
  mongoose.model("portfolio", portfolioSchema);
