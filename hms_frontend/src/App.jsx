// // src/App.jsx
// import { useRef, useState, useContext } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import { ThemeProvider, ThemeContext } from "./components/ThemeContext.jsx";
// import Sidebar from "./components/LeftSideBar.jsx";
// import Header from "./components/Header.jsx";
// import ScrollToTop from "./components/ScrollToTop";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import NotFound from "./pages/NotFound.jsx";

// import Login from "./pages/Login.jsx";
// import { ToastProvider } from "./components/Toast.jsx";

// // Pages
// import DashboardComponents from "./pages/Home/DashboardComponents.jsx";
// import Profile from "./pages/Home/Profile.jsx";
// import AppointmentList from "./pages/Appointments/appointments_list.jsx";
// import NewRegistration from "./pages/Patients/new-registration";
// import IpdOpd from "./pages/Patients/ipd-opd.jsx";
// import PatientProfile from "./pages/Patients/PatientProfile.jsx";
// import ViewPatientProfile from "./pages/Patients/ViewPatientProfile.jsx";
// import AppointmentListOPD from "./pages/Patients/OutPatientList.jsx";
// import DepartmentList from "./pages/Administration/DepartmentList.jsx";
// import RoomManagement from "./pages/Administration/RoomManagement.jsx";
// import BedList from "./pages/Administration/BedList.jsx";
// import StaffManagement from "./pages/Administration/Staff/StafManagement.jsx";
// import SurgicalDept from "./pages/Administration/Staff/SurgicalDept.jsx";
// import SupportiveDept from "./pages/Administration/Staff/SupportiveDept.jsx";
// import AdministrativeDept from "./pages/Administration/Staff/AdministrativeDept.jsx";
// import StockInventory from "./pages/Pharmacy/Stock-Inventory.jsx";
// import PharmacyBill from "./pages/Pharmacy/Bill.jsx";
// import AddDoctorNurse from "./pages/Doctor/AddDoctorNurse.jsx";
// import DoctorNurseProfile from "./pages/Doctor/DoctorNurseProfile.jsx";
// import ViewProfile from "./pages/Doctor/ViewProfiles.jsx";
// import MedicineAllocation from "./pages/Doctor/MedicineAllocation.jsx";
// import LaboratoryReports from "./pages/Clinical_Resources/Laboratory/LabReport.jsx";
// import BloodBank from "./pages/Clinical_Resources/ClinicalReport/BloodBank/BloodBank.jsx";
// import Billing from "./pages/Billing/Billing.jsx";
// import BillingPreview from "./pages/Billing/BillingPreview.jsx";
// import Ambulance from "./pages/Clinical_Resources/EmergencyService/AmbulanceManagement.jsx";
// import UserSettings from "./pages/Accounts/UserSettings.jsx";
// import Security from "./pages/Accounts/SecuritySettingsPage.jsx";
// import GlobalBackgroundText from "./components/GlobalBackgroundText.jsx";

// import { WebSocketProvider } from "./components/WebSocketContext";

// // -------------------- App Content --------------------
// function AppContent({ contentRef }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const { theme } = useContext(ThemeContext);
//   const location = useLocation();

//   const token = localStorage.getItem("token");
//   const isLoginPage = location.pathname === "/";

//   const isAuthenticated = !!token;

//   return (
//     <div
//       className={`flex min-h-screen transition-colors duration-300
//         ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
//     >
//       {/* Show Sidebar & Header only if logged in */}
//       {isAuthenticated && !isLoginPage && (
//         <>
//           <GlobalBackgroundText isCollapsed={isCollapsed} />
//           <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//         </>
//       )}

//       <div className="flex-1 flex flex-col">
//         {isAuthenticated && !isLoginPage && (
//           <Header isCollapsed={isCollapsed} />
//         )}

