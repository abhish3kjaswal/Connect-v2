const express = require('express');

const connectDB = require('./config/db');

const app = express();
var cors = require('cors');

const mongoose = require('mongoose');

const path = require('path');

//cloudinary
app.use(cors());
app.options('*', cors());

//connect database
connectDB();

//initialise middleware
app.use(express.json({ extended: false }));

//define routes

app.use('/api/users', require('./routes/api/users'));

app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/auth', require('./routes/api/auth'));

app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
