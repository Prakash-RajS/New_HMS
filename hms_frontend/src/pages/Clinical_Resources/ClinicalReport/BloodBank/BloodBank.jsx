import React, { useState } from "react";
import { Plus, Edit, Trash2, Mail, Search, Filter, ChevronLeft, ChevronRight, X, ChevronDown, Calendar } from "lucide-react";
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
  const [tempDonorFilters, setTempDonorFilters] = useState({ bloodType: "All", date: "" });
  const [donorFilters, setDonorFilters] = useState({ bloodType: "All", date: "" });
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
    if (bloodFilters.status !== "All" && b.status !== bloodFilters.status) return false;
    return (
      b.type.toLowerCase().includes(bloodSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(bloodSearch.toLowerCase()) ||
      String(b.units).includes(bloodSearch)
    );
  });

  const filteredDonors = allDonors.filter((d) => {
    if (donorFilters.bloodType !== "All" && d.blood !== donorFilters.bloodType) return false;
    if (donorFilters.date) {
      const filterDate = new Date(donorFilters.date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "4-digit",
      });
      if (d.lastDonation !== filterDate) return false;
    }
    if (
      donorSearch &&
      !d.name.toLowerCase().includes(donorSearch.toLowerCase()) &&
      !d.blood.toLowerCase().includes(donorSearch.toLowerCase()) &&
      !d.phone.includes(donorSearch) &&
      !d.gender.toLowerCase().includes(donorSearch.toLowerCase()) &&
      !d.lastDonation.includes(donorSearch) &&
      !d.status.toLowerCase().includes(donorSearch.toLowerCase())
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
      prev.includes(donor)
        ? prev.filter((d) => d !== donor)
        : [...prev, donor]
    );
  };

  const handleSelectAllBloodTypes = () => {
    setSelectedBloodTypes(
      selectedBloodTypes.length === bloodTypes.length ? [] : bloodTypes
    );
  };

  const handleSelectAllDonors = () => {
    setSelectedDonors(
      selectedDonors.length === donors.length ? [] : donors
    );
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
    <div className="w-full max-w-[1400px] mx-auto bg-white dark:bg-black text-black dark:text-white p-6">
      {/* Header */}
      <div className="mt-[60px] mb-4 bg-white dark:bg-black rounded-xl p-6 w-full flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">Blood Bank</h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] hover:bg-[#0cd968] px-4 py-2 rounded-full text-white dark:text-black font-semibold"
          >
            <Plus size={18} className="text-black dark:text-black" />
            Add blood group
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Available Blood Types and Donor Registry</p>
      </div>

      {/* Blood Types Table */}
      <div className="bg-white dark:bg-[#0D0D0D] text-black dark:text-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Blood Type</h3>
          <div className="flex gap-2 items-center">
            {showBloodSearch && (
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
                <input
                  type="text"
                  placeholder="Search blood types..."
                  value={bloodSearch}
                  onChange={(e) => setBloodSearch(e.target.value)}
                  className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#0EFF7B] text-sm focus:outline-none"
                />
              </div>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={() => setShowBloodSearch(!showBloodSearch)}
            >
              <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={() => {
                setTempBloodFilters(bloodFilters);
                setShowBloodFilterPopup(true);
              }}
            >
              <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead className="min-h-[52px]">
            <tr className="text-left bg-gray-200 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-[#3C3C3C]">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedBloodTypes.length === bloodTypes.length && bloodTypes.length > 0}
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
                className="border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#000000CC] transition"
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
                    <Edit size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                    onClick={() => {
                      setDeleteBlood(b);
                      setShowDeleteBloodPopup(true);
                    }}
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-700" />
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
        <div className="flex items-center mt-4 bg-white dark:bg-[#0D0D0D] rounded gap-x-4">
          <div className="text-sm text-gray-600 dark:text-white">
            Page <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">{bloodPage}</span> of {totalBloodPages} (
            {(bloodPage - 1) * rowsPerPage + 1} to{" "}
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
              onClick={() => setBloodPage(Math.min(totalBloodPages, bloodPage + 1))}
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
      <div className="mt-5 mb-1 bg-white dark:bg-black rounded-xl p-6 w-full flex flex-col">
  <div className="flex justify-end items-center">
    <button
      onClick={() => setShowAddDonorPopup(true)}
      className="w-[210px] flex justify-center items-center gap-2 bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] hover:bg-[#0cd968] px-4 py-2 rounded-full text-white dark:text-black font-semibold"
    >
      <Plus size={18} className="text-black dark:text-black" />
      Add Donor
    </button>
  </div>
</div>



      {/* Donor List Table */}
      <div className="bg-white dark:bg-[#0D0D0D] text-black dark:text-white rounded-xl p-6 mt-7 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Donor List</h3>
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
              <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={() => {
                setTempDonorFilters(donorFilters);
                setShowDonorFilterPopup(true);
              }}
            >
              <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
              onClick={handleDeleteSelectedDonors}
              disabled={selectedDonors.length === 0}
            >
              <Trash2 size={18} className="text-red-600 dark:text-red-700" />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left h-[52px] bg-gray-200 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-[#3C3C3C]">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedDonors.length === donors.length && donors.length > 0}
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
                className="border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#000000CC] transition"
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
                <td className="p-3 text-black dark:text-white">{d.lastDonation}</td>
                <td className="p-3">
                  <span
                    className={`py-1 rounded-full text-xs font-semibold ${
                      d.status === "Eligible" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
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
                    <Edit size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  </button>
                  {/* <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                    onClick={() => handleDeleteSingleDonor(d)}
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-700" />
                  </button> */}
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
                  >
                    <Mail size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
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
        <div className="flex items-center mt-4 bg-white dark:bg-[#0D0D0D] rounded gap-x-4">
          <div className="text-sm text-gray-600 dark:text-white">
            Page <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">{donorPage}</span> of {totalDonorPages} (
            {(donorPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(donorPage * rowsPerPage, filteredDonors.length)}{" "}
            from {filteredDonors.length} Donors)
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
              onClick={() => setDonorPage(Math.min(totalDonorPages, donorPage + 1))}
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

      {/* Popups */}
      {showAddPopup && <AddBloodTypePopup data={null} onClose={() => setShowAddPopup(false)} />}
      {showEditBloodPopup && <EditBloodTypes data={editBlood} onClose={() => setShowEditBloodPopup(false)} />}
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
        <EditDonorPopup data={editDonor} onClose={() => setShowEditDonorPopup(false)} />
      )}
      {showAddDonorPopup && (
  <AddDonorPopup data={null} onClose={() => setShowAddDonorPopup(false)} />
)}
      {showDeleteDonorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#000000] border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33] pb-3">
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
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {deleteDonor
                ? `Are you sure you want to delete donor ${deleteDonor.name}?`
                : `Are you sure you want to delete ${selectedDonors.length} donor(s)?`}
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteDonorPopup(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[#0EFF7B] dark:border-[#0D0D0D] text-[#08994A] dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteDonor) {
                    setAllDonors((prev) => prev.filter((d) => d !== deleteDonor));
                    setDeleteDonor(null);
                  } else {
                    confirmDeleteDonors();
                  }
                  setShowDeleteDonorPopup(false);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:bg-[#FF4D4D]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showBloodFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#000000] border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-6 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33] pb-3">
              <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">Filter Blood Types</h3>
              <button
                onClick={() => setShowBloodFilterPopup(false)}
                className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">Status</label>
              <div className="relative">
                <Listbox
                  value={tempBloodFilters.status}
                  onChange={(value) => setTempBloodFilters({ ...tempBloodFilters, status: value })}
                >
                  <Listbox.Button
                    className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                  >
                    {tempBloodFilters.status}
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options
                    className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                  >
                    {statusOptions.map((status) => (
                      <Listbox.Option
                        key={status}
                        value={status}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
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
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setBloodFilters({ status: "All" });
                  setTempBloodFilters({ status: "All" });
                  setShowBloodFilterPopup(false);
                }}
                className="px-4 py-2 text-sm rounded-lg border border-[#0EFF7B] dark:border-[#0D0D0D] text-[#08994A] dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setBloodFilters(tempBloodFilters);
                  setShowBloodFilterPopup(false);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-[#08994A] dark:bg-[#0EFF7B] text-white dark:text-black font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      {showDonorFilterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#000000] border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-xl p-6 w-[700px]">
            <div className="flex justify-between items-center mb-6 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33] pb-3">
              <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">Filter Donor</h3>
              <button
                onClick={() => setShowDonorFilterPopup(false)}
                className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Blood Type</label>
                <div className="relative">
                  <Listbox
                    value={tempDonorFilters.bloodType}
                    onChange={(value) => setTempDonorFilters({ ...tempDonorFilters, bloodType: value })}
                  >
                    <Listbox.Button
                      className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-left"
                    >
                      {tempDonorFilters.bloodType === "All" ? "Select blood type" : tempDonorFilters.bloodType}
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options
                      className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-[50] border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-60 overflow-y-auto"
                    >
                      <Listbox.Option
                        value="All"
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
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
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                              active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
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
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">Last Donation Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempDonorFilters.date}
                    onChange={(e) => setTempDonorFilters({ ...tempDonorFilters, date: e.target.value })}
                    className="w-full bg-white dark:bg-black border-2 border-[#0EFF7B] dark:border-[#0D0D0D] rounded-lg p-3 text-sm text-[#08994A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                  />
                  <Calendar className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setDonorFilters({ bloodType: "All", date: "" });
                  setTempDonorFilters({ bloodType: "All", date: "" });
                  setShowDonorFilterPopup(false);
                }}
                className="px-4 py-2 text-sm rounded-lg border border-[#0EFF7B] dark:border-[#0D0D0D] text-[#08994A] dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setDonorFilters(tempDonorFilters);
                  setShowDonorFilterPopup(false);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-[#08994A] dark:bg-[#0EFF7B] text-white dark:text-black font-medium hover:bg-[#0cd968] dark:hover:bg-[#0cd968]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBank;