import { Database } from "bun:sqlite";

const db = new Database("app.db");

// schema
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE)");

export default db;