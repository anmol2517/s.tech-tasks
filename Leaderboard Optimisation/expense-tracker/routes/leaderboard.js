const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const sequelize = require('../util/database');

// GET /leaderboard — only for premium users
// OPTIMISED: single SQL query using GROUP BY + INNER JOIN via Sequelize include
// Generates: SELECT Expenses.userId, SUM(Expenses.amount) AS totalExpense, User.name
//            FROM Expenses INNER JOIN Users ON Expenses.userId = Users.id
//            GROUP BY Expenses.userId
//            ORDER BY totalExpense DESC
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({ message: 'Premium feature only' });
    }

    const leaderboard = await Expense.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('Expense.amount')), 'totalExpense'],
      ],
      include: [
        {
          model: User,
          attributes: ['name'],  // only fetch what we need — no SELECT *
          required: true,        // INNER JOIN — excludes expenses with no matching user
        },
      ],
      group: ['Expense.userId', 'User.id', 'User.name'],
      order: [[sequelize.fn('SUM', sequelize.col('Expense.amount')), 'DESC']],
      raw: false,  // keep as Sequelize instances so row.User works
    });

    const result = leaderboard.map((row, index) => ({
      rank: index + 1,
      name: row.User.name,
      totalExpense: parseFloat(row.dataValues.totalExpense).toFixed(2),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load leaderboard' });
  }
});

module.exports = router;
