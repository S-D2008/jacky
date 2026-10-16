import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve HTML/JS/CSS

// auth routes
app.use("/auth", authRouter);

// middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.AUTH_SALT, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// example protected route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ email: req.user.email, message: "This is your profile data" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
