import React, { useState } from "react";
import PatientRecord from "./PatientRecord";
import SurgeryRecord from "./SurgeryRecord";
import RevenueSummary from "./RevenueSummary";
import Reports from "./Reports";
import Statistics from "./Statistics";
import Employee from "./Employee";

const DashboardComponents = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Patient Record");

  return (
    <div className="relative">
      {/* Main Container with exact dimensions and overflow control */}
      <div 
        className="bg-[#0D0D0D] ml-[-105px] mt-[5px] flex-1 pt-2 text-white"
        style={{
          width: '1089px',
          height: '905px',
          overflow: 'hidden' // This prevents both horizontal and vertical scrolling
        }}
      >
        {/* Top Navigation Bar */}
        <div className="bg-black mt-[-8px] flex gap-[97px] text-[20px] mb-6 overflow-x-hidden">
          {["Dashboard", "Reports", "Statistics", "Employee"].map((tab) => (
            <button
              key={tab}
              className={`text-left py-2 px-4 ${
                activeTab === tab 
                  ? "bg-[#0D0D0D] w-[266px]" 
                  : "bg-black text-left w-[266px]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub-Navigation Bar (Only for Dashboard) */}
        {activeTab === "Dashboard" && (
          <div className="w-[1005px] flex gap-[24px] pl-[70px] text-[20px] mb-6 overflow-x-hidden">
            {["Patient Record", "Surgery Record", "Revenue Summary"].map((subTab) => (
              <button
                key={subTab}
                className={`w-[319px] h-[37px] text-[14px] px-5  rounded-[20px] border ${
                  activeSubTab === subTab
                    ? "bg-[linear-gradient(94.31deg,#0EFF7B_17.81%,#08994A_73.63%)] border-[#0EFF7B4D] text-black"
                    : "bg-[#0D0D0D] border-[#3C3C3C] "
                }`}
                onClick={() => setActiveSubTab(subTab)}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ height: 'calc(905px - 120px)' }}>
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
    </div>
  );
};

export default DashboardComponents;