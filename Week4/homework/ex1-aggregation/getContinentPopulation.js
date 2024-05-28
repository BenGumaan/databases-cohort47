const connectToDatabase = require('./db');

async function getContinentPopulation(year, age) {
  const [db, client] = await connectToDatabase();
  const collection = db.collection('population'); 

  const pipeline = [
    { $match: { Year: year, Age: age } },
    {
      $addFields: {
        TotalPopulation: { $add: ["$M", "$F"] }
      }
    }
  ];

  const result = await collection.aggregate(pipeline).toArray();
  return [result, client];
}

getContinentPopulation(2020, '100+').then(result => {
  console.log("Results: ", result[0]);
  result[1].close();
}).catch(error => {
  console.error('Error:', error);
  result[1].close();
});
