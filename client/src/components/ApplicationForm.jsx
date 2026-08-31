import { useState } from "react";

function ApplicationForm({ onApplicationAdded }) {
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        status: "Saved",
        application_date: "",
        deadline: "",
        url: "",
        notes: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Connects adding a form with API via requests.
        try {
            // Send a POST request with form data as JSON.
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to create application");
            }

            const newApplication = await response.json();

            // If POST request successful, prop callback with the new application.
            onApplicationAdded(newApplication);

            // Reset the form to empty values.
            setFormData({
                company: "",
                position: "",
                status: "Saved",
                application_date: "",
                deadline: "",
                url: "",
                notes: ""
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Application</h2>

            <label>
                Company
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Position
                <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Status
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Offer">Offer</option>
                </select>
            </label>

            <label>
                Application Date
                <input
                    type="date"
                    name="application_date"
                    value={formData.application_date}
                    onChange={handleChange}
                />
            </label>

            <label>
                Deadline
                <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                />
            </label>

            <label>
                Job URL
                <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                />
            </label>

            <label>
                Notes
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                />
            </label>

            <button type="submit">
                Add Application
            </button>
        </form>
    );
}

export default ApplicationForm;