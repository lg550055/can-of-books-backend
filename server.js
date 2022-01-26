'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);

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

async function handlePostBooks(req, res) {
  try {
    const bookAdded = await Book.create(req.body);
    res.status(201).send(bookAdded);
  } catch(err) {
    res.status(500).send('Server Error');
  }
}

async function handleDeleteBooks(req, res) {
  let id = req.params.id;
  try {
    await Book.findByIdAndDelete(id);
    res.status(204).send('Book deleted');
  } catch(err) {
    res.status(404).send('Unable to delete '+id);
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
