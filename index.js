const express = require("express");
const app = express();
const db = require('./src/config/db');
require("dotenv").config();
const jwtAuthMiddlewar = require("./src/config/jwt").jwtAuthMiddleware;

const userRoutes = require('./src/routes/userRoutes')
const candidateRoutes = require('./src/routes/candidateRoutes')

const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`
  );
  next(); // move on to the next phase
};
app.use(logRequest);
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // middleware

app.get("/", function (req, res) {
  res.send("Welcome, the voting system.");
});
app.use('/voter', userRoutes);
app.use('/candidate', jwtAuthMiddlewar, candidateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running port " + PORT);
});

module.exports = logRequest;