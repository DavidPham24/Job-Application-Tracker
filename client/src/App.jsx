import { useEffect, useState } from "react";
import ApplicationForm from "./components/applicationForm";

function App() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/applications")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch applications");
                }

                return response.json();
            })
            .then((data) => {
                setApplications(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Could not load applications.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading applications...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    // Allows app.jsx to receive and re-render the newly created application through ApplicationForm.jsx.
    const handleApplicationAdded = (newApplication) => {
        setApplications((currentApplications) => [
            newApplication,
            ...currentApplications
        ]);
    };

    // Function to handle deleting an application by its ID.
    const handleDeleteApplication = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete application");
            }

            setApplications((currentApplications) =>
                currentApplications.filter(
                    (application) => application.id !== id
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    //======================================================================
    return (
        <div className="app">
            <h1>Quick Job Tracker</h1>

            <ApplicationForm 
                onApplicationAdded={handleApplicationAdded}
            />

            <p>
                You have {applications.length} applications.
            </p>

            <div className="applications">
                {applications.map((application) => (
                    <div className="application-card" key={application.id}>
                        <div>
                            <h2>{application.company}</h2>
                            <p>{application.position}</p>
                        </div>

                        <div>
                            <strong>{application.status}</strong>

                            {application.deadline && (
                                <p>
                                    Deadline: {application.deadline}
                                </p>
                            )}
                            
                            <button
                                onClick={() => handleDeleteApplication(application.id)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default App;