import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Edit, X } from "lucide-react";
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
            if (
                filtersData.department &&
                profile.department !== filtersData.department
            ) {
                return false;
            }
            if (
                filtersData.specialist &&
                profile.qualification !== filtersData.specialist
            ) {
                return false;
            }
            return true;
        });
    }, [profiles, searchTerm, filtersData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltersData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFiltersData({
            department: "",
            specialist: "",
        });
    };

    const Dropdown = ({ placeholder, value, onChange, options }) => (
        <div>
            <Listbox
                value={value || ""}
                onChange={(val) => onChange(val === placeholder ? "" : val)}
            >
                <div className="relative mt-1 w-[228px]">
                    <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] text-left text-[14px] leading-[16px]">
                        {value || placeholder}
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
                        {/* Default "Select ..." option */}
                        <Listbox.Option
                            key="default"
                            value={placeholder}
                            className="cursor-pointer select-none py-2 px-2 text-sm text-gray-400"
                        >
                            {placeholder}
                        </Listbox.Option>

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

    const totalDoctors = filteredProfiles.filter(p => p.type === "Doctors").length;
    const totalNurses = filteredProfiles.filter(p => p.type === "Nurses").length;
    const totalOtherStaff = filteredProfiles.filter(p => p.type === "Other Staff").length;

    return (
        <div className="mt-[60px] min-h-[920px] max-h-[1700px] mb-4 bg-black text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Doctor/Nurse Profiles</h2>
                <button
                    onClick={() => navigate("/Doctors-Nurse/AddDoctorNurse")}
                    className="w-[200px] h-[40px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] rounded-full text-white font-semibold"
                >
                    <Plus size={18} className="text-black" />
                    Add Patient
                </button>
            </div>

            {/* Stats */}
            <div className="mb-6 w-[800px]">
                <div className="flex items-center gap-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
                            Total Doctors
                        </span>
                        <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#0EFF7B66] p-1 text-xs font-normal text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A]">
                            {totalDoctors}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
                            Total Nurse
                        </span>
                        <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#2231FF] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#6E92FF] to-[#425899]">
                            {totalNurses}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-inter font-normal text-[14px] text-[#A0A0A0]">
                            Other staff
                        </span>
                        <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#FF930E] p-1 text-xs font-normal text-white bg-gradient-to-b from-[#FF930E] to-[#995808]">
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
                    <div className="min-w-[315px] flex items-center bg-[#0EFF7B1A] rounded-full px-3 py-1 border-[1px] border-[#0EFF7B1A]">
                        <Search size={18} className=" text-[#0EFF7B]" />
                        <input
                            type="text"
                            placeholder="Search by name or department"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[transparent] px-2 text-[12px] outline-none text-[#5CD592] w-48"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilterPopup(true)}
                        className="flex items-center gap-2 bg-[#0EFF7B1A] text-white px-4 py-2 rounded-full border-[1px] border-[#0EFF7B1A]"
                    >
                        <Filter size={18} className=" text-[#0EFF7B]" /> 
                    </button>
                </div>
            </div>

            {showFilterPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="w-[600px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-lg backdrop-blur-md relative">
                        <div className="flex justify-between items-center pb-3 mb-4">
                            <h3 className="text-white font-medium text-[16px]">
                                Filter Profiles
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
                            {/* Department */}
                            <Dropdown
                                placeholder="Select Department"
                                value={filtersData.department}
                                onChange={(val) => setFiltersData({ ...filtersData, department: val })}
                                options={departments}
                            />

                            {/* Specialist */}
                            <Dropdown
                                placeholder="Select Specialist"
                                value={filtersData.specialist}
                                onChange={(val) => setFiltersData({ ...filtersData, specialist: val })}
                                options={specialists}
                            />
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

            {/* Edit Doctor/Nurse Popup */}
            {showEditPopup && (
                <EditDoctorNursePopup
                    profile={selectedProfile}
                    onClose={() => setShowEditPopup(false)}
                />
            )}

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile, index) => (
                    <div
                        key={index}
                        className="w-full h-full bg-[#0D0D0D] opacity-100 
             rounded-lg p-5 border border-gray-800 
             shadow-[0px_0px_4px_0px_#D2D2D240] 
             relative text-center flex flex-col items-center"
                    >
                        <div className="absolute top-4 left-4 text-[#0EFF7B] text-[14px]">
                            {profile.type}
                        </div>
                        <div className="w-16 h-16 mx-auto mb-4 mt-10 rounded-full overflow-hidden">
                            <img
                                src={image}
                                alt="Staff Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-[18px] font-medium text-[#0EFF7B] mb-1">
                            {profile.name}
                        </p>
                        <p className="text-[14px] text-gray-400 mb-4">{profile.qualification}</p>

                        {/* Profile Details */}
                        <div className="w-full text-left space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-[14px] text-gray-400">Department</span>
                                <span className="text-[14px] text-gray-400">{profile.department}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[14px] text-gray-400">Join Date</span>
                                <span className="text-[14px] text-gray-400">{profile.joinDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[14px] text-gray-400">Contact</span>
                                <span className="text-[14px] text-gray-400">{profile.contact}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[14px] text-gray-400">Email ID</span>
                                <span className="text-[14px] text-gray-400 truncate max-w-[150px]">{profile.email}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedProfile(profile);
                                setShowEditPopup(true);
                            }}
                            className="absolute top-4 right-4 flex items-center gap-1 text-[#4D58FF] text-[12px]"
                        >
                            <Edit size={16} />
                            <span>Edit</span>
                        </button>
                        <button
                            className="w-[112px] h-[33px] rounded-[20px] border border-[#0EFF7B66] bg-gradient-to-r from-[#14DC6F] to-[#09753A] text-white text-[14px] font-medium"
                            onClick={() => navigate("/staff/profile/details")}
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