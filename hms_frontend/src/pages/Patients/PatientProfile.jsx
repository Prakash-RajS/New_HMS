import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Edit, X, Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import image from "../../assets/image.png";
import { Listbox } from "@headlessui/react";
import EditPatient from "./EditPatient";

const ProfileSection = () => {
  const [activeMainTab, setActiveMainTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filtersData, setFiltersData] = useState({
    patientName: "",
    patientId: "",
    room: "",
    status: "",
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
      type: "In-patients",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patients",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patients",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patients",
      status: "Severe",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patients",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patients",
      status: "Critical",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patients",
      status: "Completed",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patients",
      status: "Cancelled",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patients",
      status: "Normal",
    },
    {
      name: "Mrs. Watson",
      id: "SAH257384",
      room: "RM 202",
      type: "Out-patients",
      status: "Normal",
    },
    {
      name: "N 76 x 76",
      id: "SAH257384",
      room: "RM 202",
      type: "In-patients",
      status: "Critical",
    },
  ];

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (
        searchTerm &&
        !(
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (activeMainTab !== "All" && profile.type !== activeMainTab) {
        return false;
      }
      if (activeFilter !== "All" && profile.status !== activeFilter) {
        return false;
      }
      if (
        filtersData.patientName &&
        !profile.name.toLowerCase().includes(filtersData.patientName.toLowerCase())
      ) {
        return false;
      }
      if (
        filtersData.patientId &&
        !profile.id.toLowerCase().includes(filtersData.patientId.toLowerCase())
      ) {
        return false;
      }
      if (
        filtersData.room &&
        !profile.room.toLowerCase().includes(filtersData.room.toLowerCase())
      ) {
        return false;
      }
      if (filtersData.status && profile.status !== filtersData.status) {
        return false;
      }
      return true;
    });
  }, [profiles, searchTerm, activeMainTab, activeFilter, filtersData]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const currentProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProfiles.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProfiles, itemsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltersData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFiltersData({
      patientName: "",
      patientId: "",
      room: "",
      status: "",
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

  const totalPatients = filteredProfiles.length;
  const inPatientsCount = filteredProfiles.filter(
    (p) => p.type === "In-patients"
  ).length;
  const outPatientsCount = filteredProfiles.filter(
    (p) => p.type === "Out-patients"
  ).length;

  return (
    <div className="mt-[60px] h-auto max-h-[1700px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">IPD/OPD - Patient's Profiles</h2>
        <button
          onClick={() => navigate("/patients/new-registration")}
          className="flex items-center gap-2 bg-[#08994A] dark:bg-green-500 border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 px-4 py-2 rounded-full text-white font-semibold"
        >
          <Plus size={18} className="text-white" /> Add Patient
        </button>
      </div>
      <div className="mb-3 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl">
          {/* Today's Total */}
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Today's Total
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-[#000000] justify-center gap-1 opacity-100 rounded-[20px] border border-[#0EFF7B66] p-1 text-xs font-normal text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A]">
             {totalPatients}
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-700"></div>

          {/* Visited */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              In-patients
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] text-[#000000] justify-center gap-1 opacity-100 rounded-[20px] border border-[#2231FF] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#6E92FF] to-[#425899]">
             {inPatientsCount}
            </span>
          </div>

          <div className="h-8 w-px bg-gray-700"></div>

          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Out-patients
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-[12px] text-[#000000] gap-1 opacity-100 rounded-[20px] border border-[#FF930E] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#FF930E] to-[#995808]">
              {outPatientsCount}
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
              className={`w-[104px] h-[35px] rounded-[20px] border border-[#0EFF7B] dark:border-gray-700 bg-white dark:bg-[#0D0D0D] text-black dark:text-gray-300 ${
                activeMainTab === tab
                  ? "border-[#0EFF7B] dark:border-green-500 text-[#08994A] dark:text-green-400 bg-[#0EFF7B1A] dark:bg-[#0D0D0D]"
                  : "hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
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

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentProfiles.length > 0 ? (
          currentProfiles.map((profile, index) => (
            <div
              key={index}
              className="min-w-[203px] h-[238px] bg-white dark:bg-[#0D0D0D] opacity-100 rounded-lg p-[18px] pr-[12px] pl-[12px] border border-[#0EFF7B] dark:border-gray-800 shadow-[0px_0px_4px_0px_#D2D2D240] relative text-center"
            >
              <div className="absolute top-2 left-2 text-[#08994A] dark:text-[#0EFF7B] text-[14px] mt-1">
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
                    ? "text-[#08994A] dark:text-blue-400"
                    : "text-[#08994A] dark:text-[#0EFF7B]"
                }`}
              >
                {profile.name}
              </p>
              <p className="text-[14px] text-gray-600 dark:text-gray-400">{profile.id}</p>
              <p className="text-[14px] text-gray-600 dark:text-gray-400">{profile.room}</p>
              <button
                onClick={() => {
                  setSelectedAppointment(profile);
                  setShowEditPopup(true);
                }}
                className="absolute top-2 right-2 flex items-center gap-1 text-[#08994A] dark:text-[#4D58FF] text-[12px] mt-1 hover:text-green-800 dark:hover:text-blue-300"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                className="mt-2 text-[14px] text-[#08994A] dark:text-[#0EFF7B] underline hover:text-green-800 dark:hover:text-[#0EFF7B1A]"
                onClick={() => navigate("/patients/profile/details")}
              >
                View profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-gray-600 dark:text-gray-400 italic">
            No profiles found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
        <div className="text-sm text-black dark:text-white">
          Page <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">{currentPage}</span> of {totalPages} (
          {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredProfiles.length)} from {filteredProfiles.length} Patients)
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

            {/* Filter Form */}
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
              <Dropdown
                label="Status"
                value={filtersData.status}
                onChange={(val) =>
                  setFiltersData({ ...filtersData, status: val })
                }
                options={[
                  "Normal",
                  "Severe",
                  "Critical",
                  "Completed",
                  "Cancelled",
                ]}
              />
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
    </div>
  );
};

export default ProfileSection;
