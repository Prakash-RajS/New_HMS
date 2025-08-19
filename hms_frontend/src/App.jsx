import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";

// Pages
import DashboardComponents from "./pages/Home/DashboardComponents.jsx";
import PatientRecord from "./pages/Home/PatientRecord.jsx";
import SurgeryRecord from "./pages/Home/SurgeryRecord.jsx";
import RevenueSummary from "./pages/Home/RevenueSummary.jsx";
import Report from "./pages/Home/Reports.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex bg-black min-h-screen">
        {/* Sidebar (always visible) */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-[341px]">
          <Header />
          <div className="mt-[60px] p-6">
            <Routes>
              {/* Dashboard with nested routes */}
              <Route path="/" element={<DashboardComponents />}>
                <Route path="patient-record" element={<PatientRecord />} />
                <Route path="surgery-record" element={<SurgeryRecord />} />
                <Route path="revenue-summary" element={<RevenueSummary />} />
              </Route>

              {/* Other main routes */}
              <Route path="/reports" element={<Report />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
