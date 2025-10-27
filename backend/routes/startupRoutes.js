// routes/startupRoutes.js
import express from "express";
import client from "../db/dbconnect.js";

const router = express.Router();

/**
 * POST /startups
 * Create a startup
 * body: { user_id, name, description?, website? }
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, name, description = null, website = null } = req.body;
    if (!user_id || !name) return res.status(400).json({ message: "user_id and name are required" });

    // optional: prevent duplicate startup names for the same user (or globally)
    const insertQ = `
      INSERT INTO startups (user_id, name, description, website)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
    const result = await client.query(insertQ, [user_id, name, description, website]);
    return res.status(201).json({ message: "Startup created", startup: result.rows[0] });
  } catch (err) {
    console.error("Create startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /startups
 * List startups (optional filter by name or website)
 * query: ?name=&website=
 */
router.get("/", async (req, res) => {
  try {
    const { name, website } = req.query;
    const where = [];
    const values = [];
    let idx = 1;

    if (name) {
      where.push(`name ILIKE $${idx++}`);
      values.push(`%${name}%`);
    }
    if (website) {
      where.push(`website ILIKE $${idx++}`);
      values.push(`%${website}%`);
    }

    const q = `
      SELECT s.*, u.email AS user_email
      FROM startups s
      LEFT JOIN users u ON s.user_id = u.id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY s.id DESC
    `;
    const result = await client.query(q, values);
    return res.json({ startups: result.rows });
  } catch (err) {
    console.error("List startups error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /startups/:id
 * Get startup by id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT s.*, u.email AS user_email
      FROM startups s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Startup not found" });
    return res.json({ startup: result.rows[0] });
  } catch (err) {
    console.error("Get startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /startups/user/:user_id
 * Get startup(s) created by a user
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const q = `SELECT * FROM startups WHERE user_id = $1 ORDER BY id DESC`;
    const result = await client.query(q, [user_id]);
    return res.json({ startups: result.rows });
  } catch (err) {
    console.error("Get startups by user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /startups/:id
 * Update startup (partial)
 * body: name?, description?, website?
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website } = req.body;

    if (!name && typeof description === "undefined" && typeof website === "undefined") {
      return res.status(400).json({ message: "Provide at least one field to update" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (typeof description !== "undefined") { fields.push(`description = $${idx++}`); values.push(description); }
    if (typeof website !== "undefined") { fields.push(`website = $${idx++}`); values.push(website); }

    values.push(id);
    const q = `UPDATE startups SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await client.query(q, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Startup not found" });
    return res.json({ message: "Startup updated", startup: result.rows[0] });
  } catch (err) {
    console.error("Update startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /startups/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM startups WHERE id = $1 RETURNING id";
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Startup not found" });
    return res.json({ message: "Startup deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("Delete startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
