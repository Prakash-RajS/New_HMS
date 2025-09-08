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
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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
      patientId: "SAH257385",
      department: "Radiology",
      amount: "$2200.50",
      paymentMethod: "Insurance",
      status: "Paid",
    },
    {
      id: "INV-2013",
      date: "09/01/2025",
      patientName: "Ethan Harris",
      patientId: "SAH257386",
      department: "Oncology",
      amount: "$3100.75",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: "INV-2014",
      date: "09/01/2025",
      patientName: "Ava Robinson",
      patientId: "SAH257387",
      department: "Emergency",
      amount: "$4500.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2015",
      date: "09/01/2025",
      patientName: "William Clark",
      patientId: "SAH257388",
      department: "Neurology",
      amount: "$2700.25",
      paymentMethod: "-",
      status: "Unpaid",
    },
    {
      id: "INV-2016",
      date: "09/01/2025",
      patientName: "Mia Lewis",
      patientId: "SAH257389",
      department: "Orthopedics",
      amount: "$1950.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2017",
      date: "09/01/2025",
      patientName: "Alexander",
      patientId: "SAH257390",
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

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (sortColumn === "amount") {
      const numA = parseFloat(valA.replace("$", ""));
      const numB = parseFloat(valB.replace("$", ""));
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : displayedData.map((row) => row.id));
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleGenerateBill = () => {
    console.log("Generate Bill button clicked");
    // Placeholder for popup or logic
  };

  const handleProcessPayment = () => {
    console.log("Process Payment button clicked");
    // Placeholder for popup or logic
  };

  const handleInsuranceClaim = () => {
    console.log("Handle Insurance Claim button clicked");
    // Placeholder for popup or logic
  };

  const handlePrint = () => {
    console.log("Print button clicked");
    // Placeholder for print logic
  };

  const handleExport = () => {
    console.log("Export button clicked");
    // Placeholder for export logic
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
    // Placeholder for filter popup or logic
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
    // Placeholder for delete popup or logic
  };

  const handleShare = (id) => {
    console.log(`Share button clicked for invoice ${id}`);
    // Placeholder for share logic
  };

  const getStatusColor = (status) => {
    if (status === "Paid") return "text-green-600 dark:text-green-500";
    if (status === "Unpaid") return "text-orange-600 dark:text-orange-500";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="w-full flex-1 mt-[80px] bg-white dark:bg-black text-black dark:text-white p-4 md:p-6 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <h1 className="text-[20px] font-medium text-black dark:text-[#0EFF7B]">
          Billing Management
        </h1>
        <button
          onClick={handleGenerateBill}
          className="bg-[#08994A] dark:bg-[#0EFF7B] text-white dark:text-black px-4 py-2 rounded-full flex items-center gap-2 w-fit hover:bg-[#0cd968] dark:hover:bg-[#0cd968] transition"
        >
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
            <div className="flex flex-col justify-between rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-black p-6 shadow-sm">
              <div className="flex justify-end">
                <Filter className="text-gray-600 dark:text-gray-400 w-5 h-5 cursor-pointer hover:text-[#08994A] dark:hover:text-[#0EFF7B]" />
              </div>
              <div>
                <span className="font-medium text-[18px] text-black dark:text-white">
                  Total Bills Generated Today
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[24px] mt-2 font-bold block">
                  125
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-black p-6 shadow-sm">
              <div className="flex justify-end">
                <Filter className="text-gray-600 dark:text-gray-400 w-5 h-5 cursor-pointer hover:text-[#08994A] dark:hover:text-[#0EFF7B]" />
              </div>
              <div>
                <span className="font-medium text-[18px] text-black dark:text-white">
                  Insurance Claims
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[24px] mt-2 font-bold block">
                  7
                </span>
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleProcessPayment}
              className="bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-[#0EFF7B] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
            >
              <CreditCard size={16} /> Process Payment
            </button>
            <button
              onClick={handleInsuranceClaim}
              className="bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-[#0EFF7B] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
            >
              <FileText size={16} /> Handle Insurance Claim
            </button>
          </div>
        </div>

        {/* Right Section: Validation Card */}
        <div className="w-full lg:w-[280px] flex flex-col gap-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-black p-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300 dark:border-[#3C3C3C]">
            <span className="text-[#6E92FF] dark:text-[#6E92FF] text-sm font-semibold">
              VALIDATION & CONTROLS
            </span>
            <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3 mt-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> Payment method validation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-red-600 dark:text-red-500" /> No negative billing amounts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-gray-600 dark:text-gray-400" /> Duplicate bill prevention
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> Refund handling
            </li>
          </ul>
        </div>
      </div>

      {/* Invoices Section Heading */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
        <h2 className="text-black dark:text-white text-lg font-semibold">Invoices</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-[#0EFF7B] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleExport}
            className="bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-[#0EFF7B] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="w-full bg-white dark:bg-[#0D0D0D] rounded-xl p-4 md:p-6 overflow-x-auto border border-[#0EFF7B] dark:border-[#0D0D0D]">
        {/* Search + Filter + Delete */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <span className="text-black dark:text-white text-base font-medium">All Invoices</span>
          <div className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full w-full sm:w-auto">
            <Search size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-black dark:text-white flex-1 min-w-[120px] placeholder-gray-600 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter
              size={16}
              className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
              onClick={handleFilter}
            />
            <Trash2
              size={16}
              className="text-red-600 dark:text-red-500 cursor-pointer hover:text-red-700 dark:hover:text-red-400"
              onClick={handleDelete}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-white dark:bg-[#1E1E1E] h-[52px] text-left text-sm text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="bg-transparent border-gray-600 dark:border-gray-400 accent-[#08994A] dark:accent-[#0EFF7B]"
                  />
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("id")}>
                  Invoice ID {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("patientName")}>
                  Patient Name {sortColumn === "patientName" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("department")}>
                  Department {sortColumn === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount {sortColumn === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                  Payment Method {sortColumn === "paymentMethod" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                  Status {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {displayedData.map((row) => (
                <tr
                  key={row.id}
                  className="h-[62px] bg-white dark:bg-black border-b border-gray-300 dark:border-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectAll || selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="bg-transparent border-gray-600 dark:border-gray-400 accent-[#08994A] dark:accent-[#0EFF7B]"
                    />
                  </td>
                  <td className="px-3 py-3 text-black dark:text-white">
                    {row.id}
                    <br />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{row.date}</span>
                  </td>
                  <td className="px-3 py-3 text-black dark:text-white">
                    {row.patientName}
                    <br />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{row.patientId}</span>
                  </td>
                  <td className="px-3 py-3 text-black dark:text-white">{row.department}</td>
                  <td className="px-3 py-3 text-black dark:text-white">{row.amount}</td>
                  <td className="px-3 py-3 text-black dark:text-white">{row.paymentMethod}</td>
                  <td
                    className={`px-3 py-3 font-medium ${getStatusColor(row.status)}`}
                  >
                    {row.status}
                  </td>
                  <td className="px-3 py-3">
                    <Share2
                      size={16}
                      className="text-[#08994A] dark:text-[#0EFF7B] cursor-pointer hover:text-[#0cd968] dark:hover:text-[#0cd968]"
                      onClick={() => handleShare(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-left items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Page <span className="text-[#08994A] dark:text-[#0EFF7B]">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={handlePrevPage}
            className="bg-white dark:bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] disabled:opacity-40 transition"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextPage}
            className="bg-white dark:bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] disabled:opacity-40 transition"
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