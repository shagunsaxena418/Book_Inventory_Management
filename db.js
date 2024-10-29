// db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', // MySQL username
  password: 'root', // MySQL password
  database: 'BookInventory',
});


//Connection Test
pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection failed:", err.stack);
    } else {
      console.log("Database connected successfully!");
      connection.release(); // Release the connection back to the pool
    }
  });
  

// Export the pool for use in other files
module.exports = pool.promise();
