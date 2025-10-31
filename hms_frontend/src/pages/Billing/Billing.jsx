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
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";


const Dropdown = ({ label, value, onChange, options, error }) => (
  <div>
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value || "Select"} onChange={onChange}>
      <div className="relative mt-1 w-[228px]">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
          bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] 
          focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[12px] bg-white dark:bg-black 
          shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] no-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option.value || option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                ${
                  active
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                    : "text-black dark:text-white"
                }
                ${
                  selected
                    ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                    : ""
                }`
              }
            >
              {option.label || option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
    </Listbox>
  </div>
);

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([
    {
      id: "INV-2011",
      date: "2025-09-01",
      patientName: "Matthew Scott",
      patientId: "SAH257384",
      department: "Cardiology",
      amount: "$1800.00",
      paymentMethod: "Insurance",
      status: "Paid",
    },
    {
      id: "INV-2012",
      date: "2025-09-01",
      patientName: "Isabella Lopez",
      patientId: "SAH257385",
      department: "Radiology",
      amount: "$2200.50",
      paymentMethod: "Insurance",
      status: "Paid",
    },
    {
      id: "INV-2013",
      date: "2025-09-01",
      patientName: "Ethan Harris",
      patientId: "SAH257386",
      department: "Oncology",
      amount: "$3100.75",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: "INV-2014",
      date: "2025-09-01",
      patientName: "Ava Robinson",
      patientId: "SAH257387",
      department: "Emergency",
      amount: "$4500.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2015",
      date: "2025-09-01",
      patientName: "William Clark",
      patientId: "SAH257388",
      department: "Neurology",
      amount: "$2700.25",
      paymentMethod: "-",
      status: "Unpaid",
    },
    {
      id: "INV-2016",
      date: "2025-09-01",
      patientName: "Mia Lewis",
      patientId: "SAH257389",
      department: "Orthopedics",
      amount: "$1950.00",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      id: "INV-2017",
      date: "2025-09-01",
      patientName: "Alexander",
      patientId: "SAH257390",
      department: "Dermatology",
      amount: "$850.00",
      paymentMethod: "Cash",
      status: "Paid",
    },
  ]);

  const statusOptions = ["All", "Paid", "Unpaid"];
  const departmentOptions = [
    "All",
    "Cardiology",
    "Radiology",
    "Oncology",
    "Emergency",
    "Neurology",
    "Orthopedics",
    "Dermatology",
  ];
  const paymentMethodOptions = ["All", "Insurance", "Cash", "Credit Card", "None"];

  const filteredData = invoiceData.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus && filterStatus !== "All" ? item.status === filterStatus : true;
    const matchesDepartment = filterDepartment && filterDepartment !== "All"
      ? item.department === filterDepartment
      : true;
    const matchesPaymentMethod = filterPaymentMethod && filterPaymentMethod !== "All"
      ? item.paymentMethod === (filterPaymentMethod === "None" ? "-" : filterPaymentMethod)
      : true;
    const matchesDate = filterDate ? item.date === filterDate : true;
    return matchesSearch && matchesStatus && matchesDepartment && matchesPaymentMethod && matchesDate;
  });

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
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const displayedData = sortedData.slice(indexOfFirst, indexOfLast);

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
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleGenerateBill = () => {
  console.log("Generate Bill button clicked");
  navigate("/BillingPreview");
};

  const handleProcessPayment = () => {
    console.log("Process Payment button clicked");
  };

  const handleInsuranceClaim = () => {
    console.log("Handle Insurance Claim button clicked");
  };

  const handlePrint = () => {
    console.log("Print button clicked");
  };

  const handleExport = () => {
    console.log("Export button clicked");
  };

  const handleFilter = () => {
    setShowFilterPopup(true);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setShowDeletePopup(true);
    }
  };

  const confirmDelete = () => {
    setInvoiceData((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
    setSelectAll(false);
    setShowDeletePopup(false);
  };

  const handleApplyFilter = () => {
    setShowFilterPopup(false);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilterStatus("All");
    setFilterDepartment("All");
    setFilterPaymentMethod("All");
    setFilterDate("");
    setShowFilterPopup(false);
    setCurrentPage(1);
  };

  const handleShare = (id) => {
    console.log(`Share button clicked for invoice ${id}`);
  };

  const getStatusColor = (status) => {
    if (status === "Paid") return "text-green-600 dark:text-green-500";
    if (status === "Unpaid") return "text-orange-600 dark:text-orange-500";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative"
    >
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mt-4 mb-6">
        <h1 className="text-[20px] font-medium text-black dark:text-white">
          Billing Management
        </h1>
        <button
          onClick={handleGenerateBill}
          className="w-[200px] h-[40px] flex items-center justify-center bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)] border-b-[2px] border-[#0EFF7B] shadow-[0px_2px_12px_0px_#00000040] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-[8px] transition duration-300 ease-in-out"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          + Generate Bill
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex flex-col gap-8 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-[#0EFF7B1A] p-6 shadow-sm">
              <Filter className="text-gray-600 dark:text-[#0EFF7B] w-5 h-5 cursor-pointer hover:text-[#08994A] dark:hover:text-[#0EFF7B] mb-4" />
              <div className="flex flex-col gap-2">
                <span className="font-medium text-[18px] text-black dark:text-white">
                  Total Bills Generated Today
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[28px] font-bold">
                  125
                </span>
              </div>
            </div>
            <div className="flex flex-col rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-[#0EFF7B1A] p-6 shadow-sm">
              <Filter className="text-gray-600 dark:text-[#0EFF7B] w-5 h-5 cursor-pointer hover:text-[#08994A] dark:hover:text-[#0EFF7B] mb-4" />
              <div className="flex flex-col gap-2">
                <span className="font-medium text-[18px] text-black dark:text-white">
                  Insurance Claims
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[28px] font-bold">
                  7
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleProcessPayment}
              className="bg-white dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-6 py-3 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
            >
              <CreditCard size={16} /> Process Payment
            </button>
            <button
              onClick={handleInsuranceClaim}
              className="bg-white dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-6 py-3 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
            >
              <FileText size={16} /> Handle Insurance Claim
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[280px] flex flex-col gap-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-[#0EFF7B1A] p-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300 dark:border-[#3C3C3C]">
            <span className="text-[#6E92FF] dark:text-[#0EFF7B] text-sm font-semibold">
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
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
        <h2 className="text-black dark:text-white text-lg font-semibold">Invoices</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="bg-white dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleExport}
            className="dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-transparent rounded-xl p-4 md:p-6 overflow-x-auto border border-[#0EFF7B] dark:border-[#3C3C3C]">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <span className="text-black dark:text-white text-base font-medium">All Invoices</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full w-full sm:w-auto">
              <Search size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-black dark:text-white flex-1 min-w-[120px] placeholder-[#5CD592] dark:placeholder-[#5CD592] focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              className="flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
              onClick={handleFilter}
            >
              <Filter size={16} className="text-[#0EFF7B] dark:text-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]" />
            </div>
            <div
              className="flex items-center justify-center bg-[#FF00001A] dark:bg-[#FF00001A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#FF000033] dark:hover:bg-[#FF000033]"
              onClick={handleDelete}
            >
              <Trash2 size={16} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400" />
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-[#F5F6F5] dark:bg-[#091810] h-[52px] text-left text-sm text-[#0EFF7B] dark:text-[#0EFF7B]">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
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
                  className="h-[62px] bg-white dark:bg-black border-b border-gray-300 dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectAll || selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
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
                  <td className={`px-3 py-3 font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer">
                      <Edit
                        size={16}
                        className="text-[#08994A] dark:text-[#0EFF7B] cursor-pointer hover:text-[#0cd968] dark:hover:text-[#0cd968]"
                        onClick={() => handleShare(row.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center h-full mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
          <div className="text-sm text-black dark:text-white">
            Page{" "}
            <span className="text-[#08994A] dark:text-[#0EFF7B]">{currentPage}</span>{" "}
            of {totalPages} ({indexOfFirst + 1} to{" "}
            {Math.min(indexOfLast, filteredData.length)} from{" "}
            {filteredData.length} Invoices)
          </div>
          <div className="flex items-center gap-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                currentPage === 1
                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                  : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              }`}
            >
              <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                currentPage === totalPages
                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                  : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              }`}
            >
              <ChevronRight size={12} className="text-[#08994A] dark:text-white" />
            </button>
          </div>
        </div>
      </div>
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "20px",
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
              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  {selectedRows.length === 1 ? "Delete Invoice" : "Delete Invoices"}
                </h3>
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {selectedRows.length === 1
                  ? `Are you sure you want to delete invoice ${
                      invoiceData.find((item) => item.id === selectedRows[0])?.id
                    }?`
                  : `Are you sure you want to delete ${selectedRows.length} invoice(s)?`}
                <br />
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
            bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
            dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[505px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <h2
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter Invoices
                </h2>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Dropdown
                  label="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={statusOptions}
                  className="w-[228px] h-[32px] mt-1"
                />
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Invoice Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-3.5 text-black dark:text-[#0EFF7B] pointer-events-none"
                    />
                  </div>
                </div>
                <Dropdown
                  label="Department"
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  options={departmentOptions}
                  className="w-[228px] h-[32px] mt-1"
                />
                <Dropdown
                  label="Payment Method"
                  value={filterPaymentMethod}
                  onChange={setFilterPaymentMethod}
                  options={paymentMethodOptions}
                  className="w-[228px] h-[32px] mt-1"
                />
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleClearFilter}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;