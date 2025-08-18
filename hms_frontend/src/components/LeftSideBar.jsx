

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Appointments", path: "/appointments" },
  { name: "Patients", path: "/patients" },
  { name: "Schedule", path: "/schedule" },
  { name: "Laboratory Reports", path: "/LaboratoryReports"},
  { name: "Pharmacy", path: "/Pharmacy"},
  { name: "New Registration", path: "/NewRegistration"},
  { name: "Billing Info", path: "/BillingInfo"},
  { name: "Emergencies", path: "/Emergencies"},
  { name: "Accounts", path: "/Accounts"},

];

export default function Sidebar() {
  return (
    <div className="w-[260px] h-[calc(100vh-60px)] mt-[90px] ml-[41px] rounded-[20px] border border-[#1E1E1E] bg-[#0D0D0D] flex flex-col justify-between p-4 fixed">
      <ul className="flex flex-col gap-4 mt-4 ml-2 text-[14px] text-left font-normal font-['Inter']">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `w-[200px] h-[40px] rounded-[20px] flex items-center px-3 py-2 cursor-pointer transition ${
                isActive
                  ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] shadow-[0px_2px_12px_0px_#0EFF7B40] text-black"
                  : "text-gray-300 hover:text-black hover:bg-gradient-to-r hover:from-[#0EFF7B] hover:to-[#08994A] hover:shadow-[0px_2px_12px_0px_#0EFF7B40]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </ul>

      {/* Logout */}
      <div className="mt-auto mb-2">
        <button className="w-[200px] h-[40px] rounded-[20px] flex items-center justify-center 
          px-3 py-2 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}