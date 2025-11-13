// import React, { useState } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Mail,
//   Search,
//   Filter,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   ChevronDown,
// } from "lucide-react";
// import { Listbox } from "@headlessui/react";
// import DeleteBloodBankPopup from "./DeleteBloodBankPopup.jsx";
// import EditBloodTypes from "./EditBloodTypes.jsx";
// import EditDonorPopup from "./EditDonorPopup.jsx";
// import AddBloodTypePopup from "./AddBloodTypesPopup.jsx";
// import AddDonorPopup from "./AddDonorPopup.jsx";

// const BloodBank = () => {
//   /* ---------- Pop-up states ---------- */
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [showAddDonorPopup, setShowAddDonorPopup] = useState(false);
//   const [showEditBloodPopup, setShowEditBloodPopup] = useState(false);
//   const [editBlood, setEditBlood] = useState(null);
//   const [showDeleteBloodPopup, setShowDeleteBloodPopup] = useState(false);
//   const [deleteBlood, setDeleteBlood] = useState(null);
//   const [showEditDonorPopup, setShowEditDonorPopup] = useState(false);
//   const [editDonor, setEditDonor] = useState(null);
//   const [showDeleteDonorPopup, setShowDeleteDonorPopup] = useState(false);
//   const [deleteDonor, setDeleteDonor] = useState(null);
//   const [showBloodFilterPopup, setShowBloodFilterPopup] = useState(false);
//   const [showDonorFilterPopup, setShowDonorFilterPopup] = useState(false);

//   /* ---------- Blood-type filter states ---------- */
//   const [bloodStatusFilter, setBloodStatusFilter] = useState("All"); // active filter
//   const [tempBloodStatus, setTempBloodStatus] = useState("All");   // popup temp

//   /* ---------- Donor filter states ---------- */
//   const [donorFilters, setDonorFilters] = useState({
//     bloodType: "All",
//     gender: "All",
//   });
//   const [tempDonorFilters, setTempDonorFilters] = useState({
//     bloodType: "All",
//     gender: "All",
//   });

//   const [donorSearch, setDonorSearch] = useState("");
//   const [showDonorSearch, setShowDonorSearch] = useState(false);
//   const [bloodSearch, setBloodSearch] = useState("");
//   const [showBloodSearch, setShowBloodSearch] = useState(false);

//   const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
//   const [selectedDonors, setSelectedDonors] = useState([]);

//   /* ---------- Blood Types Data ---------- */
//   const [allBloodTypes, setAllBloodTypes] = useState([
//     { type: "A+", units: 30, status: "Available" },
//     { type: "A-", units: 10, status: "Low Stock" },
//     { type: "B+", units: 40, status: "Available" },
//     { type: "B-", units: 20, status: "Available" },
//     { type: "AB+", units: 0, status: "Out of Stock" },
//     { type: "AB-", units: 5, status: "Low Stock" },
//     { type: "O+", units: 10, status: "Low Stock" },
//     { type: "O-", units: 0, status: "Out of Stock" },
//   ]);

//   const bloodTypesOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   const statusOptions = ["All", "Available", "Low Stock", "Out of Stock"];

//   /* ---------- Donor Data ---------- */
//   const [allDonors, setAllDonors] = useState([
//     {
//       name: "Emma Walker",
//       gender: "Female",
//       blood: "A+",
//       phone: "555-201-3344",
//       lastDonation: "07/12/2025",
//       status: "Eligible",
//     },
//     {
//       name: "Mason Clark",
//       gender: "Male",
//       blood: "O+",
//       phone: "555-201-2844",
//       lastDonation: "08/01/2025",
//       status: "Not Eligible",
//     },
//     {
//       name: "Sophia Lewis",
//       gender: "Female",
//       blood: "B+",
//       phone: "555-201-3944",
//       lastDonation: "06/22/2025",
//       status: "Eligible",
//     },
//     {
//       name: "Isabella Taylor",
//       gender: "Female",
//       blood: "AB-",
//       phone: "555-201-3244",
//       lastDonation: "07/15/2025",
//       status: "Eligible",
//     },
//     {
//       name: "Liam Johnson",
//       gender: "Male",
//       blood: "O-",
//       phone: "555-201-3744",
//       lastDonation: "05/10/2025",
//       status: "Not Eligible",
//     },
//     {
//       name: "Lucas Thompson",
//       gender: "Male",
//       blood: "AB+",
//       phone: "555-201-4444",
//       lastDonation: "08/25/2025",
//       status: "Eligible",
//     },
//   ]);

//   /* ---------- Pagination ---------- */
//   const [bloodPage, setBloodPage] = useState(1);
//   const [donorPage, setDonorPage] = useState(1);
//   const rowsPerPage = 5;

//   /* ---------- Filtering Logic ---------- */
//   const filteredBloodTypes = allBloodTypes.filter((b) => {
//     // Status filter
//     if (bloodStatusFilter !== "All" && b.status !== bloodStatusFilter) return false;

//     // Search filter
//     if (
//       bloodSearch &&
//       !b.type.toLowerCase().includes(bloodSearch.toLowerCase()) &&
//       !b.status.toLowerCase().includes(bloodSearch.toLowerCase()) &&
//       !String(b.units).includes(bloodSearch)
//     )
//       return false;

//     return true;
//   });

//   const filteredDonors = allDonors.filter((d) => {
//     // Blood type
//     if (
//       donorFilters.bloodType !== "All" &&
//       d.blood !== donorFilters.bloodType
//     )
//       return false;

//     // Gender
//     if (
//       donorFilters.gender !== "All" &&
//       d.gender !== donorFilters.gender
//     )
//       return false;

//     // Search
//     if (
//       donorSearch &&
//       !d.name.toLowerCase().includes(donorSearch.toLowerCase()) &&
//       !d.blood.toLowerCase().includes(donorSearch.toLowerCase()) &&
//       !d.phone.includes(donorSearch) &&
//       !d.gender.toLowerCase().includes(donorSearch.toLowerCase())
//     )
//       return false;

//     return true;
//   });

