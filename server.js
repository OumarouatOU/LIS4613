// server.js
const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Oumarou',
  password: 'Pearson47#2026',
  database: 'library_db'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
     <head>
  <title>Library Management System</title>
  <link rel="stylesheet" href="/styles.css">
</head>

  </head>
    <body>
      <header>
        <h1>Library Management System</h1>
      </header>
      <nav>
  <a href="/">Home</a>
  <a href="/books">Books</a>
  <a href="/books/add">Add Book</a>
  <a href="/members/register">Register</a>
  <a href="/books/lend">Lend Book</a>
</nav>

<main>
  <h2>Welcome to Oumarou Gouba's book store</h2>
 
  <p> This system serves for internal use only. Make sure you check clients information in our database to confirm details before any operation.</p>
</main>

      <footer>
        <p>&copy; 2024 Library Management System</p>
      </footer>
    </body>
    </html>
  `);
});

// Route for displaying all books
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  connection.query(query, (err, books) => {
    if (err) throw err;

    let booksHTML = '';
    books.forEach(book => {
      booksHTML += `
        <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.publication_year}</td>
          <td>
            <form action="/books/delete/${book.id}" method="POST">
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Books</title>
        <link rel="stylesheet" href="/styles.css">
        <link rel="stylesheet" href="/books.css">
      </head>
      <body>
        <header>
          <h1>Library Management System</h1>
        </header>
        <nav>
          <a href="/">Home</a>
          <a href="/books" class="active">Books</a>
          <a href="/books/add">Add Book</a>
          <a href="/members/register">Register</a>
          <a href="/members">Members</a>
        </nav>
        <main>
          <h2>Books</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publication Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${booksHTML}
            </tbody>
          </table>
        </main>
        <footer>
          <p>&copy; 2023 Library Management System</p>
        </footer>
      </body>
      </html>
    `);
  });
});

// Route to delete a book
app.post('/books/delete/:id', (req, res) => {
  const bookId = req.params.id;
  const query = 'DELETE FROM books WHERE id = ?';
  connection.query(query, [bookId], (err, result) => {
    if (err) throw err;
    res.redirect('/books');
  });
});

// Route for adding a new book
app.get('/books/add', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Add Book</title>
<link rel="stylesheet" href="/add_books.css">
    </head>
    <body>
      <header>
        <h1>Library Management System</h1>
      </header>
      <nav>
  <a href="/">Home</a>
  <a href="/books">Books</a>
  <a href="/books/add">Add Book</a>
  <a href="/members/register">Register</a>
  <a href="/books/lend">Lend Book</a>
</nav>
      <main>
        <h2>Add Book</h2>
        <form action="/books/add" method="POST">
          <label for="title">Title</label>
          <input type="text" id="title" name="title" required>
          <label for="author">Author</label>
          <input type="text" id="author" name="author" required>
          <label for="publication_year">Publication Year</label>
          <input type="text" id="publication_year" name="publication_year" required>
          <button type="submit">Add Book</button>
        </form>
      </main>
      <footer>
        <p>&copy; 2023 Library Management System</p>
      </footer>
    </body>
    </html>
  `);
});

app.post('/books/add', (req, res) => {
  const { title, author, publication_year } = req.body;
  const query = 'INSERT INTO books (title, author, publication_year) VALUES (?, ?, ?)';
  connection.query(query, [title, author, publication_year], (err, result) => {
    if (err) throw err;
    res.redirect('/books');
  });
});

// Route for member registration form
app.get('/members/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Member Registration</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <header>
        <h1>Library Management System</h1>
      </header>
	  
      <nav>
        <a href="/">Home</a>
        <a href="/books">Books</a>
        <a href="/books/add">Add Book</a>
        <a href="/members/register" class="active">Register</a>
		<a href="/books/lend">Lend Book</a>
      </nav>
      <main>
        <h2>Member Registration</h2>
        <form action="/members/register" method="POST">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
          <button type="submit">Register</button>
        </form>
      </main>
      <footer>
        <p>&copy; 2023 Library Management System</p>
      </footer>
    </body>
    </html>
  `);
});

// Route for handling member registration form submission
app.post('/members/register', (req, res) => {
  const { name, email, password } = req.body;

  // Insert member data into the database
  const query = 'INSERT INTO members (name, email, password) VALUES (?, ?, ?)';
  connection.query(query, [name, email, password], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to view members
app.get('/members', (req, res) => {
  const query = 'SELECT * FROM members';
  connection.query(query, (err, members) => {
    if (err) throw err;

    let membersHTML = '';
    members.forEach(member => {
      membersHTML += `
        <tr>
          <td>${member.name}</td>
          <td>${member.email}</td>
          <td>
            <a href="/members/delete/${member.id}">Delete</a>
          </td>
        </tr>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Members</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <header>
          <h1>Library Management System</h1>
        </header>
        <nav>
          <a href="/">Home</a>
          <a href="/books">Books</a>
          <a href="/books/add">Add Book</a>
          <a href="/members/register">Register</a>
          <a href="/members" class="active">Members</a>
        </nav>
        <main>
          <h2>Members</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${membersHTML}
            </tbody>
          </table>
          <a href="/members/register">Add Member</a>
        </main>
        <footer>
          <p>&copy; 2023 Library Management System</p>
        </footer>
      </body>
      </html>
    `);
  });
});

// Route to delete a member
app.get('/members/delete/:id', (req, res) => {
  const memberId = req.params.id;
  const query = 'DELETE FROM members WHERE id = ?';
  connection.query(query, [memberId], (err, result) => {
    if (err) throw err;
    res.redirect('/members');
  });
});

// Route for book lending process
app.get('/books/lend', (req, res) => {
  // Render the book lending form
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Lending Form</title>
    </head>
    <body>
      <h2>Book Lending</h2>
      <form action="/books/lend" method="POST">
        <label for="member_id">Member ID:</label>
        <input type="text" id="member_id" name="member_id" required><br><br>
        <label for="book_id">Book ID:</label>
        <input type="text" id="book_id" name="book_id" required><br><br>
        <button type="submit">Lend Book</button>
      </form>
    </body>
    </html>
  `);
});

// Route for handling book lending form submission
app.post('/books/lend', (req, res) => {
  const { member_id, book_id } = req.body;

  // Check if the book is available for lending (e.g., not already borrowed)
  const checkAvailabilityQuery = 'SELECT * FROM books WHERE id = ? AND status = "available"';
  connection.query(checkAvailabilityQuery, [book_id], (err, availabilityResults) => {
    if (err) throw err;

    if (availabilityResults.length === 0) {
      // Book is not available for lending
      res.send('This book is not available for lending.');
    } else {
      // Book is available, proceed with lending
      const lendBookQuery = 'UPDATE books SET status = "borrowed", borrower_id = ? WHERE id = ?';
      connection.query(lendBookQuery, [member_id, book_id], (err, lendResults) => {
        if (err) throw err;

        // Record the lending transaction in the transactions table
        const recordTransactionQuery = 'INSERT INTO transactions (member_id, book_id, transaction_date) VALUES (?, ?, NOW())';
        connection.query(recordTransactionQuery, [member_id, book_id], (err, transactionResults) => {
          if (err) throw err;

          // Redirect to the books page after lending
          res.redirect('/books');
        });
      });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
