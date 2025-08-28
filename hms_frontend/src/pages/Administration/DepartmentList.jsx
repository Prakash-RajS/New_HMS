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
// import AddDepartmentPopup from "./AddDepartmentPopup";
// import EditDepartmentPopup from "./EditDepartmentPopup";
import DeleteDepartmentPopup from "./DeleteDepartmentPopup";

const DepartmentList = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [bulkStatus, setBulkStatus] = useState(null);
  const itemsPerPage = 8;

  const [filtersData, setFiltersData] = useState({
    name: "",
    status: "",
  });

  const [departments, setDepartments] = useState([
    {
      name: "Cardiology",
      description:
        "Cardiology is a branch of medicine that deals with the disorders of the heart as well as some parts of the circulatory system.",
      status: "Active",
    },
    {
      name: "Anesthesiology",
      description:
        "Anesthesiology is the medical specialty concerned with the total perioperative care of patients before, during and after surgery.",
      status: "Inactive",
    },
    {
      name: "Dermatology",
      description:
        "Dermatology is the branch of medicine dealing with the skin, nails, hair and its diseases.",
      status: "Active",
    },
    {
      name: "Gastroenterology",
      description:
        "Gastroenterology is the branch of medicine focused on the digestive system and its disorders.",
      status: "Active",
    },
    {
      name: "Gynaecology",
      description:
        "Gynaecology is the medical practice dealing with the health of the female reproductive system.",
      status: "Active",
    },
    {
      name: "Pharmacy",
      description:
        "Pharmacy is the clinical health science that links medical science with chemistry and it is charged with the discovery, production, disposal, safe and effective use, and control of medications and drugs.",
      status: "Active",
    },
    {
      name: "Neurology",
      description:
        "Neurology is a branch of medicine dealing with disorders of the nervous system.",
      status: "Inactive",
    },
    {
      name: "Orthopedic",
      description:
        "Orthopedic is the branch of surgery concerned with conditions involving the musculoskeletal system.",
      status: "Active",
    },
    {
      name: "Radiology",
      description:
        "Radiology is the medical discipline that uses medical imaging to diagnose diseases and guide their treatment, within the bodies of humans and other animals.",
      status: "Active",
    },
    {
      name: "Urology",
      description:
        "Urology is the branch of medicine that focuses on surgical and medical diseases of the urinary-tract system and the reproductive organs.",
      status: "Active",
    },
    {
      name: "Pulmonology",
      description:
        "Pulmonology is a medical specialty that deals with diseases involving the respiratory tract.",
      status: "Active",
    },
    {
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

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
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
  }, [departments, searchTerm, filtersData]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

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
      setSelectedDepartments(currentDepartments.map((_, idx) => indexOfFirst + idx));
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
  };

  const handleBulkStatusChange = (val) => {
    setBulkStatus(val);
    if (selectedDepartments.length > 0 && val) {
      setDepartments((depts) =>
        depts.map((d, i) => (selectedDepartments.includes(i) ? { ...d, status: val } : d))
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
          className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 border border-[#3A3A3A] max-h-60 overflow-y-auto left-0"
        >
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
  return (
    <div className="w-full max-w-[1400px] mx-auto">
    <div className="mt-[60px] mb-4 h-[829px] bg-black text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto">
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

      <p className="text-gray-400 mb-2">You have total {departments.length} departments.</p>

      {/* Change Status Dropdown */}
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          <input
            type="checkbox"
            className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500 relative"
            checked={
              currentDepartments.length > 0 &&
              selectedDepartments.length === currentDepartments.length
            }
            onChange={handleSelectAll}
          />
          {selectedDepartments.length > 0 && (
            <Check size={16} className="text-white absolute ml-0.5 mt-0.5 pointer-events-none" />
          )}
        </div>
        
        <Listbox value={bulkStatus} onChange={handleBulkStatusChange}>
          <div className="relative w-[164px]">
            <Listbox.Button className="w-full h-[40px] rounded-[20px] border border-[#3C3C3C] bg-transparent text-white text-[16px] flex items-center justify-between px-4">
              {bulkStatus || "Change Status"}
              <ChevronDown className="h-5 w-5 text-white" />
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 min-w-full w-full  rounded-md bg-black shadow-lg z-50 border border-[#3A3A3A]">
              {["All", "Active", "Inactive"].map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer select-none py-2 px-4 text-sm ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"}`
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
          <Filter size={18} /> Filter
        </button>
        <button className="flex items-center gap-2 bg-[#0D0D0D] text-white px-4 py-2 rounded-full border border-gray-700">
          <Settings size={18} />
        </button>
      </div>

      {/* === TABLE === */}
      <div className="overflow-auto h-[680px] min-w-full w-full">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1E1E1E] text-white border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500 relative"
                    checked={
                      currentDepartments.length > 0 &&
                      selectedDepartments.length === currentDepartments.length
                    }
                    onChange={handleSelectAll}
                  />
                  {selectedDepartments.length > 0 && (
                    <Check size={16} className="text-white absolute ml-0.5 mt-0.5 pointer-events-none" />
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
              currentDepartments.map((dept, idx) => {
                const globalIdx = indexOfFirst + idx;
                const IconComponent = departmentIcons[dept.name] || Activity; // fallback
                return (
                  <tr key={globalIdx} className="bg-black border-b border-gray-600">
                    <td className="px-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="appearance-none bg-black border border-[#A0A0A0] w-5 h-5 rounded checked:bg-green-900 checked:border-green-500 relative"
                          checked={selectedDepartments.includes(globalIdx)}
                          onChange={() => handleCheckboxChange(globalIdx)}
                        />
                        {selectedDepartments.includes(globalIdx) && (
                          <Check size={16} className="text-white absolute ml-0.5 mt-0.5 pointer-events-none" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <IconComponent size={24} className="text-white" />
                    </td>
                    <td className="font-medium px-4">{dept.name}</td>
                    <td className="text-gray-400 px-4">{dept.description}</td>
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
                          setMenuOpenFor(menuOpenFor === globalIdx ? null : globalIdx)
                        }
                      >
                        <MoreHorizontal size={20} className="text-white" />
                      </div>
                      {menuOpenFor === globalIdx && (
                        <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-black shadow-lg ring-1 ring-gray-700">
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
                                <Edit size={16} className="mr-2 text-white" /> Edit
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
                                <Trash2 size={16} className="mr-2 text-white" /> Delete
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
      <div className="flex items-center gap-2 mt-4 text-green-500">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft size={18} />
        </button>
        <span>
          Page {currentPage} of {totalPages} ({indexOfFirst + 1} to {Math.min(indexOfLast, filteredDepartments.length)} from {filteredDepartments.length} departments)
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={indexOfLast >= filteredDepartments.length}
          className="flex items-center"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* === FILTER POPUP === */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[504px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md relative">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h3 className="text-white font-medium text-[16px]">Filter Departments</h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Filter Form */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white">Department Name</label>
                <input
                  name="name"
                  value={filtersData.name}
                  onChange={handleFilterChange}
                  placeholder="enter department name"
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

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleClearFilters}
                className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] px-3 py-2 
            text-white font-medium text-[14px] leading-[16px] shadow opacity-100"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B66] px-3 py-2 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] shadow 
            text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
              >
                Filter
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