//   const bloodTypes = filteredBloodTypes.slice(
//     (bloodPage - 1) * rowsPerPage,
//     bloodPage * rowsPerPage
//   );
//   const donors = filteredDonors.slice(
//     (donorPage - 1) * rowsPerPage,
//     donorPage * rowsPerPage
//   );

//   const totalBloodPages = Math.ceil(filteredBloodTypes.length / rowsPerPage);
//   const totalDonorPages = Math.ceil(filteredDonors.length / rowsPerPage);

//   /* ---------- Checkbox Selection ---------- */
//   const handleBloodTypeCheckboxChange = (blood) => {
//     setSelectedBloodTypes((prev) =>
//       prev.includes(blood)
//         ? prev.filter((b) => b !== blood)
//         : [...prev, blood]
//     );
//   };

//   const handleDonorCheckboxChange = (donor) => {
//     setSelectedDonors((prev) =>
//       prev.includes(donor) ? prev.filter((d) => d !== donor) : [...prev, donor]
//     );
//   };

//   const handleSelectAllBloodTypes = () => {
//     setSelectedBloodTypes(
//       selectedBloodTypes.length === bloodTypes.length ? [] : bloodTypes
//     );
//   };

//   const handleSelectAllDonors = () => {
//     setSelectedDonors(selectedDonors.length === donors.length ? [] : donors);
//   };

//   /* ---------- Delete Handlers ---------- */
//   const handleDeleteSelectedDonors = () => {
//     if (selectedDonors.length > 0) setShowDeleteDonorPopup(true);
//   };

//   const confirmDeleteDonors = () => {
//     setAllDonors((prev) =>
//       prev.filter((donor) => !selectedDonors.includes(donor))
//     );
//     setSelectedDonors([]);
//     setShowDeleteDonorPopup(false);
//   };

//   const handleDeleteSingleDonor = (donor) => {
//     setDeleteDonor(donor);
//     setShowDeleteDonorPopup(true);
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative">
//       {/* Gradient overlay (dark mode) */}
//       <div
//         className="absolute inset-0 rounded-[8px] pointer-events-none hidden dark:block"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
//         }}
//       ></div>

//       {/* Gradient Border */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           borderRadius: "10px",
//           padding: "2px",
//           background:
//             "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//           WebkitMask:
//             "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//           WebkitMaskComposite: "xor",
//           maskComposite: "exclude",
//           pointerEvents: "none",
//         }}
//       ></div>

//       {/* ==================== BLOOD TYPES SECTION ==================== */}
//       <div className="mt-4 mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
//         {/* Header */}
//         <div className="p-6 relative z-10 flex flex-col gap-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Blood Bank</h2>
//             <button
//               onClick={() => setShowAddPopup(true)}
//               className="flex items-center gap-2 w-[200px] h-[40px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition px-8 py-2"
//             >
//               <Plus size={18} />
//               Add blood group
//             </button>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400">
//             Available Blood Types and Donor Registry
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3A3A3A] rounded-[12px] p-4">
//           <div className="flex justify-between items-center mb-4">
//             {/* Status dropdown */}
//             <div className="flex gap-2">
//               <div className="relative">
//                 <Listbox value={bloodStatusFilter} onChange={setBloodStatusFilter}>
//                   <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
//                     {bloodStatusFilter}
//                     <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
//                   </Listbox.Button>
//                   <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
//                     {statusOptions.map((s) => (
//                       <Listbox.Option
//                         key={s}
//                         value={s}
//                         className={({ active, selected }) =>
//                           `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
//                             active ? "bg-[#0EFF7B33]" : ""
//                           } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                         }
//                       >
//                         {s}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </Listbox>
//               </div>
//             </div>

//             {/* Search & Filter */}
//             <div className="flex gap-2 items-center">
//               {showBloodSearch && (
//                 <div className="relative w-72">
//                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A]" />
//                   <input
//                     type="text"
//                     placeholder="Search blood types..."
//                     value={bloodSearch}
//                     onChange={(e) => setBloodSearch(e.target.value)}
//                     className="w-full bg-[#0EFF7B1A] pl-10 pr-4 py-2 placeholder-[#5CD592] rounded-[40px] border border-[#0EFF7B1A] text-[#08994A] text-sm focus:outline-none"
//                   />
//                 </div>
//               )}
//               <button
//                 className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//                 onClick={() => setShowBloodSearch(!showBloodSearch)}
//               >
//                 <Search size={18} className="text-[#08994A]" />
//               </button>
//               <button
//                 className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//                 onClick={() => {
//                   setTempBloodStatus(bloodStatusFilter);
//                   setShowBloodFilterPopup(true);
//                 }}
//               >
//                 <Filter size={18} className="text-[#08994A]" />
//               </button>
//             </div>
//           </div>

