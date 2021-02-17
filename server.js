const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect DB
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

// Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in ${process.env.PORT}`
      .bgMagenta.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  // Handle unhandled promise rejection
  console.log(`Error: ${err.message}`.red.bold);
  // close and exit the server
  server.close(() => process.exit(1));
});
