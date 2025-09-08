import React, { useState, useRef, useEffect } from "react";
import DeleteLabReportPopup from "./DeleteLabReport.jsx";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronDown,
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

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value || "Select"} onChange={onChange}>
      <div className="relative w-full min-w-0">
        <Listbox.Button
          className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option.value || option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                  active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
              }
            >
              {option.label || option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
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
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState(null);
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
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesCategory = filterCategory === "All" || order.department === filterCategory;
    const matchesGender = filterGender === "All" || order.gender === filterGender;

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
    setShowEditPopup(true);
    setShowActionMenu(null);
  };

  const openDeletePopup = (order) => {
    setSelectedOrderForDelete(order);
    setShowDeletePopup(true);
    setShowActionMenu(null);
  };

  const handleSaveEdit = () => {
    setTestOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderForEdit.id ? selectedOrderForEdit : order
      )
    );
    setShowEditPopup(false);
  };

  const departments = [...new Set(testOrders.map((order) => order.department))];
  const statusOptions = ["All", "Pending", "Completed", "Requires validation", "Inprogress"];
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

  return (
    <div className="bg-white dark:bg-black mt-[70px] text-black dark:text-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-black dark:text-white">Laboratory & Radiology</h1>
        <button
          className="flex items-center justify-center w-[200px] h-[40px] gap-2 rounded-[20px] text-white font-medium shadow-md bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] border border-[#0EFF7B66] dark:border-[#0EFF7B66] hover:scale-105 transition"
        >
          <Plus className="w-4 h-4 text-black dark:text-black" />
          Create test order
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          className="flex items-center gap-2 min-w-[220px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white text-sm hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
        >
          <Download className="w-4 h-4 text-[#08994A] dark:text-white" />
          Fetch Previous Report
        </button>
        <button
          className="flex items-center gap-2 min-w-[166px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white text-sm hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
        >
          <Link className="w-4 h-4 text-[#08994A] dark:text-white" />
          Integrate PACS
        </button>
        <button
          className="flex items-center gap-2 min-w-[205px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white text-sm hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
        >
          <CheckSquare className="w-4 h-4 text-[#08994A] dark:text-white" />
          Test Type Validation
        </button>
      </div>

      {/* Recent Test Orders & Clear Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-black dark:text-white">Recent Test Orders</h1>
        {(filterStatus !== "All" || filterCategory !== "All" || filterGender !== "All" || filterDate !== "") && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#08994A] dark:text-[#0EFF7B] hover:underline flex items-center gap-1"
          >
            Clear all filters
            <X className="w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
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
            className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#5CD592] text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-white">
            Page <span className="text-green-500 dark:text-green-500">{currentPage}</span> of {totalPages} (
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} Orders)
          </span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-200 dark:bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-black dark:text-white disabled:opacity-50"
          >
            &lt;
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-200 dark:bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-black dark:text-white disabled:opacity-50"
          >
            &gt;
          </button>
          <div className="relative">
            <Listbox
              value={filterCategory}
              onChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}
            >
              <Listbox.Button
                className="appearance-none bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] px-4 py-2 rounded-[20px] flex items-center text-[#08994A] dark:text-[#5CD592] text-sm pr-8 focus:outline-none"
              >
                {filterCategory === "All" ? "Categories" : filterCategory}
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
              </Listbox.Button>
              <Listbox.Options
                className="absolute mt-1 min-w-[150px] rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
              >
                <Listbox.Option
                  value="All"
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                      active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                    } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                  }
                >
                  Categories
                </Listbox.Option>
                {departments.map((dept, index) => (
                  <Listbox.Option
                    key={index}
                    value={dept}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                        active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                      } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                    }
                  >
                    {dept}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <button
            onClick={openFilterPopup}
            className="flex items-center gap-2 bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white px-4 py-2 rounded-full border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
          >
            <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#000000] border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-xl p-6 w-[700px]">
            <div className="flex justify-between items-center mb-6 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33] pb-3">
              <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">Filter Test Orders</h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
              >
                <X className="w-5 h-5 text-[#08994A] dark:text-[#0EFF7B]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Category</label>
                <div className="relative">
                  <Listbox
                    value={tempFilters.category}
                    onChange={(value) => setTempFilters({ ...tempFilters, category: value })}
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {tempFilters.category === "All" ? "Select category" : tempFilters.category}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      <Listbox.Option
                        value="All"
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                          } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                        }
                      >
                        Select category
                      </Listbox.Option>
                      {departments.map((dept) => (
                        <Listbox.Option
                          key={dept}
                          value={dept}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                            } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                          }
                        >
                          {dept}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Last Test Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempFilters.date}
                    onChange={(e) => setTempFilters({ ...tempFilters, date: e.target.value })}
                    className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                  />
                  <Calendar className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Status</label>
                <div className="relative">
                  <Listbox
                    value={tempFilters.status}
                    onChange={(value) => setTempFilters({ ...tempFilters, status: value })}
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {tempFilters.status === "All" ? "Select status" : tempFilters.status}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      <Listbox.Option
                        value="All"
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                          } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                        }
                      >
                        Select status
                      </Listbox.Option>
                      {statusOptions.slice(1).map((status) => (
                        <Listbox.Option
                          key={status}
                          value={status}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                            } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                          }
                        >
                          {status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Gender</label>
                <div className="relative">
                  <Listbox
                    value={tempFilters.gender}
                    onChange={(value) => setTempFilters({ ...tempFilters, gender: value })}
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {tempFilters.gender === "All" ? "Select gender" : tempFilters.gender}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      <Listbox.Option
                        value="All"
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                          } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                        }
                      >
                        Select gender
                      </Listbox.Option>
                      {genderOptions.slice(1).map((gender) => (
                        <Listbox.Option
                          key={gender}
                          value={gender}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                            } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                          }
                        >
                          {gender}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4">
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
                className="px-5 py-2.5 text-sm rounded-lg bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#0D0D0D] text-[#08994A] dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="px-5 py-2.5 text-sm rounded-lg bg-[#08994A] dark:bg-[#0EFF7B] text-white dark:text-black font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-black rounded-xl shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 dark:bg-[#1E1E1E] h-[52px]">
            <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === displayedData.length && displayedData.length > 0}
                  onChange={toggleSelectAll}
                  className="accent-[#08994A] dark:accent-[#0EFF7B]"
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
                className="border-b border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/50 relative"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="accent-[#08994A] dark:accent-[#0EFF7B]"
                  />
                </td>
                <td className="py-3 px-4 text-gray-800 dark:text-white">{order.id}</td>
                <td className="py-3 px-4 text-gray-800 dark:text-white">
                  {order.patient}{" "}
                  <span className="text-gray-600 dark:text-gray-500 text-xs block">{order.code}</span>
                </td>
                <td className="py-3 px-4 text-gray-800 dark:text-white">{order.department}</td>
                <td className="py-3 px-4 text-gray-800 dark:text-white">{order.type}</td>
                <td className={`py-3 px-4 font-medium ${statusColors[order.status]}`}>{order.status}</td>
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
                        idx >= displayedData.length - 2 ? "bottom-full mb-2" : "top-full mt-2"
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

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No test orders found matching your criteria.
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && selectedOrderForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#000000] border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-xl p-6 w-[700px]">
            <div className="flex justify-between items-center mb-6 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33] pb-3">
              <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">Edit Order</h3>
              <button
                onClick={() => setShowEditPopup(false)}
                className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
              >
                <X className="w-5 h-5 text-[#08994A] dark:text-[#0EFF7B]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Patient Name</label>
                <input
                  type="text"
                  value={selectedOrderForEdit.patient}
                  onChange={(e) =>
                    setSelectedOrderForEdit({ ...selectedOrderForEdit, patient: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Department</label>
                <div className="relative">
                  <Listbox
                    value={selectedOrderForEdit.department}
                    onChange={(value) =>
                      setSelectedOrderForEdit({ ...selectedOrderForEdit, department: value })
                    }
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {selectedOrderForEdit.department || "Select"}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      {departments.map((dept) => (
                        <Listbox.Option
                          key={dept}
                          value={dept}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                            } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                          }
                        >
                          {dept}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Test Type</label>
                <input
                  type="text"
                  value={selectedOrderForEdit.type}
                  onChange={(e) =>
                    setSelectedOrderForEdit({ ...selectedOrderForEdit, type: e.target.value })
                  }
                  className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Status</label>
                <div className="relative">
                  <Listbox
                    value={selectedOrderForEdit.status}
                    onChange={(value) =>
                      setSelectedOrderForEdit({ ...selectedOrderForEdit, status: value })
                    }
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {selectedOrderForEdit.status || "Select"}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      {statusOptions.slice(1).map((status) => (
                        <Listbox.Option
                          key={status}
                          value={status}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                            } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                          }
                        >
                          {status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4">
              <button
                onClick={() => setShowEditPopup(false)}
                className="px-5 py-2.5 text-sm rounded-lg bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#0D0D0D] text-[#08994A] dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 text-sm rounded-lg bg-[#08994A] dark:bg-[#0EFF7B] text-white dark:text-black font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968]"
              >
                Update
              </button>
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
            setTestOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
            setShowDeletePopup(false);
          }}
        />
      )}
    </div>
  );
  
};

export default LabReport;