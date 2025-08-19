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

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  CalendarDays,
  FlaskConical,
  Pill,
  UserPlus,
  FileText,
  Siren,
  UserCircle,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Appointments", path: "/appointments", icon: <CalendarCheck size={18} /> },
  { name: "Patients", path: "/patients", icon: <Users size={18} /> },
  { name: "Schedule", path: "/schedule", icon: <CalendarDays size={18} /> },
  { name: "Laboratory Reports", path: "/LaboratoryReports", icon: <FlaskConical size={18} /> },
  { name: "Pharmacy", path: "/Pharmacy", icon: <Pill size={18} /> },
  { name: "New Registration", path: "/NewRegistration", icon: <UserPlus size={18} /> },
  { name: "Billing Info", path: "/BillingInfo", icon: <FileText size={18} /> },
  { name: "Emergencies", path: "/Emergencies", icon: <Siren size={18} /> },
  { name: "Accounts", path: "/Accounts", icon: <UserCircle size={18} /> },
];

export default function Sidebar() {
  return (
    <div
      className="w-[230px] h-screen mt-[90px] ml-[15px] rounded-[20px] border border-[#1E1E1E] 
                 bg-[#0D0D0D] shadow-[0px_0px_12px_0px_#FFFFFF1F] flex flex-col 
                  left-0 top-0"
    >
      {/* Menu (scrollable) */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-2 text-[14px] text-left font-normal font-['Inter']">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `w-[200px] h-[40px] rounded-[20px] flex items-center gap-[8px] px-4 py-2 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] shadow-[0px_2px_12px_0px_#0EFF7B40] text-white font-medium pl-9"
                    : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_12px_0px_#0EFF7B40]"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </ul>
      </div>

      {/* Logout (always at bottom, not scrolling away) */}
      <div className="p-4 border-t border-gray-800">
        <button
          className="w-[200px] h-[40px] rounded-[20px] flex items-center gap-[8px] px-3 py-2 cursor-pointer text-gray-300 
          hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] 
          hover:shadow-[0px_2px_12px_0px_#0EFF7B40] transition-all duration-200 font-['Inter']"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}