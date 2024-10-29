// Fetch all books based on filter criteria
async function fetchBooks(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`/books?${query}`);
    const books = await response.json();
    displayBooks(books);
  }
  
  // Display books in the table
  function displayBooks(books) {
    const tbody = document.querySelector("#books-table tbody");
    tbody.innerHTML = '';
    books.forEach(book => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre || ''}</td>
        <td>${book.publication_date || ''}</td>
        <td>${book.isbn}</td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Add new book
  document.querySelector("#add-book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newBook = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      genre: document.getElementById("genre").value,
      publication_date: document.getElementById("publication_date").value,
      isbn: document.getElementById("isbn").value,
    };
  
    const response = await fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
  
    if (response.ok) {
      alert("Book added successfully!");
      fetchBooks(); // Refresh book list
    } else {
      alert("Failed to add book. Please try again.");
    }
  });
  
  // Filter books
  document.querySelector("#filter-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const filters = {
      title: document.getElementById("filter-title").value,
      author: document.getElementById("filter-author").value,
      genre: document.getElementById("filter-genre").value,
      publication_date: document.getElementById("filter-publication_date").value,
    };
    fetchBooks(filters);
  });
  
  // Export data in chosen format
  function exportData(format) {
    window.location.href = `/books/export?format=${format}`;
  }
  
  // Load all books on initial load
  fetchBooks();
  