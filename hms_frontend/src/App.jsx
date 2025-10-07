// App.jsx
import { useRef, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, ThemeContext } from "./components/ThemeContext.jsx";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop";

import Login from "./pages/Login.jsx"; 

// ✅ Custom Toast helper
import { ToastProvider } from "./components/Toast.jsx";

// Pages - Dashboard
import DashboardComponents from "./pages/Home/DashboardComponents.jsx";


// Pages - Appointments
import AppointmentList from "./pages/Appointments/appointments_list.jsx";

// Pages - Patients
import NewRegistration from "./pages/Patients/new-registration";
import IpdOpd from "./pages/Patients/ipd-opd.jsx";
import PatientProfile from "./pages/Patients/PatientProfile.jsx";
import ViewPatientProfile from "./pages/Patients/ViewPatientProfile.jsx";
import AppointmentListOPD from "./pages/Patients/OutPatientList.jsx";

// Pages - Administrations
import DepartmentList from "./pages/Administration/DepartmentList.jsx";
import RoomManagement from "./pages/Administration/RoomManagement.jsx";
import BedList from "./pages/Administration/BedList.jsx";
import StaffManagement from "./pages/Administration/Staff/StafManagement.jsx";
import SurgicalDept from "./pages/Administration/Staff/SurgicalDept.jsx";
import SupportiveDept from "./pages/Administration/Staff/SupportiveDept.jsx";
import AdministrativeDept from "./pages/Administration/Staff/AdministrativeDept.jsx";

import StockInventory from "./pages/Pharmacy/Stock-Inventory.jsx";

// Doctor & Nurse
import AddDoctorNurse from "./pages/Doctor/AddDoctorNurse.jsx";
import DoctorNurseProfile from "./pages/Doctor/DoctorNurseProfile.jsx";
import ViewProfile from "./pages/Doctor/ViewProfiles.jsx";

// Clinical_Resource/Lab
import LaboratoryReports from "./pages/Clinical_Resources/Laboratory/LabReport.jsx";
import BloodBank from "./pages/Clinical_Resources/ClinicalReport/BloodBank/BloodBank.jsx";

import Billing from "./pages/Billing/Billing.jsx";
import Ambulance from "./pages/Clinical_Resources/EmergencyService/AmbulanceManagement.jsx";
import UserSettings from "./pages/Accounts/UserSettings.jsx";
import Security from "./pages/Accounts/SecuritySettingsPage.jsx";

// ✅ Wrapper so we can consume theme
function AppContent({ contentRef }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 
        ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {!isLoginPage && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <div className="flex-1 flex flex-col">
        {!isLoginPage && <Header isCollapsed={isCollapsed} />}
        <div
          ref={contentRef}
          className={`flex-1 p-2 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isLoginPage ? "flex items-center justify-center" : ""
          }`}
          style={!isLoginPage ? { marginLeft: isCollapsed ? "100px" : "240px" } : {}}
        >
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardComponents />} />
              


            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentList />} />

            {/* Patients */}
            <Route path="/patients">
              <Route path="new-registration" element={<NewRegistration />} />
              <Route path="ipd-opd" element={<IpdOpd />} />
              <Route path="out-patients" element={<AppointmentListOPD />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="profile/details" element={<ViewPatientProfile />} />
            </Route>

            {/* Administration */}
            <Route path="/Administration">
              <Route path="Departments" element={<DepartmentList />} />
              <Route path="roommanagement" element={<RoomManagement />} />
              <Route path="bedlist" element={<BedList />} />
              <Route path="/Administration/StaffManagement">
                <Route index element={<StaffManagement />} />
                <Route path="surgical" element={<SurgicalDept />} />
                <Route path="supportive" element={<SupportiveDept />} />
                <Route path="administrative" element={<AdministrativeDept />} />
              </Route>
            </Route>

            {/* Pharmacy */}
            <Route path="/Pharmacy">
              <Route path="Stock-Inventory" element={<StockInventory />} />
            </Route>

            {/* Other Pages */}
            <Route path="/Doctors-Nurse/AddDoctorNurse" element={<AddDoctorNurse />} />
            <Route path="/Doctors-Nurse/DoctorNurseProfile" element={<DoctorNurseProfile />} />
            <Route path="/Doctors-Nurse/ViewProfile" element={<ViewProfile />} />
            <Route path="/ClinicalResources/Laboratory/LaboratoryReports" element={<LaboratoryReports />} />
            <Route path="/ClinicalResources/ClinicalReports/BloodBank" element={<BloodBank />} />
            <Route path="/Billing" element={<Billing />} />
            <Route path="/ClinicalResources/EmergencyServices/Ambulance" element={<Ambulance />} />
            <Route path="/UserSettings" element={<UserSettings />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </div>
      </div>

      {/* ✅ Custom Toast Component */}
      <ToastProvider />
    </div>
  );
}

export default function App() {
  const contentRef = useRef(null);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop contentRef={contentRef} />
        <AppContent contentRef={contentRef} />
      </Router>
    </ThemeProvider>
  );
}
