const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // middleware

app.get("/", function (req, res) {
  res.send("Welcome, the voting system.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running port " + PORT);
});