//           {/* Table */}
//           <table className="w-full border-collapse">
//             <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
//               <tr className="text-center border-b border-gray-300 dark:border-[#000000] text-[#0EFF7B]">
//                 <th className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedBloodTypes.length === bloodTypes.length && bloodTypes.length > 0
//                     }
//                     onChange={handleSelectAllBloodTypes}
//                     className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
//                   />
//                 </th>
//                 <th className="p-3">Blood Types</th>
//                 <th className="p-3">Available Units (in bags)</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bloodTypes.map((b, i) => (
//                 <tr
//                   key={i}
//                   className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] transition"
//                 >
//                   <td className="p-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedBloodTypes.includes(b)}
//                       onChange={() => handleBloodTypeCheckboxChange(b)}
//                       className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
//                     />
//                   </td>
//                   <td className="p-3">{b.type}</td>
//                   <td className="p-3">{b.units}</td>
//                   <td className="p-3">
//                     <span
//                       className={`py-1 rounded-full text-xs font-semibold ${
//                         b.status === "Available"
//                           ? "text-green-500 dark:text-green-400"
//                           : b.status === "Low Stock"
//                           ? "text-yellow-500 dark:text-yellow-400"
//                           : "text-red-500 dark:text-red-400"
//                       }`}
//                     >
//                       {b.status}
//                     </span>
//                   </td>
//                   <td className="p-3 flex justify-end gap-2">
//                     <button
//                       className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//                       onClick={() => {
//                         setEditBlood(b);
//                         setShowEditBloodPopup(true);
//                       }}
//                     >
//                       <Edit size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//                     </button>
//                     <button
//                       className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//                       onClick={() => {
//                         setDeleteBlood(b);
//                         setShowDeleteBloodPopup(true);
//                       }}
//                     >
//                       <Trash2 size={18} className="text-red-600 dark:text-red-700" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredBloodTypes.length === 0 && (
//             <div className="text-center py-8 text-gray-600 dark:text-gray-400">
//               No blood types found matching your criteria.
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4 p-4">
//             <div className="text-sm text-gray-600 dark:text-white">
//               Page{" "}
//               <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
//                 {bloodPage}
//               </span>{" "}
//               of {totalBloodPages} ({(bloodPage - 1) * rowsPerPage + 1} to{" "}
//               {Math.min(bloodPage * rowsPerPage, filteredBloodTypes.length)} from{" "}
//               {filteredBloodTypes.length} Blood Groups)
//             </div>
//             <div className="flex items-center gap-x-2">
//               <button
//                 onClick={() => setBloodPage(Math.max(1, bloodPage - 1))}
//                 disabled={bloodPage === 1}
//                 className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//                   bloodPage === 1
//                     ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
//                     : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
//                 }`}
//               >
//                 <ChevronLeft size={12} />
//               </button>
//               <button
//                 onClick={() => setBloodPage(Math.min(totalBloodPages, bloodPage + 1))}
//                 disabled={bloodPage === totalBloodPages}
//                 className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//                   bloodPage === totalBloodPages
//                     ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
//                     : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
//                 }`}
//               >
//                 <ChevronRight size={12} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ==================== DONOR LIST SECTION ==================== */}
//       <div className="mt-[30px] mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] overflow-hidden relative p-6">
//         {/* Header */}
//         <div className="p-6 relative z-10 flex flex-col gap-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">Donor List</h2>
//             <button
//               onClick={() => setShowAddDonorPopup(true)}
//               className="flex items-center justify-center border-b-[2px] border-[#0EFF7B] gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition"
//             >
//               <Plus size={18} />
//               <span className="leading-none">Add Donor</span>
//             </button>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400">
//             Registered Donors and Blood Type Information
//           </p>
//         </div>

//         {/* Filters & Search */}
//         <div className="flex justify-between items-center mb-4">
//           {/* Blood type & Gender dropdowns */}
//           <div className="flex gap-2">
//             {/* Blood type */}
//             <div className="relative">
//               <Listbox
//                 value={donorFilters.bloodType}
//                 onChange={(v) => setDonorFilters((p) => ({ ...p, bloodType: v }))}
//               >
//                 <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
//                   {donorFilters.bloodType}
//                   <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
//                 </Listbox.Button>
//                 <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
//                   {["All", ...bloodTypesOptions].map((t) => (
//                     <Listbox.Option
//                       key={t}
//                       value={t}
//                       className={({ active, selected }) =>
//                         `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
//                           active ? "bg-[#0EFF7B33]" : ""
//                         } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                       }
//                     >
//                       {t}
//                     </Listbox.Option>
//                   ))}
//                 </Listbox.Options>
//               </Listbox>
//             </div>

//             {/* Gender */}
//             <div className="relative">
//               <Listbox
//                 value={donorFilters.gender}
//                 onChange={(v) => setDonorFilters((p) => ({ ...p, gender: v }))}
//               >
//                 <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
//                   {donorFilters.gender}
//                   <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
//                 </Listbox.Button>
//                 <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
//                   {["All", "Male", "Female", "Other"].map((g) => (
//                     <Listbox.Option
//                       key={g}
//                       value={g}
//                       className={({ active, selected }) =>
//                         `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
//                           active ? "bg-[#0EFF7B33]" : ""
//                         } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                       }
//                     >
//                       {g}
//                     </Listbox.Option>
//                   ))}
//                 </Listbox.Options>
//               </Listbox>
//             </div>
//           </div>

//           {/* Search / Filter / Delete */}
//           <div className="flex gap-2 items-center">
//             {showDonorSearch && (
//               <div className="relative w-72">
//                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
//                 <input
//                   type="text"
//                   placeholder="Search donors..."
//                   value={donorSearch}
//                   onChange={(e) => setDonorSearch(e.target.value)}
//                   className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#0EFF7B] text-sm focus:outline-none"
//                 />
//               </div>
//             )}
//             <button
//               className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//               onClick={() => setShowDonorSearch(!showDonorSearch)}
//             >
//               <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//             </button>
//             <button
//               className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//               onClick={() => {
//                 setTempDonorFilters(donorFilters);
//                 setShowDonorFilterPopup(true);
//               }}
//             >
//               <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//             </button>
//             <button
//               className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//               onClick={handleDeleteSelectedDonors}
//               disabled={selectedDonors.length === 0}
//             >
//               <Trash2 size={18} className="text-red-600 dark:text-red-700" />
//             </button>
//           </div>
//         </div>

