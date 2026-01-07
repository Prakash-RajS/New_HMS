import { useRef, useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, ThemeContext } from "./components/ThemeContext.jsx";
import Sidebar from "./components/LeftSideBar.jsx";
import Header from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";

import Login from "./pages/Login.jsx";
import { ToastProvider } from "./components/Toast.jsx";

// Pages
import DashboardComponents from "./pages/Home/DashboardComponents.jsx";
import Profile from "./pages/Home/Profile.jsx";
import AppointmentList from "./pages/Appointments/appointments_list.jsx";
import AppointmentCalendar from "./pages/Appointments/Calender.jsx";

import NewRegistration from "./pages/Patients/new-registration";
import IpdOpd from "./pages/Patients/ipd-opd.jsx";
import PatientProfile from "./pages/Patients/PatientProfile.jsx";
import ViewPatientProfile from "./pages/Patients/ViewPatientProfile.jsx";
import AppointmentListOPD from "./pages/Patients/OutPatientList.jsx";
import DepartmentList from "./pages/Administration/DepartmentList.jsx";
import RoomManagement from "./pages/Administration/RoomManagement.jsx";
import BedList from "./pages/Administration/BedList.jsx";
import StaffManagement from "./pages/Administration/Staff/StafManagement.jsx";
import SurgicalDept from "./pages/Administration/Staff/SurgicalDept.jsx";
import SupportiveDept from "./pages/Administration/Staff/SupportiveDept.jsx";
import AdministrativeDept from "./pages/Administration/Staff/AdministrativeDept.jsx";
import StockInventory from "./pages/Pharmacy/Stock-Inventory.jsx";
import PharmacyBill from "./pages/Pharmacy/Bill.jsx";
import AddDoctorNurse from "./pages/Doctor/AddDoctorNurse.jsx";
import DoctorNurseProfile from "./pages/Doctor/DoctorNurseProfile.jsx";
import ViewProfile from "./pages/Doctor/ViewProfiles.jsx";
import MedicineAllocation from "./pages/Doctor/MedicineAllocation.jsx";
import LaboratoryReports from "./pages/Clinical_Resources/Laboratory/LabReport.jsx";
import Laboratory from "./pages/Clinical_Resources/Laboratory/Laboratory.jsx";
import BloodBank from "./pages/Clinical_Resources/ClinicalReport/BloodBank/BloodBank.jsx";
import Billing from "./pages/Billing/Billing.jsx";
import BillingPreview from "./pages/Billing/BillingPreview.jsx";
import Ambulance from "./pages/Clinical_Resources/EmergencyService/AmbulanceManagement.jsx";
import UserSettings from "./pages/Accounts/UserSettings.jsx";
import Security from "./pages/Accounts/SecuritySettingsPage.jsx";
import GlobalBackgroundText from "./components/GlobalBackgroundText.jsx";

import { WebSocketProvider } from "./components/WebSocketContext";
import {
  PermissionProvider,
  PermissionContext,
} from "./components/PermissionContext";
import TreatmentCharges from "./pages/Patients/TreatmentCharges.jsx";

