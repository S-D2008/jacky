import express from "express";
import db from "./db.js";

const app = express();
const port = 3000;

// middleware to parse JSON bodies
app.use(express.json());

// extract form data from POST requests
app.use(express.urlencoded({ extended: true }));  

app.post("/create-user", (req, res) => {
  console.log("Received request body:", req.body);
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }

  try {
    const stmt = db.query("INSERT INTO users (name, email) VALUES (?, ?)");
    stmt.run(name, email);
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

app.get("/users", (req, res) => {
  try {
    const q = db.query("SELECT * FROM users").all();
    if (!q) {
      return res.status(404).send("No users found");
    }
    res.status(200).json(q);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  try {
    const q = db.query("SELECT * FROM users WHERE id = ?").get(id);
    if (!q) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(q);
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
