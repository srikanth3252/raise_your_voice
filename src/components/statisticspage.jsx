import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/statisticspage.css";

function Statistics() {
    const navigate = useNavigate();

    const [Statisticstype, setStatisticstype] = useState("");
    const [startdate, setstartdate] = useState("");
    const [enddate, setenddate] = useState("");
    const [data, setdata] = useState({});

    function handleshow(e) {
        setStatisticstype(e.target.value);
    }

    async function handlesubmit() {
        if (Statisticstype === "") {
            alert("Choose statistics type");
            return;
        }

        if (Statisticstype === "particulardaycomplaints" && !startdate) {
            alert("Choose a date");
            return;
        }

        if (
            Statisticstype === "customdatecomplaints" &&
            (!startdate || !enddate)
        ) {
            alert("Choose start and end dates");
            return;
        }

        try {
            let res;

            if (
                Statisticstype === "particulardaycomplaints" ||
                Statisticstype === "customdatecomplaints"
            ) {
                res = await fetch(
                    `http://127.0.0.1:2000/${Statisticstype}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            startdate,
                            enddate,
                        }),
                    }
                );
            } else {
                res = await fetch(
                    `http://127.0.0.1:2000/${Statisticstype}`
                );
            }

            const result = await res.json();

            console.log(result);

            setdata(result);

            navigate("/statistics_result_page", {
                state: {
                    statisticsData: result,
                },
            });
        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    }

    return (
        <div className="Statistics">
            <h1>Complaint Statistics Dashboard</h1>

            <p className="intro-text">
                Analyze complaint activity, track resolution progress,
                and explore trends across different time periods.
            </p>

            <label>Select Statistics Type</label>

            <select
                id="select"
                value={Statisticstype}
                onChange={handleshow}
            >
                <option value="">Select</option>

                <option value="totalcomplaints">
                    Total Complaints
                </option>

                <option value="todayscomplaints">
                    Today's Complaints
                </option>

                <option value="particulardaycomplaints">
                    On Particular Date
                </option>

                <option value="Lastweekcomplaints">
                    Last 7 Days
                </option>

                <option value="Lastmonthcomplaints">
                    Last Month
                </option>

                <option value="customdatecomplaints">
                    Custom Date Range
                </option>
            </select>

            {Statisticstype === "particulardaycomplaints" && (
                <div className="date-container">
                    <input
                        type="date"
                        value={startdate}
                        onChange={(e) =>
                            setstartdate(e.target.value)
                        }
                    />
                </div>
            )}

            {Statisticstype === "customdatecomplaints" && (
                <div className="date-container">
                    <input
                        type="date"
                        value={startdate}
                        onChange={(e) =>
                            setstartdate(e.target.value)
                        }
                    />

                    <input
                        type="date"
                        value={enddate}
                        onChange={(e) =>
                            setenddate(e.target.value)
                        }
                    />
                </div>
            )}

            <button
                type="button"
                className="show-btn"
                onClick={handlesubmit}
            >
                Show Statistics
            </button>

            <div className="statistics-overview">
                <h2>Statistics Overview</h2>

                <p>
                    Select a statistics type and click
                    <b> Show Statistics </b>
                    to view complaint data, resolution status,
                    and charts.
                </p>

                {Object.keys(data).length > 0 && (
                    <div className="statistics-result">
                        <h3>Result</h3>

                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Statistics;