//         {/* Donor Table */}
//         <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4">
//           <table className="w-full border-collapse">
//             <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
//               <tr className="text-center border-b border-gray-300 dark:border-[#3C3C3C] text-[#0EFF7B]">
//                 <th className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedDonors.length === donors.length && donors.length > 0}
//                     onChange={handleSelectAllDonors}
//                     className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
//                   />
//                 </th>
//                 <th className="p-3">Donor</th>
//                 <th className="p-3">Gender</th>
//                 <th className="p-3">Blood Type</th>
//                 <th className="p-3">Phone</th>
//                 <th className="p-3">Last Donation Date</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {donors.map((d, i) => (
//                 <tr
//                   key={i}
//                   className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] transition"
//                 >
//                   <td className="p-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedDonors.includes(d)}
//                       onChange={() => handleDonorCheckboxChange(d)}
//                       className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
//                     />
//                   </td>
//                   <td className="p-3">{d.name}</td>
//                   <td className="p-3">{d.gender}</td>
//                   <td className="p-3">{d.blood}</td>
//                   <td className="p-3">{d.phone}</td>
//                   <td className="p-3">{d.lastDonation}</td>
//                   <td className="p-3">
//                     <span
//                       className={`py-1 rounded-full text-xs font-semibold ${
//                         d.status === "Eligible"
//                           ? "text-green-500 dark:text-green-400"
//                           : "text-red-500 dark:text-red-400"
//                       }`}
//                     >
//                       {d.status}
//                     </span>
//                   </td>
//                   <td className="p-3 flex justify-end gap-2">
//                     <button
//                       className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
//                       onClick={() => {
//                         setEditDonor(d);
//                         setShowEditDonorPopup(true);
//                       }}
//                     >
//                       <Edit size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//                     </button>
//                     <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]">
//                       <Mail size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredDonors.length === 0 && (
//             <div className="text-center py-8 text-gray-600 dark:text-gray-400">
//               No donors found matching your criteria.
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4 p-4">
//             <div className="text-sm text-gray-600 dark:text-white">
//               Page{" "}
//               <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
//                 {donorPage}
//               </span>{" "}
//               of {totalDonorPages} ({(donorPage - 1) * rowsPerPage + 1} to{" "}
//               {Math.min(donorPage * rowsPerPage, filteredDonors.length)} from{" "}
//               {filteredDonors.length} Donors)
//             </div>
//             <div className="flex items-center gap-x-2">
//               <button
//                 onClick={() => setDonorPage(Math.max(1, donorPage - 1))}
//                 disabled={donorPage === 1}
//                 className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//                   donorPage === 1
//                     ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
//                     : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
//                 }`}
//               >
//                 <ChevronLeft size={12} />
//               </button>
//               <button
//                 onClick={() => setDonorPage(Math.min(totalDonorPages, donorPage + 1))}
//                 disabled={donorPage === totalDonorPages}
//                 className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//                   donorPage === totalDonorPages
//                     ? "bg-gray-200 dark:bg-[#0EFF7B1A] border-gray-300 dark:border-[#0EFF7B1A] text-gray-600 dark:text-white opacity-50"
//                     : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A] dark:border-[#0EFF7B] text-white dark:text-black"
//                 }`}
//               >
//                 <ChevronRight size={12} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ==================== POP-UPS ==================== */}
//       {showAddPopup && (
//         <AddBloodTypePopup data={null} onClose={() => setShowAddPopup(false)} />
//       )}
//       {showEditBloodPopup && (
//         <EditBloodTypes data={editBlood} onClose={() => setShowEditBloodPopup(false)} />
//       )}
//       {showDeleteBloodPopup && (
//         <DeleteBloodBankPopup
//           data={deleteBlood}
//           onClose={() => setShowDeleteBloodPopup(false)}
//           onConfirm={() => {
//             setAllBloodTypes((prev) => prev.filter((b) => b !== deleteBlood));
//             setShowDeleteBloodPopup(false);
//           }}
//         />
//       )}
//       {showEditDonorPopup && (
//         <EditDonorPopup data={editDonor} onClose={() => setShowEditDonorPopup(false)} />
//       )}
//       {showAddDonorPopup && (
//         <AddDonorPopup data={null} onClose={() => setShowAddDonorPopup(false)} />
//       )}

//       {/* Delete Donor(s) Confirmation */}
//       {showDeleteDonorPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="rounded-[20px] p-[1px]">
//             <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   borderRadius: "20px",
//                   padding: "2px",
//                   background:
//                     "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//                   WebkitMask:
//                     "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                   WebkitMaskComposite: "xor",
//                   maskComposite: "exclude",
//                   pointerEvents: "none",
//                 }}
//               ></div>

//               <div className="flex justify-between items-center pb-3 mb-4">
//                 <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
//                   {deleteDonor ? "Delete Donor" : "Delete Donors"}
//                 </h3>
//                 <button
//                   onClick={() => setShowDeleteDonorPopup(false)}
//                   className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
//                 {deleteDonor
//                   ? `Are you sure you want to delete donor ${deleteDonor.name}?`
//                   : `Are you sure you want to delete ${selectedDonors.length} donor(s)?`}
//                 <br />
//                 This action cannot be undone.
//               </p>

//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setShowDeleteDonorPopup(false)}
//                   className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (deleteDonor) {
//                       setAllDonors((prev) => prev.filter((d) => d !== deleteDonor));
//                       setDeleteDonor(null);
//                     } else {
//                       confirmDeleteDonors();
//                     }
//                     setShowDeleteDonorPopup(false);
//                   }}
//                   className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Blood Filter Popup */}
//       {showBloodFilterPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="rounded-[20px] p-[1px]">
//             <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   borderRadius: "20px",
//                   padding: "2px",
//                   background:
//                     "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//                   WebkitMask:
//                     "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                   WebkitMaskComposite: "xor",
//                   maskComposite: "exclude",
//                   pointerEvents: "none",
//                 }}
//               ></div>

//               <div className="flex justify-between items-center pb-3 mb-4">
//                 <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
//                   Filter Blood Types
//                 </h3>
//                 <button
//                   onClick={() => setShowBloodFilterPopup(false)}
//                   className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2 text-black dark:text-white">
//                   Status
//                 </label>
//                 <div className="relative">
//                   <Listbox value={tempBloodStatus} onChange={setTempBloodStatus}>
//                     <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
//                       {tempBloodStatus}
//                       <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
//                     </Listbox.Button>
//                     <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
//                       {statusOptions.map((s) => (
//                         <Listbox.Option
//                           key={s}
//                           value={s}
//                           className={({ active }) =>
//                             `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
//                               active
//                                 ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
//                                 : "text-black dark:text-white"
//                             }`
//                           }
//                         >
//                           {s}
//                         </Listbox.Option>
//                       ))}
//                     </Listbox.Options>
//                   </Listbox>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   onClick={() => {
//                     setBloodStatusFilter("All");
//                     setTempBloodStatus("All");
//                     setShowBloodFilterPopup(false);
//                   }}
//                   className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => {
//                     setBloodStatusFilter(tempBloodStatus);
//                     setShowBloodFilterPopup(false);
//                   }}
//                   className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Donor Filter Popup (no date field) */}
//       {showDonorFilterPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="rounded-[20px] p-[1px]">
//             <div className="w-[500px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   borderRadius: "20px",
//                   padding: "2px",
//                   background:
//                     "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//                   WebkitMask:
//                     "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                   WebkitMaskComposite: "xor",
//                   maskComposite: "exclude",
//                   pointerEvents: "none",
//                 }}
//               ></div>

