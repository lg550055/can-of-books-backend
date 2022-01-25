'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Mongoose is connected');
});

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('server request received');
});

app.get('/cats', (req, res) => {
  res.send('Cats route here');
});

app.get('/books', handleGetBooks);

const Book = require('./models/book');

async function handleGetBooks(req, res) {
  let queryObject = {};
  if(req.query.email) {
    queryObject = {email: req.query.email};
  }
  try {
    let booksFromDb = await Book.find(queryObject);
    if (booksFromDb.length > 0) {
      res.status(200).send(booksFromDb);
    } else {
      res.status(404).send('No books found');
    }
  } catch(err) {
    res.status(500).send('Server error');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
