import { useState, useEffect } from "react";
import { Building2, Shield, Save, RefreshCw, ChevronRight } from "lucide-react";
import HospitalInfo from "./HospitalInfo";
import SecuritySettings from "./SecuritySettings";
import api from "../../utils/axiosConfig";
import { successToast, errorToast } from "../../components/Toast.jsx";

const menuItems = [
  {
    id: "hospital",
    label: "Hospital Information",
    icon: Building2,
    component: HospitalInfo,
  },
  {
    id: "security",
    label: "Security Settings",
    icon: Shield,
    component: SecuritySettings,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [settingsData, setSettingsData] = useState({
    hospital: {},
    security: {},
  });
  const [loading, setLoading] = useState(true);
  const [saveAllLoading, setSaveAllLoading] = useState(false);

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/all");
      console.log("Settings data received:", response.data);
      setSettingsData({
        hospital: response.data.hospital || {},
        security: response.data.security || {},
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      errorToast("Failed to load settings. Please try again.");

      // Set default data if API fails
      setSettingsData({
        hospital: {},
        security: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaveAllLoading(true);
      let hasChanges = false;

      // Save hospital info
      if (
        settingsData.hospital &&
        Object.keys(settingsData.hospital).length > 0
      ) {
        const hospitalUpdate = {
          hospital_name: settingsData.hospital.hospital_name || "",
          address: settingsData.hospital.address || "",
          phone: settingsData.hospital.phone || "",
          email: settingsData.hospital.email || "",
          gstin: settingsData.hospital.gstin || "",
          emergency_contact: settingsData.hospital.emergency_contact || "",
          website: settingsData.hospital.website || "",
          tagline: settingsData.hospital.tagline || "",
          established_year: settingsData.hospital.established_year || null,
          registration_number: settingsData.hospital.registration_number || "",
          working_hours: settingsData.hospital.working_hours || {},
        };

        console.log("Saving hospital data:", hospitalUpdate);
        await api.put("/hospital", hospitalUpdate);
        hasChanges = true;
      }

      // Save security settings (only if needed for your API structure)
      // Removed security settings save since we're only doing permissions now

      if (hasChanges) {
        successToast("All settings saved successfully!");
        fetchAllSettings(); // Refresh data
      } else {
        successToast("No changes to save.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      errorToast("Failed to save settings. Please try again.");
    } finally {
      setSaveAllLoading(false);
    }
  };

  const updateSettings = (type, data) => {
    setSettingsData((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...data },
    }));
  };

  const ActiveComponent = menuItems.find(
    (item) => item.id === activeTab,
  )?.component;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] p-4">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E1E1E] mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white shadow-[0px_2px_8px_0px_#0EFF7B40]"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={fetchAllSettings}
              className="flex items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              title="Refresh settings"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="text-[#0EFF7B]">
  Version - {import.meta.env.VITE_APP_VERSION}
</span>
            <ChevronRight size={16} />
            <span>Settings</span>
            <ChevronRight size={16} />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E1E1E] p-6 mb-6">
          {ActiveComponent && (
            <ActiveComponent
              data={settingsData[activeTab] || {}}
              onUpdate={(data) => updateSettings(activeTab, data)}
            />
          )}
        </div>

        {/* Save Button - Only show for hospital tab */}
        {activeTab === "hospital" && (
          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={saveAllLoading || loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span className="font-medium">
                {saveAllLoading ? "Saving..." : "Save All Changes"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
