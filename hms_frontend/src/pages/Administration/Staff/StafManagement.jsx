import React, { useState } from "react";
import { Search, Calendar, Filter, Stethoscope, Microscope, ClipboardList, Building } from "lucide-react";
import SurgicalDept from "./SurgicalDept";
import SupportiveDept from "./SupportiveDept";
import AdministrativeDept from "./AdministrativeDept";
import AttendanceTracking from "./AttendanceTracking";
import PayrollManagement from "./PayrollManagement";

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState("Staff Profiles"); // Default active tab
  const [activeDept, setActiveDept] = useState("Medical");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const staffData = [
    { id: 1, name: "Preethi", designation: "Anesthesiology", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 2, name: "Rajesh", designation: "Cardiology", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 3, name: "Krishna", designation: "Oncology", date: "20/08/2025", shift: "09am - 05pm", status: "Absent", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 4, name: "Raghul", designation: "Dermatology", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 5, name: "Ragu", designation: "Dermatology", date: "20/08/2025", shift: "09am - 05pm", status: "Absent", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 6, name: "Prashanth", designation: "Gastroenterology", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 7, name: "Sharmi", designation: "Pharmacy", date: "20/08/2025", shift: "09am - 05pm", status: "Absent", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 8, name: "Ankita", designation: "Orthopedic", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
  ];

  const itemsPerPage = 9;
  const filteredData = staffData.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || row.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 40;
  const displayedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? displayedData.map((row) => row.id) : []);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    setSelectAll(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const applyFilter = () => {
    setShowFilterPopup(false);
    setCurrentPage(1);
  };

  const renderDepartment = () => {
    switch (activeDept) {
      case "Surgical":
        return <SurgicalDept />;
      case "Supportive":
        return <SupportiveDept />;
      case "Administrative":
        return <AdministrativeDept />;
      default:
        return (
          <div>
            {/* Search and Pagination Header */}
            <div className="flex justify-between items-center mb-4 relative">
              <div className="flex items-center gap-2 bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 min-w-[315px] max-w-md">
                <Search size={16} className="text-[#0EFF7B]" />
                <input
                  type="text"
                  placeholder="Search staff name or designation"
                  className="bg-transparent outline-none text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span>
                  Page <span className="text-green-500">{currentPage}</span> of {totalPages} (1 to {Math.min(currentPage * itemsPerPage, filteredData.length)} Staff)
                </span>
                <button onClick={handlePrevPage} className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center">&lt;</button>
                <button onClick={handleNextPage} className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center">&gt;</button>
                <button onClick={() => setShowFilterPopup(!showFilterPopup)} className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center">
                  <Filter size={16} />
                </button>
              </div>
              {showFilterPopup && (
                <div className="absolute right-0 top-8 bg-[#1E1E1E] p-4 rounded-[8px] shadow-lg z-10">
                  <h3 className="text-sm mb-2">Filter by Status</h3>
                  <select
                    className="bg-black text-white border border-[#3C3C3C] rounded px-2 py-1 mb-2 w-full"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>All</option>
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                  <button onClick={applyFilter} className="bg-green-500 text-black px-4 py-1 rounded w-full">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1E1E1E] h-[52px] text-left text-sm">
                    <th className="px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        className="bg-gray-900 border-gray-700 rounded"
                        checked={selectAll || selectedRows.length === displayedData.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {["Name", "Designation", "Date", "Shift time", "Status", "Check In", "Check Out", "Details"].map((head, i) => (
                      <th key={i} className="px-4 py-3 font-medium">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {displayedData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-900">
                      <td className="px-4 py-3 h-[52px]">
                        <input
                          type="checkbox"
                          className="bg-gray-900 border-gray-700 rounded"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleRowSelect(row.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.designation}</td>
                      <td className="px-4 py-3">{row.date}</td>
                      <td className="px-4 py-3">{row.shift}</td>
                      <td className={`px-4 py-3 font-medium ${row.status === "Present" ? "text-green-500" : "text-red-500"}`}>
                        {row.status}
                      </td>
                      <td className="px-4 py-3">{row.checkIn}</td>
                      <td className="px-4 py-3">{row.checkOut}</td>
                      <td className="px-4 py-3 text-green-400 cursor-pointer hover:underline">view profile</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen mt-[60px] bg-black text-white p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[20px] font-medium">Staff Management</h1>
        <p className="text-[14px] mt-2 text-gray-400">
          Manage staff profiles, departments, roles, attendance, and payroll in one place
        </p>
      </div>

      {/* Tabs and Year/Month Selection */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex border-b border-gray-700 text-[18px] gap-[40px]">
          {["Staff Profiles", "Attendance Tracking", "Payroll Management"].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${activeTab === tab ? "text-green-500 " : "text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-6 items-center text-white text-sm">
          <div className="flex text-[16px] items-center gap-2">
            <span>Year</span>
            <div className="relative w-[90px] h-[32px]">
              <select className="appearance-none w-full h-full bg-black text-white border border-[#3C3C3C] rounded-[20px] px-3 pr-8 text-sm outline-none">
                <option>2025</option>
                <option>2026</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="#0EFF7B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex text-[16px] items-center gap-2">
            <span>Month</span>
            <div className="relative w-[90px] h-[32px]">
              <select className="appearance-none w-full h-full bg-black text-white border border-[#3C3C3C] rounded-[20px] px-3 pr-8 text-sm outline-none">
                <option>Aug</option>
                <option>Sep</option>
                <option>Oct</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="#0EFF7B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards - Only shown when Staff Profiles is active */}
      {activeTab === "Staff Profiles" && (
        <div className="flex gap-4 mb-6">
          {[
            { 
              title: "Medical Departments", 
              subtitle: "Doctors & Specialists", 
              count: "15 medical division",
              icon: <Stethoscope size={24} className="mx-auto" />,
              dept: "Medical"
            },
            { 
              title: "Surgical Departments", 
              count: "6 medical division",
              icon: <Microscope size={24} className="mx-auto" />,
              dept: "Surgical"
            },
            { 
              title: "Supportive & Diagnostic Department", 
              count: "6 medical division",
              icon: <ClipboardList size={24} className="mx-auto" />,
              dept: "Supportive"
            },
            { 
              title: "Administrative & Non-Medical Departments", 
              count: "6 medical division",
              icon: <Building size={24} className="mx-auto" />,
              dept: "Administrative"
            },
          ].map((card, i) => {
            const isActive = activeDept === card.dept;
            return (
              <div
                key={i}
                onClick={() => setActiveDept(card.dept)}
                className={`p-4 rounded-[8px] mt-8 text-center transition min-w-[181px] h-[149px] cursor-pointer 
                  ${isActive ? "bg-black border border-[#0EFF7B1A]" : "bg-[#1E1E1E] hover:bg-gray-800"}`}
              >
                <div className="w-[46px] h-[46px] bg-green-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className={`text-[14px] font-semibold line-clamp-2 leading-snug ${isActive ? "text-green-500" : "text-white"}`}>
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className={`text-[12px] ${isActive ? "text-green-500" : "text-gray-400"}`}>
                    {card.subtitle}
                  </p>
                )}
                <p className={`text-xs mt-1 ${isActive ? "text-green-500" : "text-white"}`}>
                  {card.count}
                </p>
              </div>
            );
          })}
          <div className="bg-[#1E1E1E] p-4 rounded-[8px] w-[250px] h-[219px] flex flex-col items-center">
            <h2 className="text-[14px] w-[226px] h-[32px] flex items-center justify-center rounded-[8px] bg-[#343434] mb-2">
              Who's on leave
            </h2>
            <div className="flex items-center gap-2 mb-4 w-full justify-between">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                On leave <span className="text-red-500 font-medium">2</span>
              </p>
              <div className="relative inline-block">
                <select className="appearance-none bg-black text-[12px] text-gray-300 w-[106px] h-[32px] pl-2 pr-6 rounded-[12px] border border-[#3C3C3C] outline-none cursor-pointer">
                  <option>Today</option>
                  <option>Tomorrow</option>
                </select>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 w-[8px] h-[8px] border-b-2 border-r-2 border-[#0EFF7B] rotate-45 pointer-events-none"></span>
              </div>
            </div>
            <div className="w-[160px] h-[80px] mr-8 flex flex-col gap-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] rounded-full bg-[#4D58FF] flex items-center justify-center text-white text-[10px] font-bold">
                  TK
                </div>
                <div>
                  <p className="text-sm">Teja Khamas</p>
                  <span className="text-xs text-gray-400">Aug 18 - Casual leave</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[24px] h-[24px] rounded-full bg-[#4D58FF] flex items-center justify-center text-white text-[10px] font-bold">
                  GK
                </div>
                <div>
                  <p className="text-sm">Geeth Kannan</p>
                  <span className="text-xs text-gray-400">Aug 16 - Half leave</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Content Based on Active Tab */}
      {activeTab === "Staff Profiles" && renderDepartment()}
      {activeTab === "Attendance Tracking" && <AttendanceTracking />}
      {activeTab === "Payroll Management" && <PayrollManagement />}
    </div>
  );
};

export default StaffManagement;