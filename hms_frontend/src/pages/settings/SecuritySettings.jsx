import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axiosConfig";
import { PermissionContext } from "../../components/PermissionContext";

const SecuritySettings = ({ data, onUpdate }) => {
  const { currentUser, hasPermission, refreshPermissions } =
    useContext(PermissionContext);

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [initialized, setInitialized] = useState(false);

  // ✅ Each main module maps to ALL its sub-permission keys (matching sidebar structure exactly)
  const modules = [
    {
      label: "Dashboard",
      keys: ["dashboard"],
    },
    {
      label: "Appointments",
      keys: ["appointments"],
    },
    {
      label: "Patients",
      keys: [
        "patients_create",
        "patients_view",
        "patients_edit",
        "patients_profile",
        "treatment_charges",
        "surgeries",
      ],
    },
    {
      label: "Administration",
      keys: [
        "departments",
        "room_management",
        "bed_management",
      ],
    },
    {
      label: "Pharmacy",
      keys: [
        "pharmacy_inventory",
        "pharmacy_billing",
      ],
    },
    {
      label: "Doctors / Nurse",
      keys: [
        "doctors_manage",
        "medicine_allocation",
      ],
    },
    {
      label: "Clinical Resources",
      keys: [
        "lab_reports",
        "laboratory_manage",
        "blood_bank",
        "ambulance",
      ],
    },
    {
      label: "Billing Management",
      keys: [
        "billing",
        "charges_management",
      ],
    },
    {
      label: "Settings",
      keys: [
        "settings_access",
        "settings_hospital",
        "settings_security",
        "settings_general",
      ],
    },
    {
      label: "Accounts",
      keys: [
        "user_settings",
        "security_settings",
        "create_user",
      ],
    },
  ];

  const canEdit =
    hasPermission("security_settings") ||
    currentUser?.role?.toLowerCase() === "admin" ||
    currentUser?.is_superuser;

  useEffect(() => {
    if (!initialized) initializeData();
  }, [initialized]);

  const initializeData = async () => {
    try {
      await fetchRoles();
      await fetchAllPermissions();
      setInitialized(true);
    } catch (error) {
      toast.error("Failed to load security settings");
    }
  };

  const fetchRoles = async () => {
    const availableRoles = [
      "receptionist",
      "doctor",
      "nurse",
      "Billing Staff",
      "staff",
    ];
    setRoles(availableRoles);
    return availableRoles;
  };

  // Flatten all keys across all modules
  const allKeys = modules.flatMap((m) => m.keys);

  const fetchAllPermissions = async () => {
    try {
      const allPermissions = {};
      const availableRoles = await fetchRoles();

      availableRoles.forEach((role) => {
        allPermissions[role] = {};
        allKeys.forEach((key) => (allPermissions[role][key] = false));
      });

      for (const role of availableRoles) {
        try {
          const response = await api.get(`/security/permissions/${role}`);
          response.data.forEach((perm) => {
            if (allPermissions[role]?.hasOwnProperty(perm.module)) {
              allPermissions[role][perm.module] = perm.enabled;
            }
          });
        } catch (error) {
          if (error.response?.status !== 404) console.error(error);
        }
      }

      setPermissions(allPermissions);
    } catch (error) {
      toast.error("Failed to load permissions");
    }
  };

  // ✅ All sub-keys enabled → true
  const isModuleEnabled = (role, keys) =>
    keys.every((key) => permissions[role]?.[key] === true);

  // ✅ Some but not all sub-keys enabled → partial/indeterminate
  const isModulePartial = (role, keys) => {
    const count = keys.filter((key) => permissions[role]?.[key] === true).length;
    return count > 0 && count < keys.length;
  };

  // ✅ Toggle ALL sub-keys of a module at once
  const toggleModule = async (role, keys, currentlyAllEnabled) => {
    if (!canEdit) {
      toast.info("You have read-only access to security settings.");
      return;
    }

    try {
      setLoading(true);
      const targetEnabled = !currentlyAllEnabled;

      // Only send API calls for keys that actually need to change state
      const keysToToggle = keys.filter(
        (key) => (permissions[role]?.[key] === true) !== targetEnabled
      );

      await Promise.all(
        keysToToggle.map((key) => {
          const formData = new FormData();
          formData.append("role", role);
          formData.append("module", key);
          return api.post("/security/permissions/toggle", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        })
      );

      // Update local state for all keys in this module
      setPermissions((prev) => {
        const updated = { ...prev, [role]: { ...prev[role] } };
        keys.forEach((key) => {
          updated[role][key] = targetEnabled;
        });
        return updated;
      });

      refreshPermissions?.();
      toast.success(
        `${targetEnabled ? "Enabled" : "Disabled"} all sub-permissions for ${role}`
      );
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  // Toggle renders 3 visual states: all on / partial / all off
  const Toggle = ({ enabled, partial = false, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled || !canEdit}
      title={
        partial
          ? "Some sub-permissions enabled — click to enable all"
          : enabled
          ? "All enabled — click to disable all"
          : "All disabled — click to enable all"
      }
      className={`relative inline-flex border-[1px] border-gray-300 dark:border-[#0EFF7B4D]
        w-[48px] h-[24px] items-center rounded-full transition shadow-[0px_0px_4px_0px_#0EFF7B]
        ${
          enabled
            ? "bg-[#0EFF7B] dark:bg-[#0EFF7B1A]"
            : partial
            ? "bg-[#0EFF7B66] dark:bg-[#0EFF7B0D]"
            : "bg-gray-200 dark:bg-[#0D0D0D]"
        }
        ${disabled || !canEdit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full transition
          ${
            enabled
              ? "translate-x-[24px] bg-white"
              : partial
              ? "translate-x-[13px] bg-white"
              : "translate-x-[3px] bg-gray-100 dark:bg-gray-100"
          }`}
      />
    </button>
  );

  const formatRoleName = (role) => {
    if (role === "Billing Staff") return "Billing Staff";
    if (role === "staff") return "Staff";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-[#0EFF7B]">
            Loading Security Settings...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Access & Permissions
          </h3>
          {!canEdit && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Read-only view
            </p>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          Toggling a module enables or disables{" "}
          <strong className="text-gray-700 dark:text-gray-300">
            all its sub-permissions
          </strong>{" "}
          for that role.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mb-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <span className="inline-block w-8 h-4 rounded-full bg-[#0EFF7B]"></span>
            All enabled
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-8 h-4 rounded-full bg-[#0EFF7B66]"></span>
            Partially enabled
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-8 h-4 rounded-full bg-gray-200 dark:bg-[#0D0D0D] border border-gray-300 dark:border-[#0EFF7B4D]"></span>
            All disabled
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#1E1E1E]">
          <table className="min-w-full bg-white dark:bg-[#111111]">
            <thead className="bg-gray-50 dark:bg-[#1A1A1A]">
              <tr className="text-black dark:text-[#0EFF7B]">
                <th className="p-4 text-left font-medium w-[180px]">Module</th>
                {/* <th className="p-4 text-left font-medium text-xs text-gray-400 dark:text-gray-500">
                  Sub-permissions included
                </th> */}
                {roles.map((role) => (
                  <th key={role} className="p-4 text-center font-medium whitespace-nowrap">
                    {formatRoleName(role)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map(({ label, keys }) => (
                <tr
                  key={label}
                  className="border-t border-gray-200 dark:border-[#1E1E1E] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  {/* Module name */}
                  <td className="p-4 text-gray-800 dark:text-gray-200 font-semibold align-top">
                    {label}
                  </td>

                  {/* Sub-permission tags */}
                  {/* <td className="p-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {keys.map((key) => (
                        <span
                          key={key}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1E1E1E] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#2A2A2A]"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  </td> */}

                  {/* Toggle per role */}
                  {roles.map((role) => {
                    const allEnabled = isModuleEnabled(role, keys);
                    const partial = isModulePartial(role, keys);
                    return (
                      <td key={role} className="p-4 text-center align-top">
                        <Toggle
                          enabled={allEnabled}
                          partial={partial}
                          onChange={() => toggleModule(role, keys, allEnabled)}
                          disabled={loading}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permission Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">
            Permission Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {roles.map((role) => {
              const fullCount = modules.filter(({ keys }) =>
                isModuleEnabled(role, keys)
              ).length;
              const partialCount = modules.filter(({ keys }) =>
                isModulePartial(role, keys)
              ).length;
              return (
                <div key={role} className="text-center">
                  <div className="font-medium text-[#08994A] dark:text-[#0EFF7B]">
                    {formatRoleName(role)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {fullCount} / {modules.length} full
                  </div>
                  {partialCount > 0 && (
                    <div className="text-xs text-yellow-500 dark:text-yellow-400">
                      {partialCount} partial
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;