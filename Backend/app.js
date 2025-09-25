
// export default app;
import express from "express"
const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
// import auth from "./routes/userRoutes.js";
import router from "./src/routes/authroute.js"
import ApiError from "./src/utils/apiError.js"

import patientRoutes from "./src/routes/patientroute.js";


import doctorRoutes from "./src/routes/doctorroute.js";
import pharmacyRoutes from "./src/routes/pharmacyroute.js";

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"
}))
app.use(cookieParser())
app.use(express.static("public"))
app.use("/api/users", router);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
// Centralized error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
})
export default app