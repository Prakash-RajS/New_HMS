import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";

// Pages
import DashboardComponents from "./pages/Home/DashboardComponents.jsx";
import PatientRecord from "./pages/Home/PatientRecord.jsx";
import SurgeryRecord from "./pages/Home/SurgeryRecord.jsx";
import RevenueSummary from "./pages/Home/RevenueSummary.jsx";
import Reports from "./pages/Home/Reports.jsx";
import Statistics from "./pages/Home/Statistics.jsx";
import Employee from "./pages/Home/Employee.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex bg-black ">
        {/* Sidebar (fixed) */}
        <Sidebar />

        {/* Main Content shifted only by 230px */}
        <div className="flex-1 flex flex-col">
          <Header />

          {/* Scrollable content area */}
          <div className="mt-[60px] p-3 overflow-y-hidden h-[calc(100vh-60px)]">
            <Routes>
              {/* Dashboard with nested routes */}
              <Route path="/" element={<DashboardComponents />}>
                <Route path="patient-record" element={<PatientRecord />} />
                <Route path="surgery-record" element={<SurgeryRecord />} />
                <Route path="revenue-summary" element={<RevenueSummary />} />
              </Route>

              {/* Other main routes */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/employee" element={<Employee />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}