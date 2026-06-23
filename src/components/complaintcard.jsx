import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/complaintcard.css";

function ComplaintCard({ complaint })
{
    const role=localStorage.getItem("role");
    console.log(role);
    console.log(localStorage.getItem("role"));
    const navigate=useNavigate();
    const [likes,setlikes]=useState(complaint.totalLikes);
    const[particularcomplaint,setparticularcomplaint]=useState("");

    async function handleviewcomplaint()
    {
        try
        {
            let res=await fetch("http://127.0.0.1:2000/get_exact_complaint",{

                   method:"POST",
                   headers:
                   {
                     "Content-Type":"application/json"
                   },
                   body:JSON.stringify({
                            complaint_id:complaint.complaint_id
                   })
            });

            let data=await res.json();
            console.log(data);
            setparticularcomplaint(data)
            navigate("/complaintdetailspage", {
                state: {
                    complaintdetails: data,
                },
            });
        }    
        catch(err)
        {
            console.log(err.message);
        }
    }
    async function handlelikes()
    {
        try
        {
            let res=await fetch("http://127.0.0.1:2000/likes",{

                   method:"POST",
                   headers:
                   {
                     "Content-Type":"application/json"
                   },
                   body:JSON.stringify({
                            email:localStorage.getItem("email"),
                            complaint_id:complaint.complaint_id
                   })
            });

            let data=await res.json();
            console.log(data.message);
            setlikes(data.totalLikes);
            alert(data.message);
        }
        catch(err)
        {
            console.log(err.message);
        }
    }
    return(
        <div className="complaintcard">

    <h2>{complaint.title}</h2>

    <div className="card-header">
        <h4>{complaint.category}</h4>

        <p>{complaint.status || "Pending"}</p>
    </div>

    <p className="description">
        {complaint.description.length > 120
            ? complaint.description.slice(0,120) + "..."
            : complaint.description}
    </p>

    <div className="card-actions">
        <button className="b1" onClick={handlelikes}>
             👍 {likes} Supports
        </button>
        <button className="b1">
            💬 Comments
        </button>

        <button className="view-btn" onClick={handleviewcomplaint}>
                 {role === "admin"
                    ? "View Details & Manage Status"
                  : "View Details"}
        </button>
    </div>

</div>
    );
}

export default ComplaintCard;