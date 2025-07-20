import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import connectDB from "./mongodb";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logger - add this to debug all incoming requests
app.use((req, res, next) => {
  log(`📥 Request: ${req.method} ${req.originalUrl}`);
  next();
});

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Smart logger
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
  try {
    // Connect to MongoDB first
    log("Connecting to MongoDB...");
    await connectDB();
    log("MongoDB connected successfully");
    
    // Create HTTP server
    const server = createServer(app);
    
    // Register API routes FIRST
    log("Registering API routes...");
    await registerRoutes(app);
    log("API routes registered successfully");

    // Test route to verify server is working
    app.get("/api/test", (req, res) => {
      res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
    });

    // 404 handler ONLY for API routes - MUST come after all API routes
    app.use("/api/*", (req, res) => {
      log(`404 - API route not found: ${req.method} ${req.path}`);
      res.status(404).json({ message: `API route not found: ${req.method} ${req.path}` });
    });

    // Setup static files and React app handling
    if (isDev) {
      // Development mode
      log("Setting up Vite for development...");
      await setupVite(app, server);
    } else {
      // Production mode
      log("Setting up static file serving for production...");
      
      // Set the correct path to your client build folder
      const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
      
      // Serve static files
      app.use(express.static(clientBuildPath));
    }

    // IMPORTANT: Single catch-all route for frontend routes
    // This needs to be the LAST route handler before starting the server
    app.get('*', (req, res, next) => {
      // Skip API routes (already handled by earlier middleware)
      if (req.originalUrl.startsWith('/api/')) {
        // This should never be reached due to the API handler above
        return next();
      }
      
      log(`Serving React app for route: ${req.originalUrl}`);
      
      // In development, let Vite handle it
      if (isDev) {
        return next();
      }
      
      // In production, serve the index.html
      const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });

    // Start the server
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running on port ${port}`);
      log(`📊 Frontend: http://localhost:${port}`);
      log(`🔗 API Health: http://localhost:${port}/api/test`);
      log(`📝 Available routes:`);
      log(`   Frontend (React routes): http://localhost:${port}/* (handled by React Router)`);
      log(`   API: http://localhost:${port}/api/*`);
    });

  } catch (error) {
    log(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
})();
