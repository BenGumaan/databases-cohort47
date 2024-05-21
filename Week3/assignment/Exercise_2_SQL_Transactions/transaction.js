

const mysql = require('mysql2/promise');
require('dotenv').config();

(async (sender_account, receiver_account, amount) => {

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    
    try {
    
        await connection.beginTransaction();

        const [sender_balance] = await connection.execute(`SELECT balance FROM account WHERE account_number = ?;`, [sender_account]);
        const [receiver_balance] = await connection.execute(`SELECT balance FROM account WHERE account_number = ?;`, [receiver_account]);

        if (sender_balance[0].balance < amount) {
            throw new Error('Insufficient funds');
        }
      
        await connection.execute('UPDATE account SET balance = balance - ? WHERE account_number = ?', [amount, sender_account]);
        await connection.execute('UPDATE account SET balance = balance + ? WHERE account_number = ?', [amount, receiver_account]);
      
        const changes = [
            [sender_account, -amount, 'Transfer to account ' + receiver_account],
            [receiver_account, amount, 'Transfer from account ' + sender_account]
        ];

        for (const change of changes) {
            await connection.execute(
              'INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)', change
            );
        }
      
        await connection.commit();
        console.log('Transaction committed successfully');

    } catch (err) {

        if (connection) {
          await connection.rollback();
          console.error('Transaction failed, rolled back.', err);
        }
        console.log(`An error occurred: ${err.message}`);

    } finally {

        if (connection) {
            await connection.end();
            console.log('Connection closed');
        }

    }

})(101, 102, 1000);


