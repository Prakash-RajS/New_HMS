import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SecuritySettingsPage = () => {
  const navigate = useNavigate();

  // States
  const [saveLogs, setSaveLogs] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(false);

  // Permissions state
  const [permissions, setPermissions] = useState({
    receptionist: {
      viewPatients: true,
      editPatients: false,
      generateBills: true,
      approveInsurance: false,
      manageAppointments: true,
      manageInventory: false,
      ambulance: false,
    },
    doctor: {
      viewPatients: true,
      editPatients: true,
      generateBills: false,
      approveInsurance: false,
      manageAppointments: true,
      manageInventory: false,
      ambulance: false,
    },
    billing: {
      viewPatients: true,
      editPatients: false,
      generateBills: true,
      approveInsurance: true,
      manageAppointments: false,
      manageInventory: false,
      ambulance: false,
    },
    admin: {
      viewPatients: true,
      editPatients: true,
      generateBills: true,
      approveInsurance: true,
      manageAppointments: true,
      manageInventory: true,
      ambulance: true,
    },
  });

  // Toggle switch for permissions
  const togglePermission = (role, module) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [module]: !prev[role][module] },
    }));
  };

  // Toggle switch component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex border-[1px] border-gray-300 dark:border-[#0EFF7B4D] 
        w-[48px] h-[24px] items-center rounded-full transition shadow-[0px_0px_4px_0px_#0EFF7B]
        ${enabled ? "bg-[#0EFF7B] dark:bg-[#0EFF7B1A]" : "bg-gray-200 dark:bg-[#0D0D0D]"}`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-gray-100 dark:bg-white transition 
          ${enabled ? "translate-x-[24px]" : "translate-x-[3px]"}`}
      />
    </button>
  );

  const handleChangePassword = () => {
    console.log("Change Password button clicked");
    // Placeholder for popup or logic
  };

  return (
    <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
     bg-white dark:bg-transparent overflow-hidden relative"
    >
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
      {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>
      {/* Back Button */}
      <div className="mt-4 mb-6">
        <button
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
            onClick={() => navigate(-1)}
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-2 text-black dark:text-[#0EFF7B]">Security Settings</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        These settings are here to keep your account secure
      </p>

      {/* Save Logs */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[730px] border-b border-gray-300 dark:border-[#3C3C3C] grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6 pt-6 pb-4">
          <div>
            <h3 className="text-[18px] mb-3 font-medium text-black dark:text-white">Save my activity logs</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You can save all your activity logs including unusual activity detected
            </p>
          </div>
          <div className="self-center mr-3">
            <Toggle enabled={saveLogs} onChange={() => setSaveLogs(!saveLogs)} />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-black border-b border-gray-300 dark:border-[#3C3C3C] pb-4 flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-[18px] text-black dark:text-white">Change password</h3>
          <p className="text-[16px] text-black dark:text-white mt-2">
            Set a unique password to protect your account
          </p>
        </div>
        <div className="flex flex-col items-end">
          <button
            className="min-w-[180px] bg-[#08994A] dark:bg-[#0EFF7B1A] border-[1px] border-[#0EFF7B66] text-white dark:text-white px-4 py-2 rounded-full font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968] transition shadow-[0px_0px_4px_0px_#0EFF7B40]"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 mr-3 mt-2">Last changed: Mar 2, 2025</p>
        </div>
      </div>

      {/* 2FA */}
      <div className="border-b border-gray-300 dark:border-[#3C3C3C] pb-4 flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-[18px] flex items-center gap-2 text-black dark:text-white">
            2 Factor Auth
            <span className="bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B] px-2 py-0.5 text-xs rounded-full">
              {twoFactorAuth ? "Enabled" : "Enable"}
            </span>
          </h3>
          <p className="min-w-[400px] text-black dark:text-white text-[16px] mt-2">
            Secure your account with 2FA security. When it is activated,<br /> you will need to enter not only your password, but also a special code using an app. <br />You will receive this code in a mobile app.
          </p>
        </div>
        
        <button
          onClick={() => setTwoFactorAuth(!twoFactorAuth)}
           className="min-w-[180px] bg-[#08994A] dark:bg-[#0EFF7B1A] border-[1px] border-[#0EFF7B66] text-white dark:text-white px-4 py-2 rounded-full font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968] transition shadow-[0px_0px_4px_0px_#0EFF7B40]"
        >
          {twoFactorAuth ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Login Alerts */}
      <div className="border-b border-gray-300 dark:border-[#3C3C3C] pb-4 flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-[18px] text-black dark:text-white">Turn on login alerts</h3>
          <p className="text-black dark:text-white text-[16px] mt-2">
            Be notified if anyone logs in from unknown or new devices
          </p>
        </div>
        <button
          onClick={() => setLoginAlerts(!loginAlerts)}
           className="min-w-[180px] bg-[#08994A] dark:bg-[#0EFF7B1A] border-[1px] border-[#0EFF7B66] text-white dark:text-white px-4 py-2 rounded-full font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968] transition shadow-[0px_0px_4px_0px_#0EFF7B40]">
          {loginAlerts ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Access & Permissions */}
      <div className="pb-4 mt-6">
        <h3 className="font-medium mb-2 text-black dark:text-white">Access & Permissions</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Manage role-based access with permission controls
        </p>

        {/* Permissions Table */}
        <div className=" min-w-[1000px] ml-2 rounded-[8px] overflow-x-auto">
          <table className="min-w-[1000px]  bg-white dark:bg-[#0EFF7B1A] border-collapse text-center table-fixed">
            <thead className="h-[62px]">
              <tr className="text-[18px] text-black dark:text-[#0EFF7B]">
                <th className="p-2 w-1/5">Modules</th>
                <th className="p-2 w-1/5">Receptionist</th>
                <th className="p-2 w-1/5">Doctor</th>
                <th className="p-2 w-1/5">Billing Staff</th>
                <th className="p-2 w-1/5">Admin</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["View Patients records", "viewPatients"],
                ["Edit Patients records", "editPatients"],
                ["Generate patients bill", "generateBills"],
                ["Approve Insurance claims", "approveInsurance"],
                ["Manage Appointments", "manageAppointments"],
                ["Manage Inventory and Pharmacy", "manageInventory"],
                ["Ambulance dispatch & Transport Logs", "ambulance"],
              ].map(([label, key]) => (
                <tr
                  key={key}
                  className="bg-white h-[52px] dark:bg-black border-b border-gray-300 dark:border-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#0EFF7B0D] transition"
                >
                  <td className="p-2 break-words text-black dark:text-white">{label}</td>
                  {["receptionist", "doctor", "billing", "admin"].map((role) => (
                    <td key={role} className="p-2">
                      <Toggle
                        enabled={permissions[role][key]}
                        onChange={() => togglePermission(role, key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;