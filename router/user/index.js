import { Router } from 'express';
import db from '../../db.js';
import { validateUser } from '../../middleware/validate-user/index.js';

const router = Router();

// path: /user/create
// router.post('/create', (req, res) => {
//   console.log("Received request body:", req.body);
//   const { name, email } = req.body;
//   if (!name || !email) {
//     return res.status(400).send("Name and email are required");
//   }

//   try {
//     const stmt = db.query("INSERT INTO users (name, email) VALUES (?, ?)");
//     stmt.run(name, email);
//     res.status(201).send("User created successfully");
//   } catch (error) {
//     res.status(500).send("Error creating user");
//   }
// });

// path : /user/users
router.get("/users", validateUser, (req, res) => {
  try {
    // if valid user
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const q = db.query("SELECT * FROM users").all();
    if (!q) {
      return res.status(404).send("No users found");
    }
    res.status(200).json(q);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

// path : /user/users/:id
router.get("/users/:id", validateUser, (req, res) => {
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

export default router;