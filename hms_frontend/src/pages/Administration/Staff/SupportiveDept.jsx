import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const SupportiveDept = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const staffData = [
    { id: 1, name: "Lakshmi", designation: "Radiology Technician", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.50am", checkOut: "5.30pm" },
    { id: 2, name: "Arun", designation: "Pathology", date: "20/08/2025", shift: "09am - 05pm", status: "Absent", checkIn: "-", checkOut: "-" },
    { id: 3, name: "Deepa", designation: "Lab Technician", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.45am", checkOut: "5.20pm" },
    { id: 4, name: "Vijay", designation: "Ultrasound Specialist", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.55am", checkOut: "5.25pm" },
    { id: 5, name: "Nithya", designation: "MRI Technician", date: "20/08/2025", shift: "09am - 05pm", status: "Absent", checkIn: "-", checkOut: "-" },
    { id: 6, name: "Ravi", designation: "Phlebotomist", date: "20/08/2025", shift: "09am - 05pm", status: "Present", checkIn: "8.40am", checkOut: "5.15pm" },
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
};

export default SupportiveDept;
