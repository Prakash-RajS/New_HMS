import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Edit,
  X,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
        !profile.name
          .toLowerCase()
          .includes(filtersData.patientName.toLowerCase())
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

  const totalPatients = filteredProfiles.length;
  const inPatientsCount = filteredProfiles.filter(
    (p) => p.type === "In-patients"
  ).length;
  const outPatientsCount = filteredProfiles.filter(
    (p) => p.type === "Out-patients"
  ).length;

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
      {/* Gradient overlay for dark mode */}
      {/* <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div> */}

      {/* Header */}
      <div className="flex justify-between items-center mb-2 mt-4 relative z-10">
        <h2 className="text-black dark:text-white font-[Helvetica] text-xl font-semibold">
          IPD/OPD - Patient's Profiles
        </h2>
        <button
          onClick={() => navigate("/patients/new-registration")}
          className="flex items-center gap-2 
        bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)]
        border border-[#0EFF7B]
        shadow-[0px_2px_12px_0px_#00000040]
        hover:opacity-90
        text-white font-semibold 
        px-4 py-2 rounded-[8px] 
        transition duration-300 ease-in-out"
        >
          <Plus size={18} className="text-white font-[Helvetica]" /> Add Patient
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
              {totalPatients}
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          {/* Visited */}
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] font-[Helvetica] text-gray-600 dark:text-[#A0A0A0]">
              In-patients
            </span>
            <span className="w-6 h-6 flex items-center text-[12px] font-[Helvetica] text-white justify-center gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#080C4C] dark:bg-[#0D7F41]">
              {inPatientsCount}
            </span>
          </div>

          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>

          <div className="flex items-center gap-2">
            <span className="font-inter font-normal font-[Helvetica] text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Out-patients
            </span>
            <span className="w-6 h-6 flex items-center font-[Helvetica] justify-center text-[12px] text-white gap-1 opacity-100 rounded-[20px] p-1 text-xs font-normal bg-[#7D3737] dark:bg-[#D97706]">
              {outPatientsCount}
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
            <Filter size={18} className="text-green-600" />
          </div>
          <div className="rounded-[8px] p-[1px] bg-gradient-to-b from-[#0EFF7B] to-[#08994A] shadow-[0_0_20px_0px_#00000066] dark:inline-block hidden dark:shadow-[0_0_20px_0_#FFFFFF33]">
            <button
              onClick={() => setShowFilterPopup(true)}
              className="h-[32px] w-[32px] rounded-[7px] bg-[#1E1E1E] hover:bg-green-900 transition-colors duration-200 flex items-center justify-center"
            >
              <Filter size={18} className="text-green-400" />
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
              <p className="text-[14px] text-gray-600 dark:text-gray-400">
                {profile.id}
              </p>
              <p className="text-[14px] text-gray-600 dark:text-gray-400">
                {profile.room}
              </p>
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
          Page{" "}
          <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
            {currentPage}
          </span>{" "}
          of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredProfiles.length)} from{" "}
          {filteredProfiles.length} Patients)
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

                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Room No
                  </label>
                  <input
                    name="room"
                    value={filtersData.room}
                    onChange={handleFilterChange}
                    placeholder="enter room number"
                    className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
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
