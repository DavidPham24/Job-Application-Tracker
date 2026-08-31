const pool = require("../db");

// Get all applications, newest first.
async function getAllApplications({ search, status }) {
    // Start building the SQL query to select all applications. The "WHERE 1 = 1" condition is a common technique to simplify adding additional conditions later.
    let query = `
        SELECT *
        FROM applications
        WHERE 1 = 1
    `;

    const values = []; // This array will hold the values for parameterized queries to prevent SQL injection.

    // If a search term is provided, add it to the values array and modify the query to filter applications by company or position using a case-insensitive match (ILIKE).
    if (search) { 
        values.push(`%${search}%`); // Wrapped in % for partial matching, values.length is now 1 for the first parameter placeholder ($1).

        // filter for search term in company or position, using ILIKE for case-insensitive matching.
        query += `
            AND (
                company ILIKE $${values.length}
                OR position ILIKE $${values.length}
            )
        `;
    }

    if (status) {
        values.push(status);

        query += `
            AND status = $${values.length}
        `;
    }

    query += `
        ORDER BY created_at DESC
    `;

    const result = await pool.query(query, values);

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