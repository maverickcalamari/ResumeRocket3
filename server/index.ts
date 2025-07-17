import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testMongoConnection } from "./mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  log("🟡 [bootstrap] Starting server...");

  try {
    // 🔍 MongoDB connection
    log("⏳ [mongo] Connecting...");
    const mongoConnected = await testMongoConnection();
    log(`🧪 [mongo] Connected: ${mongoConnected}`);

    // 🔍 Register routes
    log("⏳ [routes] Registering routes...");
    const server = await registerRoutes(app);
    log("📦 [routes] Routes registered");

    // 🔍 Error middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`❌ [error] ${message}`, "express");
      res.status(status).json({ message });
    });

    // 🔍 Setup frontend
    if (app.get("env") === "development") {
      log("⚙️ [vite] Setting up Vite dev middleware...");
      await setupVite(app, server);
    } else {
      log("📁 [static] Serving static files from dist...");
      serveStatic(app);
    }

    // 🔍 Listen
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
