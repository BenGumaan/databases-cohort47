require('dotenv').config();
const mysql = require('mysql2');
const util = require('util');
const { CREATE_DATABASE, CREATE_TABLES, recipes, categories, ingredients, steps, recipeCategories,
  recipeIngredients, recipeSteps, queries } = require('./additional_recipes.js');


const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
});

const executeQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {

  connection.connect();

  try {
    await Promise.all([
      CREATE_DATABASE.map(query => executeQuery(query)),
      CREATE_TABLES.map(query => executeQuery(query)),
    ]);

    await Promise.all([
      recipes.map(rec => executeQuery('INSERT INTO recipe SET ?', rec)),
      categories.map(cat => executeQuery('INSERT INTO category SET ?', cat)),
      ingredients.map(ing => executeQuery('INSERT INTO ingredient SET ?', ing)),
      steps.map(step => executeQuery('INSERT INTO step SET ?', step)),
      recipeCategories.map(recipeCat => executeQuery('INSERT INTO recipe_category SET ?', recipeCat)),
      recipeIngredients.map(recipeIng => executeQuery('INSERT INTO recipe_ingredient SET ?', recipeIng)),
      recipeSteps.map(recipeStep => executeQuery('INSERT INTO recipe_step SET ?', recipeStep)),
    ]);

    await Promise.all([
      queries.map(query => {
        executeQuery(query.query, (err, results) => {
          if (err) throw err;
          console.log(query.question, results);
        });
      })
    ]);

  } catch (error) {
    console.error(error);
  }

  connection.end();
}

seedDatabase();