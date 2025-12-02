import React, { useState, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { useWebSocket } from "../../components/WebSocketContext";
import { ThemeContext } from "../../components/ThemeContext";

const DashboardComponents = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Patient Record");
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { theme } = useContext(ThemeContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected } =
    useWebSocket();

  const periods = ["Last Week", "This Week", "This Month", "Last Month"];

  // Safe data access helper
  const getSafeData = (path, defaultValue = 0) => {
    if (!dashboardData) return defaultValue;

    const keys = path.split(".");
    let value = dashboardData;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:8000/api/dashboard/stats");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      // Set empty data structure to prevent crashes
      setDashboardData({
        patient_stats: {
          total_patients: 0,
          active_patients: 0,
          weekly_admissions: 0,
          priority_care: 0,
          today_admissions: 0,
        },
        appointment_stats: {
          total_appointments: 0,
          today_appointments: 0,
          emergency_cases: 0,
          consultation_today: 0,
        },
        financial_stats: {
          total_revenue: 0,
          today_revenue: 0,
          pharmacy_revenue_today: 0,
          outstanding_payments: 0,
        },
        department_distribution: [],
      });
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/dashboard/recent-activities"
      );

      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data);
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]);
    }
  };

  // Test connection on mount
  const testConnection = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/dashboard/test-connection"
      );
      if (response.ok) {
        console.log("Dashboard API connection successful");
      }
    } catch (error) {
      console.error("Dashboard API connection failed:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await testConnection();
      await fetchDashboardData();
      await fetchRecentActivities();
      setLoading(false);
    };

    initializeData();
  }, []);

  // Set up real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchDashboardData();
        fetchRecentActivities();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading]);

  // Notification functions
  const getNotificationColor = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (timestamp) => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInMinutes = Math.floor((now - time) / (1000 * 60));
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return "Recently";
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
  };

  // Loading skeleton
  if (loading && !dashboardData) {
    return (
      <div className="mt-[80px] mb-4 bg-white dark:bg-black rounded-xl p-6 w-full max-w-[1400px] mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <style>
        {`
          select option {
            background-color: #0C1A12;
            color: white;
            padding: 8px;
          }
          select option:hover {
            background-color: #08994A;
          }
          select option:checked {
            background-color: #0EFF7B;
            color: black;
          }
        `}
      </style>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchDashboardData}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-visible relative">
        {/* Gradient Background */}
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

        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-black mt-[-8px] flex gap-[97px] text-[14px] mb-2 overflow-x-hidden font-helvetica">
          {["Dashboard"].map((tab) => (
            <div
              key={tab}
              className={`flex-1 max-w-[266px] text-left py-2 ${
                activeTab === tab
                  ? "text-[#0EFF7B]"
                  : "text-black dark:text-white"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Header with Last Updated */}
        {/* <div className="flex justify-between items-center mb-6">
          <div className="text-[20px] font-medium text-black dark:text-white font-helvetica">
            Overall Records
          </div>
          {lastUpdated && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
              {!isConnected && (
                <span className="ml-2 text-yellow-500">(Offline)</span>
              )}
            </div>
          )}
        </div> */}

        {/* Content with Sub-Navigation and Grid */}
        <div className="min-h-[306px] rounded-[12px] overflow-visible">
          {activeTab === "Dashboard" && (
            <div className="relative p-[26px_16px] rounded-[8px] min-w-[972px] shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible">
              {/* Dark mode gradient */}
              <div
                className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
                  zIndex: 0,
                }}
              ></div>

              {/* Gradient Border */}
              <div
                style={{
                  position: "absolute",
                  inset: "-1px",
                  borderRadius: "8px",
                  padding: "2px",
                  background:
                    "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  pointerEvents: "none",
                }}
              ></div>

              {/* Sub-Navigation Bar */}
              <div className="min-w-[975px] flex gap-[24px] pl-[17px] text-[20px] mb-6 overflow-x-hidden">
                {["Patient Record", "Surgery Record", "Revenue Summary"].map(
                  (subTab) => (
                    <button
                      key={subTab}
                      className={`flex-1 max-w-[319px] h-[37px] text-[14px] px-5 rounded-[8px] font-helvetica ${
                        activeSubTab === subTab
                          ? "bg-[#08994A] dark:bg-[#0EFF7B14] text-white dark:text-white"
                          : "text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#2A2A2A]"
                      }`}
                      style={{
                        borderBottom: "1px solid transparent",
                        borderImageSlice: 1,
                        borderImageSource:
                          "linear-gradient(90.03deg, #000000 0%, #0EFF7B 49.98%, #000000 99.96%)",
                      }}
                      onClick={() => setActiveSubTab(subTab)}
                    >
                      {subTab}
                    </button>
                  )
                )}
              </div>

              {/* Grid Content */}
              <div
                className="relative overflow-visible"
                style={{ minHeight: "193px" }}
              >
                {activeSubTab === "Patient Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <DashboardCard
                      title="Total Patients"
                      change={`${getSafeData(
                        "patient_stats.today_admissions"
                      )} today ↑`}
                      value={getSafeData(
                        "patient_stats.total_patients"
                      ).toLocaleString()}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Active Patients Card */}
                    <DashboardCard
                      title="Active Patients"
                      change={`${getSafeData(
                        "patient_stats.weekly_admissions"
                      )} this week ↑`}
                      value={getSafeData(
                        "patient_stats.active_patients"
                      ).toLocaleString()}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Admissions Card */}
                    <DashboardCard
                      title="Admissions"
                      change={`${getSafeData(
                        "patient_stats.weekly_admissions"
                      )} this week ↑`}
                      value={getSafeData("patient_stats.weekly_admissions")}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Priority Care Card */}
                    <DashboardCard
                      title="Priority Care"
                      change={`${getSafeData(
                        "appointment_stats.emergency_cases"
                      )} emergencies today`}
                      value={getSafeData("patient_stats.priority_care")}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />
                  </div>
                )}

                {activeSubTab === "Revenue Summary" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Revenue Card */}
                    <DashboardCard
                      title="Total Revenue"
                      change="This month"
                      value={`₹${(
                        getSafeData("financial_stats.total_revenue") / 1000
                      ).toFixed(1)}K`}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Today's Revenue Card */}
                    <DashboardCard
                      title="Today's Revenue"
                      change="+12% from yesterday"
                      value={`₹${getSafeData(
                        "financial_stats.today_revenue"
                      ).toLocaleString()}`}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Pharmacy Revenue Card */}
                    <DashboardCard
                      title="Pharmacy Revenue"
                      change="Today's sales"
                      value={`₹${getSafeData(
                        "financial_stats.pharmacy_revenue_today"
                      ).toLocaleString()}`}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Outstanding Payments Card */}
                    <DashboardCard
                      title="Outstanding"
                      change="Pending payments"
                      value={`₹${(
                        getSafeData("financial_stats.outstanding_payments") /
                        1000
                      ).toFixed(1)}K`}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />
                  </div>
                )}

                {activeSubTab === "Surgery Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Surgeries Card */}
                    <DashboardCard
                      title="Total Surgeries"
                      change="This month"
                      value={getSafeData(
                        "appointment_stats.total_appointments"
                      )}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Today's Surgeries Card */}
                    <DashboardCard
                      title="Today's Surgeries"
                      change="Scheduled procedures"
                      value={getSafeData(
                        "appointment_stats.today_appointments"
                      )}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Emergency Surgeries Card */}
                    <DashboardCard
                      title="Emergency Cases"
                      change="Requiring immediate attention"
                      value={getSafeData("appointment_stats.emergency_cases")}
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />

                    {/* Surgery Success Rate Card */}
                    <DashboardCard
                      title="Success Rate"
                      change="Monthly average"
                      value="98.2%"
                      selectedPeriod={selectedPeriod}
                      setSelectedPeriod={setSelectedPeriod}
                      periods={periods}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Content Below */}
        <div className="flex mt-[70px] gap-6 w-full">
          {/* Left Column - Emergency Cases and Consultation */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <EmergencyCases
              emergencyCases={getSafeData("appointment_stats.emergency_cases")}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <Consultation
              consultationToday={getSafeData(
                "appointment_stats.consultation_today"
              )}
              selectedDate={selectedDate}
              departmentDistribution={getSafeData(
                "department_distribution",
                []
              )}
            />
          </div>

          {/* Right Column - Notifications */}
          <NotificationsPanel
            notifications={notifications}
            unreadCount={unreadCount}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
            formatTime={formatTime}
            getNotificationColor={getNotificationColor}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

// Reusable Dashboard Card Component
const DashboardCard = ({
  title,
  change,
  value,
  selectedPeriod,
  setSelectedPeriod,
  periods,
}) => (
  <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg">
    <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{change}</p>
    <div className="flex items-baseline">
      <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
        {value}
      </span>
    </div>
    <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2 cursor-pointer">
      View details
    </p>
    <PeriodSelector
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      periods={periods}
    />
  </div>
);

// Reusable Components
const PeriodSelector = ({ selectedPeriod, setSelectedPeriod, periods }) => (
  <div className="relative w-full mt-4">
    <Listbox value={selectedPeriod} onChange={setSelectedPeriod}>
      <Listbox.Button
        className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
        style={{
          background:
            "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
          borderBottom: "2px solid #0EFF7B",
          boxShadow: "0px 2px 12px 0px #00000040",
          cursor: "pointer",
          paddingRight: "30px",
        }}
      >
        {selectedPeriod}
        <span
          className="absolute right-6 top-1/4 transform -translate-y-1/2 pointer-events-none"
          style={{
            width: "12px",
            height: "12px",
            borderLeft: "2px solid white",
            borderBottom: "2px solid white",
            transform: "rotate(-45deg)",
          }}
        ></span>
      </Listbox.Button>
      <Listbox.Options
        className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-[#0C1A12] shadow-lg border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white"
        style={{ zIndex: 50 }}
      >
        {periods.map((period) => (
          <Listbox.Option
            key={period}
            value={period}
            className={({
              active,
              selected,
            }) => `cursor-pointer select-none py-2 px-4 text-sm rounded-md
              ${
                active
                  ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white"
                  : "text-black dark:text-white"
              }
              ${
                selected
                  ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium"
                  : ""
              }`}
          >
            {period}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  </div>
);

// ... (Keep the other reusable components: DateSelector, DepartmentList, ConsultationChart, NotificationsPanel)
// These remain the same as in the previous version

const DateSelector = ({ selectedDate, setSelectedDate }) => (
  <div className="relative">
    <Listbox value={selectedDate} onChange={setSelectedDate}>
      <Listbox.Button className="bg-transparent border border-[#0EFF7B80] text-[#0EFF7B] text-sm rounded-md px-2 py-1 outline-none relative text-left pr-8">
        {selectedDate}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <div
            style={{
              width: "8px",
              height: "8px",
              borderLeft: "2px solid #0EFF7B",
              borderBottom: "2px solid #0EFF7B",
              transform: "rotate(-45deg)",
            }}
          ></div>
        </span>
      </Listbox.Button>
      <Listbox.Options
        className="absolute mt-1 w-full overflow-auto rounded-md bg-white dark:bg-[#0C1A12] shadow-lg border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white"
        style={{ zIndex: 50 }}
      >
        {[...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <Listbox.Option
              key={dateStr}
              value={dateStr}
              className={({
                active,
                selected,
              }) => `cursor-pointer select-none py-2 px-4 text-sm
                ${
                  active
                    ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white"
                    : "text-black dark:text-white"
                }
                ${
                  selected
                    ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium"
                    : ""
                }`}
            >
              {dateStr}
            </Listbox.Option>
          );
        })}
      </Listbox.Options>
    </Listbox>
  </div>
);

const EmergencyCases = ({ emergencyCases, selectedDate, setSelectedDate }) => (
  <div className="relative rounded-[20px] p-5 w-full h-[178px] text-white shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform">
    <div
      className="absolute inset-0 rounded-[20px] pointer-events-none dark:block hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
        zIndex: 0,
      }}
    ></div>

    <div
      style={{
        position: "absolute",
        inset: "-1px",
        borderRadius: "20px",
        padding: "2px",
        background:
          "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    ></div>

    <div className="flex justify-between items-center mb-2">
      <h3 className="text-xl text-black dark:text-white font-semibold">
        Emergency Cases
      </h3>
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>

    <div className="flex flex-col mt-3">
      <span className="text-4xl font-bold text-[#FF4D4D] mb-3">
        {emergencyCases}
      </span>
      <div className="w-full h-[6px] rounded-full bg-[#023D1E] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF4D4D] to-[#0EFF7B] rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(emergencyCases * 2, 100)}%`,
          }}
        ></div>
      </div>
    </div>
  </div>
);

const Consultation = ({
  consultationToday,
  selectedDate,
  departmentDistribution,
}) => {
  const colors = [
    "#0EFF7B",
    "#089648",
    "#5CD592",
    "#3E614E",
    "#6A8F7B",
    "#B6DEC8",
  ];
  const total =
    departmentDistribution.reduce((sum, dept) => sum + (dept.count || 0), 0) ||
    1;

  return (
    <div className="relative rounded-[20px] p-5 w-full h-[338px] text-white shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform">
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "20px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      ></div>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl text-black dark:text-white font-semibold">
          Consultation
        </h3>
        <div className="flex flex-col items-end text-right">
          <span className="text-sm text-[#0EFF7B]">Today ↑</span>
          <span className="text-xs text-gray-400">{selectedDate}</span>
        </div>
      </div>

      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-[#0EFF7B]">
          {consultationToday.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          +{Math.floor(consultationToday * 0.1)}
        </span>
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Average consultation per doctor
      </p>

      <div className="flex mt-5 justify-between items-start relative">
        <ul className="space-y-2 text-sm">
          {departmentDistribution.slice(0, 6).map((dept, index) => (
            <li
              key={dept.department__name || index}
              className="flex text-black dark:text-white items-center"
            >
              <span
                className="min-w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index] }}
              ></span>
              {dept.department__name || `Department ${index + 1}`} (
              {dept.count || 0})
            </li>
          ))}
        </ul>

        <div className="relative min-w-[148px] h-[148px] rotate-[-7deg] flex-shrink-0 group">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1A1A1A"
              strokeWidth="6"
              fill="transparent"
            />
            {departmentDistribution.slice(0, 6).map((dept, index) => {
              const percentage = ((dept.count || 0) / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -departmentDistribution
                .slice(0, index)
                .reduce((sum, d) => sum + ((d.count || 0) / total) * 100, 0);

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={colors[index]}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[#0EFF7B] text-sm font-semibold opacity-80">
            {total}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsPanel = ({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  formatTime,
  getNotificationColor,
}) => (
  <div className="relative rounded-[20px] p-7 w-[406px] h-[536px] text-white shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform flex-shrink-0">
    <div
      className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
        zIndex: 0,
      }}
    ></div>

    <div
      style={{
        position: "absolute",
        inset: "-1px",
        borderRadius: "20px",
        padding: "2px",
        background:
          "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    ></div>

    <div className="relative z-10 flex justify-between items-center mb-6">
      <h3 className="text-xl text-black dark:text-white font-semibold flex items-center">
        <span className="w-8 h-8 bg-[#0EFF7B] rounded-full flex items-center justify-center mr-3">
          <span className="text-black text-sm">🔔</span>
        </span>
        Notifications & Alerts
      </h3>
      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="text-sm text-[#08994A] dark:text-[#0EFF7B] hover:underline font-medium"
        >
          Mark all read
        </button>
      )}
    </div>

    <div
      className="relative z-10 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`bg-[#F8FFFB] dark:bg-[#0A1F14] border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
                !notification.read
                  ? "border-[#0EFF7B33] dark:border-[#0EFF7B33] bg-blue-50 dark:bg-blue-900/20"
                  : "border-[#0EFF7B33] dark:border-[#0EFF7B33]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`min-w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(
                    notification.type
                  )}`}
                ></div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      !notification.read
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs ${
                        notification.type === "error"
                          ? "text-[#FF4444]"
                          : "text-[#08994A] dark:text-[#0EFF7B]"
                      } font-medium`}
                    >
                      {formatTime(notification.timestamp)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        !notification.read
                          ? "bg-[#08994A] text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {!notification.read ? "New" : "Read"}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-2">🔔</span>
          <p className="text-sm">No notifications yet</p>
          <p className="text-xs mt-1">Notifications will appear here</p>
        </div>
      )}
    </div>
  </div>
);

export default DashboardComponents;
