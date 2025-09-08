import React, { useState } from "react";
import PatientRecord from "./PatientRecord";
import SurgeryRecord from "./SurgeryRecord";
import RevenueSummary from "./RevenueSummary";
import Reports from "./Reports";
import Statistics from "./Statistics";
import Employee from "./Employee";
import { Outlet } from "react-router-dom";

const DashboardComponents = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Patient Record");

  return (
    <div className="relative">
      {/* Main Container with exact dimensions and overflow control */}
      <div 
        className="flex-1 h-[750px] bg-white dark:bg-[#0D0D0D] mt-[90px] mb-4 pt-2 text-black dark:text-white rounded-[12px]"
        style={{
          width: "100%",          // Flexible width
          maxWidth: "1440px",
          
        }}
      >
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-black mt-[-8px] flex gap-[97px] text-[20px] mb-6 overflow-x-hidden">
          {["Dashboard", "Reports", "Statistics", "Employee"].map((tab) => (
            <button
              key={tab}
              className={`text-left py-2 px-4 flex-1 max-w-[266px] ${
                activeTab === tab 
                  ? "bg-[#08994A1A] dark:bg-[#0D0D0D] text-black dark:text-[#0EFF7B]" 
                  : "bg-white dark:bg-black text-black dark:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub-Navigation Bar (Only for Dashboard) */}
        {activeTab === "Dashboard" && (
          <div className="max-w-[1005px] flex gap-[24px] pl-[70px] text-[20px] mb-6 overflow-x-hidden">
            {["Patient Record", "Surgery Record", "Revenue Summary"].map((subTab) => (
              <button
                key={subTab}
                className={`flex-1 max-w-[319px] h-[37px] text-[14px] px-5 rounded-[20px] border ${
                  activeSubTab === subTab
                    ? "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A66] dark:border-[#0EFF7B66] text-white dark:text-black"
                    : "bg-white dark:bg-[#0D0D0D] border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                }`}
                onClick={() => setActiveSubTab(subTab)}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {/* <div className="overflow-y-auto" style={{ height: 'calc(905px - 120px)' }}> */}
        <div className="h-auto overflow-y-auto">
          {activeTab === "Dashboard" && (
            <>
              {activeSubTab === "Patient Record" && <PatientRecord />}
              {activeSubTab === "Surgery Record" && <SurgeryRecord />}
              {activeSubTab === "Revenue Summary" && <RevenueSummary />}
            </>
          )}
          {activeTab === "Reports" && <Reports />}
          {activeTab === "Statistics" && <Statistics />}
          {activeTab === "Employee" && <Employee />}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default DashboardComponents;