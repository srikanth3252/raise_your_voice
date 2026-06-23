import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/loginpage.css"; // import styles page from styles folder
function Loginpage()
{
    const[email,setemail]=useState("");
    const [otp,setotp]=useState("");
    const navigate=useNavigate();

    // function to handle from submit
     async function handlesubmit(e)
{
    e.preventDefault();

    async function callapi_toverifyotp()
    {
        let res = await fetch("https://raiseyourvoice-production.up.railway.app/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        });

        let data = await res.json();
        return data;
    }

    async function insert_usersdata()
    {   localStorage.setItem("email",email);
        let res = await fetch("https://raiseyourvoice-production.up.railway.app/insertusers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        let data = await res.json();
        return data;
    }

    async function check_role()
    {
         let res = await fetch("https://raiseyourvoice-production.up.railway.app/updaterole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        let data = await res.json();
        return data;
    }

    try
    {
        let verifyRes = await callapi_toverifyotp();

        console.log(verifyRes.message);
        if (verifyRes.message === "OTP verified")
        {
            let userRes = await insert_usersdata();

            console.log(userRes.message);

            let res=await check_role();
            localStorage.setItem("role",res.role);
            console.log(res.role);
            alert(`OTP verified successfully & ${res.message} `)
            console.log(res);
          

            navigate("/dashboard");
        }
        else
        {
            alert(verifyRes.message);
        }
    }
    catch (err)
    {
        console.log(err.message);
        alert(err.message);
    }
}
     // function to the callapi_tosendotp
    async function callapi_tosendotp()
     {
          console.log('api is called')
           async function sendotp()
           {
              let res=await fetch("https://raiseyourvoice-production.up.railway.app/send-otp",{
                    method:"POST",
                    headers:
                    {
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({email})
              });

              let data=await res.json();
              return data;
           }

           try
           {
              let res=await sendotp();
              console.log(res.message);
              alert(res.message);
           }
           catch(err)
           {
             console.log(err.message);
             alert(err.message);
           }
     }

    return(
        <section className="loginpage">

            <div className="box">

               <h1>Login</h1>

               <p className="para">
                 Use your SRM university email only
               </p>

               <form onSubmit={handlesubmit}>

                   <div className="flex">
                      <input type="text" 
                        placeholder="Enter SRM email"
                        onChange={(e)=>
                        {
                            setemail(e.target.value);
                        }
                        }
                      />

                   <button onClick={callapi_tosendotp} type="button">
                     Send Otp
                   </button>

                   <input type="number"
                          placeholder="Enter Otp"
                          onChange={(e)=>{
                              setotp(e.target.value);
                          }}
                   />
                   </div>

                   <p className="resend">
                     Resend OTP
                   </p>

                   <button type="submit">
                     Verify & Login
                   </button>

                   <p className="trust">
                     Secure • Anonymous • University Verified
                   </p>

               </form>
            </div>

        </section>
    );
}

export default Loginpage;