import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

function Homepage() 
{
    const navigate = useNavigate();

    function handleNavigation() 
    {
        navigate("/loginpage");
    }

    return (
        <section className="homepage">
           <div id="navbar">

              <div id="logo">
                   Raise Your Voice
              </div>

              <button onClick={handleNavigation} className="btn-primary">
                login
              </button>

           </div>

           <div id="hero">

               <h1>Student Complaint & Resolution Portal</h1>
               <p>
                  A secure university platform for raising concerns, tracking issues, and improving campus life with transparency and accountability.
                </p>

           <div id="features">

             <div className="box">Anonymous Reporting</div>
             <div className="box">Secure Access</div>
             <div className="box">Admin Resolution System</div>

           </div>

           </div>

        </section>
    );
}

export default Homepage;