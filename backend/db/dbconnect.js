// db/dbconnect.js
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Client } = pkg;

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

client.connect()
  .then(() => console.log(`✅ Connected to PostgreSQL database: ${client.database}`))
  .catch(err => console.error("❌ DB connection error:", err));

export default client;
