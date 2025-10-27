// routes/userRoutes.js
import express from "express";
import client from "../db/dbconnect.js"; // your pg client
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

// helper: hash password
async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
}

// helper: compare password
async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error("Error comparing password:", err);
    throw err;
  }
}

// ------------------ Signup ------------------
router.post("/signup", async (req, res) => {
  const { email, password, user_type } = req.body;

  // basic validation
  if (!email || !password || !user_type) {
    return res.status(400).json({ message: "email, password and user_type are required" });
  }
  if (!["student", "startup"].includes(user_type)) {
    return res.status(400).json({ message: "user_type must be 'student' or 'startup'" });
  }

  try {
    // check existing user
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);

    const insertQ = `
      INSERT INTO users (email, password, user_type)
      VALUES ($1, $2, $3)
      RETURNING id, email, user_type, created_at
    `;
    const result = await client.query(insertQ, [email, hashed, user_type]);
    const user = result.rows[0];

    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Login ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });

  try {
    const q = "SELECT id, email, password, user_type, created_at FROM users WHERE email = $1";
    const result = await client.query(q, [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    const safeUser = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      created_at: user.created_at,
    };

    return res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Get all users (safe fields) ------------------
router.get("/", async (req, res) => {
  try {
    const q = "SELECT id, email, user_type, created_at FROM users ORDER BY id";
    const result = await client.query(q);
    return res.json({ users: result.rows });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Get user by id ------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const q = "SELECT id, email, user_type, created_at, startup_id, student_profile_id FROM users WHERE id = $1";
    const result = await client.query(q, [id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Update user (email, user_type, optional password) ------------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, user_type, password } = req.body;

  if (!email && !user_type && !password) {
    return res.status(400).json({ message: "Provide email, user_type or password to update" });
  }
  if (user_type && !["student", "startup"].includes(user_type)) {
    return res.status(400).json({ message: "user_type must be 'student' or 'startup'" });
  }

  try {
    // build dynamic update
    const fields = [];
    const values = [];
    let idx = 1;

    if (email) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (user_type) {
      fields.push(`user_type = $${idx++}`);
      values.push(user_type);
    }
    if (password) {
      const hashed = await hashPassword(password);
      fields.push(`password = $${idx++}`);
      values.push(hashed);
    }

    values.push(id); // last parameter for WHERE
    const q = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, email, user_type, created_at`;
    const result = await client.query(q, values);

    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated", user: result.rows[0] });
  } catch (err) {
    console.error("Update user error:", err);
    // unique email constraint violation handling
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Delete user ------------------
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const q = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
