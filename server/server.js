const applications = require("./queries/applications");

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// check whether the connection works
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        
        res.json({
            message: "Server and database are working!",
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Database connection failed" 
        });
    }
});

// API route to get all applications.
app.get("/api/applications", async (req, res) => {
    try {
        const result = await applications.getAllApplications();

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Failed to retrieve applications" 
        });
    }
});

// API route to get a single application by its ID.
app.get("/api/applications/:id", async (req, res) => {
    try {
        const application = await applications.getApplicationById(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                error: "Application not found"
            });
        }

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to retrieve application"
        });
    }
});

// POST route to create a new application.
app.post("/api/applications", async (req, res) => {
    try {
        const application = await applications.createApplication(req.body);

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Failed to create application" 
        });
    }
});

// PUT route to update an application.
app.put("/api/applications/:id", async (req, res) => {
    try {
        const application = await applications.updateApplication(
            req.params.id,
            req.body
        );

        if (!application) {
            return res.status(404).json({
                error: "Application not found"
            });
        }

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update application"
        });
    }
});

// DELETE route to delete an application.
app.delete("/api/applications/:id", async (req, res) => {
    try {
        const application = await applications.deleteApplication(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                error: "Application not found"
            });
        }

        res.json({
            message: "Application deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete application"
        });
    }
});

// Starts a server bound to a port to receive incoming HTTP requests.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});