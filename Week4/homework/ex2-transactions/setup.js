require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const initializeAccounts = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');

        await accountsCollection.deleteMany({});

        const sampleAccounts = [
            {
                account_number: 101,
                balance: 5000,
                account_changes: [
                    { change_number: 1, amount: 5000, changed_date: new Date(), remark: 'Initial deposit' }
                ]
            },
            {
                account_number: 102,
                balance: 3000,
                account_changes: [
                    { change_number: 1, amount: 3000, changed_date: new Date(), remark: 'Initial deposit' }
                ]
            }
        ];

        await accountsCollection.insertMany(sampleAccounts);

        console.log('Accounts initialized');
    } catch (error) {
        console.error('Error initializing accounts:', error);
    } finally {
        await client.close();
    }
};

module.exports = initializeAccounts;
