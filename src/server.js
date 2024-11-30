const app = require("./index");
const connect = require("./config/db");
const cors = require("cors");
const express = require("express");
const path = require("path");

// CORS configuration
const allowedOrigins = [
  "http://localhost:3001", // Local development
  "http://www.thepartyjunction.in", // Replace with your frontend's domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// HTTPS redirection (optional)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    await connect();
    console.log(`Listening on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
});
