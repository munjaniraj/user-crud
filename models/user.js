import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    privilegeAccess: {
      type: Array,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.user || mongoose.model("user", userSchema);
