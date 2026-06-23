import { useEffect, useState } from "react";
import ComplaintCard from "./ComplaintCard";

import "../styles/viewcomplaints.css";

function Viewcomplaints()
{
    const [complaints, setcomplaints] = useState([]);

    useEffect(() =>
    {
        get_complaints();
    }, []);

    async function get_complaints()
    {
        try
        {
            let res = await fetch(
                "https://raiseyourvoice-production.up.railway.app/getcomplaints"
            );

            let data = await res.json();

            console.log(data);

            setcomplaints(data);
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    return (
    <>
        <div className="header">
            <h1>View Complaints</h1>
            <p>
                See ongoing, pending, and resolved concerns raised by students.
            </p>
        </div>

        <div className="complaints-container">
            {complaints.map((complaint) => (
                <ComplaintCard
                    key={complaint.complaint_id}
                    complaint={complaint}
                />
            ))}
        </div>
    </>
);
}

export default Viewcomplaints;