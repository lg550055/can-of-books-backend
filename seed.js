'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Book = require('./models/book');

async function seed() {
  await Book.create({
    title: 'Simulation Hypothesis',
    description: 'Book for lovers of sci-fi, computer science, and video games',
    status: 'reading',
    email: 'rivkadavidowski@fakeuser.com'
  });

  await Book.create({
    title: 'The Little Prince',
    description: 'Kid and adult friendly essay on important life concepts',
    status: 'read',
    email: 'rivkadavidowski@fakeuser.com'
  });

  await Book.create({
    title: 'Crime and Punishment',
    description: 'Classic russian novel delving into human emotions',
    status: 'read',
    email: 'rivkadavidowski@fakeuser.com'
  });

  console.log('Books saved');

  mongoose.disconnect();
}

seed();
