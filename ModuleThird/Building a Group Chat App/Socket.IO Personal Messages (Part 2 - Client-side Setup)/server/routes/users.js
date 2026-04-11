const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const filter = search
      ? { email: { $regex: search, $options: "i" } }
      : {};
    const users = await User.find(filter).limit(20).sort({ email: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to load users." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { name: name || normalizedEmail.split("@")[0] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to save user." });
  }
});

module.exports = router;
