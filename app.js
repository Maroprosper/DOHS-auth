require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Apply security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `http://localhost:${process.env.PORT}` }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret', // Use a strong secret in a real application
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./app/routes")(app);

app.get("/", (request, response) => response.send(process.env.TEST));

app.listen(process.env.PORT, () => console.log(`Listening: port ${process.env.PORT}`));
 // Should output your JWT secret
 