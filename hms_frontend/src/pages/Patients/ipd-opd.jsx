import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import EditPatient from "./EditPatient";
import DeletePatient from "./DeletePatient"; // ✅ Import Listbox

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
  const navigate = useNavigate();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);

  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    doctor: "",
    status: "",
    date: "",
  });

  const tabs = ["In-Patients", "Out-Patients"];
  const filters = ["All", "New", "Severe", "Normal", "Completed", "Cancelled"];

  const appointments = [
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 305",
      treatment: "Physiotherapy",
      discharge: "Pending",
      status: "Completed",
    },
    {
      patient: "Sravan",
      date: "2025-07-12",
      patientId: "SAH257385",
      department: "Neurology",
      doctor: "Dr.Naveen",
      room: "RM 405",
      treatment: "Medication",
      discharge: "In-progress",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      patientId: "SAH257386",
      department: "Cardiology",
      doctor: "Dr.Prakash",
      room: "N/A",
      treatment: "Surgery",
      discharge: "Done",
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

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredAppointments, itemsPerPage]);

  const handleClearFilters = () => {
    setFiltersData({
      patientName: "",
      patientId: "",
      department: "",
      doctor: "",
      treatment: "",
      discharge: "",
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
    <div className="mt-[60px] h-[800px] mb-4  bg-black text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">IPD/OPD - Patient Lists</h2>
        <button
          onClick={() => navigate("/patients/new-registration")}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold"
        >
          <Plus size={18} /> Add Patients
        </button>
      </div>
      <div className="mb-3 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl ">
          {/* Today's Total */}
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              Today's Total
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-[#000000] justify-center gap-1 opacity-100 rounded-[20px] border border-[#0EFF7B66] p-1 text-xs font-normal text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A]">
              150
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-700"></div>

          {/* Visited */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              In-Patients
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-[#000000] justify-center gap-1 opacity-100 rounded-[20px] border border-[#2231FF] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#6E92FF] to-[#425899]">
              47
            </span>
          </div>

          <div className="h-8 w-px bg-gray-700"></div>

          {/* Waiting */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              Out-Patients
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-[12px] text-[#000000] gap-1 opacity-100 rounded-[20px] border border-[#FF930E] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#FF930E] to-[#995808]">
              12
            </span>
          </div>

          <div className="h-8 w-px bg-gray-700"></div>
        </div>
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

      {/* Filters */}
      <div className="w-full overflow-x-auto h-[57px] rounded-[40px] border border-[#0EFF7B1A] bg-[#0D0D0D] flex items-center justify-between px-10 mb-4">
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
              <th>Treatment Type</th>
              <th>Discharge Status</th>
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
                  <td>{appt.treatment}</td>
                  <td>{appt.discharge}</td>
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
      {/* Pagination */}
      <div className="flex items-center mt-4 bg-black p-4 rounded gap-x-4">
        <div className="text-sm text-white">
          Page {currentPage} of {totalPages} (
          {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAppointments.length)}{" "}
          from {filteredAppointments.length} Patients)
        </div>

        <div className="flex items-center gap-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`w-5 h-5 flex items-center justify-center rounded-full border gap-[12px] ${
              currentPage === 1
                ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
            }`}
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              currentPage === totalPages
                ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white  opacity-50"
                : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
            }`}
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* === FILTER POPUP === */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[600px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md relative">
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
              {/* Patient Name */}
              <div>
                <label className="text-sm text-white">Patient Name</label>
                <input
                  name="patientName"
                  value={filtersData.patientName}
                  onChange={handleFilterChange}
                  placeholder="enter patient name"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                />
              </div>

              {/* Patient ID */}
              <div>
                <label className="text-sm text-white">Patient ID</label>
                <input
                  name="patientId"
                  value={filtersData.patientId}
                  onChange={handleFilterChange}
                  placeholder="enter patient ID"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                />
              </div>

              {/* Department */}
              <Dropdown
                label="Department"
                value={filtersData.department}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, department: val })
                }
                options={["Orthopedics", "Cardiology", "Neurology"]}
              />

              {/* Doctor */}
              <Dropdown
                label="Doctor"
                value={filtersData.doctor}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, doctor: val })
                }
                options={["Dr.Sravan", "Dr.Ramesh", "Dr.Naveen", "Dr.Prakash"]}
              />

              {/* Room No */}
              <div>
                <label className="text-sm text-white">Room No</label>
                <input
                  name="room"
                  value={filtersData.room}
                  onChange={handleFilterChange}
                  placeholder="enter room number"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                />
              </div>

              {/* Treatment Type */}
              <div>
                <label className="text-sm text-white">Treatment Type</label>
                <input
                  name="treatment"
                  value={filtersData.treatment}
                  onChange={handleFilterChange}
                  placeholder="enter treatment type"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
                />
              </div>

              {/* Discharge Status */}
              <Dropdown
                label="Discharge Status"
                value={filtersData.discharge}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, discharge: val })
                }
                options={["Pending", "In-progress", "Done"]}
              />

              {/* Status */}
              <Dropdown
                label="Status"
                value={filtersData.status}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, status: val })
                }
                options={["Completed", "Severe", "Normal", "Cancelled"]}
              />

              {/* Date */}
              <div className="relative">
                <label className="text-sm text-white">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filtersData.date}
                  onChange={handleFilterChange}
                  className="w-[250px] h-[33px] mt-1 pl-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] outline-none"
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
      {showAddPopup && <AddPatient onClose={() => setShowAddPopup(false)} />}
      {showEditPopup && (
        <EditPatient
          onClose={() => setShowEditPopup(false)}
          appointment={selectedAppointment}
        />
      )}
      {showDeletePopup && (
        <DeletePatient
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
