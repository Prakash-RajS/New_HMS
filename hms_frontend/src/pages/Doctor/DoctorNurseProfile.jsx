import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Edit, X, ChevronLeft, ChevronRight } from "lucide-react";
import image from "../../assets/image.png";
import { Listbox } from "@headlessui/react";
import EditDoctorNursePopup from "./EditDoctorNursePopup.jsx";

const ProfileSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filtersData, setFiltersData] = useState({
    department: "",
    specialist: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page
  const rowsPerPage = 9; // Display 9 profiles per page

  const navigate = useNavigate();

  const departments = ["Orthopedics", "Cardiology", "Dermatology", "Neurology", "Pediatrics"];
  const specialists = ["MBBS, FCPS", "MISS, MD, DNR", "MISS, MD (Anesthesiology)", "MISS, DNR"];

  const profiles = [
    {
      name: "Dr. David Miller",
      qualification: "MBBS, FCPS",
      department: "Orthopedics",
      joinDate: "24 Jun 2015",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Doctors",
    },
    {
      name: "Dr. Alishek",
      qualification: "MISS, MD, DNR",
      department: "Cardiology",
      joinDate: "29 Jun 2015",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Doctors",
    },
    {
      name: "Dr. Michael Johnson",
      qualification: "MISS, DNR",
      department: "Dermatology",
      joinDate: "21 Jun 2015",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Doctors",
    },
    {
      name: "Dr. Sarah Williams",
      qualification: "MISS, DNR",
      department: "Neurology",
      joinDate: "18 Jun 2015",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Doctors",
    },
    {
      name: "Dr. Emily Davis",
      qualification: "MBBS, FCPS",
      department: "Orthopedics",
      joinDate: "24 Jun 2015",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Doctors",
    },
    {
      name: "Nurse Jane Smith",
      qualification: "RN, BSN",
      department: "Emergency",
      joinDate: "15 Mar 2018",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Nurses",
    },
    {
      name: "Nurse Robert Brown",
      qualification: "RN, MSN",
      department: "ICU",
      joinDate: "22 Aug 2019",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Nurses",
    },
    {
      name: "John Doe",
      qualification: "Medical Assistant",
      department: "Administration",
      joinDate: "10 Jan 2020",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Other Staff",
    },{
      name: "Nurse Robert Brown",
      qualification: "RN, MSN",
      department: "ICU",
      joinDate: "22 Aug 2019",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Nurses",
    },
    {
      name: "John Doe",
      qualification: "Medical Assistant",
      department: "Administration",
      joinDate: "10 Jan 2020",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Other Staff",
    },{
      name: "Nurse Robert Brown",
      qualification: "RN, MSN",
      department: "ICU",
      joinDate: "22 Aug 2019",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Nurses",
    },
    {
      name: "John Doe",
      qualification: "Medical Assistant",
      department: "Administration",
      joinDate: "10 Jan 2020",
      contact: "+8754XXXXX",
      email: "Stacklymed@info.com",
      type: "Other Staff",
    },
  ];

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (
        searchTerm &&
        !(
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
      if (filtersData.department && profile.department !== filtersData.department) {
        return false;
      }
      if (filtersData.specialist && profile.qualification !== filtersData.specialist) {
        return false;
      }
      return true;
    });
  }, [profiles, searchTerm, filtersData]);

  // Calculate total pages and slice profiles for the current page
  const totalPages = Math.ceil(filteredProfiles.length / rowsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltersData((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFiltersData({
      department: "",
      specialist: "",
    });
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const Dropdown = ({ placeholder, value, onChange, options }) => (
    <div>
      <Listbox value={value || ""} onChange={(val) => onChange(val === placeholder ? "" : val)}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-[#000000] text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
            style={{
              borderColor: "#3C3C3C",
              boxShadow: "0px 0px 4px 0px #0EFF7B",
            }}
          >
            {value || placeholder}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <Listbox.Option
              key="default"
              value={placeholder}
              className="cursor-pointer select-none py-2 px-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {placeholder}
            </Listbox.Option>
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                    active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                  } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
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

  const totalDoctors = filteredProfiles.filter((p) => p.type === "Doctors").length;
  const totalNurses = filteredProfiles.filter((p) => p.type === "Nurses").length;
  const totalOtherStaff = filteredProfiles.filter((p) => p.type === "Other Staff").length;

  return (
    <div
      className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative"
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">Doctor/Nurse Profiles</h2>
        <button
          onClick={() => navigate("/Doctors-Nurse/AddDoctorNurse")}
          className="w-[200px] h-[40px] flex items-center justify-center gap-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-[8px] text-white font-semibold hover:scale-105 transition"
          style={{
            background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
          }}
        >
          <Plus size={18} className="text-black dark:text-black" />
          Add Doctor/Nurse
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 w-[800px]">
        <div className="flex items-center gap-4 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Total Doctors
            </span>
            <span
              className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#0EFF7B66] dark:border-[#0EFF7B66] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A]"
            >
              {totalDoctors}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Total Nurse
            </span>
            <span
              className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#2231FF] dark:border-[#2231FF] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-b from-[#6E92FF] to-[#425899] dark:from-[#6E92FF] dark:to-[#425899]"
            >
              {totalNurses}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
              Other staff
            </span>
            <span
              className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#FF930E] dark:border-[#FF930E] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-b from-[#FF930E] to-[#995808] dark:from-[#FF930E] dark:to-[#995808]"
            >
              {totalOtherStaff}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6">
          <Dropdown
            placeholder="Select Department"
            value={filtersData.department}
            onChange={(val) => setFiltersData({ ...filtersData, department: val })}
            options={departments}
          />
          <Dropdown
            placeholder="Select Specialist"
            value={filtersData.specialist}
            onChange={(val) => setFiltersData({ ...filtersData, specialist: val })}
            options={specialists}
          />
        </div>
        <div className="flex gap-4">
          <div
            className="min-w-[315px] flex items-center bg-[#0EFF7B1A] dark:bg-[#1E1E1E] rounded-full px-3 py-1 border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] relative"
          >
            <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            <input
              type="text"
              placeholder="Search by name or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent px-2 text-[12px] placeholder-[#5CD592] outline-none text-[#08994A] dark:text-[#5CD592] w-48"
            />
          </div>
          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center gap-2 bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white px-4 py-2 rounded-full border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
          >
            <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="w-[600px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-lg backdrop-blur-md relative"
          >
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
            <div className="flex justify-between items-center pb-3 mb-4">
              <h3 className="text-black dark:text-white font-medium text-[16px]">
                Filter Profiles
              </h3>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-6 h-6 rounded-full border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] flex items-center justify-center"
              >
                <X size={16} className="text-[#08994A] dark:text-white" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Dropdown
                placeholder="Select Department"
                value={filtersData.department}
                onChange={(val) => setFiltersData({ ...filtersData, department: val })}
                options={departments}
              />
              <Dropdown
                placeholder="Select Specialist"
                value={filtersData.specialist}
                onChange={(val) => setFiltersData({ ...filtersData, specialist: val })}
                options={specialists}
              />
            </div>
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleClearFilters}
                className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-white font-medium text-[14px] leading-[16px] hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E]"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
              style={{
    background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
  }}>
                Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor/Nurse Popup */}
      {showEditPopup && (
        <EditDoctorNursePopup profile={selectedProfile} onClose={() => setShowEditPopup(false)} />
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedProfiles.length > 0 ? (
          paginatedProfiles.map((profile, index) => (
            <div
              key={index}
              className="w-full h-full bg-gray-100 dark:bg-[#0EFF7B08] rounded-lg p-5 border border-gray-300 dark:border-[#0EFF7B80] shadow-[0px_0px_4px_0px_#A0A0A040] dark:shadow-[0px_0px_4px_0px_#0EFF7B] relative text-center flex flex-col items-center"
            >
              <div className="absolute top-4 left-4 text-[#08994A] dark:text-[#0EFF7B] text-[14px]">
                {profile.type}
              </div>
              <div className="w-16 h-16 mx-auto mb-4 mt-10 rounded-full overflow-hidden">
                <img src={image} alt="Staff Avatar" className="w-full h-full object-cover" />
              </div>
              <p className="text-[18px] font-medium text-[#08994A] dark:text-[#0EFF7B] mb-1">
                {profile.name}
              </p>
              <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">{profile.qualification}</p>
              <div className="w-full text-left space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">Department</span>
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">{profile.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">Join Date</span>
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">{profile.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">Contact</span>
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">{profile.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-gray-600 dark:text-gray-400">Email ID</span>
                  <span className="text-[14px] text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                    {profile.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProfile(profile);
                  setShowEditPopup(true);
                }}
                className="absolute top-4 right-4 flex items-center gap-1 text-[#4D58FF] dark:text-[#6E92FF] text-[12px]"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                className="w-[112px] h-[33px] rounded-[8px] border-[2px] border-[#0EFF7B66] dark:border-[#025126] bg-[#08994A] dark:bg-[#0EFF7B1A] text-white text-[14px] font-medium hover:scale-105 transition"
                onClick={() => navigate("/Doctors-Nurse/ViewProfile")}
              >
                View profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-6 text-gray-600 dark:text-gray-400 italic">
            No profiles found
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center mt-4 bg-white dark:bg-black p-4 rounded gap-x-4">
        <div className="text-sm text-black dark:text-white">
          Page {currentPage} of {totalPages} (
          {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredProfiles.length)} from {filteredProfiles.length} Records)
        </div>
        <div className="flex items-center gap-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              currentPage === 1
                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
            }`}
          >
            <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`w-5 h-5 flex items-center justify-center rounded-full border ${
              currentPage === totalPages || totalPages === 0
                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
            }`}
          >
            <ChevronRight size={12} className="text-[#08994A] dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;