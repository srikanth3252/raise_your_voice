import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage";
import Loginpage from "./components/loginpage";
import Dashboard from "./components/dashboard";
import Raisecomplaint from "./components/raisecomplaint";
import Viewcomplaints from  "./components/viewcomplaints";
import ComplaintCard from  "./components/complaintcard";
import Trendingcomplaints from "./components/Trendingcomplaints";
import Statistics from "./components/statisticspage";
import StatisticsResultPage from "./components/statistics_result_page";
import Complaintdetails from "./components/complaintdetailspage"
function App()
{
    return (

        <BrowserRouter>

    <Routes>

        <Route
            path="/"
            element={<Homepage />}
        />

        <Route
            path="/loginpage"
            element={<Loginpage />}
        />

        <Route
            path="/dashboard"
            element={<Dashboard />}
        />

        <Route
            path="/raisecomplaint"
            element={<Raisecomplaint />}
        />

        <Route
            path="/viewcomplaint"
            element={<Viewcomplaints />}
        />

        <Route
         path="/Trendingcomplaints"
         element={<Trendingcomplaints/>}
        />

        <Route
         path="/Statistics"
         element={<Statistics/>}
        />

        <Route
         path="/statistics_result_page"
         element={<StatisticsResultPage/>}
        />

        <Route
          path="/complaintdetailspage"
          element={<Complaintdetails/>}
        />

    </Routes>

</BrowserRouter>
    )
}

export default App;


