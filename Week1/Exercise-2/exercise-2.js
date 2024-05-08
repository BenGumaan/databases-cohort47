require('dotenv').config(); 
const mysql = require('mysql2/promise'); 
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to run a query with error handling
async function runQuery(query, description, parameters = []) {
  let connection;
  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.execute(query, parameters); 
    console.log(`\n${description}`);
    console.table(rows); 
  } catch (err) {
    console.error('Error executing query:', err);
    fs.appendFileSync('error.log', `${new Date().toISOString()} - ${err}\n`); 
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
}

const queries = [
  {
    query: 'SELECT name AS country_name FROM country WHERE population > 8000000;',
    description: 'Countries with population greater than 8 million:',
  },
  {
    query: 'SELECT name AS country_name FROM country WHERE name LIKE ?;',
    description: 'Countries with "land" in their names:',
    parameters: ['%land%'], // Using prepared statements to prevent SQL injection
  },
  {
    query: 'SELECT name AS city_name FROM city WHERE population BETWEEN 500000 AND 1000000;',
    description: 'Cities with population between 500,000 and 1 million:',
  },
  {
    query: 'SELECT name AS country_name FROM country WHERE continent = "Europe";',
    description: 'Countries on the continent Europe:',
  },
  {
    query: 'SELECT name AS country_name FROM country ORDER BY surfaceArea DESC;',
    description: 'Countries in descending order of their surface areas:',
  },
  {
    query: 'SELECT name AS city_name FROM city WHERE countryCode = "NLD";',
    description: 'Cities in the Netherlands:',
  },
  {
    query: 'SELECT population FROM city WHERE name = ?;',
    description: 'Population of Rotterdam:',
    parameters: ['Rotterdam'], 
  },
  {
    query: 'SELECT name AS country_name, surfaceArea FROM country ORDER BY surfaceArea DESC LIMIT 10;',
    description: 'Top 10 countries by Surface Area:',
  },
  {
    query: 'SELECT name AS city_name, population FROM city ORDER BY population DESC LIMIT 10;',
    description: 'Top 10 most populated cities:',
  },
  {
    query: 'SELECT SUM(population) AS world_population FROM country;',
    description: 'Population of the world:',
  },
];

(async function() {
  const queryPromises = queries.map((q) => runQuery(q.query, q.description, q.parameters));
  await Promise.all(queryPromises);

  await pool.end();
})();
