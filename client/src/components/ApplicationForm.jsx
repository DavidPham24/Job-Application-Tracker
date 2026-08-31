import { useEffect, useState } from "react";

// component works for both creating and editing applications.
function ApplicationForm({ 
    onApplicationAdded,
    applicationToEdit,
    onApplicationUpdated,
    onCancelEdit
}) {

    // Initialize form state with either the applicationToEdit values (if editing) or empty values (if creating a new application).
    const [formData, setFormData] = useState({
        company: applicationToEdit?.company || "",
        position: applicationToEdit?.position || "",
        status: applicationToEdit?.status || "Saved",
        application_date: applicationToEdit?.application_date || "",
        deadline: applicationToEdit?.deadline || "",
        url: applicationToEdit?.url || "",
        notes: applicationToEdit?.notes || ""
    });

    // This useEffect hook is used to update the form data when the applicationToEdit prop changes. It ensures that the form fields are populated with the correct values when editing an existing application.
    useEffect(() => {
        if (applicationToEdit) {
            setFormData({
                company: applicationToEdit.company || "",
                position: applicationToEdit.position || "",
                status: applicationToEdit.status || "Saved",
                application_date: applicationToEdit.application_date || "",
                deadline: applicationToEdit.deadline || "",
                url: applicationToEdit.url || "",
                notes: applicationToEdit.notes || ""
            });
        } else { // Reset form data to empty values when not editing (i.e., when adding a new application or canceling an edit).
            setFormData({
                company: "",
                position: "",
                status: "Saved",
                application_date: "",
                deadline: "",
                url: "",
                notes: ""
            });
        }
    }, [applicationToEdit]);

    
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Connects editing/creating a form with API via requests.
        try {
            // If applicationToEdit exists, use PUT. Else, use POST. Send form data as JSON.
            const url = applicationToEdit
                ? `/api/applications/${applicationToEdit.id}`
                : "/api/applications";

            const method = applicationToEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to save application");
            }

            const savedApplication = await response.json();

            // Call the appropriate prop callback function based on whether the form is in edit mode.
            if (applicationToEdit) {
                onApplicationUpdated(savedApplication);
            } else {
                onApplicationAdded(savedApplication);
            }

            // Reset form data to empty values after submission.
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
            <h2>
                {applicationToEdit ? "Edit Application" : "Add Application"}
            </h2>

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
                {applicationToEdit ? "Save Changes" : "Add Application"}
            </button>

            {applicationToEdit && (
                <button
                    type="button"
                    onClick={onCancelEdit}
                >
                    Cancel
                </button>
            )}

        </form>
    );
}

export default ApplicationForm;