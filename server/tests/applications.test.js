const request = require("supertest");
const app = require("../app");

// test getting all applications.
describe("GET /api/applications", () => {
    test("returns a list of applications", async () => {
        const response = await request(app)
            .get("/api/applications");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});