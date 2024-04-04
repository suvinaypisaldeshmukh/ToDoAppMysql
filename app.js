const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Create todo table if not exists
db.query(`CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    throw err;
  }
  console.log('Todo table created');
});

// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  db.query('INSERT INTO todos (title, description) VALUES (?, ?)', [title, description], (err, result) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ id: result.insertId, title, description });
  });
});
// Update a specific todo by ID
app.put('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const { title, description } = req.body;
    db.query('UPDATE todos SET title = ?, description = ? WHERE id = ?', [title, description, todoId], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ id: todoId, title, description });
    });
  });
  
  // Delete a specific todo by ID
  app.delete('/todos/:id', (req, res) => {
    const todoId = req.params.id;
    db.query('DELETE FROM todos WHERE id = ?', todoId, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted successfully' });
    });
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
