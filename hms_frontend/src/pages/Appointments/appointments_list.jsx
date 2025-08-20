import React, { useState } from "react";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";

const AppointmentList = () => {
  const [activeMainTab, setActiveMainTab] = useState("Today");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  const tabs = ["Today", "Upcoming", "Past"];
  const filters = ["All", "New", "Severe", "Normal", "Completed", "Cancelled"];

  const appointments = [
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 305",
      type: "Follow-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 405",
      type: "Follow-up",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "N/A",
      type: "Check-up",
      status: "Cancelled",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "OP",
      type: "Consultation",
      status: "Normal",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "OP",
      type: "Consultation",
      status: "Severe",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "N/A",
      type: "Check-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "N/A",
      type: "Check-up",
      status: "Completed",
    },
    {
      patient: "Prakash",
      date: "12/07/2025",
      patientId: "SAH257384",
      department: "Orthopedics",
      doctor: "Dr.Sravan",
      room: "RM 405",
      type: "Follow-up",
      status: "Severe",
    },
  ];

  const statusColors = {
    Completed: "bg-green-900 text-green-300",
    Cancelled: "bg-gray-700 text-gray-300",
    Normal: "bg-blue-900 text-blue-300",
    Severe: "bg-red-900 text-red-300",
    New: "bg-purple-900 text-purple-300",
  };

  // Toggle single row
  const handleCheckboxChange = (id) => {
    if (selectedAppointments.includes(id)) {
      setSelectedAppointments(selectedAppointments.filter((sid) => sid !== id));
    } else {
      setSelectedAppointments([...selectedAppointments, id]);
    }
  };

  // Toggle Select All
  const handleSelectAll = () => {
    if (selectedAppointments.length === appointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(appointments.map((_, idx) => idx));
    }
  };

  return (
    <div className="mt-[60px] mb-4  bg-black text-white rounded-xl p-6 w-full max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appointment List</h2>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold">
          <Plus size={18} /> Add Appointments
        </button>
      </div>

      {/* Counters */}
      <div className="flex gap-6 mb-6 text-sm">
        <span className="text-green-400">
          Today's Total{" "}
          <span className="bg-green-800 text-green-300 px-2 py-0.5 rounded-full">
            150
          </span>
        </span>
        <span className="text-blue-400">
          Visited{" "}
          <span className="bg-blue-800 text-blue-300 px-2 py-0.5 rounded-full">
            47
          </span>
        </span>
        <span className="text-yellow-400">
          Waiting{" "}
          <span className="bg-yellow-800 text-yellow-300 px-2 py-0.5 rounded-full">
            12
          </span>
        </span>
        <span className="text-gray-300">
          Cancelled{" "}
          <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
            2
          </span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`w-[104px] h-[35px] rounded-[20px]  border border-[#0EFF7B] border-b-2 bg-black shadow-[0px_2px_6px_0px_#0EFF7B33] ${
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
              className="bg-transparent px-2 text-sm outline-none text-white w-48"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#0D0D0D] text-white px-4 py-2 rounded-full border border-gray-700">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-green-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-2">
                <input
                  type="checkbox"
                  className="
    w-5 h-5 
    rounded-[4px] 
    border border-[#A0A0A0] 
    opacity-100 
    appearance-none 
    bg-transparent 
    checked:bg-gradient-to-r 
    checked:from-[#0EFF7B] 
    checked:to-[#08994A] 
    checked:border-none 
    checked:before:content-['✔'] 
    checked:before:text-black 
    checked:before:flex 
    checked:before:items-center 
    checked:before:justify-center 
    checked:before:font-bold 
    checked:before:text-xs
  "
                  checked={selectedAppointments.length === appointments.length}
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
            {appointments.map((appt, idx) => (
              <tr key={idx} className="border-b border-gray-800">
                <td className="px-2">
                  <input
                    type="checkbox"
                    className="
    w-5 h-5 
    rounded-[4px] 
    border border-[#A0A0A0] 
    opacity-100 
    appearance-none 
    bg-transparent 
    checked:bg-gradient-to-r 
    checked:from-[#0EFF7B] 
    checked:to-[#08994A] 
    checked:border-none 
    checked:before:content-['✔'] 
    checked:before:text-black 
    checked:before:flex 
    checked:before:items-center 
    checked:before:justify-center 
    checked:before:font-bold 
    checked:before:text-xs
  "
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
                    <Edit size={16} className="text-blue-400 cursor-pointer" />
                    <Trash2
                      size={16}
                      className="text-gray-400 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentList;
