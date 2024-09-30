const mongoose = require("mongoose");
require('dotenv').config();

// const mongoUrl = process.env.DB_Url_local;
const mongoUrl = process.env.DB_Url;

const conn =  mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB Server");
});
    
db.on("error", (err) => {
  console.log("MongoDB connection error: ", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnect");
});
module.exports = db;
