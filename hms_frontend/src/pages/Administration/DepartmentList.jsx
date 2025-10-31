import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Heart,
  Syringe,
  Sun,
  Activity,
  Baby,
  Pill,
  Brain,
  Bone,
  Scan,
  Droplet,
  Wind,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import AddDepartmentPopup from "./AddDepartment";
import EditDepartmentPopup from "./EditDepartmentPopup";
import DeleteDepartmentPopup from "./DeleteDepartmentPopup";

const API_BASE = "http://127.0.0.1:8000";

const DepartmentList = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOrder, setSortOrder] = useState("A-to-Z");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtersData, setFiltersData] = useState({
    name: "",
    status: "",
  });

  const [departments, setDepartments] = useState([]);

  // API Functions
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/departments/`);
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      // Transform backend data to frontend format
      const transformed = data.map((dept) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description || "",
        status: dept.status.charAt(0).toUpperCase() + dept.status.slice(1),
      }));
      setDepartments(transformed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDepartmentStatus = useCallback(async (departmentId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/departments/${departmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus.toLowerCase(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      await fetchDepartments(); // Refresh list
    } catch (err) {
      console.error("Update error:", err);
    }
  }, [fetchDepartments]);

  const deleteDepartment = useCallback(async (departmentId) => {
    try {
      const response = await fetch(`${API_BASE}/departments/${departmentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete department");
      }
      await fetchDepartments(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, [fetchDepartments]);

  // Initial fetch
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Add Department callback
  const handleAddDepartment = useCallback((newDept) => {
    setDepartments((prev) => [...prev, {
      id: newDept.id,
      name: newDept.name,
      description: newDept.description || "",
      status: newDept.status.charAt(0).toUpperCase() + newDept.status.slice(1),
    }]);
  }, []);

  // Bulk Status Change
  const handleBulkStatusChange = useCallback((newStatus) => {
    if (selectedDepartments.length === 0) return;
    
    const updates = selectedDepartments.map(id => 
      updateDepartmentStatus(id, newStatus)
    );
    
    Promise.all(updates).then(() => {
      setSelectedDepartments([]);
      setBulkStatus(null);
    });
  }, [selectedDepartments, updateDepartmentStatus]);

  const statusColors = {
    Active: "bg-[#08994A] dark:bg-[#08994A] text-white dark:text-white",
    Inactive: "bg-gray-300 dark:bg-gray-700 text-black dark:text-white",
  };

  const departmentIcons = {
    Cardiology: Heart,
    Anesthesiology: Syringe,
    Dermatology: Sun,
    Gastroenterology: Activity,
    Gynaecology: Baby,
    Pharmacy: Pill,
    Neurology: Brain,
    Orthopedic: Bone,
    Radiology: Scan,
    Urology: Droplet,
    Pulmonology: Wind,
    Endocrinology: Zap,
  };

  const filteredAndSortedDepartments = useMemo(() => {
    let result = departments.filter((dept) => {
      if (
        searchTerm &&
        !(
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (
        filtersData.name &&
        !dept.name.toLowerCase().includes(filtersData.name.toLowerCase())
      ) {
        return false;
      }
      if (filtersData.status && dept.status !== filtersData.status) {
        return false;
      }
      return true;
    });

    if (sortOrder === "A-to-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "Z-to-A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [departments, searchTerm, filtersData, sortOrder]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDepartments = filteredAndSortedDepartments.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredAndSortedDepartments.length / itemsPerPage
  );

  const handleCheckboxChange = (id) => {
    if (selectedDepartments.includes(id)) {
      setSelectedDepartments(selectedDepartments.filter((sid) => sid !== id));
    } else {
      setSelectedDepartments([...selectedDepartments, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDepartments.length === currentDepartments.length) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(currentDepartments.map((dept) => dept.id));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltersData({ ...filtersData, [name]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFiltersData({ name: "", status: "" });
    setSortOrder("A-to-Z");
    setItemsPerPage(8);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const Dropdown = ({ value, onChange, options }) => (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button
          className="w-full h-[42px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] 
                 dark:border-[#3A3A3A] bg-white dark:bg-transparent 
                 text-[#08994A] dark:text-[#0EFF7B] text-left 
                 text-sm leading-[16px]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>

        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black 
                 shadow-lg z-[60] border border-[#0EFF7B] 
                 dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
        >
          {options.map((option, idx) => {
            const label = typeof option === "string" ? option : option.label;
            const val = typeof option === "string" ? option : option.value;
            return (
              <Listbox.Option
                key={idx}
                value={val}
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
                {label}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </div>
    </Listbox>
  );

  const applySettings = () => {
    setCurrentPage(1);
    setShowSettingsPopup(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#0EFF7B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchDepartments}
          className="px-4 py-2 bg-[#0EFF7B] text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div
        className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-[8px] p-6 w-full max-w-[1400px] mx-auto flex flex-col  
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
        <div className="flex justify-between items-center mt-4 mb-2">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Department Lists
          </h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] border-b border-[#0EFF7B] text-white font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <Plus size={18} className="text-white" /> Add Department
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have total {departments.length} departments.
        </p>

        {/* Change Status Dropdown */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4 relative w-5 h-5">
            <input
              type="checkbox"
              className="appearance-none bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#A0A0A0] w-5 h-5 rounded checked:bg-[#08994A] dark:checked:bg-green-900 checked:border-[#0EFF7B] dark:checked:border-green-500"
              checked={
                currentDepartments.length > 0 &&
                selectedDepartments.length === currentDepartments.length
              }
              onChange={handleSelectAll}
            />
            {selectedDepartments.length > 0 &&
              currentDepartments.length > 0 &&
              selectedDepartments.length === currentDepartments.length && (
                <Check
                  size={16}
                  className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                />
              )}
          </div>

          <Listbox value={bulkStatus} onChange={handleBulkStatusChange}>
            <div className="relative w-[164px]">
              <Listbox.Button className="w-full h-[40px] rounded-[8px] dark:border-[#3C3C3C] bg-[#025126] dark:bg-[#025126] text-white dark:text-white text-[16px] flex items-center justify-between px-4">
                {bulkStatus || "Change Status"}
                <ChevronDown className="h-5 w-5 text-[#0EFF7B] dark:text-[#0EFF7B]" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 min-w-full w-full rounded-md bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A]">
                {["Active", "Inactive"].map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none py-2 px-4 text-sm ${
                        active
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                          : "text-black dark:text-white"
                      }`
                    }
                  >
                    {option}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-4 justify-end">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#08994A] dark:text-[#0EFF7B]"
            />
            <input
              type="text"
              placeholder="Search department or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[280px] h-[42px] pl-10 pr-3 rounded-[8px] border border-[#0EFF7B]
                         dark:border-[#3A3A3A] bg-white dark:bg-transparent
                         text-black dark:text-white placeholder-gray-500
                         outline-none text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center gap-2 bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-700 text-[#08994A] dark:text-white px-4 py-2 rounded-full hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
          >
            <Filter size={18} className="text-[#08994A] dark:text-white" />
          </button>
          <button
            onClick={() => setShowSettingsPopup(true)}
            className="flex items-center gap-2 bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-700 text-[#08994A] dark:text-white px-4 py-2 rounded-full hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
          >
            <Settings size={18} className="text-[#08994A] dark:text-white" />
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-[#F5F6F5] dark:bg-[#091810] text-[#08994A] dark:text-[#0EFF7B] border-b border-gray-300 dark:border-gray-700 sticky top-0 z-[10]">
              <tr>
                <th className="py-3 px-4">
                  <div className="flex items-center relative w-5 h-5">
                    <input
                      type="checkbox"
                      className="appearance-none bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#A0A0A0] w-5 h-5 rounded checked:bg-[#08994A] dark:checked:bg-green-900 checked:border-[#0EFF7B] dark:checked:border-green-500"
                      checked={
                        currentDepartments.length > 0 &&
                        selectedDepartments.length === currentDepartments.length
                      }
                      onChange={handleSelectAll}
                    />
                    {selectedDepartments.length > 0 &&
                      currentDepartments.length > 0 &&
                      selectedDepartments.length ===
                        currentDepartments.length && (
                        <Check
                          size={16}
                          className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      )}
                  </div>
                </th>
                <th className="px-4 ">Department</th>
                <th className="px-4">Description</th>
                <th className="px-4">Status</th>
                <th className="text-center px-4">...</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-600">
              {currentDepartments.length > 0 ? (
                currentDepartments.map((dept, idx) => {
                  const IconComponent = departmentIcons[dept.name] || Activity;
                  return (
                    <tr
                      key={dept.id}
                      className="border-b border-gray-300 dark:border-gray-600 h-[54px] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                    >
                      <td className="px-4">
                        <div className="flex items-center relative w-5 h-5">
                          <input
                            type="checkbox"
                            className="appearance-none bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#A0A0A0] w-5 h-5 rounded checked:bg-[#08994A] dark:checked:bg-green-900 checked:border-[#0EFF7B] dark:checked:border-green-500"
                            checked={selectedDepartments.includes(dept.id)}
                            onChange={() => handleCheckboxChange(dept.id)}
                          />
                          {selectedDepartments.includes(dept.id) && (
                            <Check
                              size={16}
                              className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            />
                          )}
                        </div>
                      </td>
                      <td className="font-medium px-4 text-black dark:text-white text-left">
                        <IconComponent size={16} className="inline mr-2 text-[#08994A]" />
                        {dept.name}
                      </td>
                      <td className="text-gray-600 dark:text-gray-400 px-4 max-w-xs truncate">
                        {dept.description}
                      </td>
                      <td className="px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusColors[dept.status]
                          }`}
                        >
                          {dept.status}
                        </span>
                      </td>
                      <td className="text-center px-4 relative">
                        <div
                          className="cursor-pointer flex justify-center"
                          onClick={() =>
                            setMenuOpenFor(
                              menuOpenFor === dept.id ? null : dept.id
                            )
                          }
                        >
                          <MoreHorizontal
                            size={20}
                            className="text-[#08994A] dark:text-[white]"
                          />
                        </div>
                        {menuOpenFor === dept.id && (
                          <div
                            className={`absolute right-0 mr-3 z-[50] w-40 rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-[#0EFF7B] dark:ring-gray-700 ${
                              idx >= currentDepartments.length - 2
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                          >
                            <ul className="py-1">
                              <li>
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                                  onClick={() => {
                                    setSelectedDepartment(dept);
                                    setShowEditPopup(true);
                                    setMenuOpenFor(null);
                                  }}
                                >
                                  <Edit
                                    size={16}
                                    className="mr-2 text-blue-500 dark:text-blue-400"
                                  />{" "}
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                                  onClick={() => {
                                    setSelectedDepartment(dept);
                                    setShowDeletePopup(true);
                                    setMenuOpenFor(null);
                                  }}
                                >
                                  <Trash2
                                    size={16}
                                    className="mr-2 text-red-500 dark:text-red-400"
                                  />{" "}
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                  >
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
            <div className="text-sm text-black dark:text-white">
              Page{" "}
              <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
                {currentPage}
              </span>{" "}
              of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedDepartments.length
              )}{" "}
              from {filteredAndSortedDepartments.length} Departments)
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                  currentPage === 1
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                    : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                }`}
              >
                <ChevronLeft
                  size={12}
                  className="text-[#08994A] dark:text-white"
                />
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                  currentPage === totalPages
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                    : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                }`}
              >
                <ChevronRight
                  size={12}
                  className="text-[#08994A] dark:text-white"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Popup */}
        {showFilterPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[50]">
            <div className="relative w-[504px] border-[#0EFF7B] rounded-[20px] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6">
              {/* Gradient Border */}
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
                <h3 className="text-black dark:text-white font-medium text-[16px]">
                  Filter
                </h3>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                >
                  <X size={16} className="text-[#08994A] dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Department Name */}
                <div className="flex flex-col w-[228px]">
                  <label className="text-sm text-black dark:text-white mb-1">
                    Department Name
                  </label>
                  <input
                    name="name"
                    value={filtersData.name}
                    onChange={handleFilterChange}
                    placeholder="Enter Name"
                    className="w-full h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] 
                 dark:border-[#3A3A3A] bg-white dark:bg-transparent 
                 text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                 dark:placeholder-gray-500 outline-none text-sm"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-col w-[228px]">
                  <label className="text-sm text-black dark:text-white mb-1">
                    Status
                  </label>
                  <Dropdown
                    value={filtersData.status}
                    onChange={(val) => {
                      setFiltersData({ ...filtersData, status: val });
                      setCurrentPage(1);
                    }}
                    options={["Active", "Inactive"]}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-8">
                <button
                  onClick={handleClearFilters}
                  className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setShowFilterPopup(false);
                    setCurrentPage(1);
                  }}
                  className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B] dark:border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{
                    background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Popup */}
        {showSettingsPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[50]">
            <div className="relative w-[504px] border-[#0EFF7B] rounded-[20px] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6">
              {/* Gradient Border */}
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
                <h3 className="text-black dark:text-white font-medium text-[16px]">
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettingsPopup(false)}
                  className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                >
                  <X size={16} className="text-[#08994A] dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 items-end">
                {/* Number of Lines */}
                <div>
                  <label className="text-sm text-black dark:text-white">
                    Number of Lines
                  </label>
                  <Listbox value={itemsPerPage} onChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}>
                    <div className="relative w-full min-w-0">
                      <Listbox.Button className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]">
                        {itemsPerPage}
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options 
                        className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[60] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto left-0 no-scrollbar"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
                          <Listbox.Option
                            key={option}
                            value={option}
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
                            {option}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

                {/* Order Dropdown */}
                <div>
                  <label className="text-sm text-black dark:text-white">Order</label>
                  <Dropdown
                    value={sortOrder}
                    onChange={(v) => {
                      setSortOrder(v);
                      setCurrentPage(1);
                    }}
                    options={[
                      { label: "A to Z", value: "A-to-Z" },
                      { label: "Z to A", value: "Z-to-A" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-8">
                <button
                  onClick={handleClearFilters}
                  className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                >
                  Clear
                </button>
                <button
                  onClick={applySettings}
                  className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B] dark:border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{
                    background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popups */}
        {showAddPopup && (
          <AddDepartmentPopup 
            onClose={() => setShowAddPopup(false)} 
            onSave={handleAddDepartment}
          />
        )}
        {showEditPopup && (
          <EditDepartmentPopup
            onClose={() => setShowEditPopup(false)}
            department={selectedDepartment}
            onSave={fetchDepartments}
          />
        )}
        {showDeletePopup && (
          <DeleteDepartmentPopup
            onClose={() => setShowDeletePopup(false)}
            department={selectedDepartment}
            onConfirm={() => {
              deleteDepartment(selectedDepartment.id);
              setShowDeletePopup(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentList;