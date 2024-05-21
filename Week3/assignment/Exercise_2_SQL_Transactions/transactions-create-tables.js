const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    
    const CREATE_ACCOUNT_TABLE = `
        CREATE TABLE IF NOT EXISTS account (
            account_number INT,
            balance DECIMAL(10, 2) NOT NULL,
            PRIMARY KEY (account_number)
        );
    `;
    
    const CREATE_ACCOUNT_CHANGES_TABLE = `
        CREATE TABLE IF NOT EXISTS account_changes (
            change_number INT AUTO_INCREMENT,
            account_number INT,
            amount DECIMAL(10, 2) NOT NULL,
            changed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            remark VARCHAR(255),
            PRIMARY KEY (change_number),
            FOREIGN KEY (account_number) REFERENCES account(account_number) ON DELETE CASCADE
        );
    `;
    
    
    try {
        await connection.execute(CREATE_ACCOUNT_TABLE);
        await connection.execute(CREATE_ACCOUNT_CHANGES_TABLE);
        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        await connection.end();
    }

})();
