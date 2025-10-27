import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Listbox } from "@headlessui/react";

const DashboardComponents = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSubTab, setActiveSubTab] = useState("Patient Record");
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [selectedDate, setSelectedDate] = useState("20 July 2025");

  const periods = ["Last Week", "This Month", "Last Month"];

  return (
    <div className="relative">
      {/* Adding custom styles for option elements */}
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

      {/* Main Container with exact dimensions and overflow control */}
      <div
        className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-visible relative"
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
        <div className="min-h-[306px] rounded-[12px] overflow-visible">
          {activeTab === "Dashboard" && (
            <div className="relative p-[26px_16px] rounded-[8px] min-w-[972px] shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible">
              {/* Dark mode gradient */}
              <div
                className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
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
              <div className="relative overflow-visible" style={{ minHeight: "193px" }}>
                {activeSubTab === "Patient Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Active Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-[#0C1A12] shadow-lg border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white "
                            style={{ zIndex: 10 }}
                          >
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Admissions Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Priority Care Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>
                  </div>
                )}

                {/* Revenue Summary */}
                {activeSubTab === "Revenue Summary" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Active Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Admissions Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Priority Care Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>
                  </div>
                )}

                {/* Surgery Record */}
                {activeSubTab === "Surgery Record" && (
                  <div className="grid grid-cols-4 gap-[43px] responsive-grid">
                    {/* Total Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Active Patients Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Admissions Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>

                    {/* Priority Care Card */}
                    <div className="bg-[#0EFF7B1A] dark:bg-[#0EFF7B0D] p-5 rounded-lg ">
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
                            <Listbox.Option
                              value="This Week"
                              className={({ active, selected }) =>
                                `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                              }
                            >
                              This Week
                            </Listbox.Option>
                            {periods.map((period) => (
                              <Listbox.Option
                                key={period}
                                value={period}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none py-2 px-4 text-sm rounded-md 
                                  ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                                  ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                                }
                              >
                                {period}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>
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
            {/* Emergency Cases */}
            <div className="relative rounded-[20px] p-5 w-full h-[178px] text-white shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform">
              <div
                className="absolute inset-0 rounded-[20px] pointer-events-none dark:block hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
                  zIndex: 0,
                }}
              ></div>
              {/* Gradient Border */}
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
                <div className="relative">
                  <Listbox value={selectedDate} onChange={setSelectedDate}>
                    <Listbox.Button className="bg-transparent border border-[#0EFF7B80] text-[#0EFF7B] text-sm rounded-md px-2 py-1 outline-none relative text-left pr-8">
                      {selectedDate}
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                      >
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
                      {["20 July 2025", "21 July 2025", "22 July 2025"].map((date) => (
                        <Listbox.Option
                          key={date}
                          value={date}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-4 text-sm 
                            ${active ? "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white" : "text-black dark:text-white"}
                            ${selected ? "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black font-medium" : ""}`
                          }
                        >
                          {date}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>

              <div className="flex flex-col mt-3">
                <span className="text-4xl font-bold text-[#FF4D4D] mb-3">
                  42
                </span>

                {/* Progress Line */}
                <div className="w-full h-[6px] rounded-full bg-[#023D1E] overflow-hidden">
                  <div className="h-full min-w-[75%] bg-gradient-to-r from-[#FF4D4D] to-[#0EFF7B] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Consultation */}
            <div className="relative rounded-[20px] p-5 w-full h-[338px] text-white shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform">
              <div
                className="absolute inset-0 rounded-[20px] pointer-events-none dark:block hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(3,56,27,0.25) 0%, rgba(15,15,15,0.25) 48.97%)",
                  zIndex: 0,
                }}
              ></div>
              {/* Gradient Border */}
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
                  <span className="text-xs text-gray-400">20 July 2025</span>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-[#0EFF7B]">3,570</span>
                <span className="text-xs text-gray-400 ml-2">+220</span>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                Average consultation per doctor
              </p>

              <div className="flex mt-5 justify-between items-start relative">
                {/* Department list */}
                <ul className="space-y-2 text-sm">
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#0EFF7B]"></span>
                    General Physician
                  </li>
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#089648]"></span>
                    Dermatology
                  </li>
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#5CD592]"></span>
                    Orthopedics
                  </li>
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#3E614E]"></span>
                    Pediatrics
                  </li>
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#6A8F7B]"></span>
                    Cardiology
                  </li>
                  <li className="flex text-black dark:text-white items-center">
                    <span className="min-w-3 h-3 rounded-full mr-2 bg-[#B6DEC8]"></span>
                    Neurology
                  </li>
                </ul>

                {/* Multi-segment Circular Chart */}
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
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#0EFF7B"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="30 221.2"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#089648"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="20 231.2"
                      strokeDashoffset="-30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#5CD592"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="40 211.2"
                      strokeDashoffset="-50"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3E614E"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="25 226.2"
                      strokeDashoffset="-90"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#6A8F7B"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="35 216.2"
                      strokeDashoffset="-115"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#B6DEC8"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="20 231.2"
                      strokeDashoffset="-150"
                    />
                  </svg>

                  <div className="absolute hidden group-hover:flex flex-col items-center left-1/2 bottom-[100%] -translate-x-1/2 mt-2 z-20">
                    <div className="bg-[#0A0A0A] border border-dashed border-[#0EFF7B] text-white text-xs px-3 py-2 rounded-md shadow-[0_0_6px_#0EFF7B66] whitespace-nowrap mt-1">
                      <div className="text-[#0EFF7B] font-semibold">
                        General Physician
                      </div>
                      <div className="text-gray-300">15–20 / per day (Low)</div>
                    </div>
                    <div className="w-[1px] h-[24px] border-l border-dashed border-[#0EFF7B] bg-transparent"></div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center text-[#0EFF7B] text-sm font-semibold opacity-80">
                    70%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="relative rounded-[20px] p-7 w-[406px] h-[536px] text-white shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] border border-transparent bg-white dark:bg-transparent overflow-visible hover:scale-105 transition-transform flex-shrink-0">
            <div
              className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
              style={{
                background: "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
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
                <span className="ml-3 bg-[#08994A] text-white text-xs px-2 py-1 rounded-full">
                  5 new
                </span>
              </h3>
              <button className="text-sm text-[#08994A] dark:text-[#0EFF7B] hover:underline font-medium">
                View all
              </button>
            </div>

            <div
              className="relative z-10 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <ul className="space-y-3">
                <li className="bg-[#F8FFFB] dark:bg-[#0A1F14] border border-[#0EFF7B33] dark:border-[#0EFF7B33] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#0EFF7B] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        4 new patients admitted from cardiology
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#08994A] dark:text-[#0EFF7B] font-medium">Just now</span>
                        <span className="text-xs bg-[#08994A] text-white px-2 py-1 rounded-full">New</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#F8FFFB] dark:bg-[#0A1F14] border border-[#0EFF7B33] dark:border-[#0EFF7B33] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#0EFF7B] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        3 patients discharged successfully
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#08994A] dark:text-[#0EFF7B]">1 hour ago</span>
                        <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">Completed</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#FFF5F5] dark:bg-[#1F0A0A] border border-[#FF444433] dark:border-[#FF444433] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#FF4444] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        2 emergency cases reported
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#FF4444] font-medium">5 min ago</span>
                        <span className="text-xs bg-[#FF4444] text-white px-2 py-1 rounded-full">Urgent</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#F8FFFB] dark:bg-[#0A1F14] border border-[#0EFF7B33] dark:border-[#0EFF7B33] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#0EFF7B] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        3 patients discharged successfully
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#08994A] dark:text-[#0EFF7B]">1 hour ago</span>
                        <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">Completed</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#FFF5F5] dark:bg-[#1F0A0A] border border-[#FF444433] dark:border-[#FF444433] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#FF4444] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        1 operation delayed due to equipment
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#FF4444]">2 hours ago</span>
                        <span className="text-xs bg-[#FF4444] text-white px-2 py-1 rounded-full">Attention</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#F8FFFB] dark:bg-[#0A1F14] border border-[#0EFF7B33] dark:border-[#0EFF7B33] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#0EFF7B] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        All systems running normally
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#08994A] dark:text-[#0EFF7B]">Today</span>
                        <span className="text-xs bg-[#08994A] text-white px-2 py-1 rounded-full">System</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="bg-[#F0F9FF] dark:bg-[#0A1A1F] border border-[#0EA5E933] dark:border-[#0EA5E933] rounded-xl p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 h-2 bg-[#0EA5E9] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        New doctor joined neurology department
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#0EA5E9]">Yesterday</span>
                        <span className="text-xs bg-[#0EA5E9] text-white px-2 py-1 rounded-full">Info</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default DashboardComponents;