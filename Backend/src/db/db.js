import mongoose from "mongoose"

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected:", mongoose.connection.host);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err?.message || err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

export const Connection = async()=>{
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment");
    }
    const ConnectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    })
    console.log(`connection is successfull at the server of ${ConnectionInstance.connection.host}`)
  } catch (error) {
    console.log("Error in connection of mongodb", error)
    throw error
  }
}