//               <div className="flex justify-between items-center pb-3 mb-4">
//                 <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
//                   Filter Donor
//                 </h3>
//                 <button
//                   onClick={() => setShowDonorFilterPopup(false)}
//                   className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 {/* Blood Type */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-black dark:text-white">
//                     Blood Type
//                   </label>
//                   <div className="relative">
//                     <Listbox
//                       value={tempDonorFilters.bloodType}
//                       onChange={(v) =>
//                         setTempDonorFilters((p) => ({ ...p, bloodType: v }))
//                       }
//                     >
//                       <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
//                         {tempDonorFilters.bloodType}
//                         <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
//                       </Listbox.Button>
//                       <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
//                         {["All", ...bloodTypesOptions].map((t) => (
//                           <Listbox.Option
//                             key={t}
//                             value={t}
//                             className={({ active }) =>
//                               `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
//                                 active
//                                   ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
//                                   : "text-black dark:text-white"
//                               }`
//                             }
//                           >
//                             {t}
//                           </Listbox.Option>
//                         ))}
//                       </Listbox.Options>
//                     </Listbox>
//                   </div>
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-black dark:text-white">
//                     Gender
//                   </label>
//                   <div className="relative">
//                     <Listbox
//                       value={tempDonorFilters.gender}
//                       onChange={(v) =>
//                         setTempDonorFilters((p) => ({ ...p, gender: v }))
//                       }
//                     >
//                       <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
//                         {tempDonorFilters.gender}
//                         <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
//                       </Listbox.Button>
//                       <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
//                         {["All", "Male", "Female", "Other"].map((g) => (
//                           <Listbox.Option
//                             key={g}
//                             value={g}
//                             className={({ active }) =>
//                               `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
//                                 active
//                                   ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
//                                   : "text-black dark:text-white"
//                               }`
//                             }
//                           >
//                             {g}
//                           </Listbox.Option>
//                         ))}
//                       </Listbox.Options>
//                     </Listbox>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <button
//                   onClick={() => {
//                     setDonorFilters({ bloodType: "All", gender: "All" });
//                     setTempDonorFilters({ bloodType: "All", gender: "All" });
//                     setShowDonorFilterPopup(false);
//                   }}
//                   className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => {
//                     setDonorFilters(tempDonorFilters);
//                     setShowDonorFilterPopup(false);
//                   }}
//                   className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BloodBank;

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import DeleteBloodBankPopup from "./DeleteBloodBankPopup.jsx";
import EditBloodTypes from "./EditBloodTypes.jsx";
import EditDonorPopup from "./EditDonorPopup.jsx";
import AddBloodTypePopup from "./AddBloodTypesPopup.jsx";
import AddDonorPopup from "./AddDonorPopup.jsx";
import { successToast, errorToast } from "../../../../components/Toast.jsx";

