import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Trash2,
  DollarSign,
  Filter,
  Package,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";

const StockInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Today");
  const [showCalendar, setShowCalendar] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddStockPopup, setShowAddStockPopup] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    category: "",
    batch: "",
    vendor: "",
    vendorCode: "",
    stock: "",
    status: "Slect Status",
  });
  const onClose = () => {
    setShowAddStockPopup(false);
  };
  const categories = ["Electronics", "Furniture", "Groceries", "Clothing"];

  // ✅ Reusable Dropdown
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] text-left text-[14px] leading-[16px]">
            {value || "Select Categories"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 border border-[#3A3A3A] left-[2px]">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                    active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"
                  } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const inventoryData = [
    {
      id: 1,
      name: "Septodont",
      category: "Local Anesthesia",
      batch: "SHY09835",
      vendor: "Barone LLC",
      vendorCode: "BAR12345",
      stock: 124,
      status: "IN STOCK",
    },
    {
      id: 2,
      name: "Chlorhexidine gluconate",
      category: "Antiseptics",
      batch: "SHM09886",
      vendor: "Acme Co.",
      vendorCode: "ACM12345",
      stock: 10,
      status: "LOW STOCK",
    },
    {
      id: 3,
      name: "Amoxicillin",
      category: "Antibiotics",
      batch: "SHY07635",
      vendor: "Manish Ltd.",
      vendorCode: "MAN12345",
      stock: 0,
      status: "OUT OF STOCK",
    },
    {
      id: 4,
      name: "Ibuprofen",
      category: "Anti-inflammatory",
      batch: "SHA09435",
      vendor: "Manish Ltd.",
      vendorCode: "MAN12345",
      stock: 178,
      status: "IN STOCK",
    },
    {
      id: 5,
      name: "Acetaminophen",
      category: "Analgesics",
      batch: "SHB09755",
      vendor: "Acme Co.",
      vendorCode: "ACM12345",
      stock: 200,
      status: "IN STOCK",
    },
    {
      id: 6,
      name: "Methylprednisolone",
      category: "Steroid",
      batch: "SHC09475",
      vendor: "KMC private Ltd.",
      vendorCode: "KMC12345",
      stock: 49,
      status: "LOW STOCK",
    },
    {
      id: 7,
      name: "Fluconazole",
      category: "Antifungal",
      batch: "SHD04735",
      vendor: "Barone LLC",
      vendorCode: "BAR12345",
      stock: 0,
      status: "OUT OF STOCK",
    },
  ];

  const itemsPerPage = 9;

  const filteredData = inventoryData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortedData = [...displayedData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    setSelectAll(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === displayedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayedData.map((row) => row.id));
    }
  };

  const handleDeleteSelected = () => {
    console.log("Deleting selected rows:", selectedRows);
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    const id = inventoryData.length + 1;
    setInventoryData([
      ...inventoryData,
      { id, ...newStock, stock: parseInt(newStock.stock) },
    ]);
    setShowAddStockPopup(false);
    setNewStock({
      name: "",
      category: "",
      batch: "",
      vendor: "",
      vendorCode: "",
      stock: "",
      status: "IN STOCK",
    });
  };

  const setInventoryData = (newData) => {
    // This is a workaround since inventoryData is a const. In a real app, use useState or a state management solution.
    // For this example, we'll assume inventoryData is mutable for simplicity.
    inventoryData.length = 0;
    inventoryData.push(...newData);
  };

  return (
    <div className="w-full min-h-screen mt-[60px] bg-black text-white p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 w-full ">
        <div>
          <h1 className="text-[20px] font-medium">Stock & Inventory</h1>
          <p className="text-[14px] mt-2 text-gray-400">
            Manage staff profiles, departments, roles, attendance, and payroll
            in one place.
          </p>
        </div>
        <button
          onClick={() => setShowAddStockPopup(true)}
          className="w-[200px] h-[40px] flex items-center justify-center gap-2 
             rounded-full border border-[#0EFF7B66] 
             bg-gradient-to-r from-[#14DC6F] to-[#09753A] 
             shadow-[0px_2px_12px_0px_#0EFF7B40] 
             text-sm font-semibold text-white px-3 py-2"
        >
          + Add Stock
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-6 mb-6 pb-2 text-sm relative">
        {["Today", "Week", "Month", "Year"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setActiveFilter(f);
              setShowCalendar(false);
            }}
            className={`hover:text-[#ffffff] ${
              f === activeFilter
                ? "text-[#ffffff] border-b-2 border-[#ffffff]"
                : "text-gray-400"
            }`}
          >
            {f}
          </button>
        ))}

        {/* Custom Tab */}
        <button
          onClick={() => {
            setActiveFilter("Custom");
            setShowCalendar(!showCalendar);
          }}
          className={`flex items-center gap-1 hover:text-[#ffffff] ${
            activeFilter === "Custom" ? "text-[#ffffff]" : "text-gray-400"
          }`}
        >
          Custom
          <ChevronDown size={14} />
        </button>

        {/* Dropdown Calendar */}
        {showCalendar && (
          <div className="absolute top-10 left-[15%] bg-[#1E1E1E] p-3 rounded-lg shadow-lg border border-gray-700 z-50">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-transparent text-white text-sm border border-gray-600 rounded-md p-1 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Top Stats */}
      <div className="bg-[#0D0D0D] px-6 py-6 opacity-100 w-full h-[102px] rounded-2xl mb-6">
        <div className="grid grid-cols-4 gap-6 text-sm">
          {[
            {
              label: "Total Profit",
              value: "$1,30,734",
              icon: <DollarSign className="w-6 h-6 text-green-400" />,
              ring: "ring-green-600/60 bg-green-900/10",
            },
            {
              label: "Inventory Stock",
              value: "1,432",
              icon: <Package className="w-6 h-6 text-amber-500" />,
              ring: "ring-amber-600/60 bg-amber-900/10",
            },
            {
              label: "Out of Stock",
              value: "1,432",
              icon: <AlertTriangle className="w-6 h-6 text-gray-400" />,
              ring: "ring-gray-600/60 bg-gray-900/10",
            },
            {
              label: "Expired",
              value: "24",
              icon: <XCircle className="w-6 h-6 text-indigo-400" />,
              ring: "ring-indigo-600/60 bg-indigo-900/10",
            },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-[27px]">
              {/* Circle Icon Background */}
              <div
                className={`flex items-center justify-center w-12 h-12 ml-6 rounded-full ring-2  ${stat.ring}`}
              >
                {stat.icon}
              </div>
              {/* Text Section */}
              <div>
                <p className="font-Inter font-normal text-[12px] leading-[100%] tracking-normal text-white mb-3">
                  {stat.label}
                </p>
                <p className="font-Inter font-bold text-[16px] leading-[100%] tracking-normal text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Stocks & Upcoming/Expiring */}
      {/* Department Stocks & Upcoming/Expiring */}
<div className="flex flex-wrap w-full gap-4 mb-6">
  {/* DEPARTMENT STOCKS */}
  <div className="flex-1 min-w-[280px] lg:min-w-[350px] h-[200px] rounded-lg border border-[#0EFF7B1A] p-3 bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
    <h3 className="text-[#0EFF7B] text-[14px] font-semibold mb-1">
      DEPARTMENT STOCKS
    </h3>
    <hr className="border-[#333] mb-6" />
    <div className="flex items-center justify-between">
      {/* Department List */}
      <div className="flex flex-col gap-5 mr-6">
        <div className="flex items-center gap-3">
          <span className="min-w-[14px] h-[14px] rounded-full bg-[#0EFF7B] inline-block"></span>
          <span className="font-inter text-sm">Medical Dept</span>
          <span className="text-[#A0A0A0] text-sm">60%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="min-w-[14px] h-[14px] rounded-full bg-[#0A7239] inline-block"></span>
          <span className="font-inter text-sm">Surgical Dept</span>
          <span className="text-[#A0A0A0] text-sm">30%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="min-w-[14px] h-[14px] rounded-full bg-[#D7FDE8] inline-block"></span>
          <span className="font-inter text-sm">
            Supportive &<br /> Diagnostic Dept
          </span>
          <span className="text-[#A0A0A0] text-sm">10%</span>
        </div>
      </div>
      {/* Donut Chart */}
      <svg viewBox="0 0 36 36" width="100" height="100">
        <circle cx="18" cy="18" r="16" fill="none" stroke="#242424" strokeWidth="4" />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#18FF96" strokeWidth="4"
          strokeDasharray="60 100" strokeDashoffset="0" strokeLinecap="round" />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#1AB873" strokeWidth="4"
          strokeDasharray="30 100" strokeDashoffset="60" strokeLinecap="round" />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#C9FFE1" strokeWidth="4"
          strokeDasharray="10 100" strokeDashoffset="90" strokeLinecap="round" />
      </svg>
    </div>
  </div>

  {/* UPCOMING STOCKS */}
  <div className="flex-1 min-w-[250px] h-[200px] rounded-lg border border-[#0EFF7B1A] p-3 bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
    <h3 className="flex justify-between text-[15px] font-semibold mb-1">
      <span className="text-[#6E92FF] text-[14px] uppercase flex items-center gap-1">
        <span>○</span> UPCOMING STOCKS
      </span>
      <span className="text-[#0EFF7B] text-[12px] cursor-pointer">View all (80)</span>
    </h3>
    <hr className="border-[#222] mb-6" />
    <ul className="space-y-3 text-sm">
      <li className="flex justify-between">
        <span>Ibuprofen</span>
        <div className="flex gap-x-2">
          <span className="text-[#0EFF7B]">+145</span>
          <span className="text-gray-400 text-xs">29 aug 25</span>
        </div>
      </li>
      <li className="flex justify-between">
        <span>Amoxicillin</span>
        <div className="flex gap-x-2">
          <span className="text-[#0EFF7B]">+120</span>
          <span className="text-gray-400 text-xs">29 aug 25</span>
        </div>
      </li>
      <li className="flex justify-between">
        <span>Disinfectant skin antiseptic</span>
        <div className="flex gap-x-2">
          <span className="text-[#0EFF7B]">+200</span>
          <span className="text-gray-400 text-xs">29 aug 25</span>
        </div>
      </li>
    </ul>
  </div>

  {/* EXPIRING STOCKS */}
  <div className="flex-1 min-w-[280px] lg:min-w-[350px] h-[200px] rounded-lg border border-[#0EFF7B1A] p-3 bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
    <h3 className="flex justify-between text-[15px] font-semibold mb-1">
      <span className="text-[#FF2424] text-[14px] uppercase flex items-center gap-1">
        <span>○</span> EXPIRING STOCKS
      </span>
      <span className="text-[#0EFF7B] text-[12px] cursor-pointer">View all (150)</span>
    </h3>
    <hr className="border-[#222] mb-4" />
    <ul className="space-y-3 text-sm">
      <li className="flex justify-between">
        <span>Mask 4-layered</span>
        <span className="text-gray-400 text-xs">30 available</span>
      </li>
      <li className="flex justify-between">
        <span>Disinfectant chlorhexidine bigluconate 0.05%</span>
        <span className="text-gray-400 text-xs">100 available</span>
      </li>
      <li className="flex justify-between">
        <span>Disinfectant skin antiseptic</span>
        <span className="text-gray-400 text-xs">150 available</span>
      </li>
    </ul>
  </div>
</div>


      {/* Inventory List */}
      <h3 className="w-full h-[22px] font-inter font-medium text-[18px] leading-[22px] tracking-normal text-white mb-4">
        Inventory list
      </h3>

      <div className="mb-4 w-full flex justify-between items-center relative">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 min-w-[315px] max-w-md">
          <Search size={16} className="text-[#0EFF7B]" />
          <input
            type="text"
            placeholder="Search by name, category, batch, vendor, or code"
            className="bg-transparent outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="text-sm text-gray-400 flex items-center gap-3 relative">
          <span>
            Page <span className="text-[#0EFF7B]">{currentPage}</span> of{" "}
            {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length})
          </span>

          <button
            onClick={handlePrevPage}
            className="bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextPage}
            className="bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>

          {/* Categories Dropdown */}
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="bg-[#0EFF7B] text-black rounded-full px-4 py-1 flex items-center text-sm font-medium"
          >
            {selectedCategory} <ChevronDown size={16} className="ml-2" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full mt-2 right-0 w-[150px] bg-[#000000E5] p-2 rounded-[20px] border-[2px] border-[#1E1E1E] backdrop-blur-[4px] shadow-[0_0_4px_0_#FFFFFF1F] z-50">
              <ul className="text-white text-sm">
                {["Medicine", "Equipments", "Tools"].map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-[#1E1E1E] rounded-[4px] cursor-pointer"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center"
          >
            <Filter size={16} />
          </button>

          {/* Filter Popup */}
          {showFilterPopup && (
            <div className="absolute top-full mt-2 right-0 w-[188px] h-[119px] gap-[12px] rounded-[20px] border-[2px] border-[#1E1E1E] p-[18px_12px] bg-[#000000E5] backdrop-blur-[4px] shadow-[0_0_4px_0_#FFFFFF1F] flex flex-col z-50">
              <div className="flex flex-col justify-start items-start space-y-[8px]">
                <button
                  onClick={() => setFilterStatus("IN STOCK")}
                  className={`w-[140px] h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-inter font-normal ${
                    filterStatus === "IN STOCK"
                      ? "bg-[#1E1E1E] text-[#0EFF7B]"
                      : "bg-[#000000] text-[#0EFF7B]"
                  }`}
                >
                  <span className="w-[8px] h-[8px] rounded-full bg-[#0EFF7B] inline-block mr-2"></span>
                  IN STOCK
                </button>

                <button
                  onClick={() => setFilterStatus("LOW STOCK")}
                  className={`w-[140px] h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-inter font-normal ${
                    filterStatus === "LOW STOCK"
                      ? "bg-[#1E1E1E] text-[#FF930E]"
                      : "bg-[#000000] text-[#FF930E]"
                  }`}
                >
                  <span className="w-[8px] h-[8px] rounded-full bg-[#FF930E] inline-block mr-2"></span>
                  LOW STOCK
                </button>

                <button
                  onClick={() => setFilterStatus("OUT OF STOCK")}
                  className={`w-[140px] h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-inter font-normal ${
                    filterStatus === "OUT OF STOCK"
                      ? "bg-[#1E1E1E] text-[#FF2424]"
                      : "bg-[#000000] text-[#FF2424]"
                  }`}
                >
                  <span className="w-[8px] h-[8px] rounded-full bg-[#FF2424] inline-block mr-2"></span>
                  OUT OF STOCK
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleDeleteSelected}
            className="bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full border-collapse border border-black rounded-[8px]">
          <thead className="bg-[#1E1E1E] h-[52px] text-left text-sm text-white opacity-100">
            <tr className="h-[52px] bg-[#1E1E1E] text-left text-sm text-white rounded-[8px] border border-black">
              {/* Select All Checkbox */}
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  className="appearance-none w-5 h-5 border border-white rounded-sm
          bg-black checked:bg-green-500 checked:border-green-500
          flex items-center justify-center 
          checked:before:content-['✔'] checked:before:text-black 
          checked:before:text-sm"
                  checked={
                    displayedData.length > 0 &&
                    selectedRows.length === displayedData.length
                  }
                  onChange={handleSelectAll}
                />
              </th>

              {/* Table Columns */}
              {[
                { label: "Name", key: "name" },
                { label: "Categories", key: "category" },
                { label: "Batch number", key: "batch" },
                { label: "Vendor", key: "vendor" },
                { label: "Available stocks", key: "stock" },
                { label: "Status", key: "status" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-3 font-medium cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <div className="flex flex-col ml-1">
                      {/* Up Arrow */}
                      <svg
                        className={`w-3 h-3 ${
                          sortColumn === col.key && sortOrder === "asc"
                            ? "stroke-[#0EFF7B]"
                            : "stroke-gray-500"
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        strokeWidth="2"
                      >
                        <path
                          d="M5 12 L10 7 L15 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {/* Down Arrow */}
                      <svg
                        className={`w-3 h-3 ${
                          sortColumn === col.key && sortOrder === "desc"
                            ? "stroke-[#0EFF7B]"
                            : "stroke-gray-500"
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        strokeWidth="2"
                      >
                        <path
                          d="M5 8 L10 13 L15 8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm">
            {sortedData.map((row, i) => (
              <tr
                key={row.id}
                className="w-full h-[62px] bg-black px-[12px] py-[12px] opacity-100 border-b border-[#1E1E1E]"
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border border-white rounded-sm
             bg-black checked:bg-green-500 checked:border-green-500
             flex items-center justify-center 
             checked:before:content-['✔'] checked:before:text-black 
             checked:before:text-sm"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>
                <td className="px-3 py-3 text-white">{row.name}</td>
                <td className="px-3 py-3 text-white">{row.category}</td>
                <td className="px-3 py-3 text-white">{row.batch}</td>
                <td className="px-3 py-3 text-white">
                  {row.vendor}{" "}
                  <span className="text-gray-500 ml-1">({row.vendorCode})</span>
                </td>
                <td className="px-3 py-3 text-white">{row.stock}</td>
                <td className="px-3 py-3 font-medium">
                  <span
                    className={`${
                      row.status === "IN STOCK"
                        ? "text-green-500"
                        : row.status === "LOW STOCK"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    • {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Stock Popup */}
      {showAddStockPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[504px] h-[463px] bg-[#000000E5] border-2 border-[#1E1E1E] rounded-[20px] p-5 gap-8 shadow-[0px_0px_2px_0px_#A0A0A040] backdrop-blur-md relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-medium text-[16px] leading-[19px]">
                Add New Stock
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddStock} className="grid grid-cols-2 gap-6">
              {/* Stock Name */}
              <div>
                <label className="text-sm text-white">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newStock.name}
                  onChange={(e) =>
                    setNewStock({ ...newStock, name: e.target.value })
                  }
                  className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <Dropdown
                label="Category"
                value={newStock.category}
                onChange={(val) => setNewStock({ ...newStock, category: val })}
                options={categories}
              />

              {/* Batch Number */}
              <div>
                <label className="text-sm text-white">Batch Number</label>
                <input
                  type="text"
                  placeholder="Enter Batch Number"
                  value={newStock.batch}
                  onChange={(e) =>
                    setNewStock({ ...newStock, batch: e.target.value })
                  }
                  className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  required
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="text-sm text-white">Vendor</label>
                <input
                  type="text"
                  placeholder="Enter Vendor"
                  value={newStock.vendor}
                  onChange={(e) =>
                    setNewStock({ ...newStock, vendor: e.target.value })
                  }
                  className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  required
                />
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="text-sm text-white">No Of Stocks</label>
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={newStock.stock}
                  onChange={(e) =>
                    setNewStock({ ...newStock, stock: e.target.value })
                  }
                  className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  required
                />
              </div>

              {/* Vendor Code */}
              <div>
                <label className="text-sm text-white">Vendor ID</label>
                <input
                  type="text"
                  placeholder="Enter Vendor ID"
                  value={newStock.vendorCode}
                  onChange={(e) =>
                    setNewStock({ ...newStock, vendorCode: e.target.value })
                  }
                  className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  required
                />
              </div>

              {/* Status Dropdown */}
              <Dropdown
                label="Status"
                value={newStock.status}
                onChange={(val) => setNewStock({ ...newStock, status: val })}
                options={["IN STOCK", "LOW STOCK", "OUT OF STOCK"]}
              />
            </form>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onClose}
                className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] text-white font-medium text-[14px] leading-[16px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddStock}
                className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B66] bg-gradient-to-r from-[#14DC6F] to-[#09753A] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInventory;
