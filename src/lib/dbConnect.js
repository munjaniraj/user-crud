import mongoose from "mongoose";

async function dbConnect() {
  try {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("db is connected");
    });
  } catch (error) {
    console.log("error==========>", error.massage);
  }
}
export default dbConnect;
