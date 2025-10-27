// routes/internshipRoutes.js
import express from "express";
import client from "../db/dbconnect.js";

const router = express.Router();
const ALLOWED_STATUSES = ["Active", "Closed", "Draft"];

/**
 * Helper: normalize skills input
 * Accepts: ['React','Node'] OR "React, Node" OR "React"
 * Returns: array of trimmed non-empty strings
 */
function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) {
    return skills.map(s => String(s).trim()).filter(Boolean);
  }
  // string -> split by comma
  if (typeof skills === "string") {
    return skills.split(",").map(s => s.trim()).filter(Boolean);
  }
  // fallback
  return [];
}

/**
 * POST /
 * Create internship
 * body: { startup_id, title, role?, location?, stipend?, description?, required_skills?, status? }
 */
router.post("/", async (req, res) => {
  try {
    const {
      startup_id,
      title,
      role = null,
      location = null,
      stipend = null,
      description = null,
      required_skills = null,
      status = "Active",
    } = req.body;

    if (!startup_id || !title) {
      return res.status(400).json({ message: "startup_id and title are required" });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }

    const skillsArray = normalizeSkills(required_skills);

    const insertQ = `
      INSERT INTO internships
        (startup_id, title, role, location, stipend, description, required_skills, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
    const values = [startup_id, title, role, location, stipend, description, skillsArray, status];
    const result = await client.query(insertQ, values);
    return res.status(201).json({ message: "Internship created", internship: result.rows[0] });
  } catch (err) {
    console.error("Create internship error:", err);
    // handle foreign key violation or others as needed
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /
 * List internships with optional filters:
 *  - startup_id
 *  - status
 *  - skill  (matches any skill in required_skills)
 *  - q      (full-text like search on title/description)
 */
router.get("/", async (req, res) => {
  try {
    const { startup_id, status, skill, q: search } = req.query;
    const where = [];
    const values = [];
    let idx = 1;

    if (startup_id) {
      where.push(`startup_id = $${idx++}`);
      values.push(startup_id);
    }
    if (status) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
      }
      where.push(`status = $${idx++}`);
      values.push(status);
    }
    if (skill) {
      // check if skill is contained in required_skills array
      where.push(`$${idx} = ANY(required_skills)`); // uses any(array)
      values.push(skill);
      idx++;
    }
    if (search) {
      where.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const q = `
      SELECT i.*, s.name as startup_name
      FROM internships i
      LEFT JOIN startups s ON i.startup_id = s.id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY posted_at DESC
    `;
    const result = await client.query(q, values);
    return res.json({ internships: result.rows });
  } catch (err) {
    console.error("List internships error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /:id
 * Get internship by id (with startup info)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT i.*, s.name as startup_name, s.website as startup_website
      FROM internships i
      LEFT JOIN startups s ON i.startup_id = s.id
      WHERE i.id = $1
    `;
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Internship not found" });
    return res.json({ internship: result.rows[0] });
  } catch (err) {
    console.error("Get internship error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /startup/:startup_id
 * Get internships for a given startup
 */
router.get("/startup/:startup_id", async (req, res) => {
  try {
    const { startup_id } = req.params;
    const q = `
      SELECT *
      FROM internships
      WHERE startup_id = $1
      ORDER BY posted_at DESC
    `;
    const result = await client.query(q, [startup_id]);
    return res.json({ internships: result.rows });
  } catch (err) {
    console.error("Get internships by startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /:id
 * Update internship fields: title, role, location, stipend, description, required_skills, status
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      role,
      location,
      stipend,
      description,
      required_skills,
      status,
    } = req.body;

    if (!title && !role && !location && !stipend && typeof description === "undefined" && typeof required_skills === "undefined" && typeof status === "undefined") {
      return res.status(400).json({ message: "Provide at least one field to update" });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (title) { fields.push(`title = $${idx++}`); values.push(title); }
    if (role) { fields.push(`role = $${idx++}`); values.push(role); }
    if (location) { fields.push(`location = $${idx++}`); values.push(location); }
    if (stipend) { fields.push(`stipend = $${idx++}`); values.push(stipend); }
    if (typeof description !== "undefined") { fields.push(`description = $${idx++}`); values.push(description); }
    if (typeof required_skills !== "undefined") {
      const skillsArray = normalizeSkills(required_skills);
      fields.push(`required_skills = $${idx++}`);
      values.push(skillsArray);
    }
    if (typeof status !== "undefined") { fields.push(`status = $${idx++}`); values.push(status); }

    values.push(id);
    const q = `UPDATE internships SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await client.query(q, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Internship not found" });
    return res.json({ message: "Internship updated", internship: result.rows[0] });
  } catch (err) {
    console.error("Update internship error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /:id
 * Delete internship
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM internships WHERE id = $1 RETURNING id";
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Internship not found" });
    return res.json({ message: "Internship deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("Delete internship error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
