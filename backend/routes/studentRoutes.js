// routes/studentProfileRoutes.js
import express from "express";
import client from "../db/dbconnect.js";

const router = express.Router();

/**
 * POST /student-profiles
 * Create a student profile
 * body: { user_id, name, school?, major?, graduation_date?, resume_url?, portfolio_link? }
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, name, school = null, major = null, graduation_date = null, resume_url = null, portfolio_link = null } = req.body;

    if (!user_id || !name) {
      return res.status(400).json({ message: "user_id and name are required" });
    }

    const insertQ = `
      INSERT INTO student_profiles
        (user_id, name, school, major, graduation_date, resume_url, portfolio_link)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;
    const values = [user_id, name, school, major, graduation_date, resume_url, portfolio_link];
    const result = await client.query(insertQ, values);
    return res.status(201).json({ message: "Student profile created", student_profile: result.rows[0] });
  } catch (err) {
    console.error("Create student profile error:", err);
    // handle unique constraint / FK errors if needed
    return res.status(500).json({ message: "Server error" });
  }
});
/**
 * GET /student-profiles/me
 * Get the student profile for the currently authenticated user.
 * Requires authentication middleware that sets `req.user = { id, ... }`.
 */

// routes/studentProfileRoutes.js

/**
 * GET /students/me
 * Get the student profile for the current user
 * Uses X-User-ID header to identify the user
 */
router.get("/me", async (req, res) => {
  try {
    // ✅ Get user ID from header (set by axios interceptor)
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user ID not provided" });
    }

    const userIdInt = parseInt(userId, 10);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const q = `
      SELECT sp.*, u.email AS user_email
      FROM student_profiles sp
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = $1
      LIMIT 1
    `;
    
    const result = await client.query(q, [userIdInt]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student profile not found for this user" });
    }

    return res.json({ student: result.rows[0] });
  } catch (err) {
    console.error("Get student profile (me) error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



/**
 * GET /student-profiles
 * List all student profiles (optionally filter by school/major)
 * query: ?school=&major=&q=
 */
router.get("/", async (req, res) => {
  try {
    const { school, major, q } = req.query;
    const where = [];
    const values = [];
    let idx = 1;

    if (school) {
      where.push(`school ILIKE $${idx++}`);
      values.push(`%${school}%`);
    }
    if (major) {
      where.push(`major ILIKE $${idx++}`);
      values.push(`%${major}%`);
    }
    if (q) {
      where.push(`(name ILIKE $${idx} OR resume_url ILIKE $${idx} OR portfolio_link ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    const query = `
      SELECT sp.*, u.email AS user_email
      FROM student_profiles sp
      LEFT JOIN users u ON sp.user_id = u.id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY sp.id DESC
    `;
    const result = await client.query(query, values);
    return res.json({ student_profiles: result.rows });
  } catch (err) {
    console.error("List student profiles error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /student-profiles/:id
 * Get student profile by id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT sp.*, u.email AS user_email
      FROM student_profiles sp
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE sp.id = $1
    `;
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Student profile not found" });
    return res.json({ student_profile: result.rows[0] });
  } catch (err) {
    console.error("Get student profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /student-profiles/user/:user_id
 * Get profile by user id (one-to-one)
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const q = `SELECT * FROM student_profiles WHERE user_id = $1`;
    const result = await client.query(q, [user_id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Student profile not found for this user" });
    return res.json({ student_profile: result.rows[0] });
  } catch (err) {
    console.error("Get student profile by user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /student-profiles/:id
 * Update student profile (partial update allowed)
 * body: any of name, school, major, graduation_date, resume_url, portfolio_link
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, school, major, graduation_date, resume_url, portfolio_link } = req.body;

    if (!name && typeof school === "undefined" && typeof major === "undefined" && typeof graduation_date === "undefined" && typeof resume_url === "undefined" && typeof portfolio_link === "undefined") {
      return res.status(400).json({ message: "Provide at least one field to update" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (typeof school !== "undefined") { fields.push(`school = $${idx++}`); values.push(school); }
    if (typeof major !== "undefined") { fields.push(`major = $${idx++}`); values.push(major); }
    if (typeof graduation_date !== "undefined") { fields.push(`graduation_date = $${idx++}`); values.push(graduation_date); }
    if (typeof resume_url !== "undefined") { fields.push(`resume_url = $${idx++}`); values.push(resume_url); }
    if (typeof portfolio_link !== "undefined") { fields.push(`portfolio_link = $${idx++}`); values.push(portfolio_link); }

    values.push(id);
    const q = `UPDATE student_profiles SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await client.query(q, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Student profile not found" });
    return res.json({ message: "Student profile updated", student_profile: result.rows[0] });
  } catch (err) {
    console.error("Update student profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /student-profiles/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM student_profiles WHERE id = $1 RETURNING id";
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Student profile not found" });
    return res.json({ message: "Student profile deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("Delete student profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
