const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});

conn.connect(error => {
    
    try {

        if (error) throw error;

        console.log('Connected to MySQL database.');

        const name = "' OR ' 1 '=' 1";
        const code = "' OR ' 1 '=' 1";
        const cb = (error, population) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Population:', population);
            }
        };

        injectedGetPopulation('country', name, code, cb);

        getPopulation('country', name, code, cb);
        
    } catch (error) {
        console.log('Unable to connect to MySQL database.');
    } finally {
        conn.end();
    }
    
  });

  function injectedGetPopulation(Country, name, code, cb) {

    conn.query(
      `SELECT Population FROM ${Country} WHERE Name = '${name}' and code = '${code}'`,
      function (error, result) {
        if (error) cb(error);
        if (result.length == 0) cb(new Error("Not found"));
        cb(null, result);
      }
    );

  };

  function getPopulation(Country, name, code, cb) {

    conn.query(
        `SELECT Population FROM ${Country} WHERE Name = ? AND code = ?`, [name, code],
        function (error, result) {
            if (error) cb(error);
            if (result.length == 0) {
                cb(new Error("Not found"));
            } else {
                cb(null, result);
            }
        }
    );

}