//         <div
//           ref={contentRef}
//           className={`flex-1 p-2 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
//             isLoginPage ? "flex items-center justify-center" : ""
//           }`}
//           style={
//             isAuthenticated && !isLoginPage
//               ? { marginLeft: isCollapsed ? "100px" : "240px" }
//               : {}
//           }
//         >
//           <Routes>
//             {/* Public Route */}
//             <Route path="/" element={<Login />} />

//             {/* Protected Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <DashboardComponents />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Profile />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Appointments */}
//             <Route
//               path="/appointments"
//               element={
//                 <ProtectedRoute>
//                   <AppointmentList />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Patients */}
//             <Route
//               path="/patients/new-registration"
//               element={
//                 <ProtectedRoute>
//                   <NewRegistration />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patients/ipd-opd"
//               element={
//                 <ProtectedRoute>
//                   <IpdOpd />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patients/out-patients"
//               element={
//                 <ProtectedRoute>
//                   <AppointmentListOPD />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patients/profile"
//               element={
//                 <ProtectedRoute>
//                   <PatientProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patients/profile/:patient_id"
//               element={
//                 <ProtectedRoute>
//                   <ViewPatientProfile />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Administration */}
//             <Route
//               path="/Administration/Departments"
//               element={
//                 <ProtectedRoute>
//                   <DepartmentList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/roommanagement"
//               element={
//                 <ProtectedRoute>
//                   <RoomManagement />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/bedlist"
//               element={
//                 <ProtectedRoute>
//                   <BedList />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/StaffManagement"
//               element={
//                 <ProtectedRoute>
//                   <StaffManagement />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/StaffManagement/surgical"
//               element={
//                 <ProtectedRoute>
//                   <SurgicalDept />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/StaffManagement/supportive"
//               element={
//                 <ProtectedRoute>
//                   <SupportiveDept />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Administration/StaffManagement/administrative"
//               element={
//                 <ProtectedRoute>
//                   <AdministrativeDept />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Pharmacy */}
//             <Route
//               path="/Pharmacy/Stock-Inventory"
//               element={
//                 <ProtectedRoute>
//                   <StockInventory />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Pharmacy/Bill"
//               element={
//                 <ProtectedRoute>
//                   <PharmacyBill />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Other Protected Routes */}
//             <Route
//               path="/Doctors-Nurse/AddDoctorNurse"
//               element={
//                 <ProtectedRoute>
//                   <AddDoctorNurse />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Doctors-Nurse/DoctorNurseProfile"
//               element={
//                 <ProtectedRoute>
//                   <DoctorNurseProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Doctors-Nurse/ViewProfile"
//               element={
//                 <ProtectedRoute>
//                   <ViewProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Doctors-Nurse/MedicineAllocation"
//               element={
//                 <ProtectedRoute>
//                   <MedicineAllocation />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Clinical Resources */}
//             <Route
//               path="/ClinicalResources/Laboratory/LaboratoryReports"
//               element={
//                 <ProtectedRoute>
//                   <LaboratoryReports />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/ClinicalResources/ClinicalReports/BloodBank"
//               element={
//                 <ProtectedRoute>
//                   <BloodBank />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Billing"
//               element={
//                 <ProtectedRoute>
//                   <Billing />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/BillingPreview"
//               element={
//                 <ProtectedRoute>
//                   <BillingPreview />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/ClinicalResources/EmergencyServices/Ambulance"
//               element={
//                 <ProtectedRoute>
//                   <Ambulance />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/UserSettings"
//               element={
//                 <ProtectedRoute>
//                   <UserSettings />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/security"
//               element={
//                 <ProtectedRoute>
//                   <Security />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Catch-all for invalid routes */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </div>

//       <ToastProvider />
//     </div>
//   );
// }

// // -------------------- Main Wrapper --------------------
// export default function App() {
//   const contentRef = useRef(null);
//   return (
//     <ThemeProvider>
//       <WebSocketProvider>
//         <Router>
//           <ScrollToTop contentRef={contentRef} />
//           <AppContent contentRef={contentRef} />
//         </Router>
//       </WebSocketProvider>
//     </ThemeProvider>
//   );
// }

