// routes/Application.js
import express from "express";
import client from "../db/dbconnect.js";

const router = express.Router();

const ALLOWED_STATUSES = ["Applied", "Reviewing", "Interviewing", "Offer", "Rejected"];


router.post("/", async (req, res) => {
  try {
    const { student_id, internship_id, startup_id, status = "Applied", notes = null } = req.body;

    // basic validation
    if (!student_id || !internship_id || !startup_id) {
      return res.status(400).json({ message: "student_id, internship_id and startup_id are required" });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }

    const insertQ = `
      INSERT INTO applications (student_id, internship_id, startup_id, status, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await client.query(insertQ, [student_id, internship_id, startup_id, status, notes]);
    const application = result.rows[0];

    return res.status(201).json({ message: "Application created successfully", application });
  } catch (error) {
    console.error("Application create error:", error);
    // if foreign key violation or other DB errors, you can handle specific codes here
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all applications (and internship details) for a particular student

router.get("/student/:student_id", async (req, res) => {
  try {
    const { student_id } = req.params;

    // Validate and parse student_id as integer
    const studentIdInt = parseInt(student_id, 10);
    
    if (!student_id || isNaN(studentIdInt)) {
      return res.status(400).json({ message: "Valid student_id is required" });
    }

    const q = `
      SELECT
        a.id AS application_id,
        a.student_id,
        a.internship_id,
        a.startup_id,
        a.status,
        a.notes,
        a.applied_at,
        i.title AS internship_title,
        i.description AS internship_description,
        i.location AS internship_location,
        i.stipend AS internship_stipend,
        s.name AS startup_name,
        s.website AS startup_website
      FROM applications a
      LEFT JOIN internships i ON a.internship_id = i.id
      LEFT JOIN startups s ON a.startup_id = s.id
      WHERE a.student_id = $1
      ORDER BY a.applied_at DESC
    `;

    const result = await client.query(q, [studentIdInt]);
    return res.json({ applications: result.rows });
  } catch (err) {
    console.error("Get applications by student error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const q = `
      SELECT
        a.*,
        sp.name AS student_name,
        i.title AS internship_title,
        s.name AS startup_name
      FROM applications a
      LEFT JOIN student_profiles sp ON a.student_id = sp.id
      LEFT JOIN internships i ON a.internship_id = i.id
      LEFT JOIN startups s ON a.startup_id = s.id
      ORDER BY a.applied_at DESC
    `;
    const result = await client.query(q);
    return res.json({ applications: result.rows });
  } catch (err) {
    console.error("Get applications error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT a.*,
             sp.name AS student_name,
             i.title AS internship_title,
             s.name AS startup_name
      FROM applications a
      LEFT JOIN student_profiles sp ON a.student_id = sp.id
      LEFT JOIN internships i ON a.internship_id = i.id
      LEFT JOIN startups s ON a.startup_id = s.id
      WHERE a.id = $1
    `;
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Application not found" });
    return res.json({ application: result.rows[0] });
  } catch (err) {
    console.error("Get application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.get("/startup/:startup_id", async (req, res) => {
  try {
    const { startup_id } = req.params;
    const q = `
      SELECT a.*,
             sp.name AS student_name,
             i.title AS internship_title
      FROM applications a
      LEFT JOIN student_profiles sp ON a.student_id = sp.id
      LEFT JOIN internships i ON a.internship_id = i.id
      WHERE a.startup_id = $1
      ORDER BY a.applied_at DESC
    `;
    const result = await client.query(q, [startup_id]);
    return res.json({ applications: result.rows });
  } catch (err) {
    console.error("Get applications by startup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status && typeof notes === "undefined") {
      return res.status(400).json({ message: "Provide status or notes to update" });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (typeof notes !== "undefined") {
      fields.push(`notes = $${idx++}`);
      values.push(notes);
    }

    values.push(id);
    const q = `UPDATE applications SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    const result = await client.query(q, values);
    if (result.rows.length === 0) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Application updated", application: result.rows[0] });
  } catch (err) {
    console.error("Update application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM applications WHERE id = $1 RETURNING id";
    const result = await client.query(q, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Application deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("Delete application error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
