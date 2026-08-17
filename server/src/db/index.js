import pg, { Connection } from "pg"
import "dotenv/config"

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

const result = await pool.query("SELECT NOW()");
console.log("Database connected:", result.rows[0]);


export default pool;

