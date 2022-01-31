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
const verifyUser = require('./auth');

app.get('/', (req, res) => {
  res.send('server request received');
});

app.get('/books', handleGetBooks);
app.post('/books', handlePostBooks);
app.delete('/books/:id', handleDeleteBooks);
app.put('/books/:id', handlePutBooks);
app.get('./user', handleGetUser);

function handleGetUser(req, res) {
  verifyUser(req, (err, user)=> {
    if(err) {
      console.log(err);
      res.send('invalid token');
    } else { res.send(user); }
  });
}

const Book = require('./models/book');

async function handleGetBooks(req, res) {
  verifyUser(req, async (err, user)=> {
    if(err) {
      console.log(err);
      res.send('invalid token');
    } else {
      try {
        let books = await Book.find({email: user.email});
        if (books.length > 0) {
          res.status(200).send(books);
        } else {
          res.status(404).send('No books found');
        }
      } catch(err) {
        res.status(500).send('Server error');
      }
    }
  });
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
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      let id = req.params.id;
      try {
        const book = await Book.findOne({_id: id, email: user.emali});
        if (!book) {
          res.status(400).send('Unable to find book');
        } else {
          await Book.findByIdAndDelete(id);
          res.status(200).send('Book deleted');
        }
      } catch(err) {
        res.status(404).send('Unable to delete '+id);
      }
    }
  });
}

async function handlePutBooks(req, res) {
  let id = req.params.id;
  try {
    let updatedBook = await Book.findByIdAndUpdate(id, req.body, {new:true, overwrite:true});
    res.status(200).send(updatedBook);
  } catch(err) {
    res.status(404).send('Unable to update '+id);
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
