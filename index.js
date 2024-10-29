// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Our database connection
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname)));



// Add new book to the inventory
app.post('/books', async (req, res) => {
    const { title, author, genre, publication_date, isbn } = req.body;
  
    // Basic input validation
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: "Title, Author, and ISBN are required." });
    }
  
    // ISBN format validation (basic example, can be expanded for format-checking)
    if (!/^\d{10}(\d{3})?$/.test(isbn)) {
      return res.status(400).json({ message: "Invalid ISBN format. Use 10 or 13 digits." });
    }
  
    try {
      const [result] = await db.query(
        "INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)",
        [title, author, genre, publication_date, isbn]
      );
      res.status(201).json({ message: "Book added successfully!", bookId: result.insertId });
    } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ message: "Failed to add book. Please try again." });
    }
  });
  


  // Filter books based on query parameters
app.get('/books', async (req, res) => {
    const { title, author, genre, publication_date } = req.query;
    let query = "SELECT * FROM Inventory WHERE 1=1";
    const queryParams = [];
  
    // Apply filters if present
    if (title) {
      query += " AND title LIKE ?";
      queryParams.push(`%${title}%`);
    }
    if (author) {
      query += " AND author LIKE ?";
      queryParams.push(`%${author}%`);
    }
    if (genre) {
      query += " AND genre LIKE ?";
      queryParams.push(`%${genre}%`);
    }
    if (publication_date) {
      query += " AND publication_date = ?";
      queryParams.push(publication_date);
    }
  
    try {
      const [rows] = await db.query(query, queryParams);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books. Please try again." });
    }
  });

  const { Parser } = require('json2csv'); // Import json2csv for CSV export

  // Export books in CSV or JSON format
  app.get('/books/export', async (req, res) => {
    const { format } = req.query; // Get format from query (either 'csv' or 'json')
  
    try {
      // Fetch all books from the inventory
      const [rows] = await db.query("SELECT * FROM Inventory");
  
      if (format === 'csv') {
        // Convert to CSV format
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(rows);
  
        // Set headers for CSV download
        res.header('Content-Type', 'text/csv');
        res.attachment('books.csv');
        return res.send(csv);
      } else {
        // Default to JSON format
        res.json(rows);
      }
    } catch (error) {
      console.error("Error exporting books:", error);
      res.status(500).json({ message: "Failed to export books. Please try again." });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
