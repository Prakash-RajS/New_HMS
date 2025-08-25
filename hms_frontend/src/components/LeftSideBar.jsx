// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   CalendarCheck,
//   Users,
//   CalendarDays,
//   FlaskConical,
//   Pill,
//   UserPlus,
//   FileText,
//   Siren,
//   UserCircle,
//   LogOut,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
//   { name: "Appointments", path: "/appointments", icon: <CalendarCheck size={18} /> },
//   { name: "Patients", path: "/patients", icon: <Users size={18} /> },
//   { name: "Schedule", path: "/schedule", icon: <CalendarDays size={18} /> },
//   { name: "Laboratory Reports", path: "/LaboratoryReports", icon: <FlaskConical size={18} /> },
//   { name: "Pharmacy", path: "/Pharmacy", icon: <Pill size={18} /> },
//   { name: "New Registration", path: "/NewRegistration", icon: <UserPlus size={18} /> },
//   { name: "Billing Info", path: "/BillingInfo", icon: <FileText size={18} /> },
//   { name: "Emergencies", path: "/Emergencies", icon: <Siren size={18} /> },
//   { name: "Accounts", path: "/Accounts", icon: <UserCircle size={18} /> },
// ];

// export default function Sidebar() {
//   return (
//     <div className="w-[260px] h-[calc(100vh-60px)] mt-[90px] ml-[41px] rounded-[20px] border border-[#1E1E1E] bg-[#0D0D0D] flex flex-col justify-between p-4 fixed">
//       <ul className="flex flex-col gap-2 mt-4 ml-2 text-[14px] text-left font-normal font-['Inter']">
//         {menuItems.map((item, idx) => (
//           <NavLink
//             key={idx}
//             to={item.path}
//             className={({ isActive }) =>
//               `w-[200px] h-[40px] rounded-[20px] flex items-center gap-3 px-3 py-2 cursor-pointer transition ${
//                 isActive
//                   ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] shadow-[0px_2px_12px_0px_#0EFF7B40] text-black font-medium"
//                   : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_12px_0px_#0EFF7B40]"
//               }`
//             }
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </NavLink>
//         ))}
//       </ul>

//       {/* Logout */}
//       <div className="mt-auto mb-2">
//         <button className="w-[200px] h-[40px] rounded-[20px] flex items-center gap-2 justify-center
//           px-3 py-2 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition">
//           <LogOut size={18} /> Logout
//         </button>
//       </div>
//     </div>
//   );
// }

//LeftSideBar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { 
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Bed,
  UserCog,
  Pill,
  Boxes,
  ClipboardList,
  FileText,
  DollarSign,
  ReceiptText,
  CreditCard,
  Microscope,
  BarChart3,
  Activity,
  Droplet,
  HeartPulse,
  Ambulance,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Appointments", path: "/appointments", icon: CalendarDays },

  {
    name: "Patients",
    path: "/patients",
    icon: Users,
    dropdown: [
      { name: "New Registration", path: "/patients/new-registration", icon: User },
      { 
  name: "IPD / OPD Patient",
  path: "/patients/ipd-opd",
  paths: ["/patients/ipd-opd", "/patients/out-patients"], // ✅ multiple routes
  icon: Bed 
},
      { name: "Patient Profile", path: "/patients/profile", icon: ClipboardList },
    ],
  },

  {
    name: "Administration",
    path: "/Administration",
    icon: Building2,
    dropdown: [
      { name: "Departments", path: "/Administration/Departments", icon: Building2 },
      { name: "Room Management", path: "/Administration/RoomManagement", icon: Bed },
      { name: "Staff Management", path: "/Administration/StaffManagement", icon: UserCog },
    ],
  },

  {
    name: "Pharmacy",
    path: "/Pharmacy",
    icon: Pill,
    dropdown: [
      { name: "Stock & Inventory", path: "/Pharmacy/Stock-Inventory", icon: Boxes },
      { name: "Medication", path: "/Pharmacy/Medication", icon: Pill },
    ],
  },

  {
    name: "Doctors / Nurse",
    path: "/Doctors-Nurse",
    icon: ShieldCheck,
    dropdown: [
      { name: "Add Doctor / Nurse", path: "/Doctors-Nurse/AddDoctorNurse", icon: User },
      { name: "Doctor / Nurse", path: "/Doctors-Nurse/DoctorNurse", icon: Users },
    ],
  },

  {
    name: "Clinical Resources",
    path: "/ClinicalResources",
    icon: Microscope,
    dropdown: [
      {
        name: "Laboratory",
        path: "/ClinicalResources/Laboratory",
        icon: Microscope,
        dropdown: [
          { name: "Inventory Item Report", path: "/ClinicalResources/Laboratory/InventoryItemReport", icon: Boxes },
          { name: "Laboratory Reports", path: "/ClinicalResources/Laboratory/LaboratoryReports", icon: BarChart3 },
        ],
      },
      {
        name: "Clinical Reports",
        path: "/ClinicalResources/ClinicalReports",
        icon: FileText,
        dropdown: [
          { name: "Blood Reports", path: "/ClinicalResources/ClinicalReports/BloodReports", icon: Droplet },
          { name: "Death Reports", path: "/ClinicalResources/ClinicalReports/DeathReports", icon: Activity },
          { name: "Blood Bank", path: "/ClinicalResources/ClinicalReports/BloodBank", icon: HeartPulse },
        ],
      },
      {
        name: "Emergency Services",
        path: "/ClinicalResources/EmergencyServices",
        icon: Ambulance,
        dropdown: [
          { name: "Emergency Service", path: "/ClinicalResources/EmergencyServices/emergency", icon: Activity },
          { name: "Ambulance Management", path: "/ClinicalResources/EmergencyServices/Ambulance", icon: Ambulance },
        ],
      },
    ],
  },

  {
    name: "Finance",
    path: "/Finance",
    icon: DollarSign,
    dropdown: [
      { name: "Income", path: "/Finance/Income", icon: DollarSign },
      { name: "Expenses", path: "/Finance/Expenses", icon: FileText },
      { name: "Invoice list", path: "/Finance/Invoice-list", icon: ReceiptText },
      { name: "Invoice Details", path: "/Finance/Invoice-Details", icon: FileText },
      { name: "Billing Info", path: "/Finance/Billing-Info", icon: CreditCard },
    ],
  },

  { name: "Accounts", path: "/Accounts", icon: UserCog },
];

