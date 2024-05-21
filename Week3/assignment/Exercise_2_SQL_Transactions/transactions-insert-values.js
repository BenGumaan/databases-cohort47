
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const accounts = [
        [101, 5000.00],
        [102, 1000.00],
        [103, 4000.00],
        [104, 6000.00],
        [105, 8000.00],
        [106, 3200.00],
        [107, 7000.00],
        [108, 9000.00]
    ];

    const insertAccount = `
        INSERT INTO account (account_number, balance) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE balance = VALUES(balance);
    `;

    try {
        for (const account of accounts) {
            await connection.execute(insertAccount, account);
        }
        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        await connection.end();
    }

})();
