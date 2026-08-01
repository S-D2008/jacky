import { Router } from 'express';
import db from '../../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send("Name, email, and password are required");
    }
    try {
        // find if user already exists
        const existingUser = db.query("SELECT * FROM users WHERE email = ?").get(email);
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        const salt = process.env.AUTH_SALT || await bcrypt.genSalt(10); // Use the salt from .env or generate a new one as fallback
        const secPass = await bcrypt.hash(req.body.password, salt);

        // insert new user into the database
        db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, secPass);
        // return res.status(201).send("User created successfully");

        // generate JWT token
        const token = jwt.sign({ email }, process.env.AUTH_SALT, { expiresIn: '1h' });
        
        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).send("Error checking existing user");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }
    try {
        const user = db.query("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid password");
        }
        const token = jwt.sign({ email }, process.env.AUTH_SALT, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).send("Error during login");
    }
});

export default router;