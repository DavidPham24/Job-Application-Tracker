const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        
        res.json({
            message: "Server and database are working!",
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});