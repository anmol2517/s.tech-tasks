const mongoose = require('mongoose');

async function connectDatabase(uri) {
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB');
}

module.exports = connectDatabase;
