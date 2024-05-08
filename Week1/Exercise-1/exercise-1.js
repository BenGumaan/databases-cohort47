require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2/promise'); // Promise-based MySQL client
const fs = require('fs'); 

function log(message, error = false) {
  console[error ? 'error' : 'log'](message);
  fs.appendFileSync('db_operations.log', `${new Date().toISOString()} - ${message}\n`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function createTables(connection) {
  const tableQueries = [
    `
      CREATE TABLE IF NOT EXISTS Invitee (
        invitee_no INT PRIMARY KEY AUTO_INCREMENT,
        invitee_name VARCHAR(255),
        invited_by VARCHAR(255)
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS Room (
        room_no INT PRIMARY KEY AUTO_INCREMENT,
        room_name VARCHAR(255),
        floor_number INT
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS Meeting (
        meeting_no INT PRIMARY KEY AUTO_INCREMENT,
        meeting_title VARCHAR(255),
        starting_time DATETIME,
        ending_time DATETIME,
        room_no INT,
        FOREIGN KEY (room_no) REFERENCES Room(room_no)
      )
    `,
  ];

  for (const query of tableQueries) {
    await connection.query(query);
  }
  log('Tables created');
}

async function insertData(connection) {
  const insertInvitee = `
    INSERT INTO Invitee (invitee_name, invited_by)
    VALUES 
      ('Alex Doe', 'Jane Smith'),
      ('John Brown', 'Mark Pascal'),
      ('Eddy White', 'Susan Marvin'),
      ('Emily Peter', 'Paul Gerd'),
      ('Tom Simon', 'Sara Ali')
  `;

  await connection.query(insertInvitee);
  log('Data inserted into Invitee');

  const insertRoom = `
    INSERT INTO Room (room_name, floor_number)
    VALUES 
      ('Room A', 1),
      ('Room B', 3),
      ('Room C', 2),
      ('Room D', 1),
      ('Room E', 2)
  `;

  await connection.query(insertRoom);
  log('Data inserted into Room');

  const insertMeeting = `
    INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no)
    VALUES 
      ('Board Meeting', '2024-05-01 09:00:00', '2024-05-01 11:00:00', 1),
      ('Project Update', '2024-05-02 10:00:00', '2024-05-02 12:00:00', 2),
      ('Team Building', '2024-05-03 13:00:00', '2024-05-03 15:00:00', 3),
      ('Product Launch', '2024-05-04 14:00:00', '2024-05-04 16:00:00', 4),
      ('Customer Meeting', '2024-05-05 15:00:00', '2024-05-05 17:00:00', 5)
  `;

  await connection.query(insertMeeting);
  log('Data inserted into Meeting');
}

(async function main() {
    
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    await connection.query('DROP DATABASE IF EXISTS meetup');
    await connection.query('CREATE DATABASE meetup');
    await connection.query('USE meetup');

    log('Database created and in use');

    await createTables(connection);

    await insertData(connection);

    await connection.commit();
    log('Transaction committed successfully');
  } catch (err) {
    if (connection) {
      await connection.rollback();
      log('Transaction rolled back due to an error', true);
    }
    log(`An error occurred: ${err.message}`, true);
  } finally {
    if (connection) {
      connection.release();
      log('Connection released');
    }
  }

    await pool.end();
    log('Connection pool closed');
})();
