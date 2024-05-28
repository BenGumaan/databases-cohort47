const connectToDatabase = require('./db');

async function getPopulationByCountry(countryName) {
  const [db, client] = await connectToDatabase();
  const collection = db.collection('population');

  const pipeline = [
    { $match: { Country: countryName } },
    { $group: { _id: "$Year", countPopulation: { $sum: { $add: ["$M", "$F"] } } } },
    { $sort: { _id: 1 } }
  ];

  const result = await collection.aggregate(pipeline).toArray();
  return [result, client];
}

getPopulationByCountry('Netherlands').then(result => {
  console.log("Results: ", result[0]);
  result[1].close();
}).catch(error => {
  console.error('Error:', error);
  result[1].close();
});
