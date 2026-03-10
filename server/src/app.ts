import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from './routes/index.routes.js';

const app: Application = express();


// Security: Sets various HTTP headers to prevent attacks (XSS, Clickjacking)
app.use(helmet()); 

// CORS: Allow your Vite Frontend to talk to this Backend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true // Allow cookies/sessions if needed
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get('/api', (req, res) => {
    res.json({ message: "API is reachable" });
});

app.use('/api', routes);

// Health Check (Used by AWS/Render to check if server is alive)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});



// 3. 404 HANDLER (Handle routes that don't exist)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// 4. GLOBAL ERROR HANDLER (The Safety Net)
// If any route throws an error, it ends up here. No App crashes.
// IMPORTANT: Error handler must have 4 parameters and be last
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`❌ Error: ${message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(`Stack: ${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development, never in production!
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;