// src/App.jsx
import { useRef, useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import BloodBank from "./pages/Clinical_Resources/ClinicalReport/BloodBank/BloodBank.jsx";
import Billing from "./pages/Billing/Billing.jsx";
import BillingPreview from "./pages/Billing/BillingPreview.jsx";
import Ambulance from "./pages/Clinical_Resources/EmergencyService/AmbulanceManagement.jsx";
import UserSettings from "./pages/Accounts/UserSettings.jsx";
import Security from "./pages/Accounts/SecuritySettingsPage.jsx";
import GlobalBackgroundText from "./components/GlobalBackgroundText.jsx";

import { WebSocketProvider } from "./components/WebSocketContext";
import { PermissionProvider } from "./components/PermissionContext"; // Import PermissionProvider

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
        ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {/* Show Sidebar & Header only if logged in */}
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
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardComponents />
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
                  <AppointmentList />
                </ProtectedRoute>
              }
            />

            {/* Patients */}
            <Route
              path="/patients/new-registration"
              element={
                <ProtectedRoute>
                  <NewRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/ipd-opd"
              element={
                <ProtectedRoute>
                  <IpdOpd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/out-patients"
              element={
                <ProtectedRoute>
                  <AppointmentListOPD />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/profile"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/profile/:patient_id"
              element={
                <ProtectedRoute>
                  <ViewPatientProfile />
                </ProtectedRoute>
              }
            />

            {/* Administration */}
            <Route
              path="/Administration/Departments"
              element={
                <ProtectedRoute>
                  <DepartmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/roommanagement"
              element={
                <ProtectedRoute>
                  <RoomManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/bedlist"
              element={
                <ProtectedRoute>
                  <BedList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement"
              element={
                <ProtectedRoute>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/surgical"
              element={
                <ProtectedRoute>
                  <SurgicalDept />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/supportive"
              element={
                <ProtectedRoute>
                  <SupportiveDept />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Administration/StaffManagement/administrative"
              element={
                <ProtectedRoute>
                  <AdministrativeDept />
                </ProtectedRoute>
              }
            />

            {/* Pharmacy */}
            <Route
              path="/Pharmacy/Stock-Inventory"
              element={
                <ProtectedRoute>
                  <StockInventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Pharmacy/Bill"
              element={
                <ProtectedRoute>
                  <PharmacyBill />
                </ProtectedRoute>
              }
            />

            {/* Other Protected Routes */}
            <Route
              path="/Doctors-Nurse/AddDoctorNurse"
              element={
                <ProtectedRoute>
                  <AddDoctorNurse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/DoctorNurseProfile"
              element={
                <ProtectedRoute>
                  <DoctorNurseProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/ViewProfile"
              element={
                <ProtectedRoute>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Doctors-Nurse/MedicineAllocation"
              element={
                <ProtectedRoute>
                  <MedicineAllocation />
                </ProtectedRoute>
              }
            />
            <Route
  path="/appointments/calendar"
  element={
    <ProtectedRoute>
      <AppointmentCalendar />
    </ProtectedRoute>
  }
/>

            {/* Clinical Resources */}
            <Route
              path="/ClinicalResources/Laboratory/LaboratoryReports"
              element={
                <ProtectedRoute>
                  <LaboratoryReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ClinicalResources/ClinicalReports/BloodBank"
              element={
                <ProtectedRoute>
                  <BloodBank />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Billing"
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BillingPreview"
              element={
                <ProtectedRoute>
                  <BillingPreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ClinicalResources/EmergencyServices/Ambulance"
              element={
                <ProtectedRoute>
                  <Ambulance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserSettings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security"
              element={
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              }
            />

            {/* Catch-all for invalid routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>

      <ToastProvider />
    </div>
  );
}

// -------------------- Main Wrapper --------------------
export default function App() {
  const contentRef = useRef(null);
  return (
    <ThemeProvider>
      <PermissionProvider>
        {" "}
        {/* Add PermissionProvider here */}
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
