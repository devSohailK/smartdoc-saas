import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";

// ====================================================================
// UNHANDLED ERROR HANDLERS (Prevent app crashes)
// ====================================================================

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Note: SIGTERM and SIGINT are handled in startServer() for graceful shutdown

// ====================================================================
// START SERVER
// ====================================================================

// Start Server Only After DB Connects
const startServer = async () => {
  try {
    await connectDB();
    
    // Create server instance
    const server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`http://localhost:${env.PORT}`);
    });

    // Handle server errors - MUST be set up immediately after listen()
    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`\nPort ${env.PORT} is already in use!`);
        console.error(`Please either:`);
        console.error(`1. Stop the process using port ${env.PORT}`);
        console.error(`2. Change PORT in your .env file\n`);
      } else {
        console.error(`Server error: ${err.message}`);
        if (process.env.NODE_ENV !== "production") {
          console.error(`Stack: ${err.stack}`);
        }
      }
      
      mongoose.connection.close().finally(() => {
        process.exit(1);
      });
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      console.log("\nShutting down gracefully...");
      server.close(() => {
        console.log("HTTP server closed");
        mongoose.connection.close().then(() => {
          console.log("MongoDB connection closed");
          process.exit(0);
        }).catch((err) => {
          console.error("Error closing MongoDB connection:", err);
          process.exit(1);
        });
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    
  } catch (error) {
    console.error("\nFailed to start server:");
    if (error instanceof Error) {
      console.error(`${error.message}`);
      if (process.env.NODE_ENV !== "production") {
        console.error(`\nStack trace:`);
        console.error(`${error.stack}`);
      }
    } else {
      console.error(" Unknown error occurred");
    }
    // Close database connection if it was opened
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close().finally(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  }
};

startServer();