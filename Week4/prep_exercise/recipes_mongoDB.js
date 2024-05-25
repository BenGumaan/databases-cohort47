require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const recipes = require('./recipes_collection.json');

const connectionString = process.env.MONGODB_URL;

if (!connectionString || !connectionString.startsWith('mongodb+srv://')) {
  throw new Error('Invalid or missing MongoDB connection string.');
}

const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAndInsertData() {
  try {
    await client.connect();
    const db = client.db('recipeDB');

    await db.collection('recipes').insertMany(recipes);

    console.log('Recipes data inserted successfully');
  } catch (error) {
    console.error('Error inserting recipes data:', error);
  } finally {
    await client.close();
  }
}

async function updateRecordWithTransaction() {
  const session = client.startSession();

  try {
    await client.connect();
    const db = client.db('recipeDB');

    await session.withTransaction(async () => {
      const recipeId = 1;
      const newCategory = { category_name: "Low Carb" };

      await db.collection('recipes').updateOne(
        { _id: recipeId },
        { $push: { categories: newCategory } },
        { session }
      );

      const newIngredient = { ingredient_name: "Chili Flakes", quantity: "1 tsp" };
      await db.collection('recipes').updateOne(
        { _id: recipeId },
        { $push: { ingredients: newIngredient } },
        { session }
      );
    });

    console.log('Transaction committed successfully');
  } catch (error) {
    console.error('Transaction aborted:', error);
  } finally {
    await session.endSession();
    await client.close();
  }
}

(async () => {
  await createAndInsertData();
  await updateRecordWithTransaction();
})();
