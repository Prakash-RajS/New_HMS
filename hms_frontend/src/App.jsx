import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";

// Pages - Dashboard
import DashboardComponents from "./pages/Home/DashboardComponents.jsx";
import PatientRecord from "./pages/Home/PatientRecord.jsx";
import SurgeryRecord from "./pages/Home/SurgeryRecord.jsx";
import RevenueSummary from "./pages/Home/RevenueSummary.jsx";
import Reports from "./pages/Home/Reports.jsx";
import Statistics from "./pages/Home/Statistics.jsx";
import Employee from "./pages/Home/Employee.jsx";

// Pages - Appointments
import AppointmentList from "./pages/Appointments/appointments_list.jsx";

// Pages - Patients (PascalCase filenames)
import NewRegistration from "./pages/Patients/new-registration";
import IpdOpd from "./pages/Patients/ipd-opd.jsx";
// import PatientProfile from "./pages/Patients/PatientProfile.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex bg-black">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          {/* Scrollable Content Area */}
          <div className="ml-[250px] p-2 overflow-y-hidden overflow-x-hidden h-[auto]">
            <Routes>
              {/* Dashboard with nested routes */}
              <Route path="/" element={<DashboardComponents />}>
                <Route path="patient-record" element={<PatientRecord />} />
                <Route path="surgery-record" element={<SurgeryRecord />} />
                <Route path="revenue-summary" element={<RevenueSummary />} />
              </Route>

              {/* Other main routes */}
              <Route path="/appointments" element={<AppointmentList />} />

              {/* Patients routes */}
              <Route path="/patients">
                <Route path="new-registration" element={<NewRegistration />} />
                <Route path="ipd-opd" element={<IpdOpd />} />
                {/* <Route path="profile" element={<PatientProfile />} /> */}
              </Route>

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
