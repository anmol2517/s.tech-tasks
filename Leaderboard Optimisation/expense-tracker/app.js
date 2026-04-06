require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./util/database');

const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const leaderboardRoutes = require('./routes/leaderboard');

// Association for leaderboard join
User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/expense', expenseRoutes);
app.use('/payment', paymentRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
}).catch(err => console.error('DB sync error:', err));
