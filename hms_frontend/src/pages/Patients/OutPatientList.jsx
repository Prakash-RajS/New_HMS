import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Calendar,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import EditPatient from "./EditPatient";
import DeletePatient from "./DeletePatient";

const AppointmentListOPD = () => {
  const [activeMainTab, setActiveMainTab] = useState("Out-Patients");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const itemsPerPage = 10; // Updated to show 10 items per page
  const [currentPage, setCurrentPage] = useState(1);

  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    doctor: "",
    room: "",
    treatment: "",
    status: "",
    date: "",
  });

  const tabs = ["In-Patients", "Out-Patients"];
  const filters = ["All", "New", "Severe", "Normal", "Completed", "Cancelled"];

  const appointments = [
    {
      patient: "Prakash",
      date: "2025-07-12",
      time: "10:30 AM",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 305",
      treatment: "Physiotherapy",
      status: "Completed",
    },
    {
      patient: "Sravan",
      date: "2025-07-12",
      time: "11:00 AM",
      patientId: "SAH257385",
      department: "Neurology",
      doctor: "Dr.Naveen",
      room: "RM 405",
      treatment: "Medication",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "2025-07-12",
      time: "02:00 PM",
      patientId: "SAH257386",
      department: "Cardiology",
      doctor: "Dr.Prakash",
      room: "N/A",
      treatment: "Surgery",
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Search term filter
      if (
        searchTerm &&
        !(
          appt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appt.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Status filter (prioritize activeFilter over filtersData.status)
      if (activeFilter !== "All" && appt.status !== activeFilter) {
        return false;
      }

      // Popup filters
      if (
        filtersData.patientName &&
        !appt.patient.toLowerCase().includes(filtersData.patientName.toLowerCase())
      ) {
        return false;
      }
      if (
        filtersData.patientId &&
        !appt.patientId.toLowerCase().includes(filtersData.patientId.toLowerCase())
      ) {
        return false;
      }
      if (filtersData.department && appt.department !== filtersData.department) {
        return false;
      }
      if (filtersData.doctor && appt.doctor !== filtersData.doctor) {
        return false;
      }
      if (filtersData.room && !appt.room.toLowerCase().includes(filtersData.room.toLowerCase())) {
        return false;
      }
      if (
        filtersData.treatment &&
        !appt.treatment.toLowerCase().includes(filtersData.treatment.toLowerCase())
      ) {
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

  const handleCheckboxChange = (index) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;
    if (selectedAppointments.includes(globalIndex)) {
      setSelectedAppointments(selectedAppointments.filter((idx) => idx !== globalIndex));
    } else {
      setSelectedAppointments([...selectedAppointments, globalIndex]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filteredAppointments.length);
      const pageIndices = Array.from(
        { length: endIndex - startIndex },
        (_, i) => startIndex + i
      );
      setSelectedAppointments(pageIndices);
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
      room: "",
      treatment: "",
      status: "",
      date: "",
    });
    setActiveFilter("All");
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
    <div className="mt-[60px] h-auto mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">OPD - Patient Lists</h2>
        <button
          onClick={() => navigate("/patients/new-registration")}
          className="flex items-center gap-2 bg-[#08994A] hover:text-[#08994A] dark:hover:text-white dark:bg-green-500 border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 px-4 py-2 rounded-full text-white font-semibold"
        >
          <Plus size={18} className="text-White dark:text-white" /> Add Patients
        </button>
      </div>
      <div className="mb-3 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl">
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-[104px] h-[35px] rounded-[20px] border border-[#0EFF7B] dark:border-gray-700 bg-white dark:bg-[#0D0D0D] text-black dark:text-gray-300 ${
                activeMainTab === tab
                  ? "border-[#0EFF7B] dark:border-green-500 text-[#08994A] dark:text-green-400 bg-[#0EFF7B1A] dark:bg-[#0D0D0D]"
                  : "hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              }`}
              onClick={() =>
                tab === "In-Patients"
                  ? navigate("/patients/ipd-opd")
                  : setActiveMainTab(tab)
              }
            >
              {tab}
            </button>
          ))}
        </div>

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

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[#08994A] dark:text-green-400 border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="py-3 px-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border border-[#0EFF7B] dark:border-gray-600 accent-[#08994A] dark:accent-green-500 bg-white dark:bg-transparent focus:outline-none cursor-pointer transition-colors"
                  checked={
                    filteredAppointments.length > 0 &&
                    currentAppointments.every((_, idx) =>
                      selectedAppointments.includes((currentPage - 1) * itemsPerPage + idx)
                    )
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
              <th>Appointment Date</th>
              <th>Status</th>
              <th className="text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                return (
                  <tr key={globalIndex} className="border-b border-gray-300 dark:border-gray-800">
                    <td className="px-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-md border border-[#0EFF7B] dark:border-gray-600 accent-[#08994A] dark:accent-green-500 bg-white dark:bg-transparent focus:outline-none cursor-pointer transition-colors"
                        checked={selectedAppointments.includes(globalIndex)}
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
                    <td className="text-black dark:text-white">{appt.treatment}</td>
                    <td className="text-black dark:text-white">
                      <div>{appt.date}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{appt.time}</div>
                    </td>
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[600px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-lg backdrop-blur-md relative">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-black dark:text-white">Patient Name</label>
                <input
                  name="patientName"
                  value={filtersData.patientName}
                  onChange={handleFilterChange}
                  placeholder="enter patient name"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-black dark:text-white">Patient ID</label>
                <input
                  name="patientId"
                  value={filtersData.patientId}
                  onChange={handleFilterChange}
                  placeholder="enter patient ID"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
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
                label="Doctor"
                value={filtersData.doctor}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, doctor: val })
                }
                options={["Dr.Sravan", "Dr.Ramesh", "Dr.Naveen", "Dr.Prakash"]}
              />

              <div>
                <label className="text-sm text-black dark:text-white">Room No</label>
                <input
                  name="room"
                  value={filtersData.room}
                  onChange={handleFilterChange}
                  placeholder="enter room number"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-black dark:text-white">Treatment Type</label>
                <input
                  name="treatment"
                  value={filtersData.treatment}
                  onChange={handleFilterChange}
                  placeholder="enter treatment type"
                  className="w-[250px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
                />
              </div>

              <Dropdown
                label="Status"
                value={filtersData.status}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, status: val })
                }
                options={["Completed", "Severe", "Normal", "Cancelled"]}
              />

              <div className="relative">
                <label className="text-sm text-black dark:text-white">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filtersData.date}
                  onChange={handleFilterChange}
                  className="w-[250px] h-[33px] mt-1 pl-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none"
                />
                <Calendar className="absolute right-3 bottom-2 text-[#08994A] dark:text-[#0EFF7B] w-4 h-4 pointer-events-none" />
              </div>
            </div>

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

export default AppointmentListOPD;