const express = require('express');

const connectDB = require('./config/db');

const app = express();

const mongoose = require('mongoose');

//connect database
connectDB();

//initialise middleware
app.use(express.json({ extended: false }));

//define routes

app.use('/api/users', require('./routes/api/users'));

app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/auth', require('./routes/api/auth'));

app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send('API Running');
// });

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
