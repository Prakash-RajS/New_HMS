import React, { useState, useRef, useEffect } from "react";
import DeleteLabReportPopup from "./DeleteLabReport.jsx";
import CreateTestOrderPopup from "./CreateTestOrderPopup.jsx";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Link,
  CheckSquare,
  X,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";
import { Listbox } from "@headlessui/react";

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
                    }}>
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

const LabReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    status: "All",
    category: "All",
    gender: "All",
    date: "",
  });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState(null);
  const [formData, setFormData] = useState({
    patient: "",
    department: "",
    type: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [testOrders, setTestOrders] = useState([
    {
      id: "L12345",
      time: "12:30pm",
      patient: "John Smith",
      code: "SMH9875",
      department: "Pathology",
      type: "CBC (Blood Test)",
      status: "Pending",
      gender: "Male",
    },
    {
      id: "R98521",
      time: "12:30pm",
      patient: "Mary Davis",
      code: "SMH9875",
      department: "Radiology",
      type: "X-Ray",
      status: "Completed",
      gender: "Female",
    },
    {
      id: "L87952",
      time: "12:30pm",
      patient: "Alex Brown",
      code: "SMH9875",
      department: "Cardiology",
      type: "Lipid Profile",
      status: "Requires validation",
      gender: "Other",
    },
    {
      id: "R20891",
      time: "12:30pm",
      patient: "Emily Davis",
      code: "SMH9875",
      department: "Radiology",
      type: "Chest X-Ray",
      status: "Inprogress",
      gender: "Female",
    },
    {
      id: "R45078",
      time: "12:30pm",
      patient: "Sarah Williams",
      code: "SMH9875",
      department: "Neurology",
      type: "MRI Brain",
      status: "Pending",
      gender: "Female",
    },
    {
      id: "L56781",
      time: "12:30pm",
      patient: "David Miller",
      code: "SMH9875",
      department: "Gastroenterology",
      type: "LFT (Liver Function)",
      status: "Requires validation",
      gender: "Male",
    },
    {
      id: "R89067",
      time: "12:30pm",
      patient: "Jessica Brown",
      code: "SMH9875",
      department: "Cardiology",
      type: "ECG",
      status: "Completed",
      gender: "Female",
    },
  ]);
  const itemsPerPage = 5;

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const statusColors = {
    Pending: "text-yellow-400 dark:text-yellow-400",
    Completed: "text-green-400 dark:text-green-400",
    "Requires validation": "text-orange-400 dark:text-orange-400",
    Inprogress: "text-blue-400 dark:text-blue-400",
  };

  const openFilterPopup = () => {
    setTempFilters({
      status: filterStatus,
      category: filterCategory,
      gender: filterGender,
      date: filterDate,
    });
    setShowFilterPopup(true);
  };

  const applyFilters = () => {
    setFilterStatus(tempFilters.status);
    setFilterCategory(tempFilters.category);
    setFilterGender(tempFilters.gender);
    setFilterDate(tempFilters.date);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const clearFilters = () => {
    setTempFilters({
      status: "All",
      category: "All",
      gender: "All",
      date: "",
    });
    setFilterStatus("All");
    setFilterCategory("All");
    setFilterGender("All");
    setFilterDate("");
    setCurrentPage(1);
  };

  const filteredData = testOrders.filter((order) => {
    const matchesSearch =
      order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    const matchesCategory =
      filterCategory === "All" || order.department === filterCategory;
    const matchesGender =
      filterGender === "All" || order.gender === filterGender;

    return matchesSearch && matchesStatus && matchesCategory && matchesGender;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === displayedData.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(displayedData.map((order) => order.id));
    }
  };

  const toggleActionMenu = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  const openEditPopup = (order) => {
    setSelectedOrderForEdit(order);
    setFormData({
      patient: order.patient,
      department: order.department,
      type: order.type,
      status: order.status,
    });
    setShowEditPopup(true);
    setShowActionMenu(null);
  };

  const openDeletePopup = (order) => {
    setSelectedOrderForDelete(order);
    setShowDeletePopup(true);
    setShowActionMenu(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient.trim())
      newErrors.patient = "Patient name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.type.trim()) newErrors.type = "Test type is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = () => {
    if (validateForm()) {
      setTestOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderForEdit.id
            ? { ...order, ...formData }
            : order
        )
      );
      setShowEditPopup(false);
      setErrors({});
    }
  };

  const handleCreateOrder = (newOrder) => {
    setTestOrders((prevOrders) => [...prevOrders, newOrder]);
    setShowCreatePopup(false);
  };

  const departments = [...new Set(testOrders.map((order) => order.department))];
  const statusOptions = [
    "All",
    "Pending",
    "Completed",
    "Requires validation",
    "Inprogress",
  ];
  const genderOptions = ["All", "Male", "Female", "Other"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowActionMenu(null);
      }
    };

    if (showActionMenu !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActionMenu]);

  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("Aug");
  const years = ["2023", "2024", "2025", "2026"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
     <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
     bg-white dark:bg-transparent overflow-hidden relative"
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
      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div>
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Laboratory & Radiology
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            Manage staff profiles, departments, roles, attendance, and payroll
            in one place.
          </p>
        </div>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="w-[200px] h-[40px] flex items-center justify-center
    bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)]
    border-b-[2px] border-[#0EFF7B]
    shadow-[0px_2px_12px_0px_#00000040]
    hover:opacity-90
    text-white font-semibold
    px-4 py-2 rounded-[8px]
    transition duration-300 ease-in-out"
  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
>
          <Plus className="w-4 h-4 text-black dark:text-black" />
          Create test order
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            className="flex items-center justify-center gap-2 min-w-[164px] h-[32px] 
            px-4 py-2 rounded-[4px] 
            bg-[#0EFF7B33] dark:bg-[#1E1E1E] 
            text-black dark:text-white text-sm 
            shadow-[0_0_20px_0_#00000066] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] 
            transition relative"
          >
            Fetch Previous Report
          </button>
          <button
            className="flex items-center justify-center gap-2 min-w-[121px] h-[32px] 
            px-4 py-2 rounded-[4px] 
            bg-[#0EFF7B33] dark:bg-[#1E1E1E] 
            text-black dark:text-white text-sm 
            shadow-[0_0_20px_0_#00000066] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] 
            transition relative"
          >
            Integrate PACS
          </button>
          <button
            className="flex items-center justify-center gap-2 min-w-[149px] h-[32px] 
            px-4 py-2 rounded-[4px] 
            bg-[#0EFF7B33] dark:bg-[#1E1E1E] 
            text-black dark:text-white text-sm 
            shadow-[0_0_20px_0_#00000066] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] 
            transition relative"
          >
            Test Type Validation
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Year
            </span>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none bg-white dark:bg-[#0D0D0D] text-black dark:text-white border border-[#08994A] shadow-[0_0_4px_0_#0EFF7B] rounded-md px-4 py-1 pr-8 focus:outline-none"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-2 text-[#08994A] pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Month
            </span>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none bg-white dark:bg-[#0D0D0D] text-black dark:text-white border border-[#08994A] shadow-[0_0_4px_0_#0EFF7B] rounded-md px-4 py-1 pr-8 focus:outline-none"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-2 text-[#08994A] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Test Orders & Clear Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-black dark:text-white">
          Recent Test Orders
          <p className="text-sm text-[#A0A0A0] mt-1">List of all stocks</p>
        </h1>

        {(filterStatus !== "All" ||
          filterCategory !== "All" ||
          filterGender !== "All" ||
          filterDate !== "") && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#08994A] dark:text-[#0EFF7B] hover:underline flex items-center gap-1"
          >
            Clear all filters
            <X className="w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        )}
      </div>

      {/* Bordered Container for Categories Dropdown to Table */}
      <div className="border border-[#0EFF7B] dark:border-[#3A3A3A] rounded-[12px] p-4">
        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Listbox
              value={filterCategory}
              onChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}
            >
              <Listbox.Button className="min-w-[180px]  appearance-none bg-[#0EFF7B1A] dark:bg-[#000000] px-4 py-2 rounded-[8px] flex items-center border border-[#3C3C3C] text-[#08994A] dark:text-[#5CD592] text-sm pr-8 focus:outline-none">
                {filterCategory === "All" ? "Departments" : filterCategory}
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 min-w-[180px] rounded-[8px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto">
                <Listbox.Option
                  value="All"
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                      active
                        ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                        : "text-black dark:text-white"
                    } ${
                      selected
                        ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                        : ""
                    }`
                  }
                >
                  All
                </Listbox.Option>
                {departments.map((dept, index) => (
                  <Listbox.Option
                    key={index}
                    value={dept}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                        active
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                          : "text-black dark:text-white"
                      } ${
                        selected
                          ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                          : ""
                      }`
                    }
                  >
                    {dept}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
              <input
                type="text"
                placeholder="Search patient name or test type.."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] placeholder-[#5CD592] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#5CD592] text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={openFilterPopup}
              className="bg-gray-100 dark:bg-[#0EFF7B1A] rounded-[20px] w-[32px] h-[32px] flex items-center justify-center text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A]"
            >
              <Filter
                size={18}
                className="text-[#0EFF7B] dark:text-[#0EFF7B]"
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-black rounded-xl shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 dark:bg-[#091810] h-[52px]">
              <tr className="border-b border-gray-300 dark:border-[#000000] text-[#0EFF7B] dark:text-[#0EFF7B]">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === displayedData.length &&
                      displayedData.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                  />
                </th>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Patient Name</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Test Type</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] relative"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">
                    {order.patient}{" "}
                    <span className="text-gray-600 dark:text-gray-500 text-xs block">
                      {order.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">
                    {order.department}
                  </td>
                  <td className="py-3 px-4 text-gray-800 dark:text-white">
                    {order.type}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      ref={showActionMenu === order.id ? buttonRef : null}
                      onClick={() => toggleActionMenu(order.id)}
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400 cursor-pointer" />
                    </button>
                    {showActionMenu === order.id && (
                      <div
                        ref={menuRef}
                        className={`absolute right-6 bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg shadow-lg z-10 w-55 ${
                          idx >= displayedData.length - 2
                            ? "bottom-full mb-2"
                            : "top-full mt-2"
                        }`}
                      >
                        <button
                          onClick={() => openEditPopup(order)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] w-full text-left"
                        >
                          <Edit2 className="w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeletePopup(order)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-700 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] w-full text-left"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-700" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Popup */}
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
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4">
                <h2
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter Test Orders
                </h2>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>

              {/* Filter Fields */}
              <div className="grid grid-cols-2 gap-6">
                <Dropdown
                  label="Category"
                  value={tempFilters.category}
                  onChange={(value) =>
                    setTempFilters({ ...tempFilters, category: value })
                  }
                  options={["All", ...departments]}
                  className="w-[228px] h-[32px] mt-1"
                />

                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Last Test Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tempFilters.date}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, date: e.target.value })
                      }
                      className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-3.5 text-black dark:text-[#0EFF7B] pointer-events-none"
                    />
                  </div>
                </div>

                <Dropdown
                  label="Status"
                  value={tempFilters.status}
                  onChange={(value) =>
                    setTempFilters({ ...tempFilters, status: value })
                  }
                  options={statusOptions}
                  className="w-[228px] h-[32px] mt-1"
                />

                <Dropdown
                  label="Gender"
                  value={tempFilters.gender}
                  onChange={(value) =>
                    setTempFilters({ ...tempFilters, gender: value })
                  }
                  options={genderOptions}
                  className="w-[228px] h-[32px] mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => {
                    clearFilters();
                    setTempFilters({
                      status: "All",
                      category: "All",
                      gender: "All",
                      date: "",
                    });
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Cancel
                </button>

                <button
                  onClick={applyFilters}
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

      {/* Pagination */}
      <div className="flex items-center mt-4 bg-white dark:bg-[#000000] rounded gap-x-4">
        <div className="text-sm text-gray-600 dark:text-white">
          Page{" "}
          <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
            {currentPage}
          </span>{" "}
          of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} from{" "}
          {filteredData.length} Orders)
        </div>
        <div className="flex items-center gap-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
            }`}
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
            }`}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No test orders found matching your criteria.
        </div>
      )}

      {/* Create Test Order Popup */}
      {showCreatePopup && (
        <CreateTestOrderPopup
          onClose={() => setShowCreatePopup(false)}
          onCreate={handleCreateOrder}
        />
      )}

      {/* Edit Popup */}
      {showEditPopup && selectedOrderForEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
      bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
      dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4">
                <h2
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Edit Test Order
                </h2>
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                {/* Patient Name */}
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Patient Name
                  </label>
                  <input
                    name="patient"
                    value={formData.patient}
                    onChange={(e) =>
                      setFormData({ ...formData, patient: e.target.value })
                    }
                    placeholder="Enter patient name"
                    className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                  {errors.patient && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.patient}
                    </p>
                  )}
                </div>

                {/* Department Dropdown */}
                <Dropdown
                  label="Department"
                  value={formData.department}
                  onChange={(val) =>
                    setFormData({ ...formData, department: val })
                  }
                  options={departments}
                  error={errors.department}
                  className="w-[228px] h-[32px] mt-1"
                />

                {/* Test Type */}
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Test Type
                  </label>
                  <input
                    name="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="Enter test type"
                    className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                  {errors.type && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Status Dropdown */}
                <Dropdown
                  label="Status"
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={statusOptions.slice(1)}
                  error={errors.status}
                  className="w-[228px] h-[32px] mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEdit}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
            text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && selectedOrderForDelete && (
        <DeleteLabReportPopup
          order={selectedOrderForDelete}
          onClose={() => setShowDeletePopup(false)}
          onConfirm={(id) => {
            setTestOrders((prevOrders) =>
              prevOrders.filter((order) => order.id !== id)
            );
            setShowDeletePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default LabReport;
