const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongodbURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndexes: true,
    });
    console.log('MongoDB connected....');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