const MenuItem = ({ item, level = 0, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasDropdown = item.dropdown && item.dropdown.length > 0;
  const paddingLeft = level === 0 ? "pl-3" : level === 1 ? "pl-6" : "pl-9";

  const isParentActive = item.paths
    ? item.paths.includes(location.pathname)
    : location.pathname.startsWith(item.path + "/");

  const isExactActive = item.paths
    ? item.paths.includes(location.pathname)
    : location.pathname === item.path;

  const Icon = item.icon;

  // Sizes based on level
  const iconSizeClass = level === 0 ? "w-[24px] h-[24px]" : "w-[16px] h-[16px]";
  const textSizeClass = level === 0 ? "text-[14px]" : "text-[12px]";

  return (
    <li className="w-full font-['Inter']">
      {hasDropdown ? (
        <>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full h-[40px] rounded-[16px] flex items-center justify-between pr-3 ${paddingLeft} cursor-pointer transition-all duration-200
              ${
                isExactActive || isParentActive
                  ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white shadow-[0px_2px_8px_0px_#0EFF7B40]"
                  : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_8px_0px_#0EFF7B40]"
              }`}
          >
            <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
              <Icon
                className={`${iconSizeClass} ${isExactActive || isParentActive ? "text-white" : "text-emerald-500"}`}
              />
              {!isCollapsed && <span className={`${textSizeClass} font-['Inter']`}>{item.name}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : "text-emerald-500"}`}
              />
            )}
          </div>

          {/* Dropdown */}
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isOpen ? "500px" : "0px" }}
          >
            <ul className="mt-0.5 flex flex-col gap-0.5 font-['Inter']">
              {item.dropdown.map((subItem, subIdx) => (
                <MenuItem key={subIdx} item={subItem} level={level + 1} isCollapsed={isCollapsed} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <NavLink
          to={item.path}
          className={() => {
            const active = item.paths
              ? item.paths.includes(location.pathname)
              : location.pathname === item.path;
            return `w-full h-[40px] flex items-center ${paddingLeft} gap-2 cursor-pointer transition-all duration-200 rounded-[12px]
              ${level === 0
                ? active
                  ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white shadow-[0px_2px_8px_0px_#0EFF7B40]"
                  : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_8px_0px_#0EFF7B40]"
                : active
                ? "bg-[#0EFF7B1A] text-white"
                : "text-gray-300 hover:bg-[#0EFF7B1A] hover:text-white"}`;
          }}
        >
          {() => (
            <>
              <Icon className={`${iconSizeClass} ${isExactActive || isParentActive ? "text-white" : "text-emerald-500"}`} />
              {!isCollapsed && <span className={`${textSizeClass} font-['Inter']`}>{item.name}</span>}
            </>
          )}
        </NavLink>
      )}
    </li>
  );
};

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  return (
    <div
      className={`mt-[20px] ml-[15px] mb-4 rounded-[20px] border border-[#1E1E1E] bg-[#0D0D0D] shadow-[0px_0px_12px_0px_#FFFFFF1F] flex flex-col fixed left-0 top-0 overflow-hidden transition-all duration-300`}
      style={{
        width: isCollapsed ? "70px" : "220px",
        height: "calc(100vh - 110px)",
        minHeight: "590px",
        maxHeight: "860px",
      }}
    >
      {/* Header */}
      <div className="w-[170px] h-[36px] mt-5 mb-2 ml-3 flex items-center gap-[7px] px-1 py-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-[4px] border border-[#1E1E1E] bg-transparent"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-500"
          >
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {!isCollapsed && <img src={LOGO} alt="Logo" className="w-[118px] h-[36px] object-contain" />}
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-3 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="flex flex-col gap-1.5">
          {menuItems.map((item, idx) => (
            <MenuItem key={idx} item={item} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </div>
    </div>
  );
}

