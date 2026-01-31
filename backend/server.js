const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "your_super_secret_key";

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ---
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: users[0].id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TASK CRUD ---

// View all tasks
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
      [title, description, "Pending"],
    );
    res
      .status(201)
      .json({ id: result.insertId, title, description, status: "Pending" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task Status (Toggle)
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
