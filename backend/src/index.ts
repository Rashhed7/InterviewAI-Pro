import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/prisma";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import interviewRoutes from "./routes/interview.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("InterviewAI Pro Backend is Running 🚀");
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      provider: "Neon PostgreSQL",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log("✅ Neon PostgreSQL Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
});