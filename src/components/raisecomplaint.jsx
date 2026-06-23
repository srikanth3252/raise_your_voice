import { useState } from "react";
import "../styles/raisecomplaint.css";

function Raisecomplaint()
{
    const [showPopup, setShowPopup] = useState(true);

    const [title, setTitle] = useState("");
    const [complaintCategory, setComplaintCategory] = useState("About Hostel");
    const [complaintDescription, setComplaintDescription] = useState("");

    const [proof, setProof] = useState(null);
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileType, setFileType] = useState("");

    function handleFileChange(e)
    {
        const file = e.target.files[0];

        if (!file)
            return;

        setProof(file);
        setFileName(file.name);

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);
        setFileType(file.type);
    }

    async function handleSubmit()
    {
       async function Store_complaints_database(formdata)
       {
           let res=await fetch("https://raiseyourvoice-production.up.railway.app/complaint",
            {
                method:"POST",
                body:formdata
            });

            let data=await res.json();
            return data;
       }

        if (
            title.trim() === "" ||
            complaintDescription.trim() === "" ||
            !proof
        )
        {
            alert("Please fill all fields and upload proof");
            return;
        }

        const complaintData =
        {
            title,
            complaintCategory,
            complaintDescription,
            proofName: proof.name
        };
        
        const formdata=new FormData();
        formdata.append("email",localStorage.getItem("email"));
        formdata.append("title",title);
        formdata.append("complaintCategory",complaintCategory);
        formdata.append("complaintDescription",complaintDescription);
        formdata.append("proof",proof);

        try
        {
            let res=await Store_complaints_database(formdata);
            console.log(res.message);
        }
        catch(err)
           {
              console.log(err.message);
           }

        

        alert("Complaint Raised Successfully");

        setTitle("");
        setComplaintCategory("About Hostel");
        setComplaintDescription("");

        setProof("");
        setFileName("");
        setPreviewUrl("");
        setFileType("");
    }

    return (
        <>
            {
                showPopup &&
                <div className="popupbox">

                    <h2>Before Raising Complaint</h2>

                    <p>
                        You can freely raise your complaint here without worrying
                        about anyone.

                        <br /><br />

                        Your personal details and uploaded proofs will remain
                        confidential and accessible only to authorized administrators.

                        <br /><br />

                        Please provide genuine information and valid proof.

                        <br /><br />

                        False or misleading complaints may result in disciplinary
                        action according to institution rules.
                    </p>

                    <div className="popupbuttons">

                        <button
                            onClick={() => setShowPopup(false)}
                        >
                            Proceed
                        </button>

                    </div>

                </div>
            }

            <section className="raisecomplaint">

                <div className={`flex1 ${showPopup ? "blur" : ""}`}>

                    <h1>Raise Complaint</h1>

                    <p>
                        Welcome, User.
                        <br /><br />
                        You can raise your concerns securely through the portal.
                    </p>

                    <div className="flex2">

                        <div className="flex3">

                            <label>Complaint Title:</label>

                            <input
                                type="text"
                                value={title}
                                placeholder="Enter complaint title"
                                onChange={(e) =>
                                {
                                    setTitle(e.target.value);
                                }}
                            />

                        </div>

                        <div className="flex3">

                            <label>Complaint Category:</label>

                            <select
                                value={complaintCategory}
                                onChange={(e) =>
                                {
                                    setComplaintCategory(e.target.value);
                                }}
                            >
                                <option>About Hostel</option>
                                <option>About Faculty</option>
                                <option>About Transport</option>
                                <option>About Management</option>
                                <option>About Infrastructure</option>
                                <option>Other</option>
                            </select>

                        </div>

                        <div className="flex3">

                            <label>Complaint Description</label>

                            <textarea
                                value={complaintDescription}
                                placeholder="Describe your issue clearly"
                                onChange={(e) =>
                                {
                                    setComplaintDescription(e.target.value);
                                }}
                            ></textarea>

                        </div>

                        <div className="flex3">

                            <label>Upload Proof (must require)</label>

                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />

                            {
                                fileName &&
                                <p>{fileName}</p>
                            }

                            {
                                fileType.startsWith("image/") &&
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    style={{
                                        width: "100%",
                                        marginTop: "15px",
                                        borderRadius: "8px"
                                    }}
                                />
                            }

                            {
                                fileType.startsWith("video/") &&
                                <video
                                    src={previewUrl}
                                    controls
                                    style={{
                                        width: "100%",
                                        marginTop: "15px",
                                        borderRadius: "8px"
                                    }}
                                />
                            }

                            <p className="privacy">
                                Your uploaded files and identity will remain
                                confidential and accessible only to authorized administrators.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                        >
                            Raise Complaint
                        </button>

                    </div>

                </div>

            </section>
        </>
    );
}

export default Raisecomplaint;