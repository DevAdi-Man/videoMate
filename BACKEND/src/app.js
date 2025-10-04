import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
console.log("CORS_ORIGIN", process.env.CORS_ORIGIN);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// router immport
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashbord.routes.js";
import comunityRouter from "./routes/comunity.routes.js";
import { ErrorMiddleware } from "./middleware/ErrorHandler.js";

// router decleartion

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comunity", comunityRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Videomate backend is healthy 🚀",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});
app.use(ErrorMiddleware);

export { app };
