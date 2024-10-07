const express = require("express");
const router = express.Router();
const user = require("../model/user");
const { jwtAuthMiddleware, genrateToken } = require("../config/jwt");

router.get(
  "/",
  /*jwtAuthMiddleware, open this for work on login*/ async (req, res) => {
    try {
      const data = await user.find();
      console.log("data find successfully");
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server Error." });
    }
  }
);

// Add
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new user(data);
    const response = await newUser.save();
    console.log("Data saved");
    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = genrateToken(payload);
    console.log("Token is: " + token);
    res.status(200).json({ response: response, token: token });
    // res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    const voter = await user.findOne({ aadharCardNumber: aadharCardNumber });
    if (!voter || !(await voter.comparepassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid Aadhar Number and password." });
    }
    const payload = {
      id: voter.id,
    };
    const token = genrateToken(payload);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// profile

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userid = userData.id;
    console.log(userData);
    const User = await user.findById(userid);
    res.status(200).json({ User });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// update Password
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let { currentPassword, newPassword } = req.body;
    // Convert to string explicitly
    currentPassword = String(currentPassword);
    newPassword = String(newPassword);

    const voter = await user.findById(userId);
    if (!(await voter.comparepassword(currentPassword))) {
      return res.status(401).json({ error: "Password Incorrect." });
    }
    voter.password = newPassword;

    await voter.save();
    console.log("Password Updated.");
    res.status(201).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error." });
  }
});

module.exports = router;
