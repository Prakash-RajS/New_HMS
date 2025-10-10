import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FiFilter } from "react-icons/fi";
import { Listbox } from "@headlessui/react";
import AddAppointmentPopup from "./AddAppointmentPopup";
import EditAppointmentPopup from "./EditAppointmentPopup";
import DeleteAppointmentPopup from "./DeleteAppointmentPopup";

const AppointmentList = () => {
  const [activeMainTab, setActiveMainTab] = useState("Today");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    doctor: "",
    status: "",
    date: "",
  });

  const tabs = ["Today", "Upcoming", "Past"];
  const filters = [
    "All",
    "Normal",
    "Severe",
    "Critical",
    "Completed",
    "Cancelled",
  ];

  // Sample data - in a real app this would come from an API
  const appointments = [
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "RM 305",
      type: "Follow-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Cancelled",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "OP",
      type: "Consultation",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "OP",
      type: "Consultation",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "RM 405",
      type: "Follow-up",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "RM 309",
      type: "Follow-up",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Stavan",
      room: "N/A",
      type: "Check-up",
      status: "Normal",
    },
  ];

  const statusColors = {
    Completed: "bg-green-900 text-green-300",
    Cancelled: "bg-gray-700 text-gray-300",
    Normal: "bg-blue-900 text-blue-300",
    Severe: "bg-red-900 text-red-300",
    Critical: "bg-purple-900 text-purple-300",
  };

  // Count statuses for Today's Total section
  const statusCounts = useMemo(() => {
    const counts = {
      Visited: 0,
      Waiting: 0,
      Cancelled: 0,
    };

    appointments.forEach((appt) => {
      if (appt.status === "Completed") counts.Visited++;
      else if (appt.status === "Cancelled") counts.Cancelled++;
      else counts.Waiting++; // All other statuses are considered Waiting
    });

    return counts;
  }, [appointments]);

  /** =================
   *   Filtering Logic
   ================== */
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (
        searchTerm &&
        !(
          appt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appt.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (activeFilter !== "All" && appt.status !== activeFilter) {
        return false;
      }
      if (
        filtersData.patientName &&
        !appt.patient
          .toLowerCase()
          .includes(filtersData.patientName.toLowerCase())
      ) {
        return false;
      }
      if (
        filtersData.patientId &&
        !appt.patientId
          .toLowerCase()
          .includes(filtersData.patientId.toLowerCase())
      ) {
        return false;
      }
      if (
        filtersData.department &&
        appt.department !== filtersData.department
      ) {
        return false;
      }
      if (filtersData.doctor && appt.doctor !== filtersData.doctor) {
        return false;
      }
      if (filtersData.status && appt.status !== filtersData.status) {
        return false;
      }
      if (filtersData.date && appt.date !== filtersData.date) {
        return false;
      }
      return true;
    });
  }, [appointments, searchTerm, activeFilter, filtersData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredAppointments, itemsPerPage]);

  /** =================
   *   Select checkboxes
   ================== */
  const handleCheckboxChange = (id) => {
    if (selectedAppointments.includes(id)) {
      setSelectedAppointments(selectedAppointments.filter((sid) => sid !== id));
    } else {
      setSelectedAppointments([...selectedAppointments, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === currentAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(currentAppointments.map((_, idx) => idx));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltersData({ ...filtersData, [name]: value });
  };

  const handleClearFilters = () => {
    setFiltersData({
      patientName: "",
      patientId: "",
      department: "",
      doctor: "",
      status: "",
      date: "",
    });
  };

  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A] left-[2px]">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
              ${
                active
                  ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                  : "text-black dark:text-white"
              }
              ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                }
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
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

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-2 relative z-10">
        <h2 className="text-black dark:text-white font-[Helvetica] text-xl font-semibold">
          Appointment List
        </h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-2 
        bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)]
        border border-[#0EFF7B]
        shadow-[0px_2px_12px_0px_#00000040]
        hover:opacity-90
        text-white font-semibold 
        px-4 py-2 rounded-[8px] 
        transition duration-300 ease-in-out"
        >
          <Plus size={18} className="text-white font-[Helvetica]" /> Add
          Appointments
        </button>
      </div>

      {/* Today's Total Section */}
      <div className="mb-3 min-w-[800px] relative z-10">
        <div className="flex items-center gap-4 rounded-xl">
          {/* Today's Total */}
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal font-[Helvetica] text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Today's Total
            </span>
            <span className="w-6 h-6 flex items-center font-[Helvetica] text-[12px] text-white justify-center gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#0D2016] dark:bg-[#14DC6F]">
              150
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Visited */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] font-[Helvetica] text-gray-600 dark:text-[#A0A0A0]">
              Visited
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] font-[Helvetica] text-white justify-center gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#080C4C] dark:bg-[#0D7F41]">
              47
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Waiting */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal font-[Helvetica] text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Waiting
            </span>
            <span className="w-6 h-6 flex items-center font-[Helvetica] justify-center text-[12px] text-white gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#7D3737] dark:bg-[#D97706]">
              12
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Cancelled */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] font-[Helvetica] text-gray-600 dark:text-[#A0A0A0]">
              Cancelled
            </span>
            <span className="h-6 min-w-[24px] flex items-center font-[Helvetica] text-[12px] text-white justify-center gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#3C3C3C] dark:bg-[#9CA3AF]">
              2
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`min-w-[104px] h-[31px] 
            hover:bg-[#0EFF7B1A] 
            rounded-[4px] 
            font-[Helvetica] text-[13px] font-normal 
            transition duration-300 ease-in-out
            ${
              activeMainTab === tab
                ? "bg-[#025126] shadow-[0px_0px_20px_0px_#0EFF7B40] font-[Helvetica] text-white border-[#0EFF7B]"
                : "bg-gray-100 text-gray-800 border-gray-300  font-[Helvetica] dark:bg-[#1E1E1E] dark:text-gray-300 dark:border-[#3A3A3A]"
            }`}
              onClick={() => setActiveMainTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex items-center font-[Helvetica] w-[315px] h-[32px] gap-2 rounded-[8px] px-4 py-1 border border-gray-300 bg-gray-100 shadow dark:hidden">
            <Search size={18} className="text-green-600" />
            <input
              type="text"
              placeholder="Search patient name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent px-2 text-xs outline-none font-normal font-[Helvetica] text-black placeholder-gray-400 w-48 leading-none tracking-normal"
            />
          </div>
          <div className="rounded-[8px] p-[1px] bg-gradient-to-b from-[#0EFF7B] to-[#08994A] shadow-[0_0_20px_0px_#00000066] dark:inline-block hidden dark:shadow-[0_0_20px_0_#FFFFFF33]">
            <div className="h-[32px] w-[315px] rounded-[7px] bg-[#1E1E1E] flex items-center gap-2 px-4 py-1">
              <Search size={18} className="text-green-400" />
              <input
                type="text"
                placeholder="Search patient name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent px-2 text-xs outline-none font-normal font-[Helvetica] text-white placeholder-[#00A048] w-48 leading-none tracking-normal"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] border border-gray-300 bg-gray-100 hover:bg-green-200 transition-colors duration-200 dark:hidden ">
            <FiFilter size={18} className="text-green-600" />
          </div>
          <div className="rounded-[8px] p-[1px] bg-gradient-to-b from-[#0EFF7B] to-[#08994A] shadow-[0_0_20px_0px_#00000066] dark:inline-block hidden dark:shadow-[0_0_20px_0_#FFFFFF33]">
            <button
              onClick={() => setShowFilterPopup(true)}
              className="h-[32px] w-[32px] rounded-[7px] bg-[#1E1E1E] hover:bg-green-900 transition-colors duration-200 flex items-center justify-center"
            >
              <FiFilter size={18} className="text-green-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full overflow-x-auto h-[50px] flex items-center gap-3 mb-8 px-2 relative z-10">
        <div className="flex gap-3 min-w-full">
          {filters.map((f) => (
            <button
              key={f}
              className={`relative min-w-[162px] mx-auto h-[35px] flex items-center justify-center rounded-lg px-3 text-sm font-medium transition-all border-b-[1px] gradient-border
            ${
              activeFilter === f
                ? "bg-[#08994A] text-white font-[Helvetica] dark:bg-green-900 dark:text-white"
                : "text-gray-800 hover:text-green-600 font-[Helvetica] dark:text-white dark:hover:text-white"
            }`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* === TABLE === */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#0EFF7B] dark:text-[#0EFF7B] font-[Helvetica] dark:bg-[#091810] border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="py-3 px-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border border-[#0EFF7B] dark:border-gray-600 accent-[#08994A] dark:accent-green-500 bg-white dark:bg-transparent focus:outline-none cursor-pointer transition-colors"
                  checked={
                    currentAppointments.length > 0 &&
                    selectedAppointments.length === currentAppointments.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Patient Name</th>
              <th>Patient ID</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Room no</th>
              <th>Appointment type</th>
              <th>Status</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 dark:border-gray-800 font-[Helvetica]"
                >
                  <td className="px-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-md border border-[#0EFF7B] dark:border-gray-600 accent-[#08994A] dark:accent-green-500 bg-white dark:bg-transparent focus:outline-none cursor-pointer transition-colors"
                      checked={selectedAppointments.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-black dark:text-white">
                      {appt.patient}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {appt.date}
                    </div>
                  </td>
                  <td className="text-black dark:text-white">
                    {appt.patientId}
                  </td>
                  <td className="text-black dark:text-white">
                    {appt.department}
                  </td>
                  <td className="text-black dark:text-white">{appt.doctor}</td>
                  <td className="text-black dark:text-white">{appt.room}</td>
                  <td className="text-black dark:text-white">{appt.type}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusColors[appt.status]
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <Edit2
                        size={16}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowEditPopup(true);
                        }}
                        className="text-[#08994A] dark:text-blue-400 cursor-pointer"
                      />
                      <Trash2
                        size={16}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowDeletePopup(true);
                        }}
                        className="text-[#08994A] dark:text-gray-400 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
        <div className="text-sm text-black dark:text-white">
          Page{" "}
          <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
            {currentPage}
          </span>{" "}
          of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAppointments.length)}{" "}
          from {filteredAppointments.length} Patients)
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
            <ChevronLeft size={12} className="text-[#08994A] dark:text-black" />
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
              className="text-[#08994A] dark:text-black"
            />
          </button>
        </div>
      </div>
      {/* === FILTER POPUP === */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          {/* Outer wrapper: 1px gradient border with light/dark mode */}
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
        bg-gradient-to-r
        from-green-400/70 via-gray-300/30 to-green-400/70
        dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[505px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 shadow-lg relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <h3
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter Appointment
                </h3>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full 
              border border-gray-300 dark:border-[#0EFF7B1A] 
              bg-white dark:bg-[#0EFF7B1A] 
              shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>

              {/* Filter Form */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Patient Name
                  </label>
                  <input
                    name="patientName"
                    value={filtersData.patientName}
                    onChange={handleFilterChange}
                    placeholder="enter patient name"
                    className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                </div>
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Patient ID
                  </label>
                  <input
                    name="patientId"
                    value={filtersData.patientId}
                    onChange={handleFilterChange}
                    placeholder="enter patient ID"
                    className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                </div>

                <Dropdown
                  label="Department"
                  value={filtersData.department}
                  onChange={(val) =>
                    setFiltersData({ ...filtersData, department: val })
                  }
                  options={["Orthopedics", "Cardiology", "Neurology"]}
                />
                <Dropdown
                  label="Status"
                  value={filtersData.status}
                  onChange={(val) =>
                    setFiltersData({ ...filtersData, status: val })
                  }
                  options={["Completed", "Severe", "Normal", "Cancelled"]}
                />
                <Dropdown
                  label="Doctor"
                  value={filtersData.doctor}
                  onChange={(val) =>
                    setFiltersData({ ...filtersData, doctor: val })
                  }
                  options={[
                    "Dr.Stavan",
                    "Dr.Ramesh",
                    "Dr.Naveen",
                    "Dr.Prakash",
                  ]}
                />

                {/* Date with Calendar Icon */}
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Date
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      name="date"
                      value={filtersData.date}
                      onChange={handleFilterChange}
                      className="w-[228px] h-[33px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black dark:text-[#0EFF7B] pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={handleClearFilters}
                  className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#3C3C3C] text-white font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] opacity-100 bg-black dark:bg-transparent dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Popups */}
      {showAddPopup && (
        <AddAppointmentPopup onClose={() => setShowAddPopup(false)} />
      )}
      {showEditPopup && (
        <EditAppointmentPopup
          onClose={() => setShowEditPopup(false)}
          appointment={selectedAppointment}
        />
      )}
      {showDeletePopup && (
        <DeleteAppointmentPopup
          onClose={() => setShowDeletePopup(false)}
          onConfirm={() => {
            console.log("Deleting", selectedAppointment);
            setShowDeletePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentList;
