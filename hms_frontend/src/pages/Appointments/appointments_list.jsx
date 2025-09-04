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
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]">
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
                  ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
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
    <div className="mt-[60px] h-auto mb-6 bg-white dark:bg-black text-black dark:text-white  dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black dark:text-white text-xl font-semibold">Appointment List</h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-2 bg-[#08994A] dark:bg-green-500 hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 border border-[#0EFF7B] dark:border-[#1E1E1E] px-4 py-2 rounded-full text-white font-semibold"
        >
          <Plus size={18} className="text-white" /> Add Appointments
        </button>
      </div>

      {/* Today's Total Section */}
       {/* Today's Total Section */}
      <div className="mb-3 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl ">
          {/* Today's Total */}
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Today's Total
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-white justify-center gap-1 opacity-100 rounded-[20px] border border-[#08994A] dark:border-[#0EFF7B66] p-1 text-xs font-normal bg-gradient-to-r from-[#08994A] to-[#067a3b] dark:from-[#14DC6F] dark:to-[#09753A]">
              150
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Visited */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Visited
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-white justify-center gap-1 opacity-100 rounded-[20px] border border-blue-500 dark:border-[#2231FF] p-1 text-xs font-normal bg-gradient-to-b from-blue-500 to-blue-700 dark:from-[#6E92FF] dark:to-[#425899]">
              47
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Waiting */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Waiting
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-[12px] text-white gap-1 opacity-100 rounded-[20px] border border-amber-500 dark:border-[#FF930E] p-1 text-xs font-normal bg-gradient-to-b from-amber-500 to-amber-700 dark:from-[#FF930E] dark:to-[#995808]">
              12
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Cancelled */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Cancelled
            </span>
            <span className="h-6 min-w-[24px] flex items-center text-[12px] text-white justify-center gap-1 opacity-100 rounded-[20px] border border-gray-400 dark:border-[#A0A0A0] p-1 text-xs font-normal bg-gradient-to-r from-gray-400 to-gray-600 dark:from-[#3C3C3C] dark:to-[#A0A0A0]">
              2
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between  items-center mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-[104px] h-[35px] hover:bg-[#0EFF7B1A] rounded-[20px] border ${
                activeMainTab === tab
                  ? "border-[#08994A] text-[#08994A] bg-white dark:border-green-500 dark:text-green-400 dark:bg-[#0D0D0D]"
                  : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-[#0D0D0D]"
              }`}
              onClick={() => setActiveMainTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex items-center bg-white dark:bg-[#0D0D0D] rounded-full px-3 py-1 border border-[#0EFF7B] dark:border-gray-700">
            <Search size={18} className="text-[#08994A] dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search patient name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent px-2 text-sm outline-none text-black dark:text-white w-48"
            />
          </div>
          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center gap-2 bg-white dark:bg-[#0D0D0D] text-black dark:text-white px-4 py-2 rounded-full border border-[#0EFF7B] dark:border-gray-700 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
          >
            <Filter size={18} className="text-[#08994A] dark:text-white" /> Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full overflow-x-auto h-[57px] rounded-[40px] border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-white dark:bg-[#0D0D0D] flex items-center justify-between px-10 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-6 py-2 rounded-full ${
              activeFilter === f
                ? "bg-[#08994A] dark:bg-green-900 text-white dark:text-green-400"
                : "bg-white dark:bg-[#0D0D0D] text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
            }`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* === TABLE === */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#08994A] dark:text-green-400 border-b border-gray-300 dark:border-gray-700">
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
                <tr key={idx} className="border-b border-gray-300 dark:border-gray-800">
                  <td className="px-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-md border border-[#0EFF7B] dark:border-gray-600 accent-[#08994A] dark:accent-green-500 bg-white dark:bg-transparent focus:outline-none cursor-pointer transition-colors"
                      checked={selectedAppointments.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-black dark:text-white">{appt.patient}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{appt.date}</div>
                  </td>
                  <td className="text-black dark:text-white">{appt.patientId}</td>
                  <td className="text-black dark:text-white">{appt.department}</td>
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
          Page {currentPage} of {totalPages} (
          {(currentPage - 1) * itemsPerPage + 1} to{" "}
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
            <ChevronRight size={12} className="text-[#08994A] dark:text-black" />
          </button>
        </div>
      </div>

      {/* === FILTER POPUP === */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[504px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-lg backdrop-blur-md relative">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h3 className="text-black dark:text-white font-medium text-[16px]">
                Filter Appointment
              </h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              >
                <X size={16} className="text-[#08994A] dark:text-white" />
              </button>
            </div>

            {/* Filter Form */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-black dark:text-white">Patient Name</label>
                <input
                  name="patientName"
                  value={filtersData.patientName}
                  onChange={handleFilterChange}
                  placeholder="enter patient name"
                  className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-black dark:text-white">Patient ID</label>
                <input
                  name="patientId"
                  value={filtersData.patientId}
                  onChange={handleFilterChange}
                  placeholder="enter patient ID"
                  className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
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
                options={["Dr.Stavan", "Dr.Ramesh", "Dr.Naveen", "Dr.Prakash"]}
              />

              {/* Date with Calendar Icon */}
              <div className="relative">
                <label className="text-sm text-black dark:text-white">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filtersData.date}
                  onChange={handleFilterChange}
                  className="w-[228px] h-[33px] mt-1 pl-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none"
                />
                <Calendar className="absolute right-3 bottom-2 text-[#08994A] dark:text-[#0EFF7B] w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleClearFilters}
                className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#0EFF7B66] bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
              >
                Filter
              </button>
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