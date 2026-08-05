import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import interviewRoutes from "./routes/interview.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("InterviewAI Pro Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/interviews", interviewRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});