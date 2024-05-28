const fs = require('fs');
const csv = require('csv-parser');
const { ObjectId } = require('mongodb');
const connectToDatabase = require('./db');

async function importCsvToMongoDB() {
  const [db, client] = await connectToDatabase();
  const collection = db.collection('population'); // Replace with your actual collection name
  const results = [];

  fs.createReadStream('population_pyramid_1950-2022.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        _id: new ObjectId(),
        Country: data.Country,
        Year: parseInt(data.Year, 10),
        Age: data.Age,
        M: parseInt(data.M, 10),
        F: parseInt(data.F, 10),
      });
    })
    .on('end', async () => {
      try {
        await collection.insertMany(results);
        console.log('Data successfully inserted into MongoDB');
      } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
      } finally {
        await client.close();
      }
    });
}

importCsvToMongoDB();
