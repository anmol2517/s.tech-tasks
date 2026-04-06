const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.render("index", { expenses, total });
});

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", async (req, res) => {
  const { title, amount, category } = req.body;
  await Expense.create({ title, amount, category });
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  res.render("edit", { expense });
});

router.post("/edit/:id", async (req, res) => {
  const { title, amount, category } = req.body;
  await Expense.findByIdAndUpdate(req.params.id, { title, amount, category });
  res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