const BloodBank = () => {
  /* ---------- Pop-up states ---------- */
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
  const API_BASE = "http://localhost:8000";

  /* ---------- Filter states ---------- */
  const [bloodStatusFilter, setBloodStatusFilter] = useState("All");
  const [tempBloodStatus, setTempBloodStatus] = useState("All");
  const [donorFilters, setDonorFilters] = useState({
    bloodType: "All",
    gender: "All",
  });
  const [tempDonorFilters, setTempDonorFilters] = useState({
    bloodType: "All",
    gender: "All",
  });

  const [donorSearch, setDonorSearch] = useState("");
  const [showDonorSearch, setShowDonorSearch] = useState(false);
  const [bloodSearch, setBloodSearch] = useState("");
  const [showBloodSearch, setShowBloodSearch] = useState(false);

  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donorLoading, setDonorLoading] = useState(true);

  /* ---------- Blood Types Data ---------- */
  const [allBloodTypes, setAllBloodTypes] = useState([]);

  /* ---------- Donor Data ---------- */
  const [allDonors, setAllDonors] = useState([]);

  const bloodTypesOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusOptions = ["All", "Available", "Low Stock", "Out of Stock"];

  /* ---------- Pagination ---------- */
  const [bloodPage, setBloodPage] = useState(1);
  const [donorPage, setDonorPage] = useState(1);
  const rowsPerPage = 5;

  /* ---------- API Functions ---------- */
  const fetchBloodGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/blood-groups/`);
      if (response.ok) {
        const data = await response.json();
        setAllBloodTypes(data.blood_groups || []);
      } else {
        throw new Error(`Failed to fetch blood groups: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching blood groups:", error);
      setAllBloodTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      setDonorLoading(true);
      const response = await fetch(`${API_BASE}/api/donors/list`);
      if (response.ok) {
        const data = await response.json();
        const transformedDonors = data.map((donor) => ({
          id: donor.id,
          name: donor.donor_name,
          gender: donor.gender,
          blood: donor.blood_type,
          phone: donor.phone,
          lastDonation: donor.last_donation_date
            ? new Date(donor.last_donation_date).toLocaleDateString("en-US")
            : "Never",
          status: donor.status,
        }));
        setAllDonors(transformedDonors);
      } else {
        throw new Error(`Failed to fetch donors: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      setAllDonors([]);
    } finally {
      setDonorLoading(false);
    }
  };

  /* ---------- Blood Group Handlers ---------- */
  const handleAddBloodGroup = async (newBloodGroup) => {
    setAllBloodTypes((prev) => [...prev, newBloodGroup]);
    await fetchBloodGroups();
  };

  const handleUpdateBloodGroup = async (updatedBloodGroup) => {
    try {
      console.log("🟡 handleUpdateBloodGroup called with:", updatedBloodGroup);

      const bloodId = editBlood?.id;
      console.log("🟡 Editing blood ID:", bloodId);
      console.log("🟡 Original editBlood data:", editBlood);

      if (!bloodId) {
        throw new Error("Blood group ID is missing");
      }

      const payload = {
        blood_type: updatedBloodGroup.type,
        available_units: parseInt(updatedBloodGroup.units),
        status: updatedBloodGroup.status,
      };

      console.log("🟡 Sending payload to backend:", payload);

      const response = await fetch(
        `${API_BASE}/api/blood-groups/${bloodId}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("🟡 Update response status:", response.status);
      console.log("🟡 Update response data:", result);

      if (!response.ok) {
        const errorMsg = result.detail || "Failed to update blood group";
        throw new Error(errorMsg);
      }

      // Refresh the data
      await fetchBloodGroups();
      console.log("✅ Blood group updated successfully");
    } catch (error) {
      console.error("❌ Error updating blood group:", error);
      alert(`Error updating blood group:\n${error.message}`);
    }
  };

  const handleDeleteBloodGroup = async (bloodGroup) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/blood-groups/${bloodGroup.id}/delete`,
        { method: "DELETE" }
      );

      if (response.ok) {
        // Remove from state
        setAllBloodTypes((prev) =>
          prev.filter((bg) => bg.id !== bloodGroup.id)
        );
        setSelectedBloodTypes((prev) =>
          prev.filter((bg) => bg.id !== bloodGroup.id)
        );

        // Refresh list
        await fetchBloodGroups();

        // Success toast
        successToast(`Blood type "${bloodGroup.type}" deleted successfully!`);
      } else {
        throw new Error("Failed to delete blood group");
      }
    } catch (error) {
      console.error("Error deleting blood group:", error);

      // Still remove from UI (optimistic)
      setAllBloodTypes((prev) => prev.filter((bg) => bg.id !== bloodGroup.id));

      // Error toast
      errorToast(`Failed to delete "${bloodGroup.type}"`);
    }
  };

  const handleDeleteSelectedBloodGroups = async () => {
    const count = selectedBloodTypes.length;
    const types = selectedBloodTypes.map((bg) => bg.type).join(", ");

    try {
      for (const bg of selectedBloodTypes) {
        await handleDeleteBloodGroup(bg);
      }

      setSelectedBloodTypes([]);

      // Bulk success toast
      successToast(
        `${count} blood type${count > 1 ? "s" : ""} deleted successfully!`
      );
    } catch (error) {
      // If any fail, show error (individual toasts already shown in handleDeleteBloodGroup)
      errorToast("Some blood types could not be deleted.");
    }
  };

  /* ---------- Donor Handlers ---------- */
  const handleAddDonor = async () => {
    // Simply refresh the donors list - the API call already happened in the popup
    try {
      console.log("Refreshing donors list after successful addition");
      await fetchDonors(); // Refresh the donors list
      await fetchBloodGroups(); // Refresh blood groups if needed
    } catch (error) {
      console.error("Error refreshing data after adding donor:", error);
    }
  };

  const handleUpdateDonor = async (updatedDonorData) => {
    try {
      console.log("🟡 Updating donor with data:", updatedDonorData);

      const donorId = editDonor?.id;

      if (!donorId) {
        throw new Error("Donor ID is missing");
      }

      const payload = {
        donor_name: updatedDonorData.donor_name,
        phone: updatedDonorData.phone,
        gender: updatedDonorData.gender,
        blood_type: updatedDonorData.blood_type,
        last_donation_date: updatedDonorData.last_donation_date || null,
        status: updatedDonorData.status,
      };

      console.log(
        "🟡 Sending PUT request to:",
        `${API_BASE}/api/donors/${donorId}`
      );
      console.log("🟡 Request payload:", payload);

      const response = await fetch(`${API_BASE}/api/donors/${donorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("🟡 Update response status:", response.status);
      console.log("🟡 Update response data:", result);

      if (!response.ok) {
        const errorMsg = result.detail || "Failed to update donor";
        throw new Error(errorMsg);
      }

      // Refresh the donors list
      await fetchDonors();
      console.log("✅ Donor updated successfully");
    } catch (error) {
      console.error("❌ Error updating donor:", error);
      alert(`Error updating donor:\n${error.message}`);
    }
  };
  const handleDeleteDonor = async (donor) => {
    try {
      const response = await fetch(`${API_BASE}/api/donors/${donor.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAllDonors((prev) => prev.filter((d) => d.id !== donor.id));
        setSelectedDonors((prev) => prev.filter((d) => d.id !== donor.id));
        successToast("Donor Deleted successfully!");
        await fetchDonors();
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
      errorToast("Unable Delete");
      setAllDonors((prev) => prev.filter((d) => d.id !== donor.id));
    }
  };

  const handleDeleteSelectedDonors = async () => {
    for (const donor of selectedDonors) {
      await handleDeleteDonor(donor);
    }
    setSelectedDonors([]);
    setShowDeleteDonorPopup(false);
  };

  const handleDeleteSingleDonor = (donor) => {
    setDeleteDonor(donor);
    setShowDeleteDonorPopup(true);
  };

  const confirmDeleteDonors = () => {
    if (deleteDonor) {
      handleDeleteDonor(deleteDonor);
      setDeleteDonor(null);
    } else {
      handleDeleteSelectedDonors();
    }
    setShowDeleteDonorPopup(false);
  };

  /* ---------- useEffect ---------- */
  useEffect(() => {
    fetchBloodGroups();
    fetchDonors();
  }, []);

  /* ---------- Filtering Logic ---------- */
  const filteredBloodTypes = allBloodTypes.filter((b) => {
    if (bloodStatusFilter !== "All" && b.status !== bloodStatusFilter)
      return false;
    if (
      bloodSearch &&
      !b.blood_type.toLowerCase().includes(bloodSearch.toLowerCase()) &&
      !b.status.toLowerCase().includes(bloodSearch.toLowerCase()) &&
      !String(b.available_units).includes(bloodSearch)
    )
      return false;
    return true;
  });

  const filteredDonors = allDonors.filter((d) => {
    if (donorFilters.bloodType !== "All" && d.blood !== donorFilters.bloodType)
      return false;
    if (donorFilters.gender !== "All" && d.gender !== donorFilters.gender)
      return false;
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

  /* ---------- Checkbox Selection ---------- */
  const handleBloodTypeCheckboxChange = (blood) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(blood) ? prev.filter((b) => b !== blood) : [...prev, blood]
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

  /* ---------- UI ---------- */
  return (
    <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative">
      {/* Gradient overlay (dark mode) */}
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
        }}
      ></div>

      {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      ></div>

      {/* ==================== BLOOD TYPES SECTION ==================== */}
      <div className="mt-4 mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] overflow-hidden relative">
        {/* Header */}
        <div className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Blood Bank</h2>
            <button
              onClick={() => setShowAddPopup(true)}
              className="flex items-center gap-2 w-[200px] h-[40px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition px-8 py-2"
            >
              <Plus size={18} />
              Add blood group
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Available Blood Types and Donor Registry
          </p>
        </div>

        {/* Controls */}
        <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3A3A3A] rounded-[12px] p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Status dropdown */}
            <div className="flex gap-2">
              <div className="relative">
                <Listbox
                  value={bloodStatusFilter}
                  onChange={setBloodStatusFilter}
                >
                  <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                    {bloodStatusFilter}
                    <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
                    {statusOptions.map((s) => (
                      <Listbox.Option
                        key={s}
                        value={s}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                            active ? "bg-[#0EFF7B33]" : ""
                          } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {s}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>

              {/* Delete Selected Button */}
              {selectedBloodTypes.length > 0 && (
                <button
                  onClick={() => setShowDeleteBloodPopup(true)}
                  className="flex items-center gap-2 w-auto h-[32px] px-3 rounded-[8px] bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedBloodTypes.length})
                </button>
              )}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-2 items-center">
              {showBloodSearch && (
                <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A]" />
                  <input
                    type="text"
                    placeholder="Search blood types..."
                    value={bloodSearch}
                    onChange={(e) => setBloodSearch(e.target.value)}
                    className="w-full bg-[#0EFF7B1A] pl-10 pr-4 py-2 placeholder-[#5CD592] rounded-[40px] border border-[#0EFF7B1A] text-[#08994A] text-sm focus:outline-none"
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
                  setTempBloodStatus(bloodStatusFilter);
                  setShowBloodFilterPopup(true);
                }}
              >
                <Filter size={18} className="text-[#08994A]" />
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
              <tr className="text-center border-b border-gray-300 dark:border-[#000000] text-[#0EFF7B]">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedBloodTypes.length === bloodTypes.length &&
                      bloodTypes.length > 0
                    }
                    onChange={handleSelectAllBloodTypes}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['Check'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                  />
                </th>
                <th className="p-3">Blood Types</th>
                <th className="p-3">Available Units (in bags)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-600 dark:text-gray-400"
                  >
                    Loading blood groups...
                  </td>
                </tr>
              ) : bloodTypes.length > 0 ? (
                bloodTypes.map((b) => (
                  <tr
                    key={b.id}
                    className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] transition"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedBloodTypes.includes(b)}
                        onChange={() => handleBloodTypeCheckboxChange(b)}
                        className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['Check'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                      />
                    </td>
                    <td className="p-3">{b.blood_type}</td>
                    <td className="p-3">{b.available_units}</td>
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
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                        onClick={() => {
                          console.log(
                            "🟡 Opening edit popup with blood data:",
                            b
                          );
                          setEditBlood(b); // Make sure this contains the blood data
                          setShowEditBloodPopup(true);
                        }}
                      >
                        <Edit
                          size={18}
                          className="text-[#08994A] dark:text-[#0EFF7B]"
                        />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-600 dark:text-gray-400"
                  >
                    No blood types found. Add your first blood type!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && filteredBloodTypes.length > 0 && (
            <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4 p-4">
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
          )}
        </div>
      </div>

      {/* ==================== DONOR LIST SECTION ==================== */}
      <div className="mt-[30px] mb-4 w-full rounded-xl border border-transparent bg-white dark:bg-transparent shadow-[0_0_4px_0_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_0_#FFFFFF1F] overflow-hidden relative p-6">
        {/* Header */}
        <div className="p-6 relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Donor List</h2>
            <button
              onClick={() => setShowAddDonorPopup(true)}
              className="flex items-center justify-center border-b-[2px] border-[#0EFF7B] gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition"
            >
              <Plus size={18} />
              <span className="leading-none">Add Donor</span>
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Registered Donors and Blood Type Information
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {/* Blood type */}
            <div className="relative">
              <Listbox
                value={donorFilters.bloodType}
                onChange={(v) =>
                  setDonorFilters((p) => ({ ...p, bloodType: v }))
                }
              >
                <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                  {donorFilters.bloodType}
                  <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
                  {["All", ...bloodTypesOptions].map((t) => (
                    <Listbox.Option
                      key={t}
                      value={t}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                          active ? "bg-[#0EFF7B33]" : ""
                        } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                      }
                    >
                      {t}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            <div className="relative">
              <Listbox
                value={donorFilters.gender}
                onChange={(v) => setDonorFilters((p) => ({ ...p, gender: v }))}
              >
                <Listbox.Button className="w-[139px] h-[32px] flex justify-between items-center bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B] dark:border-[#3C3C3C] text-sm px-3 py-1 rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] focus:outline-none">
                  {donorFilters.gender}
                  <ChevronDown className="w-4 h-4 text-[#0EFF7B]" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-[139px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white rounded-[8px] shadow-[0_0_4px_0_#0EFF7B] z-50 max-h-60 overflow-y-auto">
                  {["All", "Male", "Female", "Other"].map((g) => (
                    <Listbox.Option
                      key={g}
                      value={g}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-1 px-2 text-sm rounded-md ${
                          active ? "bg-[#0EFF7B33]" : ""
                        } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                      }
                    >
                      {g}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            {selectedDonors.length > 0 && (
              <button
                onClick={() => setShowDeleteDonorPopup(true)}
                className="flex items-center gap-2 w-auto h-[32px] px-3 rounded-[8px] bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedDonors.length})
              </button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {showDonorSearch && (
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B]" />
                <input
                  type="text"
                  placeholder="Search donors..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] text-[#08994A] dark:text-[#0EFF7B] text-sm focus:outline-none"
                />
              </div>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
              onClick={() => setShowDonorSearch(!showDonorSearch)}
            >
              <Search
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
              onClick={() => {
                setTempDonorFilters(donorFilters);
                setShowDonorFilterPopup(true);
              }}
            >
              <Filter
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </button>
          </div>
        </div>

        {/* Donor Table */}
        <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4">
          <table className="w-full border-collapse">
            <thead className="min-h-[52px] bg-gray-200 dark:bg-[#091810] h-[52px]">
              <tr className="text-center border-b border-gray-300 dark:border-[#3C3C3C] text-[#0EFF7B]">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedDonors.length === donors.length &&
                      donors.length > 0
                    }
                    onChange={handleSelectAllDonors}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['Check'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
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
              {donorLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-600 dark:text-gray-400"
                  >
                    Loading donors...
                  </td>
                </tr>
              ) : donors.length > 0 ? (
                donors.map((d) => (
                  <tr
                    key={d.id}
                    className="text-center border-b h-[62px] border-gray-300 dark:border-[#3C3C3C] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] transition"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedDonors.includes(d)}
                        onChange={() => handleDonorCheckboxChange(d)}
                        className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['Check'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                      />
                    </td>
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.gender}</td>
                    <td className="p-3">{d.blood}</td>
                    <td className="p-3">{d.phone}</td>
                    <td className="p-3">{d.lastDonation}</td>
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
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                        onClick={() => {
                          console.log("Editing donor:", d);
                          setEditDonor(d);
                          setShowEditDonorPopup(true);
                        }}
                      >
                        <Edit
                          size={18}
                          className="text-[#08994A] dark:text-[#0EFF7B]"
                        />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]">
                        <Mail
                          size={18}
                          className="text-[#08994A] dark:text-[#0EFF7B]"
                        />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                        onClick={() => handleDeleteSingleDonor(d)}
                      >
                        <Trash2
                          size={18}
                          className="text-red-600 dark:text-red-700"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-600 dark:text-gray-400"
                  >
                    No donors found. Add your first donor!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!donorLoading && filteredDonors.length > 0 && (
            <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4 p-4">
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
          )}
        </div>
      </div>

      {/* ==================== POP-UPS ==================== */}
      {showAddPopup && (
        <AddBloodTypePopup
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddBloodGroup}
        />
      )}
      {showEditBloodPopup && (
        <EditBloodTypes
          data={editBlood}
          onClose={() => setShowEditBloodPopup(false)}
          onUpdate={handleUpdateBloodGroup}
        />
      )}
      {showDeleteBloodPopup && (
        <DeleteBloodBankPopup
          data={deleteBlood}
          selectedCount={selectedBloodTypes.length}
          onClose={() => setShowDeleteBloodPopup(false)}
          onConfirm={() => {
            if (deleteBlood) handleDeleteBloodGroup(deleteBlood);
            else handleDeleteSelectedBloodGroups();
            setShowDeleteBloodPopup(false);
          }}
        />
      )}
      {showEditDonorPopup && (
        <EditDonorPopup
          key={editDonor?.id}
          onClose={() => setShowEditDonorPopup(false)}
          donor={editDonor}
          onUpdate={handleUpdateDonor}
        />
      )}
      {showAddDonorPopup && (
        <AddDonorPopup
          onClose={() => setShowAddDonorPopup(false)}
          onAdd={handleAddDonor} // Just pass the function reference, no parameters
        />
      )}

      {/* Delete Donor(s) Confirmation */}
      {showDeleteDonorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
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
                }}
              ></div>

              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  {deleteDonor ? "Delete Donor" : "Delete Donors"}
                </h3>
                <button
                  onClick={() => setShowDeleteDonorPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {deleteDonor
                  ? `Are you sure you want to delete donor ${deleteDonor.name}?`
                  : `Are you sure you want to delete ${selectedDonors.length} donor(s)?`}
                <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteDonorPopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteDonors}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blood Filter Popup */}
      {showBloodFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
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
                }}
              ></div>

              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Filter Blood Types
                </h3>
                <button
                  onClick={() => setShowBloodFilterPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Status
                </label>
                <div className="relative">
                  <Listbox
                    value={tempBloodStatus}
                    onChange={setTempBloodStatus}
                  >
                    <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
                      {tempBloodStatus}
                      <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
                      {statusOptions.map((s) => (
                        <Listbox.Option
                          key={s}
                          value={s}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                              active
                                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                : "text-black dark:text-white"
                            }`
                          }
                        >
                          {s}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setBloodStatusFilter("All");
                    setTempBloodStatus("All");
                    setShowBloodFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setBloodStatusFilter(tempBloodStatus);
                    setShowBloodFilterPopup(false);
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donor Filter Popup */}
      {showDonorFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[500px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
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
                }}
              ></div>

              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Filter Donor
                </h3>
                <button
                  onClick={() => setShowDonorFilterPopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Blood Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Blood Type
                  </label>
                  <div className="relative">
                    <Listbox
                      value={tempDonorFilters.bloodType}
                      onChange={(v) =>
                        setTempDonorFilters((p) => ({ ...p, bloodType: v }))
                      }
                    >
                      <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
                        {tempDonorFilters.bloodType}
                        <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
                        {["All", ...bloodTypesOptions].map((t) => (
                          <Listbox.Option
                            key={t}
                            value={t}
                            className={({ active }) =>
                              `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                                active
                                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                  : "text-black dark:text-white"
                              }`
                            }
                          >
                            {t}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Gender
                  </label>
                  <div className="relative">
                    <Listbox
                      value={tempDonorFilters.gender}
                      onChange={(v) =>
                        setTempDonorFilters((p) => ({ ...p, gender: v }))
                      }
                    >
                      <Listbox.Button className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]">
                        {tempDonorFilters.gender}
                        <ChevronDown className="absolute right-3 top-2 w-4 h-4 pointer-events-none text-[#08994A] dark:text-[#0EFF7B]" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
                        {["All", "Male", "Female", "Other"].map((g) => (
                          <Listbox.Option
                            key={g}
                            value={g}
                            className={({ active }) =>
                              `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                                active
                                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                  : "text-black dark:text-white"
                              }`
                            }
                          >
                            {g}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setDonorFilters({ bloodType: "All", gender: "All" });
                    setTempDonorFilters({ bloodType: "All", gender: "All" });
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
                  className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
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
