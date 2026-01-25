const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense
} = require('../controllers/expenseController');

router.post('/expenses', createExpense);
router.get('/expenses', getExpenses);
router.delete('/expenses/:id', deleteExpense);
router.put('/expenses/:id', updateExpense);

module.exports = router;
