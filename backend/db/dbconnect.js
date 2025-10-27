//db/dbconnect.js
import { Client } from "pg";

const client = new Client({
    host:"localhost",
    user: "postgres",
    port: 5433,
    password: "Sona@2006",
    database: "Intern-Hub"
})

client.connect()
  .then(() => console.log("✅ Connected to PostgreSQL "+client.database))
  .catch(err => console.error("❌ DB connection error:", err));

export default client





