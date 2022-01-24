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
  console.log('D booked saved');

  mongoose.disconnect();
}

seed();
