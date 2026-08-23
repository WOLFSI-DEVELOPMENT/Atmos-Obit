import { Pool } from "@neondatabase/serverless";
const pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_d9ZVKLESo6kO@ep-weathered-lab-ax9yxkm3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" });
pool.query("SELECT 1 as result").then(res => console.log(res.rows)).catch(err => console.error(err));
