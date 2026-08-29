const pool = require("../db");

// Get all applications, newest first.
async function getAllApplications() {
    const result = await pool.query(
        "SELECT * FROM applications ORDER BY created_at DESC"
    );

    return result.rows;
}

// Get a single application by its ID.
async function getApplicationById(id) {
    const result = await pool.query(
        "SELECT * FROM applications WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

// Create a new application in the database.
async function createApplication(application) {
    const {
        company,
        position,
        status,
        application_date,
        deadline,
        url,
        notes
    } = application;

    const result = await pool.query(
        // Note: $ in VALUES are parameter placeholders for accompanied list.
        `INSERT INTO applications
        (company, position, status, application_date, deadline, url, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            company,
            position,
            status,
            application_date,
            deadline,
            url,
            notes
        ]
    );

    return result.rows[0];
}

// Update an application in the database.
async function updateApplication(id, application) {
    const {
        company,
        position,
        status,
        application_date,
        deadline,
        url,
        notes
    } = application;

    const result = await pool.query(
        `UPDATE applications
        SET
            company = $1,
            position = $2,
            status = $3,
            application_date = $4,
            deadline = $5,
            url = $6,
            notes = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *`,
        [
            company,
            position,
            status,
            application_date,
            deadline,
            url,
            notes,
            id
        ]
    );

    return result.rows[0];
}

// Delete an application in the database.
async function deleteApplication(id) {
    const result = await pool.query(
        "DELETE FROM applications WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication
};