import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import DeleteBloodBankPopup from "./DeleteBloodBankPopup.jsx";
import EditBloodTypes from "./EditBloodTypes.jsx";
import EditDonorPopup from "./EditDonorPopup.jsx";
import AddBloodTypePopup from "./AddBloodTypesPopup.jsx";
import AddDonorPopup from "./AddDonorPopup.jsx";

const BloodBank = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddDonorPopup, setShowAddDonorPopup] = useState(false);
  const [showEditBloodPopup, setShowEditBloodPopup] = useState(false);
  const [editBlood, setEditBlood] = useState(null);
  const [showDeleteBloodPopup, setShowDeleteBloodPopup] = useState(false);
  const [deleteBlood, setDeleteBlood] = useState(null);
  const [showEditDonorPopup, setShowEditDonorPopup] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [showDeleteDonorPopup, setShowDeleteDonorPopup] = useState(false);
  const [deleteDonor, setDeleteDonor] = useState(null);
  const [showBloodFilterPopup, setShowBloodFilterPopup] = useState(false);
  const [showDonorFilterPopup, setShowDonorFilterPopup] = useState(false);
  const [tempBloodFilters, setTempBloodFilters] = useState({ status: "All" });
  const [bloodFilters, setBloodFilters] = useState({ status: "All" });
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const [tempDonorFilters, setTempDonorFilters] = useState({
    bloodType: "All",
    date: "",
  });
  const [donorFilters, setDonorFilters] = useState({
    bloodType: "All",
    date: "",
  });
  const [donorSearch, setDonorSearch] = useState("");
  const [showDonorSearch, setShowDonorSearch] = useState(false);
  const [bloodSearch, setBloodSearch] = useState("");
  const [showBloodSearch, setShowBloodSearch] = useState(false);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);

  // ---------- Blood Types Data ----------
  const [allBloodTypes, setAllBloodTypes] = useState([
    { type: "A+", units: 30, status: "Available" },
    { type: "A-", units: 10, status: "Low Stock" },
    { type: "B+", units: 40, status: "Available" },
    { type: "B-", units: 20, status: "Available" },
    { type: "AB+", units: 0, status: "Out of Stock" },
    { type: "AB-", units: 5, status: "Low Stock" },
    { type: "O+", units: 10, status: "Low Stock" },
    { type: "O-", units: 0, status: "Out of Stock" },
  ]);

  const bloodTypesOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusOptions = ["All", "Available", "Low Stock", "Out of Stock"];

  // ---------- Donor Data ----------
  const [allDonors, setAllDonors] = useState([
    {
      name: "Emma Walker",
      gender: "Female",
      blood: "A+",
      phone: "555-201-3344",
      lastDonation: "07/12/2025",
      status: "Eligible",
    },
    {
      name: "Mason Clark",
      gender: "Male",
      blood: "O+",
      phone: "555-201-2844",
      lastDonation: "08/01/2025",
      status: "Not Eligible",
    },
    {
      name: "Sophia Lewis",
      gender: "Female",
      blood: "B+",
      phone: "555-201-3944",
      lastDonation: "06/22/2025",
      status: "Eligible",
    },
    {
      name: "Isabella Taylor",
      gender: "Female",
      blood: "AB-",
      phone: "555-201-3244",
      lastDonation: "07/15/2025",
      status: "Eligible",
    },
    {
      name: "Liam Johnson",
      gender: "Male",
      blood: "O-",
      phone: "555-201-3744",
      lastDonation: "05/10/2025",
      status: "Not Eligible",
    },
    {
      name: "Lucas Thompson",
      gender: "Male",
      blood: "AB+",
      phone: "555-201-4444",
      lastDonation: "08/25/2025",
      status: "Eligible",
    },
  ]);

  // ---------- Pagination Logic ----------
  const [bloodPage, setBloodPage] = useState(1);
  const [donorPage, setDonorPage] = useState(1);
  const rowsPerPage = 5;

  const filteredBloodTypes = allBloodTypes.filter((b) => {
    if (selectedBloodType && b.type !== selectedBloodType) return false;
    if (selectedStatus && b.status !== selectedStatus) return false;
    if (
      bloodSearch &&
      !b.type.toLowerCase().includes(bloodSearch.toLowerCase()) &&
      !b.status.toLowerCase().includes(bloodSearch.toLowerCase()) &&
      !String(b.units).includes(bloodSearch)
    )
      return false;
    return true;
  });

  const filteredDonors = allDonors.filter((d) => {
    // Filter by blood type
    if (
      donorFilters.bloodType &&
      donorFilters.bloodType !== "All" &&
      d.blood !== donorFilters.bloodType
    )
      return false;

    // Filter by gender
    if (
      donorFilters.gender &&
      donorFilters.gender !== "All" &&
      d.gender !== donorFilters.gender
    )
      return false;

    // Search filter (searches in name, blood type, phone, and gender)
    if (
      donorSearch &&
      !d.name.toLowerCase().includes(donorSearch.toLowerCase()) &&
      !d.blood.toLowerCase().includes(donorSearch.toLowerCase()) &&
      !d.phone.includes(donorSearch) &&
      !d.gender.toLowerCase().includes(donorSearch.toLowerCase())
    )
      return false;

    return true;
  });

  const bloodTypes = filteredBloodTypes.slice(
    (bloodPage - 1) * rowsPerPage,
    bloodPage * rowsPerPage
  );
  const donors = filteredDonors.slice(
    (donorPage - 1) * rowsPerPage,
    donorPage * rowsPerPage
  );

  const totalBloodPages = Math.ceil(filteredBloodTypes.length / rowsPerPage);
  const totalDonorPages = Math.ceil(filteredDonors.length / rowsPerPage);

  // ---------- Handle Checkbox Selection ----------
  const handleBloodTypeCheckboxChange = (bloodType) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(bloodType)
        ? prev.filter((b) => b !== bloodType)
        : [...prev, bloodType]
    );
  };

  const handleDonorCheckboxChange = (donor) => {
    setSelectedDonors((prev) =>
      prev.includes(donor) ? prev.filter((d) => d !== donor) : [...prev, donor]
    );
  };

  const handleSelectAllBloodTypes = () => {
    setSelectedBloodTypes(
      selectedBloodTypes.length === bloodTypes.length ? [] : bloodTypes
    );
  };

  const handleSelectAllDonors = () => {
    setSelectedDonors(selectedDonors.length === donors.length ? [] : donors);
  };

  // ---------- Handle Delete Actions ----------
  const handleDeleteSelectedDonors = () => {
    if (selectedDonors.length > 0) {
      setShowDeleteDonorPopup(true);
    }
  };

  const confirmDeleteDonors = () => {
    setAllDonors((prev) =>
      prev.filter((donor) => !selectedDonors.includes(donor))
    );
    setSelectedDonors([]);
    setShowDeleteDonorPopup(false);
  };

  const handleDeleteSingleDonor = (donor) => {
    setDeleteDonor(donor);
    setShowDeleteDonorPopup(true);
  };

  return (
    <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
     bg-white dark:bg-transparent overflow-hidden relative"
    ><div
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
      <div className="mt-[10px] mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] overflow-hidden relative p-6">
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
        <div className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Blood Bank
            </h2>
            <button
              onClick={() => setShowAddPopup(true)}
              className="flex items-center gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition px-8 py-2"
            >
              <Plus size={18} className="text-black dark:text-white" />
              Add blood group
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Available Blood Types and Donor Registry
          </p>
        </div>

        {/* Table */}
        <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3A3A3A] rounded-[12px] p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Left side: Blood Type & Status dropdowns */}
            <div className="flex gap-2">
              {/* Blood Type Dropdown */}
              <div className="relative">
                <Listbox
                  value={selectedBloodType}
                  onChange={setSelectedBloodType}
                >
                  <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-black text-white text-sm px-3 py-1 rounded-[8px] border border-[#3C3C3C] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                    {selectedBloodType || "Blood Type"}
                    <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-[139px] bg-black rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-[50] max-h-60 overflow-y-auto border border-[#3C3C3C] text-white">
                    {bloodTypesOptions.map((type, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={type}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B33]" : ""
                          } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {type}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                  <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-black text-white text-sm px-3 py-1 rounded-[8px] border border-[#3C3C3C] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                    {selectedStatus || "Status"}
                    <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-[139px] bg-black rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-[50] max-h-60 overflow-y-auto border border-[#3C3C3C] text-white">
                    {statusOptions.map((status, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={status}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B33]" : ""
                          } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {status}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>

            {/* Right side: Search & Filter buttons */}
            <div className="flex gap-2 items-center">
              {showBloodSearch && (
                <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A]" />
                  <input
                    type="text"
                    placeholder="Search blood types..."
                    value={bloodSearch}
                    onChange={(e) => setBloodSearch(e.target.value)}
                    className="w-full bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] text-[#08994A] text-sm focus:outline-none"
                  />
                </div>
              )}
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                onClick={() => setShowBloodSearch(!showBloodSearch)}
              >
                <Search size={18} className="text-[#08994A]" />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                onClick={() => {
                  setTempBloodFilters(bloodFilters);
                  setShowBloodFilterPopup(true);
                }}
              >
                <Filter size={18} className="text-[#08994A]" />
              </button>
            </div>
          </div>

          {/* Table content */}
          <table className="w-full border-collapse">
            <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
              <tr className="text-center border-b border-gray-300 dark:border-[#000000] text-[#0EFF7B] dark:text-[#0EFF7B]">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedBloodTypes.length === bloodTypes.length &&
                      bloodTypes.length > 0
                    }
                    onChange={handleSelectAllBloodTypes}
                    className="accent-[#08994A] dark:accent-[#0EFF7B]"
                  />
                </th>
                <th className="p-3">Blood Types</th>
                <th className="p-3">Available Units (in bags)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bloodTypes.map((b, i) => (
                <tr
                  key={i}
                  className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#000000CC] transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedBloodTypes.includes(b)}
                      onChange={() => handleBloodTypeCheckboxChange(b)}
                      className="accent-[#08994A] dark:accent-[#0EFF7B]"
                    />
                  </td>
                  <td className="p-3 text-black dark:text-white">{b.type}</td>
                  <td className="p-3 text-black dark:text-white">{b.units}</td>
                  <td className="p-3">
                    <span
                      className={`py-1 rounded-full text-xs font-semibold ${
                        b.status === "Available"
                          ? "text-green-500 dark:text-green-400"
                          : b.status === "Low Stock"
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                      onClick={() => {
                        setEditBlood(b);
                        setShowEditBloodPopup(true);
                      }}
                    >
                      <Edit
                        size={18}
                        className="text-[#08994A] dark:text-[#0EFF7B]"
                      />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                      onClick={() => {
                        setDeleteBlood(b);
                        setShowDeleteBloodPopup(true);
                      }}
                    >
                      <Trash2
                        size={18}
                        className="text-red-600 dark:text-red-700"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBloodTypes.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No blood types found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center mt-4 bg-white dark:bg-[#000000] rounded gap-x-4 p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Page{" "}
              <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
                {bloodPage}
              </span>{" "}
              of {totalBloodPages} ({(bloodPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(bloodPage * rowsPerPage, filteredBloodTypes.length)}{" "}
              from {filteredBloodTypes.length} Blood Groups)
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setBloodPage(Math.max(1, bloodPage - 1))}
                disabled={bloodPage === 1}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  bloodPage === 1
                    ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                    : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
                }`}
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() =>
                  setBloodPage(Math.min(totalBloodPages, bloodPage + 1))
                }
                disabled={bloodPage === totalBloodPages}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  bloodPage === totalBloodPages
                    ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                    : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
                }`}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[30px] mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] overflow-hidden relative p-6">
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
        <div className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Donor List
            </h2>
            <button
              onClick={() => setShowAddDonorPopup(true)}
              className="flex items-center gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition px-8 py-2"
            >
              <Plus size={18} className="text-black dark:text-white" />
              Add Donor
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Registered Donors and Blood Type Information
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex justify-between items-center mb-4">
          {/* Left side: Blood Type & Gender dropdowns */}
          <div className="flex gap-2">
            {/* Blood Type Dropdown */}
            <div className="relative">
              <Listbox
                value={donorFilters.bloodType}
                onChange={(value) =>
                  setDonorFilters((prev) => ({ ...prev, bloodType: value }))
                }
              >
                <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-black text-white text-sm px-3 py-1 rounded-[8px] border border-[#3C3C3C] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                  {donorFilters.bloodType || "Blood Type"}
                  <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-[139px] bg-black rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-[50] max-h-60 overflow-y-auto border border-[#3C3C3C] text-white">
                  {bloodTypesOptions.map((type, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={type}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                          active ? "bg-[#0EFF7B33]" : ""
                        } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                      }
                    >
                      {type}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            {/* Gender Dropdown */}
            <div className="relative">
              <Listbox
                value={donorFilters.gender}
                onChange={(value) =>
                  setDonorFilters((prev) => ({ ...prev, gender: value }))
                }
              >
                <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-black text-white text-sm px-3 py-1 rounded-[8px] border border-[#3C3C3C] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                  {donorFilters.gender || "Gender"}
                  <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-[139px] bg-black rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-[50] max-h-60 overflow-y-auto border border-[#3C3C3C] text-white">
                  {["All", "Male", "Female", "Other"].map((gender, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={gender}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                          active ? "bg-[#0EFF7B33]" : ""
                        } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                      }
                    >
                      {gender}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>

          {/* Right side: Search & Filter buttons */}
          <div className="flex gap-2 items-center">
            {showDonorSearch && (
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
                <input
                  type="text"
                  placeholder="Search donors..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#0EFF7B] text-sm focus:outline-none"
                />
              </div>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={() => setShowDonorSearch(!showDonorSearch)}
            >
              <Search
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={() => setShowDonorFilterPopup(true)}
            >
              <Filter
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={handleDeleteSelectedDonors}
              disabled={selectedDonors.length === 0}
            >
              {" "}
              <Trash2
                size={18}
                className="text-red-600 dark:text-red-700"
              />{" "}
            </button>
          </div>
        </div>

        {/* Donor Table */}
        <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4">
          <table className="w-full border-collapse">
            <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
              <tr className="text-center border-b border-gray-300 dark:border-[#3C3C3C] text-[#0EFF7B] dark:text-[#0EFF7B]">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedDonors.length === donors.length &&
                      donors.length > 0
                    }
                    onChange={handleSelectAllDonors}
                    className="accent-[#08994A] dark:accent-[#0EFF7B]"
                  />
                </th>
                <th className="p-3">Donor</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Blood Type</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Last Donation Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d, i) => (
                <tr
                  key={i}
                  className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#000000CC] transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedDonors.includes(d)}
                      onChange={() => handleDonorCheckboxChange(d)}
                      className="accent-[#08994A] dark:accent-[#0EFF7B]"
                    />
                  </td>
                  <td className="p-3 text-black dark:text-white">{d.name}</td>
                  <td className="p-3 text-black dark:text-white">{d.gender}</td>
                  <td className="p-3 text-black dark:text-white">{d.blood}</td>
                  <td className="p-3 text-black dark:text-white">{d.phone}</td>
                  <td className="p-3 text-black dark:text-white">
                    {d.lastDonation}
                  </td>
                  <td className="p-3">
                    <span
                      className={`py-1 rounded-full text-xs font-semibold ${
                        d.status === "Eligible"
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                      onClick={() => {
                        setEditDonor(d);
                        setShowEditDonorPopup(true);
                      }}
                    >
                      <Edit
                        size={18}
                        className="text-[#08994A] dark:text-[#0EFF7B]"
                      />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]">
                      <Mail
                        size={18}
                        className="text-[#08994A] dark:text-[#0EFF7B]"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDonors.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No donors found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center mt-4 bg-white dark:bg-[#0D0D0D] rounded gap-x-4 p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Page{" "}
              <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
                {donorPage}
              </span>{" "}
              of {totalDonorPages} ({(donorPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(donorPage * rowsPerPage, filteredDonors.length)} from{" "}
              {filteredDonors.length} Donors)
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setDonorPage(Math.max(1, donorPage - 1))}
                disabled={donorPage === 1}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  donorPage === 1
                    ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                    : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
                }`}
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() =>
                  setDonorPage(Math.min(totalDonorPages, donorPage + 1))
                }
                disabled={donorPage === totalDonorPages}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  donorPage === totalDonorPages
                    ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
                    : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
                }`}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showAddPopup && (
        <AddBloodTypePopup data={null} onClose={() => setShowAddPopup(false)} />
      )}
      {showEditBloodPopup && (
        <EditBloodTypes
          data={editBlood}
          onClose={() => setShowEditBloodPopup(false)}
        />
      )}
      {showDeleteBloodPopup && (
        <DeleteBloodBankPopup
          data={deleteBlood}
          onClose={() => setShowDeleteBloodPopup(false)}
          onConfirm={() => {
            setAllBloodTypes((prev) => prev.filter((b) => b !== deleteBlood));
            setShowDeleteBloodPopup(false);
          }}
        />
      )}
      {showEditDonorPopup && (
        <EditDonorPopup
          data={editDonor}
          onClose={() => setShowEditDonorPopup(false)}
        />
      )}
      {showAddDonorPopup && (
        <AddDonorPopup
          data={null}
          onClose={() => setShowAddDonorPopup(false)}
        />
      )}
      {showDeleteDonorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
            <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33]">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  {deleteDonor ? "Delete Donor" : "Delete Donors"}
                </h3>
                <button
                  onClick={() => setShowDeleteDonorPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {deleteDonor
                  ? `Are you sure you want to delete donor ${deleteDonor.name}?`
                  : `Are you sure you want to delete ${selectedDonors.length} donor(s)?`}
                <br />
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteDonorPopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteDonor) {
                      setAllDonors((prev) =>
                        prev.filter((d) => d !== deleteDonor)
                      );
                      setDeleteDonor(null);
                    } else {
                      confirmDeleteDonors();
                    }
                    setShowDeleteDonorPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBloodFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
            <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33]">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Filter Blood Types
                </h3>
                <button
                  onClick={() => setShowBloodFilterPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Status
                </label>
                <div className="relative">
                  <Listbox
                    value={tempBloodFilters.status}
                    onChange={(value) =>
                      setTempBloodFilters({
                        ...tempBloodFilters,
                        status: value,
                      })
                    }
                  >
                    <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
                      {tempBloodFilters.status}
                      <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-[#1A1A1A] shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
                      {statusOptions.map((status) => (
                        <Listbox.Option
                          key={status}
                          value={status}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                              active
                                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                : "text-black dark:text-white"
                            }`
                          }
                        >
                          {status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setBloodFilters({ status: "All" });
                    setTempBloodFilters({ status: "All" });
                    setShowBloodFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setBloodFilters(tempBloodFilters);
                    setShowBloodFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDonorFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
            <div className="w-[700px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33]">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Filter Donor
                </h3>
                <button
                  onClick={() => setShowDonorFilterPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Blood Type
                  </label>
                  <div className="relative">
                    <Listbox
                      value={tempDonorFilters.bloodType}
                      onChange={(value) =>
                        setTempDonorFilters({
                          ...tempDonorFilters,
                          bloodType: value,
                        })
                      }
                    >
                      <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
                        {tempDonorFilters.bloodType === "All"
                          ? "Select blood type"
                          : tempDonorFilters.bloodType}
                        <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-[#1A1A1A] shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
                        <Listbox.Option
                          value="All"
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                              active
                                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                : "text-black dark:text-white"
                            }`
                          }
                        >
                          All
                        </Listbox.Option>
                        {bloodTypesOptions.map((type) => (
                          <Listbox.Option
                            key={type}
                            value={type}
                            className={({ active }) =>
                              `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                                active
                                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                  : "text-black dark:text-white"
                              }`
                            }
                          >
                            {type}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Last Donation Date
                  </label>
                  <input
                    type="date"
                    value={tempDonorFilters.date}
                    onChange={(e) =>
                      setTempDonorFilters({
                        ...tempDonorFilters,
                        date: e.target.value,
                      })
                    }
                    className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setDonorFilters({ bloodType: "All", date: "" });
                    setTempDonorFilters({ bloodType: "All", date: "" });
                    setShowDonorFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setDonorFilters(tempDonorFilters);
                    setShowDonorFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBank;
