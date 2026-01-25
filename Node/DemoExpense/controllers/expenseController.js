const Expense = require('../models/Expense');

exports.createExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.findAll();
  res.json(expenses);
};

exports.deleteExpense = async (req, res) => {
  const deleted = await Expense.destroy({ where: { id: req.params.id } });
  res.json({ deleted });
};

exports.updateExpense = async (req, res) => {
  const updated = await Expense.update(req.body, { where: { id: req.params.id } });
  res.json({ updated });
};
