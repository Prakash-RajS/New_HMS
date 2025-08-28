// DepartmentList.jsx
import React, { useState, useMemo } from "react";
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
// import EditDepartmentPopup from "./EditDepartmentPopup";
import DeleteDepartmentPopup from "./DeleteDepartmentPopup";

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

  const [filtersData, setFiltersData] = useState({
    name: "",
    status: "",
  });

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Cardiology",
      description:
        "Cardiology is a branch of medicine that deals with the disorders of the heart as well as some parts of the circulatory system.",
      status: "Active",
    },
    {
      id: 2,
      name: "Anesthesiology",
      description:
        "Anesthesiology is the medical specialty concerned with the total perioperative care of patients before, during and after surgery.",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Dermatology",
      description:
        "Dermatology is the branch of medicine dealing with the skin, nails, hair and its diseases.",
      status: "Active",
    },
    {
      id: 4,
      name: "Gastroenterology",
      description:
        "Gastroenterology is the branch of medicine focused on the digestive system and its disorders.",
      status: "Active",
    },
    {
      id: 5,
      name: "Gynaecology",
      description:
        "Gynaecology is the medical practice dealing with the health of the female reproductive system.",
      status: "Active",
    },
    {
      id: 6,
      name: "Pharmacy",
      description:
        "Pharmacy is the clinical health science that links medical science with chemistry and it is charged with the discovery, production, disposal, safe and effective use, and control of medications and drugs.",
      status: "Active",
    },
    {
      id: 7,
      name: "Neurology",
      description:
        "Neurology is a branch of medicine dealing with disorders of the nervous system.",
      status: "Inactive",
    },
    {
      id: 8,
      name: "Orthopedic",
      description:
        "Orthopedic is the branch of surgery concerned with conditions involving the musculoskeletal system.",
      status: "Active",
    },
    {
      id: 9,
      name: "Radiology",
      description:
        "Radiology is the medical discipline that uses medical imaging to diagnose diseases and guide their treatment, within the bodies of humans and other animals.",
      status: "Active",
    },
    {
      id: 10,
      name: "Urology",
      description:
        "Urology is the branch of medicine that focuses on surgical and medical diseases of the urinary-tract system and the reproductive organs.",
      status: "Active",
    },
    {
      id: 11,
      name: "Pulmonology",
      description:
        "Pulmonology is a medical specialty that deals with diseases involving the respiratory tract.",
      status: "Active",
    },
    {
      id: 12,
      name: "Endocrinology",
      description:
        "Endocrinology is a branch of biology and medicine dealing with the endocrine system, its diseases, and its specific secretions known as hormones.",
      status: "Active",
    },
  ]);

  const statusColors = {
    Active: "bg-green-900 text-green-300",
    Inactive: "bg-gray-700 text-gray-300",
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
      if (filtersData.name && !dept.name.toLowerCase().includes(filtersData.name.toLowerCase())) {
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
  const currentDepartments = filteredAndSortedDepartments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAndSortedDepartments.length / itemsPerPage);

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
  };

  const handleClearFilters = () => {
    setFiltersData({
      name: "",
      status: "",
    });
    setSortOrder("A-to-Z");
    setItemsPerPage(8);
  };

  const handleBulkStatusChange = (val) => {
    setBulkStatus(val);
    if (selectedDepartments.length > 0 && val) {
      setDepartments((depts) =>
        depts.map((d) => (selectedDepartments.includes(d.id) ? { ...d, status: val } : d))
      );
      setSelectedDepartments([]);
      setBulkStatus(null);
    }
  };

  const Dropdown = ({ label, value, onChange, options }) => (
    <div className="space-y-1 w-full">
      <label className="text-sm text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full min-w-0">
          <Listbox.Button
            className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-[50] border border-[#3A3A3A] max-h-60 overflow-y-auto left-0"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option.value || option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                    active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"
                  } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
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

  const applySettings = () => {
    setCurrentPage(1);
    setShowSettingsPopup(false);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mt-[60px] mb-4 h-[817px] bg-black text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Department Lists</h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold"
          >
            <Plus size={18} /> Add Department
          </button>
        </div>

        <p className="text-gray-400 mb-6">You have total {departments.length} departments.</p>

        {/* Change Status Dropdown */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4 relative w-5 h-5">
            <input
              type="checkbox"
              className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500"
              checked={
                currentDepartments.length > 0 &&
                selectedDepartments.length === currentDepartments.length
              }
              onChange={handleSelectAll}
            />
            {selectedDepartments.length > 0 && currentDepartments.length > 0 && selectedDepartments.length === currentDepartments.length && (
              <Check
                size={16}
                className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            )}
          </div>
          
          <Listbox value={bulkStatus} onChange={handleBulkStatusChange}>
            <div className="relative w-[164px]">
              <Listbox.Button className="w-full h-[40px] rounded-[20px] border border-[#3C3C3C] bg-transparent text-white text-[16px] flex items-center justify-between px-4">
                {bulkStatus || "Change Status"}
                <ChevronDown className="h-5 w-5 text-white" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 min-w-full w-full rounded-md bg-black shadow-lg z-[50] border border-[#3A3A3A]">
                {["Active", "Inactive"].map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none py-2 px-4 text-sm ${
                        active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"
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
          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center gap-2 bg-[#0D0D0D] text-white px-4 py-2 rounded-full border border-gray-700"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => setShowSettingsPopup(true)}
            className="flex items-center gap-2 bg-[#0D0D0D] text-white px-4 py-2 rounded-full border border-gray-700"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-[#1E1E1E] text-white border-b border-gray-700 sticky top-0 z-[10]">
              <tr>
                <th className="py-3 px-4">
                  <div className="flex items-center relative w-5 h-5">
                    <input
                      type="checkbox"
                      className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500"
                      checked={
                        currentDepartments.length > 0 &&
                        selectedDepartments.length === currentDepartments.length
                      }
                      onChange={handleSelectAll}
                    />
                    {selectedDepartments.length > 0 && currentDepartments.length > 0 && selectedDepartments.length === currentDepartments.length && (
                      <Check
                        size={16}
                        className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      />
                    )}
                  </div>
                </th>
                <th className="px-4">Icon</th>
                <th className="px-4">Department</th>
                <th className="px-4">Description</th>
                <th className="px-4">Status</th>
                <th className="text-center px-4">...</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.length > 0 ? (
                currentDepartments.map((dept) => {
                  const IconComponent = departmentIcons[dept.name] || Activity;
                  return (
                    <tr key={dept.id} className="bg-black border-b border-gray-600 h-[54px]">
                      <td className="px-4">
                        <div className="flex items-center relative w-5 h-5">
                          <input
                            type="checkbox"
                            className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500"
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
                      <td className="px-4">
                        <IconComponent size={24} className="text-white" />
                      </td>
                      <td className="font-medium px-4">{dept.name}</td>
                      <td className="text-gray-400 px-4 max-w-xs truncate">{dept.description}</td>
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
                            setMenuOpenFor(menuOpenFor === dept.id ? null : dept.id)
                          }
                        >
                          <MoreHorizontal size={20} className="text-white" />
                        </div>
                        {menuOpenFor === dept.id && (
                          <div className="absolute right-0 mr-3 z-[50] mt-2 w-40 rounded-md bg-black shadow-lg ring-1 ring-gray-700">
                            <ul className="py-1">
                              <li>
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                                  onClick={() => {
                                    setSelectedDepartment(dept);
                                    setShowEditPopup(true);
                                    setMenuOpenFor(null);
                                  }}
                                >
                                  <Edit size={16} className="mr-2 text-blue-400" /> Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                                  onClick={() => {
                                    setSelectedDepartment(dept);
                                    setShowDeletePopup(true);
                                    setMenuOpenFor(null);
                                  }}
                                >
                                  <Trash2 size={16} className="mr-2 text-red-400" /> Delete
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
                  <td colSpan="6" className="text-center py-6 text-gray-400 italic">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center mt-4 bg-black p-4 rounded gap-x-4">
          <div className="text-sm text-white">
            Page <span className="text-[#0EFF7B] font-semibold">{currentPage}</span> of {totalPages} (
            {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedDepartments.length)}{" "}
            from {filteredAndSortedDepartments.length} Departments)
          </div>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                currentPage === 1
                  ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                  : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
              }`}
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                currentPage === totalPages
                  ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                  : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
              }`}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Filter Popup */}
        {showFilterPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[50]">
            <div className="w-[504px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md">
              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-white font-medium text-[16px]">Filter</h3>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-white">Department Name</label>
                  <input
                    name="name"
                    value={filtersData.name}
                    onChange={handleFilterChange}
                    placeholder="Enter Name"
                    className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                  />
                </div>
                <Dropdown
                  label="Status"
                  value={filtersData.status}
                  onChange={(val) => setFiltersData({ ...filtersData, status: val })}
                  options={["Active", "Inactive"]}
                />
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button
                  onClick={handleClearFilters}
                  className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] px-3 py-2 text-white font-medium text-[14px] leading-[16px] shadow"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
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
            <div className="w-[504px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md">
              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-white font-medium text-[16px]">Settings</h3>
                <button
                  onClick={() => setShowSettingsPopup(false)}
                  className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-white">Number of Lines</label>
                  <Listbox value={itemsPerPage} onChange={setItemsPerPage}>
                    <div className="relative w-full min-w-0">
                      <Listbox.Button
                        className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]"
                      >
                        {itemsPerPage}
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options
                        className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-[50] border border-[#3A3A3A] max-h-60 overflow-y-auto left-0"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
                          <Listbox.Option
                            key={option}
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
                <Dropdown
                  label="Order"
                  value={sortOrder}
                  onChange={setSortOrder}
                  options={[
                    { value: "A-to-Z", label: "A to Z" },
                    { value: "Z-to-A", label: "Z to A" },
                  ]}
                />
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <button
                  onClick={handleClearFilters}
                  className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] px-3 py-2 text-white font-medium text-[14px] leading-[16px] shadow"
                >
                  Clear
                </button>
                <button
                  onClick={applySettings}
                  className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popups */}
        {showAddPopup && <AddDepartmentPopup onClose={() => setShowAddPopup(false)} />}
        {showEditPopup && (
          <EditDepartmentPopup
            onClose={() => setShowEditPopup(false)}
            department={selectedDepartment}
          />
        )}
        {showDeletePopup && (
          <DeleteDepartmentPopup
            onClose={() => setShowDeletePopup(false)}
            onConfirm={() => {
              console.log("Deleting", selectedDepartment);
              setShowDeletePopup(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentList;