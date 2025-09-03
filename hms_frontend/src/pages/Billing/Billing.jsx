import React, { useState } from "react";
import {
  Search,
  Filter,
  Settings,
  Printer,
  Download,
  CheckCircle,
  CreditCard,
  FileText,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const invoiceData = [
    {
      id: "INV-2011",
      date: "09/01/2025",
      patientName: "Matthew Scott",
      patientId: "SAH257384",
      department: "Cardiology",
      amount: "$1800.00",
      paymentMethod: "Insurance",
      status: "Paid",
    },
    {
      id: "INV-2012",
      date: "09/01/2025",
      patientName: "Isabella Lopez",
      patientId: "SAH257384",
      department: "Radiology",
      amount: "$2200.50",
      paymentMethod: "Insurance",
      status: "Paid",
    },
    {
      id: "INV-2013",
      date: "09/01/2025",
      patientName: "Ethan Harris",
      patientId: "SAH257384",
      department: "Oncology",
      amount: "$3100.75",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: "INV-2014",
      date: "09/01/2025",
      patientName: "Ava Robinson",
      patientId: "SAH257384",
      department: "Emergency",
      amount: "$4500.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2015",
      date: "09/01/2025",
      patientName: "William Clark",
      patientId: "SAH257384",
      department: "Neurology",
      amount: "$2700.25",
      paymentMethod: "-",
      status: "Unpaid",
    },
    {
      id: "INV-2016",
      date: "09/01/2025",
      patientName: "Mia Lewis",
      patientId: "SAH257384",
      department: "Orthopedics",
      amount: "$1950.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2017",
      date: "09/01/2025",
      patientName: "Alexander",
      patientId: "SAH257384",
      department: "Dermatology",
      amount: "$850.00",
      paymentMethod: "Cash",
      status: "Paid",
    },
  ];

  const filteredData = invoiceData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === "Paid") return "text-green-500";
    if (status === "Unpaid") return "text-orange-500";
    return "text-gray-400";
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="w-full flex-1  mt-[80px] bg-black text-white p-4 md:p-6 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <h1 className="text-[20px] font-medium">Billing Management</h1>
        <button className="bg-green-500 text-black px-4 py-2 rounded-full flex items-center gap-2 w-fit">
          + Generate Bill
        </button>
      </div>

      {/* Stats + Validation */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Section: Stats + Buttons */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="flex flex-col justify-between rounded-[8px] border border-[#0EFF7B1A] bg-black p-6 shadow-sm">
              <div className="flex justify-end">
                <Filter className="text-gray-400 w-5 h-5 cursor-pointer hover:text-[#0EFF7B]" />
              </div>
              <div>
                <span className="font-medium text-[18px] text-[#FFFFFF]">
                  Total Bills Generated Today
                </span>
                <span className="text-[#0EFF7B] text-[24px] mt-2 font-bold block">
                  125
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between rounded-[8px] border border-[#0EFF7B1A] bg-black p-6 shadow-sm">
              <div className="flex justify-end">
                <Filter className="text-gray-400 w-5 h-5 cursor-pointer hover:text-[#0EFF7B]" />
              </div>
              <div>
                <span className="font-medium text-[18px] text-[#FFFFFF]">
                  Insurance Claims
                </span>
                <span className="text-[#0EFF7B] text-[24px] mt-2 font-bold block">
                  7
                </span>
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#0D0D0D] text-green-500 px-6 py-3 rounded-full flex items-center gap-2">
              <CreditCard size={16} /> Process Payment
            </button>
            <button className="bg-[#0D0D0D] text-green-500 px-6 py-3 rounded-full flex items-center gap-2">
              <FileText size={16} /> Handle Insurance Claim
            </button>
          </div>
        </div>

        {/* Right Section: Validation Card */}
        <div className="w-full lg:w-[280px] flex flex-col gap-3 rounded-[8px] border border-[#0EFF7B1A] bg-black p-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[#3C3C3C]">
            <span className="text-[#6E92FF] text-sm font-semibold">
              VALIDATION & CONTROLS
            </span>
            <Settings size={16} className="text-gray-400" />
          </div>
          <ul className="text-sm text-gray-300 space-y-3 mt-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" /> Payment
              method validation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-red-500" /> No negative
              billing amounts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-gray-400" /> Duplicate bill
              prevention
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" /> Refund
              handling
            </li>
          </ul>
        </div>
      </div>

      {/* Invoices Section Heading */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
        <h2 className="text-white text-lg font-semibold">Invoices</h2>
        <div className="flex flex-wrap gap-2">
          <button className="bg-[#0D0D0D] text-green-500 px-4 py-2 rounded-full flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button className="bg-[#0D0D0D] text-green-500 px-4 py-2 rounded-full flex items-center gap-2">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="w-full bg-[#0D0D0D] rounded-xl p-4 md:p-6 overflow-x-auto">
        {/* Search + Filter + Delete */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <span className="text-white text-base font-medium">All Invoices</span>
          <div className="flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 rounded-full w-full sm:w-auto">
            <Search size={16} className="text-green-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-white flex-1 min-w-[120px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter size={16} className="text-gray-400 cursor-pointer" />
            <Trash2 size={16} className="text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-[#1E1E1E] h-[52px] text-left text-sm text-gray-400">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="bg-transparent border-gray-600"
                  />
                </th>
                <th className="px-3 py-3">Invoice ID</th>
                <th className="px-3 py-3">Patient Name</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Payment Method</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="h-[62px] bg-black border-b border-[#1E1E1E] hover:bg-[#1A1A1A]"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      className="bg-transparent border-gray-600"
                      checked={selectAll}
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-3 text-white">
                    {row.id}
                    <br />
                    <span className="text-gray-400 text-xs">{row.date}</span>
                  </td>
                  <td className="px-3 py-3 text-white">
                    {row.patientName}
                    <br />
                    <span className="text-gray-400 text-xs">
                      {row.patientId}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-white">{row.department}</td>
                  <td className="px-3 py-3 text-white">{row.amount}</td>
                  <td className="px-3 py-3 text-white">{row.paymentMethod}</td>
                  <td
                    className={`px-3 py-3 font-medium ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </td>
                  <td className="px-3 py-3">
                    <Share2
                      size={16}
                      className="text-green-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-left items-center gap-3 text-sm text-gray-400">
          <span>
            Page <span className="text-[#0EFF7B]">{currentPage}</span> of{" "}
            {totalPages}
          </span>
          <button
            onClick={handlePrevPage}
            className="bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextPage}
            className="bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
