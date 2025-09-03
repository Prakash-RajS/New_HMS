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

 // Toggle switch component (slightly smaller)
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex border-[1px] border-[#0EFF7B4D] 
      w-[48px] h-[24px] items-center rounded-full transition 
      ${enabled ? "bg-[#0EFF7B1A]" : "bg-[#0D0D0D] border-[#3C3C3C]"}`}
  >
    <span
      className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white transition 
        ${enabled ? "translate-x-[24px]" : "translate-x-[3px]"}`}
    />
  </button>
);


  return (
    <div className="w-full bg-black mt-[70px] w-full mx-auto p-3 mt-10 text-white">
      {/* Back Button */}
      <div className="mb-6">
        <button className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
        onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-2">Security Settings</h2>
      <p className="text-gray-400 mb-6">
        These settings are here to keep your account secure
      </p>

      {/* Save Logs */}
      <div className="w-full overflow-x-auto">
  <div className="min-w-[730px] border-b border-[#3C3C3C] grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6 pt-6 pb-4">
    <div>
      <h3 className="text-[18px] mb-3 font-medium">Save my activity logs</h3>
      <p className="text-gray-400 text-sm">
        You can save all your activity logs including unusual activity detected
      </p>
    </div>

    {/* toggle will sit directly to the right of the text with `gap-4` spacing */}
    <div className=" self-center">
      <Toggle enabled={saveLogs} onChange={() => setSaveLogs(!saveLogs)} />
    </div>
  </div>
</div>

      {/* Change Password */}
      <div className="bg-black border-b border-[#3C3C3C] pb-4 flex justify-between items-start mb-4">
  {/* Left content */}
  <div>
    <h3 className="font-medium text-[18px]">Change password</h3>
    <p className="text-[16px] text-white mt-2">
      Set a unique password to protect your account
    </p>
  </div>

  {/* Right content */}
  <div className="flex flex-col items-end">
    <button className="bg-[#0EFF7B] text-black px-4 py-2 rounded-full font-medium">
      Change Password
    </button>
    <p className="text-[12px] text-[#A0A0A0] mt-2">Last changed: Mar 2, 2025</p>
  </div>
</div>

      {/* 2FA */}
      <div className="border-b border-[#3C3C3C] pb-4 flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-[18px] flex items-center gap-2">
            2 Factor Auth{" "}
            <span className="bg-[#0EFF7B33] text-[#0EFF7B] px-2 py-0.5 text-xs rounded-full">
              Enable
            </span>
          </h3>
          <p className="min-w-[400px] text-white text-[16px] mt-2">
            Secure your account with 2FA security. when it is activated you will need to enter not only your password, but also a special code using app. you will receive this code by in mobile app.
          </p>
        </div>
        <button
          onClick={() => setTwoFactorAuth(!twoFactorAuth)}
          className="bg-[#0EFF7B] text-black px-4 py-2 rounded-full font-medium"
        >
          {twoFactorAuth ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Login Alerts */}
      <div className="border-b border-[#3C3C3C]  pb-4 flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium text-[18px]">Turn on login alerts</h3>
          <p className="text-white text-[16px] mt-2">
            Be notified if anyone logs in from unknown or new devices
          </p>
        </div>
        <button
          onClick={() => setLoginAlerts(!loginAlerts)}
          className="bg-[#0EFF7B] text-black px-4 py-2 rounded-full font-medium"
        >
          {loginAlerts ? "Disable" : "Enable"}
        </button>
      </div>

      {/* Access & Permissions */}
      <div className=" pb-4 mt-6">
        <h3 className="font-medium mb-2">Access & Permissions</h3>
        <p className="text-gray-400 text-sm mb-6">
          Manage role-based access with permission controls
        </p>

        {/* Permissions Table */}
<div className="w-full ml-6 overflow-x-auto">
  <table className="w-full border-collapse text-center table-fixed">
    <thead>
      <tr className="text-[18px] text-[#FFFFFF]">
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
        <tr key={key}>
          <td className="p-2 break-words">{label}</td>
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
