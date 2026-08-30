// This file starts the server.

const app = require("./app");

const PORT = 5000;

// Starts a server bound to a port to receive incoming HTTP requests.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// 404 handler in case the wrong route is used (i.e. /api/incorrectroute)
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    });
});