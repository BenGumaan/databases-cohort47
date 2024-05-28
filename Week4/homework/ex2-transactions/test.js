require('dotenv').config();
const initializeAccounts = require('./setup');
const transfer = require('./transfer');

const runTest = async () => {
    await initializeAccounts();

    console.log('Before transfer:');
    await printAccounts();

    const fromAccountNumber = 101;
    const toAccountNumber = 102;
    const amount = 1000;

    try {
        await transfer(fromAccountNumber, toAccountNumber, amount, `${amount} transferred from account ${fromAccountNumber} to account ${toAccountNumber}.`);
    } catch (error) {
        console.error('Error during test transfer:', error);
    }

    console.log('After transfer:');
    await printAccounts();
};

const printAccounts = async () => {
    const { MongoClient } = require('mongodb');

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');
        const accounts = await accountsCollection.find({}).toArray();

        console.log(JSON.stringify(accounts, null, 2));
    } catch (error) {
        console.error('Error fetching accounts:', error);
    } finally {
        await client.close();
    }
};

runTest().catch(console.error);
