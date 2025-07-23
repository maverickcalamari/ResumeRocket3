import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { mongodb, testMongoConnection } from "./mongodb";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Explicit __dirname definition
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', true);

// Logging middleware (unchanged)...

(async () => {
  log("🟡 [bootstrap] Starting server...");

  try {
    // 🔍 MongoDB connection - Await explicitly here!
    log("⏳ [mongo] Connecting...");
    await mongodb.connect();  // crucial line
    await mongodb.createIndexes();
    log(`🟢 [mongo] MongoDB connected successfully.`);

    // 🔍 Register routes ONLY after MongoDB connects!
    log("⏳ [routes] Registering routes...");
    const server = await registerRoutes(app);
    log("📦 [routes] Routes registered");

    // Error middleware (unchanged)...

    // Frontend setup (unchanged)...

    const port = 5000;
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`🚀 Server running on port ${port}`);
      log(`📊 Dashboard: http://localhost:${port}`);
      log(`🔧 API: http://localhost:${port}/api`);
    });
  } catch (err) {
    log(`💥 [fatal] Unhandled error: ${(err as Error).message}`, "fatal");
    console.error(err);
    process.exit(1);
  }
})();
