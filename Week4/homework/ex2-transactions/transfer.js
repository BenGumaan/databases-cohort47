require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const transfer = async (fromAccountNumber, toAccountNumber, amount, remark) => {
    if (typeof fromAccountNumber !== 'number' || typeof toAccountNumber !== 'number' || typeof amount !== 'number' || typeof remark !== 'string') {
        throw new Error('Invalid input types');
    }

    if (amount <= 0) {
        throw new Error('Transfer amount must be positive');
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');

        const session = client.startSession();
        session.startTransaction();

        try {
            const fromAccount = await accountsCollection.findOne({ account_number: fromAccountNumber });
            const toAccount = await accountsCollection.findOne({ account_number: toAccountNumber });

            if (!fromAccount || !toAccount) {
                throw new Error('Account not found');
            }

            if (fromAccount.balance < amount) {
                throw new Error('Insufficient funds');
            }
            
            const fromChangeNumber = fromAccount.account_changes.length > 0 
                ? fromAccount.account_changes[fromAccount.account_changes.length - 1].change_number + 1 
                : 1;
            const toChangeNumber = toAccount.account_changes.length > 0 
                ? toAccount.account_changes[toAccount.account_changes.length - 1].change_number + 1 
                : 1;

            const currentDate = new Date();

            const fromAccountChanges = fromAccount.account_changes.concat({
                change_number: fromChangeNumber,
                amount: -amount,
                changed_date: currentDate,
                remark: remark
            });

            const toAccountChanges = toAccount.account_changes.concat({
                change_number: toChangeNumber,
                amount: amount,
                changed_date: currentDate,
                remark: remark
            });

            await accountsCollection.updateOne(
                { account_number: fromAccountNumber },
                {
                    $inc: { balance: -amount },
                    $set: { account_changes: fromAccountChanges }
                },
                { session }
            );

            await accountsCollection.updateOne(
                { account_number: toAccountNumber },
                {
                    $inc: { balance: amount },
                    $set: { account_changes: toAccountChanges }
                },
                { session }
            );

            await session.commitTransaction();
            console.log('Transaction committed successfully!');
            console.log(`${amount} transferred from account ${fromAccountNumber} to account ${toAccountNumber}.`);
            console.log(`Account ${fromAccountNumber} is now ${fromAccount.balance}.`);
            console.log(`Account ${toAccountNumber} is now ${toAccount.balance}.`);
        } catch (error) {
            await session.abortTransaction();
            console.error('Transaction aborted due to error:', error);
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error during transfer:', error);
    } finally {
        await client.close();
    }
};

const fromAccountNumber = 101;
const toAccountNumber = 102;
const amount = 1000;

transfer(fromAccountNumber, toAccountNumber, amount, `${amount} transferred from account ${fromAccountNumber} to account ${toAccountNumber}.`);

module.exports = transfer;
