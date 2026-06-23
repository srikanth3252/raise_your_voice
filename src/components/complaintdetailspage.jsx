import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/complaintdetailspage.css";

function ComplaintDetails()
{
    const role = localStorage.getItem("role");

    const location = useLocation();

    const complaint =
        location.state?.complaintdetails?.result;

    const [status, setStatus] = useState(
        complaint?.status
    );

    if (!complaint)
    {
        return <h2>No Complaint Found</h2>;
    }

    const proofUrl =
        complaint.proof
            ? `https://raiseyourvoice-production.up.railway.app/${complaint.proof.replace(/\\/g, "/")}`
            : "";

    const extension =
        complaint.proof
            ? complaint.proof.split(".").pop().toLowerCase()
            : "";

    async function updateStatus(newStatus)
    {
        try
        {
            let res = await fetch(
                "https://raiseyourvoice-production.up.railway.app/updatecomplaintstatus",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        complaint_id:
                            complaint.complaint_id,
                        status: newStatus
                    })
                }
            );

            let result = await res.json();

            alert(result.message);

            setStatus(newStatus);
        }
        catch (error)
        {
            console.log(error.message);
        }
    }

    return (
        <div className="container">

            <h1 className="page-title">
                Complaint Details
            </h1>

            <p className="subtitle">
                Complete information regarding the selected complaint
            </p>

            <div className="complaint-header">

                <h2 className="complaint-title">
                    {complaint.title}
                </h2>

                <p className="category">
                    {complaint.category}
                </p>

            </div>

            <div className="info-row">

                <div className="info-card">

                    <h3>Status</h3>

                    <p>
                        <span className="status">
                            {status}
                        </span>
                    </p>

                </div>

                <div className="info-card">

                    <h3>Created Date</h3>

                    <p>
                        {
                            new Date(
                                complaint.created_at
                            ).toLocaleString()
                        }
                    </p>

                </div>

                <div className="info-card">

                    <h3>Supports</h3>

                    <p>
                        👍 {complaint.totallikes}
                    </p>

                </div>

            </div>

            <div className="section">

                <h2>Description</h2>

                <div className="description-box">
                    {complaint.description}
                </div>

            </div>

            <div className="section">

                <h2>Attached Proof</h2>

                <div id="proofContainer">

                    {
                        ["jpg", "jpeg", "png", "gif", "webp"]
                            .includes(extension)
                        &&
                        <img
                            src={proofUrl}
                            alt="proof"
                            className="proof-image"
                        />
                    }

                    {
                        ["mp4", "webm", "mov", "avi"]
                            .includes(extension)
                        &&
                        <video
                            src={proofUrl}
                            controls
                            className="proof-video"
                        />
                    }

                    {
                        extension === "pdf"
                        &&
                        <iframe
                            src={proofUrl}
                            width="100%"
                            height="600"
                            title="pdf"
                        />
                    }

                </div>

            </div>

            {
                role === "admin" &&

                <div id="adminControls">

                    <h2>Admin Controls</h2>

                    <div className="admin-buttons">

                        <button
                            className="resolved-btn"
                            onClick={() =>
                                updateStatus("Resolved")
                            }
                        >
                            Mark Resolved
                        </button>

                        <button
                            className="pending-btn"
                            onClick={() =>
                                updateStatus("Pending")
                            }
                        >
                            Mark Pending
                        </button>

                        <button
                            className="reject-btn"
                            onClick={() =>
                                updateStatus("Rejected")
                            }
                        >
                            Reject Complaint
                        </button>

                    </div>

                </div>
            }

        </div>
    );
}

export default ComplaintDetails;