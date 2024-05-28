require('dotenv').config();
const { MongoClient } = require('mongodb');

const connectionString = process.env.MONGODB_URI;
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('databaseWeek4');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB:', error);
      throw error;
    }
  }
  return [db, client];
}

module.exports = connectToDatabase;
