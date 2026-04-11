const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_chat';

const sampleUsers = [
  { name: 'Alice Turner', email: 'alice@example.com' },
  { name: 'Bob Singh', email: 'bob@example.com' },
  { name: 'Nina Sharma', email: 'nina@example.com' },
  { name: 'Ravi Kumar', email: 'ravi@example.com' }
];

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');
    await User.deleteMany({});
    await User.insertMany(sampleUsers);
    console.log('Seeded sample users:');
    sampleUsers.forEach(user => console.log(`- ${user.email}`));
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