// -------------------- Permission Gate for Access Denied --------------------
const PermissionGate = ({ moduleKey, children }) => {
  const { hasPermission } = useContext(PermissionContext);
  const navigate = useNavigate();

  if (!hasPermission(moduleKey)) {
    return (
      <div className="mt-[80px] mb-4 bg-gray-100 dark:bg-black text-black dark:text-white rounded-xl p-8 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-500">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            You do not have permission to access this module.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="px-8 py-3 bg-[#08994A] text-white rounded-full hover:bg-[#0cd968] transition text-lg font-medium"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// -------------------- First Permitted Page Redirect --------------------
const FirstPermittedPage = () => {
  const { hasPermission } = useContext(PermissionContext);
  const navigate = useNavigate();

  useEffect(() => {
    const modulePriority = [
      "dashboard",
      "appointments",
      "patients_view",
      "patients_create",
      "patients_profile",
      "treatment_charges",
      "medicine_allocation",
      "bed_management",
      "room_management",
      "staff_management",
      "pharmacy_inventory",
      "pharmacy_billing",
      "doctors_manage",
      "laboratory_manage",
      "lab_reports",
      "blood_bank",
      "ambulance",
      "billing",
      "user_settings",
      "security_settings",
    ];

    const pathMap = {
      dashboard: "/dashboard",
      appointments: "/appointments",
      patients_view: "/patients/ipd-opd",
      patients_create: "/patients/new-registration",
      treatment_charges : "/patients/treatment-charges",
      patients_profile: "/patients/profile",
      medicine_allocation: "/Doctors-Nurse/MedicineAllocation",
      bed_management: "/Administration/BedList",
      room_management: "/Administration/RoomManagement",
      staff_management: "/Administration/StaffManagement",
      pharmacy_inventory: "/Pharmacy/Stock-Inventory",
      pharmacy_billing: "/Pharmacy/Bill",
      doctors_manage: "/Doctors-Nurse/DoctorNurseProfile",
      lab_reports: "/ClinicalResources/Laboratory/LaboratoryReports",
      laboratory_manage: "/ClinicalResources/Laboratory/Laboratory",  
      blood_bank: "/ClinicalResources/ClinicalReports/BloodBank",
      ambulance: "/ClinicalResources/EmergencyServices/Ambulance",
      billing: "/Billing",
      user_settings: "/UserSettings",
      security_settings: "/security",
    };

    for (const module of modulePriority) {
      if (hasPermission(module)) {
        navigate(pathMap[module] || "/profile", { replace: true });
        return;
      }
    }

    navigate("/profile", { replace: true });
  }, [hasPermission, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-[#0EFF7B] rounded-full mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    </div>
  );
};

// -------------------- App Content --------------------
function AppContent({ contentRef }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/";

  const isAuthenticated = !!token;

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 
        ${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
    >
      {isAuthenticated && !isLoginPage && (
        <>
          <GlobalBackgroundText isCollapsed={isCollapsed} />
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </>
      )}

      <div className="flex-1 flex flex-col">
        {isAuthenticated && !isLoginPage && (
          <Header isCollapsed={isCollapsed} />
        )}

        <div
          ref={contentRef}
          className={`flex-1 p-2 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isLoginPage ? "flex items-center justify-center" : ""
          }`}
          style={
            isAuthenticated && !isLoginPage
              ? { marginLeft: isCollapsed ? "100px" : "240px" }
              : {}
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/home" element={<FirstPermittedPage />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="dashboard">
                    <DashboardComponents />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Appointments */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="appointments">
                    <AppointmentList />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/calendar"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="appointments">
                    <AppointmentCalendar />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Patients */}
            <Route
              path="/patients/new-registration"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="patients_create">
                    <NewRegistration />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/ipd-opd"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="patients_view">
                    <IpdOpd />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/out-patients"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="patients_view">
                    <AppointmentListOPD />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/profile"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="patients_profile">
                    <PatientProfile />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/profile/:patient_id"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="patients_profile">
                    <ViewPatientProfile />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
  path="/patients/treatment-charges"
  element={
    <ProtectedRoute>
      <PermissionGate moduleKey="treatment_charges">
        <TreatmentCharges />
      </PermissionGate>
    </ProtectedRoute>
  }
/>

            {/* Administration */}
            <Route
              path="/Administration/Departments"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="departments">
                    <DepartmentList />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/RoomManagement"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="room_management">
                    <RoomManagement />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/BedList"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="bed_management">
                    <BedList />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="staff_management">
                    <StaffManagement />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/surgical"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="staff_management">
                    <SurgicalDept />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/supportive"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="staff_management">
                    <SupportiveDept />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/administrative"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="staff_management">
                    <AdministrativeDept />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Pharmacy */}
            <Route
              path="/Pharmacy/Stock-Inventory"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="pharmacy_inventory">
                    <StockInventory />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Pharmacy/Bill"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="pharmacy_billing">
                    <PharmacyBill />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Doctors / Nurse */}
            <Route
              path="/Doctors-Nurse/AddDoctorNurse"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="doctors_manage">
                    <AddDoctorNurse />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/DoctorNurseProfile"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="doctors_manage">
                    <DoctorNurseProfile />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/ViewProfile"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="doctors_manage">
                    <ViewProfile />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/MedicineAllocation"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="medicine_allocation">
                    <MedicineAllocation />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Clinical Resources */}
            <Route
              path="/ClinicalResources/Laboratory/LaboratoryReports"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="lab_reports">
                    <LaboratoryReports />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ClinicalResources/ClinicalReports/BloodBank"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="blood_bank">
                    <BloodBank />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ClinicalResources/EmergencyServices/Ambulance"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="ambulance">
                    <Ambulance />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
  path="/ClinicalResources/Laboratory/Laboratory"
  element={
    <ProtectedRoute>
      <PermissionGate moduleKey="laboratory_manage">
        <Laboratory />
      </PermissionGate>
    </ProtectedRoute>
  }
/>


            {/* Billing */}
            <Route
              path="/Billing"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="billing">
                    <Billing />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />
            <Route
              path="/BillingPreview"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="billing">
                    <BillingPreview />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Accounts */}
            <Route
              path="/UserSettings"
              element={
                <ProtectedRoute>
                  <PermissionGate moduleKey="user_settings">
                    <UserSettings />
                  </PermissionGate>
                </ProtectedRoute>
              }
            />

            {/* Security Settings - Special: Always allow view, read-only if no edit permission */}
            <Route
              path="/security"
              element={
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>

      <ToastProvider />
    </div>
  );
}

export default function App() {
  const contentRef = useRef(null);

  return (
    <ThemeProvider>
      <PermissionProvider>
        <WebSocketProvider>
          <Router>
            <ScrollToTop contentRef={contentRef} />
            <AppContent contentRef={contentRef} />
          </Router>
        </WebSocketProvider>
      </PermissionProvider>
    </ThemeProvider>
  );
}