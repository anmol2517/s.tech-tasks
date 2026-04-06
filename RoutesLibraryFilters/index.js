const express = require('express');
const app = express();
const bookRouter = require('./routes/bookRoutes');

app.use(express.json());
app.use('/books', bookRouter);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
