import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    function handleLogout() 
    {
        alert("Logout Successfully");
        navigate("/loginpage");
    }

    return (
        <>
            <div id="navbar">

                <div id="logo">
                    Campus Issue Management System
                </div>

                <button id="logout" onClick={handleLogout}>
                    Logout
                </button>

            </div>

            <section id="hero">

                <h1>Welcome to the Portal</h1>

                <p>
                    A unified system for students, staff, and administrators to report issues,
                    track progress, and ensure transparent resolution of campus concerns.
                </p>

            </section>

            <section id="dashboard">

                <div className="card" onClick={()=>navigate("/raisecomplaint")}>
                    <div className="icon">📢</div>
                    <h2>Raise Complaint</h2>
                    <p>
                        Submit academic, hostel, transport, or campus-related issues securely.
                    </p>
                </div>

                <div className="card" onClick={()=>navigate("/viewcomplaint")}>
                    <div className="icon">📄</div>
                    <h2>View Complaints</h2>
                    <p>
                        Track all submitted issues and monitor their resolution status.
                    </p>
                </div>

                <div className="card" onClick={()=>navigate("/Statistics")}>
                    <div className="icon">📊</div>
                    <h2>Statistics</h2>
                    <p>
                        View resolution rates, trends, and system performance insights.
                    </p>
                </div>

                <div className="card"  onClick={()=>navigate("/Trendingcomplaints")}>
                    <div className="icon">🔥</div>
                    <h2>Trending Issues</h2>
                    <p>
                        See the most discussed and high-priority campus problems.
                    </p>
                </div>

            </section>
        </>
    );
}

export default Dashboard;