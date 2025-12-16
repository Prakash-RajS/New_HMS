import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { PermissionContext } from "../../components/PermissionContext";

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, hasPermission, refreshPermissions } =
    useContext(PermissionContext);

  // States
  const [saveLogs, setSaveLogs] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [initialized, setInitialized] = useState(false);


    const backendUrl =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000"
    : "http://localhost:8000";

  // Create axios instance with direct URL
  const api = axios.create({
  baseURL: backendUrl,
});

  // Add interceptors
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // All available modules matching our Permission model
  const modules = [
    // Dashboard
    { key: "dashboard", label: "View Dashboard" },

    // Appointments
    { key: "appointments", label: "Manage Appointments" },

    // Patients
    { key: "patients_view", label: "View Patients" },
    { key: "patients_create", label: "Create Patients" },
    { key: "patients_edit", label: "Edit Patients" },
    { key: "patients_profile", label: "Patient Profile" },

    // Administration
    { key: "departments", label: "Manage Departments" },
    { key: "room_management", label: "Room Management" },
    { key: "bed_management", label: "Bed Management" },
    { key: "staff_management", label: "Staff Management" },

    // Pharmacy
    { key: "pharmacy_inventory", label: "Pharmacy Inventory" },
    { key: "pharmacy_billing", label: "Pharmacy Billing" },

    // Doctors & Nurses
    { key: "doctors_manage", label: "Manage Doctors/Nurses" },
    { key: "medicine_allocation", label: "Medicine Allocation" },

    // Clinical Resources
    { key: "lab_reports", label: "Laboratory Reports" },
    { key: "blood_bank", label: "Blood Bank" },
    { key: "ambulance", label: "Ambulance Management" },

    // Billing
    { key: "billing", label: "Billing Management" },

    // Accounts
    { key: "user_settings", label: "User Settings" },
    { key: "security_settings", label: "Security Settings" },

    // User Management
    { key: "create_user", label: "Create User Accounts" },
  ];

  // Check if current user has permission to manage security settings
  const canManagePermissions =
    hasPermission("security_settings") ||
    currentUser?.role === "admin" ||
    currentUser?.is_superuser;

  // Initialize data
  useEffect(() => {
    if (canManagePermissions && !initialized) {
      initializeData();
    }
  }, [canManagePermissions, initialized]);

  const initializeData = async () => {
    try {
      await fetchRoles();
      await fetchAllPermissions();
      await fetchSecuritySettings();
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing data:", error);
      toast.error("Failed to load security settings");
    }
  };

  const fetchSecuritySettings = async () => {
    try {
      const response = await api.get("/security/settings");
      setSaveLogs(response.data.save_logs);
      setTwoFactorAuth(response.data.two_factor_auth);
      setLoginAlerts(response.data.login_alerts);
    } catch (error) {
      console.error("Error fetching security settings:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const availableRoles = [
        "receptionist",
        "doctor",
        "nurse",
        "billing",
        "admin",
      ];
      setRoles(availableRoles);
      return availableRoles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const allPermissions = {};
      const availableRoles = [
        "receptionist",
        "doctor",
        "nurse",
        "billing",
        "admin",
      ];

      // Initialize all permissions as false first
      availableRoles.forEach((role) => {
        allPermissions[role] = {};
        modules.forEach((module) => {
          allPermissions[role][module.key] = false;
        });
      });

      // Fetch permissions for each role
      for (const role of availableRoles) {
        try {
          console.log(`🔄 Fetching permissions for role: ${role}`);
          const response = await api.get(`/security/permissions/${role}`);
          console.log(`✅ Permissions for ${role}:`, response.data);

          // Update permissions for this role
          response.data.forEach((perm) => {
            if (allPermissions[role] && perm.module in allPermissions[role]) {
              allPermissions[role][perm.module] = perm.enabled;
            }
          });
        } catch (error) {
          console.error(`❌ Error fetching permissions for ${role}:`, error);
          // Continue with other roles even if one fails
        }
      }

      setPermissions(allPermissions);
      console.log("✅ All permissions loaded:", allPermissions);
    } catch (error) {
      console.error("Error fetching all permissions:", error);
      toast.error("Failed to load permissions");
      throw error;
    }
  };

  const togglePermission = async (role, module) => {
    try {
      setLoading(true);

      console.log(`🔄 Toggling permission: ${role} - ${module}`);

      // Use FormData instead of URLSearchParams for better compatibility
      const formData = new FormData();
      formData.append("role", role);
      formData.append("module", module);

      const response = await api.post(
        "/security/permissions/toggle",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Toggle response:", response.data);

      // Update local state with new permission status
      setPermissions((prev) => ({
        ...prev,
        [role]: {
          ...prev[role],
          [module]: response.data.enabled,
        },
      }));

      // Refresh permissions in context to update sidebar immediately
      if (refreshPermissions) {
        refreshPermissions();
      }

      toast.success(
        `Permission ${
          response.data.enabled ? "enabled" : "disabled"
        } successfully for ${role}`
      );
    } catch (error) {
      console.error("❌ Error toggling permission:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        `Failed to update permission: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      setLoading(true);

      // Create FormData for security settings
      const formData = new FormData();
      formData.append("save_logs", saveLogs.toString());
      formData.append("two_factor_auth", twoFactorAuth.toString());
      formData.append("login_alerts", loginAlerts.toString());

      // Update security settings
      await api.put("/security/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Security settings updated successfully");
    } catch (error) {
      console.error("Error updating security settings:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Failed to update security settings");
    } finally {
      setLoading(false);
    }
  };

  // Toggle switch component
  const Toggle = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex border-[1px] border-gray-300 dark:border-[#0EFF7B4D] 
        w-[48px] h-[24px] items-center rounded-full transition shadow-[0px_0px_4px_0px_#0EFF7B]
        ${
          enabled
            ? "bg-[#0EFF7B] dark:bg-[#0EFF7B1A]"
            : "bg-gray-200 dark:bg-[#0D0D0D]"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-gray-100 dark:bg-white transition 
          ${enabled ? "translate-x-[24px]" : "translate-x-[3px]"}`}
      />
    </button>
  );

  // If user doesn't have permission to manage security settings
  if (!canManagePermissions) {
    return (
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-8 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access security settings.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#08994A] text-white rounded-full hover:bg-[#0cd968] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!initialized) {
    return (
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-8 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#0EFF7B]">
            Loading Security Settings...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load your security settings.
          </p>
        </div>
      </div>
    );
  }

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
          borderRadius: "10px",
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
      {/* ... (keep all your existing JSX structure the same) ... */}

      {/* Access & Permissions Table */}
      <div className="pb-4 mt-6 relative z-10">
        <h3 className="font-medium mb-2 text-black dark:text-white">
          Access & Permissions
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Manage role-based access with permission controls
        </p>

        {/* Permissions Table with columns for each role */}
        <div className="min-w-[1000px] ml-2 rounded-[8px] overflow-x-auto">
          <table className="min-w-[1000px] bg-white dark:bg-[#0EFF7B1A] border-collapse text-center table-fixed">
            <thead className="h-[62px]">
              <tr className="text-[18px] text-black dark:text-[#0EFF7B]">
                <th className="p-2 w-1/5">Modules</th>
                <th className="p-2 w-1/5">Receptionist</th>
                <th className="p-2 w-1/5">Doctor</th>
                <th className="p-2 w-1/5">Nurse</th>
                <th className="p-2 w-1/5">Billing Staff</th>
                <th className="p-2 w-1/5">Admin</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(({ key, label }) => (
                <tr
                  key={key}
                  className=" h-[52px] border-b border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-[#0EFF7B0D] transition"
                >
                  <td className="p-2 break-words text-black dark:text-white">
                    {label}
                  </td>
                  {["receptionist", "doctor", "nurse", "billing", "admin"].map(
                    (role) => (
                      <td key={role} className="p-2">
                        <Toggle
                          enabled={permissions[role]?.[key] || false}
                          onChange={() => togglePermission(role, key)}
                          disabled={loading}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permission Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-lg">
          <h4 className="font-medium text-black dark:text-white mb-2">
            Permission Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            {["receptionist", "doctor", "nurse", "billing", "admin"].map(
              (role) => {
                const enabledCount = modules.filter(
                  (module) => permissions[role]?.[module.key]
                ).length;
                return (
                  <div key={role} className="text-center">
                    <span className="font-medium text-[#08994A] dark:text-[#0EFF7B]">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <div className="text-gray-600 dark:text-gray-400">
                      {enabledCount} / {modules.length} enabled
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
