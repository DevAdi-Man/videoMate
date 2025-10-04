import dotenv from "dotenv";
import dbConnect from "./db/index.js";

import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

dbConnect()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
      console.log(`connection successfully on port no ${process.env.PORT}`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });
    
    return server;
  })
  .catch((err) => {
    console.log(`Mongodb connection faild`, err);
  });
