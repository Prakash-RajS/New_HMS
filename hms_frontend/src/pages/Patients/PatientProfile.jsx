import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Edit, X, Calendar } from "lucide-react";
import image from "../../assets/image.png";
import { Listbox } from "@headlessui/react";
import EditPatient from "./EditPatient";

const ProfileSection = () => {
  const [activeMainTab, setActiveMainTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    doctor: "",
    room: "",
    treatment: "",
    discharge: "",
    status: "",
    date: "",
  });
  const navigate = useNavigate();

  const tabs = ["All", "In-patients", "Out-patients"];
  const filters = [
    "All",
    "Normal",
    "Severe",
    "Critical",
    "Completed",
    "Cancelled",
  ];

  const profiles = [
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patient",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patient",
      status: "Severe",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patient",
      status: "Critical",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Completed",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patient",
      status: "Cancelled",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patient",
      status: "Normal",
    },
    {
      name: "N 76 x 76",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patient",
      status: "Critical",
    },
  ];

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesSearch =
        !searchTerm ||
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        activeMainTab === "All" || profile.type === activeMainTab;
      const matchesFilter =
        activeFilter === "All" || profile.status === activeFilter;
      return matchesSearch && matchesTab && matchesFilter;
    });
  }, [profiles, searchTerm, activeMainTab, activeFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltersData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFiltersData({
      patientName: "",
      patientId: "",
      department: "",
      doctor: "",
      room: "",
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
              <svg
                className="h-4 w-4 text-[#0EFF7B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 border border-[#3A3A3A]">
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
    <div className="mt-[60px] h-full mb-4 bg-black text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">IPD/OPD - Patient's Profiles</h2>
        <button
          onClick={() => navigate("/patients/new-registration")}
          className="flex items-center gap-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold"
        >
          <Plus size={18} /> Add Patient
        </button>
      </div>
      <div className="mb-3 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              Today's Total
            </span>
            <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#0EFF7B66] p-1 text-xs font-normal text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A]">
              450
            </span>
          </div>
          <div className="h-8 w-px bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              In-patients
            </span>
            <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#2231FF] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#6E92FF] to-[#425899]">
              225
            </span>
          </div>
          <div className="h-8 w-px bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
              Out-patients
            </span>
            <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#FF930E] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#FF930E] to-[#995808]">
              225
            </span>
          </div>
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
                  ? "bg-[#0EFF7B] text-black font-medium"
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
                ? "bg-[#0EFF7B] text-black font-medium"
                : "bg-[#0D0D0D] text-white"
            }`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
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

      {showEditPopup && (
        <EditPatient
          onClose={() => setShowEditPopup(false)}
          appointment={selectedAppointment}
        />
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProfiles.map((profile, index) => (
          <div
            key={index}
            className="w-[203px] h-[238px] bg-[#0D0D0D] opacity-100 
             rounded-lg p-[18px] pr-[12px] pl-[12px] 
             border border-gray-800 
             shadow-[0px_0px_4px_0px_#D2D2D240] 
             relative text-center"
          >
            <div className="absolute top-2 left-2 text-[#0EFF7B] text-[14px] mt-1">
              {profile.type}
            </div>
            <div className="w-16 h-16 mx-auto mb-2 mt-8 rounded-full overflow-hidden">
              <img
                src={image}
                alt="Patient Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <p
              className={`text-[18px] font-medium ${
                profile.name === "N 76 x 76"
                  ? "text-blue-400"
                  : "text-[#0EFF7B]"
              }`}
            >
              {profile.name}
            </p>
            <p className="text-[14px] text-gray-400">{profile.id}</p>
            <p className="text-[14px] text-gray-400">{profile.room}</p>
            <button
              onClick={() => {
                setSelectedAppointment(profile); // Corrected from 'appt' to 'profile'
                setShowEditPopup(true);
              }}
              className="absolute top-2 right-2 flex items-center gap-1 text-[#4D58FF] text-[12px] mt-1"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              className="mt-2 text-[14px] text-[#0EFF7B] underline"
              onClick={() => alert(`View profile for ${profile.name}`)}
            >
              View profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
