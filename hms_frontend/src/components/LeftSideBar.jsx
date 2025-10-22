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
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
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
        paths: ["/patients/ipd-opd", "/patients/out-patients"],
        icon: Bed
      },
      {
        name: "Patient Profile",
        path: "/patients/profile",
        paths: ["/patients/profile", "/patients/profile/details"],
        icon: ClipboardList
      },
    ],
  },

  {
    name: "Administration",
    path: "/Administration",
    icon: Building2,
    dropdown: [
      { name: "Departments", path: "/Administration/Departments", icon: Building2 },
      {
        name: "Room Management",
        path: "/Administration/RoomManagement",
        paths: ["/Administration/roommanagement", "/Administration/BedList", "/Administration/RoomManagement"],
        icon: Bed
      },
      { name: "Staff Management", path: "/Administration/StaffManagement", icon: UserCog },
    ],
  },

  {
    name: "Pharmacy",
    path: "/Pharmacy",
    icon: Pill,
    dropdown: [
      { name: "Stock & Inventory", path: "/Pharmacy/Stock-Inventory", icon: Boxes },
    ],
  },

  {
    name: "Doctors / Nurse",
    path: "/Doctors-Nurse",
    icon: ShieldCheck,
    dropdown: [
      { name: "Add Doctor / Nurse", path: "/Doctors-Nurse/AddDoctorNurse", icon: User },
      { name: "Doctor / Nurse", path: "/Doctors-Nurse/DoctorNurseProfile",
        paths: ["/Doctors-Nurse/DoctorNurseProfile", "/Doctors-Nurse/ViewProfile"],
         icon: Users },
         { name: "MedicineAllocation", path: "/Doctors-Nurse/MedicineAllocation", icon: Pill },
    ],
  },

  {
    name: "Clinical Resources",
    path: "/ClinicalResources",
    icon: Microscope,
    dropdown: [
      { name: "Laboratory Reports", path: "/ClinicalResources/Laboratory/LaboratoryReports", icon: BarChart3 },
      { name: "Blood Bank", path: "/ClinicalResources/ClinicalReports/BloodBank", icon: HeartPulse },
      { name: "Ambulance Management", path: "/ClinicalResources/EmergencyServices/Ambulance", icon: Ambulance },
    ],
  },

  {
    name: "Billing",
    path: "/Billing",
    icon: DollarSign,
  },

  { name: "Accounts", path: "/UserSettings",
    paths: ["/security", "/UserSettings"],
     icon: UserCog },
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

  const iconSizeClass = level === 0 ? "w-[24px] h-[24px]" : "w-[16px] h-[16px]";
  const textSizeClass = level === 0 ? "text-[14px]" : "text-[12px]";

  return (
    <li className="w-full font-['Inter']">
      {hasDropdown ? (
        <>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full h-[40px] rounded-[8px] flex items-center justify-between pr-3 ${paddingLeft} cursor-pointer transition-all duration-200
              ${isExactActive || isParentActive
                ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white shadow-[0px_2px_8px_0px_#0EFF7B40]"
                : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_8px_0px_#0EFF7B40]"
              }`}
          >
            <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}>
              <Icon
                className={`${iconSizeClass} ${isExactActive || isParentActive ? "text-white" : "text-[#08994A] dark:text-emerald-500"}`}
              />
              {!isCollapsed && <span className={`${textSizeClass} font-['Inter']`}>{item.name}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : "text-[#08994A] dark:text-emerald-500"}`}
              />
            )}
          </div>

          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isOpen ? "500px" : "0px" }}
          >
            <ul className="mt-2 gap-[10px] flex flex-col gap-0.5 font-['Inter']">
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
            return `w-full h-[40px] flex items-center ${paddingLeft} gap-2 cursor-pointer transition-all duration-200 rounded-[8px]
              ${level === 0
                ? active
                  ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white shadow-[0px_2px_8px_0px_#0EFF7B40]"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_8px_0px_#0EFF7B40]"
                : active
                  ? "bg-[#0EFF7B1A] text-[#08994A] dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"}`;
          }}
        >
          {() => (
            <>
              <Icon className={`${iconSizeClass} ${isExactActive || isParentActive ? "text-[#08994A]" : "text-[#08994A] dark:text-emerald-500"}`} />
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
      className={`mt-[20px] ml-[15px] mb-4 rounded-[8px]  bg-white dark:bg-[#0D0D0D]  flex flex-col fixed left-0 top-0 transition-all duration-300`}
      style={{
        width: isCollapsed ? "80px" : "220px",
        height: "calc(100vh - 110px)",
        minHeight: "590px",
        maxHeight: "1860px",
      }}
    > {/* Border gradient layer */}
  <div
    className="absolute inset-0 rounded-[8px] p-[1.5px] pointer-events-none"
    style={{
      background:
        "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      zIndex: 1,
    }}
  ></div>

  {/* Dark overlay for dark mode */}
  <div
    className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
    style={{
      background:
        "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
      zIndex: 0,
    }}
  ></div>
      {/* Header */}
      <div className="w-[170px] h-[36px] mt-5 mb-2 ml-3 flex items-center gap-[7px] px-1 py-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-[4px] border border-[#08994A] dark:border-[#1E1E1E] bg-transparent"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#08994A] dark:text-emerald-500"
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