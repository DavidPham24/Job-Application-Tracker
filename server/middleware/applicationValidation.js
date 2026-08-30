// This file validates user inputs.

const { body, validationResult } = require("express-validator");

const validStatuses = [
    "Saved",
    "Applied",
    "OA",
    "Interview",
    "Rejected",
    "Offer"
];

// Note: replaced "checkFalsy: true" in optional because it is deprecated for versions >= v7.
const validateApplication = [
    body("company")
        .trim()
        .notEmpty()
        .withMessage("Company is required"),

    body("position")
        .trim()
        .notEmpty()
        .withMessage("Position is required"),

    body("status")
        .optional()
        .isIn(validStatuses)
        .withMessage("Invalid application status"),

    body("url")
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage("URL must be valid"),

    body("application_date")
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage("Application date must be valid"),

    body("deadline")
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage("Deadline must be valid"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    validateApplication
};