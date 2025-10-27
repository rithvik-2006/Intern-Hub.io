// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import applicationRoutes from "./routes/Application.js";
import client from "./db/dbconnect.js"; // ensure DB connection is initialized

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection
// client.connect()
//   .then(() => console.log("✅ Database connected successfully"))
//   .catch((err) => console.error("❌ Database connection failed:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);

// Health check route
app.get("/", (req, res) => res.send("🚀 Internship Portal API is running..."));

// Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
