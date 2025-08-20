import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Listbox } from "@headlessui/react"; // ✅ Import Listbox
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

  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    doctor: "",
    status: "",
    date: "",
  });

  const tabs = ["Today", "Upcoming", "Past"];
  const filters = ["All", "New", "Severe", "Normal", "Completed", "Cancelled"];

  const appointments = [
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 305",
      type: "Follow-up",
      status: "Completed",
    },
    {
      patient: "Sravan",
      date: "2025-07-12",
      patientId: "SAH257385",
      department: "Neurology",
      doctor: "Dr.Naveen",
      room: "RM 405",
      type: "Follow-up",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257386",
      department: "Cardiology",
      doctor: "Dr.Prakash",
      room: "N/A",
      type: "Check-up",
      status: "Cancelled",
    },
  ];

  const statusColors = {
    Completed: "bg-green-900 text-green-300",
    Cancelled: "bg-gray-700 text-gray-300",
    Normal: "bg-blue-900 text-blue-300",
    Severe: "bg-red-900 text-red-300",
    New: "bg-purple-900 text-purple-300",
  };

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
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAppointments.map((_, idx) => idx));
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
      <label className="text-sm text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] text-left text-[14px] leading-[16px]">
            {value || "Select"}
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
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"}
                  ${selected ? "font-medium text-[#0EFF7B]" : ""}`
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
    <div className="mt-[90px] mb-4 bg-black text-white rounded-xl p-6 w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appointment List</h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold"
        >
          <Plus size={18} /> Add Appointments
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-[104px] h-[35px] rounded-[20px] border ${
                activeMainTab === tab
                  ? "border-green-500 text-green-400 bg-[#0D0D0D]"
                  : "border-gray-700 text-gray-300 bg-[#0D0D0D]"
              }`}
              onClick={() => setActiveMainTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex items-center bg-[#0D0D0D] rounded-full px-3 py-1 border border-gray-700">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search patient name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent px-2 text-sm outline-none text-white w-48"
            />
          </div>
          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center gap-2 bg-[#0D0D0D] text-white px-4 py-2 rounded-full border border-gray-700"
          >
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Filters buttons row */}
      <div className="w-full mx-auto h-[57px] rounded-[40px] border border-[#0EFF7B1A] bg-[#0D0D0D] flex items-center justify-between px-10 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-6 py-2 rounded-full ${
              activeFilter === f
                ? "bg-green-900 text-green-400"
                : "bg-[#0D0D0D] text-white"
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
          <thead className="text-green-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-2">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={
                    filteredAppointments.length > 0 &&
                    selectedAppointments.length === filteredAppointments.length
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
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt, idx) => (
                <tr key={idx} className="border-b border-gray-800">
                  <td className="px-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedAppointments.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                  </td>
                  <td className="py-3">
                    <div className="font-medium">{appt.patient}</div>
                    <div className="text-xs text-gray-400">{appt.date}</div>
                  </td>
                  <td>{appt.patientId}</td>
                  <td>{appt.department}</td>
                  <td>{appt.doctor}</td>
                  <td>{appt.room}</td>
                  <td>{appt.type}</td>
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
                      <Edit
                        size={16}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowEditPopup(true);
                        }}
                        className="text-blue-400 cursor-pointer"
                      />
                      <Trash2
                        size={16}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowDeletePopup(true);
                        }}
                        className="text-gray-400 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === FILTER POPUP === */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[504px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md relative">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h3 className="text-white font-medium text-[16px]">
                Filter Appointment
              </h3>
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
                <label className="text-sm text-white">Patient Name</label>
                <input
                  name="patientName"
                  value={filtersData.patientName}
                  onChange={handleFilterChange}
                  placeholder="enter patient name"
                  className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-white">Patient ID</label>
                <input
                  name="patientId"
                  value={filtersData.patientId}
                  onChange={handleFilterChange}
                  placeholder="enter patient ID"
                  className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
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
                options={["Dr.Sravan", "Dr.Ramesh", "Dr.Naveen", "Dr.Prakash"]}
              />

              {/* ✅ Date with Calendar Icon */}
              <div className="relative">
                <label className="text-sm text-white">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filtersData.date}
                  onChange={handleFilterChange}
                  className="w-[228px] h-[33px] mt-1 pl-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] outline-none"
                />
                <Calendar className="absolute right-3 bottom-2 text-[#0EFF7B] w-4 h-4 pointer-events-none" />
              </div>
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
