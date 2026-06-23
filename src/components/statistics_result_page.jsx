import { useLocation } from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import "../styles/statistics_result_page.css";

function StatisticsResultPage() {
    const location = useLocation();
    const data = location.state?.statisticsData;

    if (!data) {
        return (
            <div className="page-wrapper">
                <div className="page-card">
                    <h2 className="page-title">No Statistics Data Found</h2>
                </div>
            </div>
        );
    }

    // ✅ ONLY numeric fields (prevents NaN issue)
    const allowedKeys = [
        "totalcomplaints",
        "totalresolvedcomplaints",
        "totalpendingcomplaints",
        "totalrejectedcomplaints"
    ];

    const chartData = allowedKeys
        .filter((key) => data[key] !== undefined && !isNaN(Number(data[key])))
        .map((key) => ({
            name: key.replace(/([A-Z])/g, " $1"),
            value: Number(data[key])
        }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="page-wrapper">
            <div className="page-card">

                <h1 className="page-title">Complaint Statistics Dashboard</h1>

                {/* CHART SECTION */}
                <div className="chart-box">
                    <ResponsiveContainer width="100%" height={380}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                dataKey="value"
                                label
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* SUMMARY SECTION */}
                <h2 className="section-title">Key Metrics</h2>

                <div className="grid">
                    {chartData.map((item, index) => (
                        <div className="card" key={index}>
                            <h3 className="card-title">{item.name}</h3>
                            <p className="card-value">{item.value}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default StatisticsResultPage;