import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const DashboardComponents = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Patient Record");
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  const periods = ["Last Week", "This Month", "Last Month"];

  return (
    <div className="relative">
      {/* Main Container with exact dimensions and overflow control */}
      <div
        className="flex-1 min-h-[750px] bg-white dark:bg-black mt-[70px] mb-4 pt-2 text-black dark:text-white rounded-[12px]"
        style={{
          width: "100%",
          maxWidth: "2140px",
        }}
      >
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

        {/* Below the tab header */}
        <div className="text-[20px] font-medium mt-4 mb-6 text-black dark:text-white font-helvetica">
          Overall Records
        </div>

        {/* Content with Sub-Navigation and Grid */}
        <div className="h-[306px] rounded-[12px]">
          {activeTab === "Dashboard" && (
            <div
              className="p-[26px_16px] rounded-[8px] relative bg-gradient-to-b from-[rgba(3,56,27,0.25)] to-[rgba(15,15,15,0.25)] backdrop-blur-[4px]"
              style={{
                minWidth: "1092px",
                boxShadow: "0px 0px 4px 0px #FFFFFF1F",
                position: "relative",
                border: "1px solid transparent",
              }}
            >
              {/* Gradient Border */}
              <div
                style={{
                  position: "absolute",
                  inset: "-1px",
                  borderRadius: "8px",
                  padding: "1px",
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
              <div className="max-w-[1005px] flex gap-[24px] pl-[70px] text-[20px] mb-6 overflow-x-hidden">
                {["Patient Record", "Surgery Record", "Revenue Summary"].map(
                  (subTab) => (
                    <button
                      key={subTab}
                      className={`flex-1 max-w-[319px] h-[37px] text-[14px] px-5 rounded-[8px] font-helvetica ${
                        activeSubTab === subTab
                          ? "bg-[#08994A] dark:bg-[#0EFF7B14] text-white dark:text-white"
                          : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
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
              <div style={{ minHeight: "193px" }}>
                {activeSubTab === "Patient Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Total Patients
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Active Patients Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Active Patients
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Admissions Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Admissions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Priority Care Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Priority Care
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubTab === "Surgery Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Total Patients
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Active Patients Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Active Patients
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Admissions Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Admissions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Priority Care Card */}
                    <div className="bg-[#0EFF7B0D] p-5 rounded-lg hover:scale-105 transition-transform">
                      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                        Priority Care
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        +12 this week ↑
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">
                          124K
                        </span>
                      </div>
                      <p className="text-sm text-[#08994A] dark:text-[#0EFF7B] underline mt-2">
                        View details
                      </p>
                      <div className="relative w-full mt-4">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 text-white text-sm rounded-[8px] text-center w-full appearance-none"
                          style={{
                            background:
                              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                            borderBottom: "2px solid #0EFF7B",
                            boxShadow: "0px 2px 12px 0px #00000040",
                            cursor: "pointer",
                            paddingRight: "30px", // space for arrow
                          }}
                        >
                          <option value="This Week">This Week</option>
                          {periods.map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <span
                          className="absolute right-10 top-1/4  transform -translate-y-1/2 pointer-events-none"
                          style={{
                            width: "12px",
                            height: "12px",
                            borderLeft: "2px solid white",
                            borderBottom: "2px solid white",
                            transform: "rotate(-45deg)",
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Additional Content Below */}
  <div className="flex mt-[70px] gap-6 flex-wrap justify-between" style={{ minWidth: "892px" }}>
  {/* Left Column */}
  <div className="flex flex-col gap-6">

    {/* Emergency Cases */}
    <div
      className="rounded-[20px] p-5 w-[619px] h-[178px] text-white hover:scale-105 transition-transform"
      style={{
        background:
          "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
        border: "1px solid",
        borderImageSource:
          "linear-gradient(132.3deg, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 49.68%, rgba(14,255,123,0.7) 99.36%)",
        backdropFilter: "blur(4px)",
        boxShadow: "0px 0px 4px 0px #FFFFFF1F",
      }}
    >
      <h3 className="text-xl font-semibold mb-3">Emergency Cases</h3>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-[#0EFF7B]">42</span>
      </div>
      <button className="mt-4 px-4 py-2 text-[#0EFF7B] text-sm rounded-full border border-[#0EFF7B66] hover:bg-[#0EFF7B33]">
        View details
      </button>
    </div>

    {/* Consultation */}
    <div
      className="rounded-[20px] p-5 w-[619px] h-[338px] text-white relative hover:scale-105 transition-transform"
      style={{
        background:
          "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
        border: "1px solid",
        borderImageSource:
          "linear-gradient(132.3deg, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 49.68%, rgba(14,255,123,0.7) 99.36%)",
        backdropFilter: "blur(4px)",
        boxShadow: "0px 0px 4px 0px #FFFFFF1F",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">Consultation</h3>
        <span className="text-sm text-[#0EFF7B]">Today ↑</span>
      </div>

      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-[#0EFF7B]">3,570</span>
        <span className="text-xs text-gray-400 ml-2">+220</span>
      </div>

      <p className="text-sm text-gray-400 mt-2">Average consultation per doctor</p>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#0EFF7B" }}></span>General Physician</li>
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#089648" }}></span>Dermatology</li>
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#5CD592" }}></span>Orthopedics</li>
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#3E614E" }}></span>Pediatrics</li>
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#6A8F7B" }}></span>Cardiology</li>
        <li className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#B6DEC8" }}></span>Neurology</li>
      </ul>

      {/* Circular Progress inside Consultation */}
      <div className="absolute top-5 right-5 group">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-700 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className="text-[#0EFF7B] stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="calc(251.2 - (251.2 * 70) / 100)"
            ></circle>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[#0EFF7B] text-xs">
            70%
          </div>
        </div>

        {/* Hover popup */}
        <div className="hidden group-hover:block absolute right-0 top-28 bg-[#0EFF7B33] border border-[#0EFF7B] text-[#0EFF7B] text-xs px-3 py-1 rounded-lg shadow-lg backdrop-blur-md">
          Today’s consultations increased by 15%
        </div>
      </div>
    </div>
  </div>

  {/* Right Column - Notifications */}
  <div
    className="rounded-[20px] p-5 w-[446px] h-[536px] text-white hover:scale-105 transition-transform"
    style={{
      background:
        "linear-gradient(180deg, rgba(3,56,27,0.5) 0%, rgba(15,15,15,0.5) 48.97%)",
      border: "1px solid",
      borderImageSource:
        "linear-gradient(132.3deg, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 49.68%, rgba(14,255,123,0.7) 99.36%)",
      backdropFilter: "blur(4px)",
    }}
  >
    <h3 className="text-xl font-semibold mb-3">Notifications & Alerts</h3>
    <ul className="text-sm space-y-3">
      <li className="flex items-center"><span className="text-[#0EFF7B] mr-2">🔔</span>4 new patients admitted from cardiology</li>
      <li className="flex items-center"><span className="text-[#FF4444] mr-2">🔔</span>2 emergency cases reported</li>
      <li className="flex items-center"><span className="text-[#0EFF7B] mr-2">🔔</span>3 patients discharged successfully</li>
      <li className="flex items-center"><span className="text-[#FF4444] mr-2">🔔</span>1 operation delayed due to equipment</li>
      <li className="flex items-center"><span className="text-[#0EFF7B] mr-2">🔔</span>All systems running normally</li>
    </ul>
    <button className="mt-6 px-4 py-2 text-[#0EFF7B] text-sm rounded-full border border-[#0EFF7B66] hover:bg-[#0EFF7B33]">
      View all
    </button>
  </div>
</div>

      </div>
      <Outlet />
    </div>
  );
};

export default DashboardComponents;
