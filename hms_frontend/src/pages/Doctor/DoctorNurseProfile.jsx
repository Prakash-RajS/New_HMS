// import React, { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import image from "../../assets/image.png";
// import { Listbox } from "@headlessui/react";
// import EditDoctorNursePopup from "./EditDoctorNursePopup.jsx";
// import { successToast, errorToast } from "../../components/Toast";

// const API_BASE = "http://127.0.0.1:8000";

// const ProfileSection = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [showFilterPopup, setShowFilterPopup] = useState(false);
//   const [filtersData, setFiltersData] = useState({
//     department: "",
//     specialist: "",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 9;

//   const navigate = useNavigate();

//   const [profiles, setProfiles] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [specialists, setSpecialists] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all staff from backend
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${API_BASE}/staff/all/`);
//         if (!response.ok) throw new Error("Failed to fetch profiles");
//         const data = await response.json();

//         // Transform to match frontend format
//         const transformed = data.map((staff) => ({
//           id: staff.id,
//           name: staff.full_name || "Unknown",
//           qualification: staff.specialization || "N/A",
//           department: staff.department || "N/A",
//           joinDate: staff.date_of_joining
//             ? new Date(staff.date_of_joining).toLocaleDateString("en-GB")
//             : "N/A",
//           contact: staff.phone || "N/A",
//           email: staff.email || "N/A",
//           type: staff.designation
//             ? staff.designation.toLowerCase() === "doctor"
//               ? "Doctors"
//               : staff.designation.toLowerCase() === "nurse"
//               ? "Nurses"
//               : "Other Staff"
//             : "Other Staff",
//           // Include all original data for editing
//           originalData: staff,
//         }));

//         setProfiles(transformed);

//         // Extract unique departments and specialists (exclude N/A)
//         const uniqueDepartments = [
//           ...new Set(
//             transformed.map((p) => p.department).filter((d) => d && d !== "N/A")
//           ),
//         ].sort();
//         const uniqueSpecialists = [
//           ...new Set(
//             transformed
//               .map((p) => p.qualification)
//               .filter((s) => s && s !== "N/A")
//           ),
//         ].sort();
//         setDepartments(uniqueDepartments);
//         setSpecialists(uniqueSpecialists);
//       } catch (err) {
//         errorToast("Failed to load profiles.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfiles();
//   }, []);

//   const filteredProfiles = useMemo(() => {
//     return profiles.filter((profile) => {
//       if (
//         searchTerm &&
//         !(
//           profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           profile.department.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       ) {
//         return false;
//       }
//       if (
//         filtersData.department &&
//         profile.department !== filtersData.department
//       ) {
//         return false;
//       }
//       if (
//         filtersData.specialist &&
//         profile.qualification !== filtersData.specialist
//       ) {
//         return false;
//       }
//       return true;
//     });
//   }, [profiles, searchTerm, filtersData]);

//   const totalPages = Math.ceil(filteredProfiles.length / rowsPerPage);
//   const paginatedProfiles = filteredProfiles.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleFilterChange = (field, value) => {
//     setFiltersData((prev) => ({ ...prev, [field]: value }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFiltersData({
//       department: "",
//       specialist: "",
//     });
//     setCurrentPage(1);
//   };

//   const handleEditProfile = (profile) => {
//     setSelectedProfile(profile.originalData);
//     setShowEditPopup(true);
//   };

//   const handleUpdateProfile = async (updatedData) => {
//     try {
//       // Update the profile in the backend
//       const response = await fetch(
//         `${API_BASE}/staff/update/${updatedData.id}/`,
//         {
//           method: "PUT",
//           body: updatedData, // This should be FormData in your actual implementation
//         }
//       );

//       if (response.ok) {
//         successToast("Profile updated successfully");
//         // Refresh the profiles
//         const fetchResponse = await fetch(`${API_BASE}/staff/all/`);
//         const data = await fetchResponse.json();
//         const transformed = data.map((staff) => ({
//           id: staff.id,
//           name: staff.full_name || "Unknown",
//           qualification: staff.specialization || "N/A",
//           department: staff.department || "N/A",
//           joinDate: staff.date_of_joining
//             ? new Date(staff.date_of_joining).toLocaleDateString("en-GB")
//             : "N/A",
//           contact: staff.phone || "N/A",
//           email: staff.email || "N/A",
//           type: staff.designation
//             ? staff.designation.toLowerCase() === "doctor"
//               ? "Doctors"
//               : staff.designation.toLowerCase() === "nurse"
//               ? "Nurses"
//               : "Other Staff"
//             : "Other Staff",
//           originalData: staff,
//         }));
//         setProfiles(transformed);
//       } else {
//         errorToast("Failed to update profile");
//       }
//     } catch (error) {
//       errorToast("Error updating profile");
//       console.error(error);
//     }
//   };

//   const Dropdown = ({ placeholder, value, onChange, options }) => (
//     <div className="relative">
//       <Listbox
//         value={value || ""}
//         onChange={(val) => onChange(val === placeholder ? "" : val)}
//       >
//         <div className="relative mt-1 w-[228px]">
//           <Listbox.Button
//             className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
//                        bg-gray-100 dark:bg-[#000000] text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] z-[100]"
//             style={{
//               borderColor: "#3C3C3C",
//               boxShadow: "0px 0px 4px 0px #0EFF7B",
//             }}
//           >
//             <span className="block truncate">{value || placeholder}</span>
//             <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//               <svg
//                 className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </span>
//           </Listbox.Button>

//           <Listbox.Options
//             className="absolute mt-1 w-full max-h-60 rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A] overflow-auto z-[100]"
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             <Listbox.Option
//               key="default"
//               value={placeholder}
//               className="cursor-pointer select-none py-2 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33]"
//             >
//               {placeholder}
//             </Listbox.Option>
//             {options.map((option, idx) => (
//               <Listbox.Option
//                 key={idx}
//                 value={option}
//                 className={({ active, selected }) =>
//                   `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
//                     active
//                       ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
//                       : "text-black dark:text-white"
//                   } ${
//                     selected
//                       ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
//                       : ""
//                   }`
//                 }
//               >
//                 {option}
//               </Listbox.Option>
//             ))}
//           </Listbox.Options>
//         </div>
//       </Listbox>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="w-8 h-8 border-2 border-[#0EFF7B] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const totalDoctors = filteredProfiles.filter(
//     (p) => p.type === "Doctors"
//   ).length;
//   const totalNurses = filteredProfiles.filter(
//     (p) => p.type === "Nurses"
//   ).length;
//   const totalOtherStaff = filteredProfiles.filter(
//     (p) => p.type === "Other Staff"
//   ).length;

//   return (
//     <div className="mt-[80px] mb-4 bg-gray-100 dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative">
//       <div
//         className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
//           zIndex: 0,
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
//           zIndex: 0,
//         }}
//       ></div>

//       {/* Header */}
//       <div className="flex justify-between items-center mt-4 mb-6 relative z-10">
//         <h2 className="text-xl font-semibold text-black dark:text-white">
//           Doctor/Nurse Profiles
//         </h2>
//         <button
//           onClick={() => navigate("/Doctors-Nurse/AddDoctorNurse")}
//           className="w-[200px] h-[40px] flex items-center justify-center gap-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-[8px] text-white font-semibold hover:scale-105 transition"
//           style={{
//             background:
//               "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
//           }}
//         >
//           <Plus size={18} className="text-white" />
//           Add Doctor/Nurse
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="mb-6 w-[800px] relative z-10">
//         <div className="flex items-center gap-4 rounded-xl">
//           <div className="flex items-center gap-3">
//             <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
//               Total Doctors
//             </span>
//             <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#0EFF7B66] dark:border-[#0EFF7B66] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A]">
//               {totalDoctors}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
//               Total Nurse
//             </span>
//             <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#2231FF] dark:border-[#2231FF] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-b from-[#6E92FF] to-[#425899] dark:from-[#6E92FF] dark:to-[#425899]">
//               {totalNurses}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="font-inter font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">
//               Other staff
//             </span>
//             <span className="w-6 h-6 flex items-center justify-center gap-1 rounded-[20px] border border-[#FF930E] dark:border-[#FF930E] p-1 text-xs font-normal text-white dark:text-white bg-gradient-to-b from-[#FF930E] to-[#995808] dark:from-[#FF930E] dark:to-[#995808]">
//               {totalOtherStaff}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="flex justify-between items-center mb-6 relative z-30">
//         <div className="flex gap-4">
//           <Dropdown
//             placeholder="Select Department"
//             value={filtersData.department}
//             onChange={(val) => handleFilterChange("department", val)}
//             options={departments}
//           />
//           <Dropdown
//             placeholder="Select Specialist"
//             value={filtersData.specialist}
//             onChange={(val) => handleFilterChange("specialist", val)}
//             options={specialists}
//           />
//         </div>
//         <div className="flex gap-4">
//           <div className="min-w-[315px] flex items-center bg-[#0EFF7B1A] dark:bg-[#1E1E1E] rounded-full px-3 py-1 border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] relative">
//             <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//             <input
//               type="text"
//               placeholder="Search by name or department"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-transparent px-2 text-[12px] placeholder-[#5CD592] outline-none text-[#08994A] dark:text-[#5CD592] w-48"
//             />
//           </div>
//           <button
//             onClick={() => setShowFilterPopup(true)}
//             className="flex items-center gap-2 bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white px-4 py-2 rounded-full border-[1px] border-[#0EFF7B1A] dark:border-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]"
//           >
//             <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
//           </button>
//         </div>
//       </div>

//       {/* Filter Popup */}
//       {showFilterPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="w-[600px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-gray-100 dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-lg backdrop-blur-md relative z-50">
//             {/* Gradient Border */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 borderRadius: "20px",
//                 padding: "2px",
//                 background:
//                   "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//                 WebkitMask:
//                   "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//                 WebkitMaskComposite: "xor",
//                 maskComposite: "exclude",
//                 pointerEvents: "none",
//                 zIndex: 0,
//               }}
//             ></div>
//             <div className="flex justify-between items-center pb-3 mb-4 relative z-10">
//               <h3 className="text-black dark:text-white font-medium text-[16px]">
//                 Filter Profiles
//               </h3>
//               <button
//                 onClick={() => setShowFilterPopup(false)}
//                 className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] flex items-center justify-center text-gray-600 dark:text-white hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-6 relative z-30">
//               <Dropdown
//                 placeholder="Select Department"
//                 value={filtersData.department}
//                 onChange={(val) =>
//                   setFiltersData((prev) => ({ ...prev, department: val }))
//                 }
//                 options={departments}
//               />
//               <Dropdown
//                 placeholder="Select Specialist"
//                 value={filtersData.specialist}
//                 onChange={(val) =>
//                   setFiltersData((prev) => ({ ...prev, specialist: val }))
//                 }
//                 options={specialists}
//               />
//             </div>

//             <div className="flex justify-center gap-6 mt-8 relative z-10">
//               <button
//                 onClick={handleClearFilters}
//                 className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow hover:bg-[#0EFF7B1A] dark:hover:bg-gray-900"
//               >
//                 Clear
//               </button>
//               <button
//                 onClick={() => setShowFilterPopup(false)}
//                 className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
//                 style={{
//                   background:
//                     "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
//                 }}
//               >
//                 Filter
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Doctor/Nurse Popup */}
//       {showEditPopup && selectedProfile && (
//         <EditDoctorNursePopup
//           onClose={() => {
//             setShowEditPopup(false);
//             setSelectedProfile(null);
//           }}
//           profile={selectedProfile}
//           onUpdate={handleUpdateProfile}
//         />
//       )}

//       {/* Profiles Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
//         {paginatedProfiles.length > 0 ? (
//           paginatedProfiles.map((profile, index) => (
//             <div
//               key={profile.id || index}
//               className="w-full h-full bg-gray-100 dark:bg-[#0EFF7B08] rounded-lg p-5 border border-[#0EFF7B80] dark:border-[#0EFF7B80] shadow-[0px_0px_4px_0px_#A0A0A040] dark:shadow-[0px_0px_4px_0px_#0EFF7B] relative text-center flex flex-col items-center"
//               style={{ zIndex: 20 }}
//             >
//               <div className="absolute top-4 left-4 text-[#08994A] dark:text-[#0EFF7B] text-[14px]">
//                 {profile.type}
//               </div>
//               <div className="w-16 h-16 mx-auto mb-4 mt-10 rounded-full overflow-hidden">
//                 <img
//                   src={image}
//                   alt="Staff Avatar"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <p className="text-[18px] font-medium text-[#08994A] dark:text-[#0EFF7B] mb-1">
//                 {profile.name}
//               </p>
//               <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
//                 {profile.qualification}
//               </p>
//               <div className="w-full text-left space-y-2 mb-4">
//                 <div className="flex justify-between">
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     Department
//                   </span>
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     {profile.department}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     Join Date
//                   </span>
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     {profile.joinDate}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     Contact
//                   </span>
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     {profile.contact}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400">
//                     Email ID
//                   </span>
//                   <span className="text-[14px] text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
//                     {profile.email}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleEditProfile(profile)}
//                 className="absolute top-4 right-4 flex items-center gap-1 text-[#4D58FF] dark:text-[#6E92FF] text-[12px]"
//               >
//                 <Edit size={16} />
//                 <span>Edit</span>
//               </button>
//               <button
//                 className="w-[112px] h-[33px] rounded-[8px] border-[2px] border-[#0EFF7B66] dark:border-[#025126] bg-[#08994A] dark:bg-[#0EFF7B1A] text-white text-[14px] font-medium hover:scale-105 transition"
//                 onClick={() =>
//                   navigate("/Doctors-Nurse/ViewProfile", {
//                     state: { profile: profile.originalData },
//                   })
//                 }
//               >
//                 View profile
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-3 text-center py-6 text-gray-600 dark:text-gray-400 italic">
//             No profiles found
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center mt-4 bg-gray-100 dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E] relative z-10">
//         <div className="text-sm text-black dark:text-white">
//           Page {currentPage} of {totalPages} (
//           {(currentPage - 1) * rowsPerPage + 1} to{" "}
//           {Math.min(currentPage * rowsPerPage, filteredProfiles.length)} from{" "}
//           {filteredProfiles.length} Records)
//         </div>
//         <div className="flex items-center gap-x-2">
//           <button
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//             className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//               currentPage === 1
//                 ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
//                 : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
//             }`}
//           >
//             <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
//           </button>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages || totalPages === 0}
//             className={`w-5 h-5 flex items-center justify-center rounded-full border ${
//               currentPage === totalPages || totalPages === 0
//                 ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
//                 : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
//             }`}
//           >
//             <ChevronRight
//               size={12}
//               className="text-[#08994A] dark:text-white"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSection;

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, Plus, Edit, Trash2, X,
  ChevronLeft, ChevronRight, User, AlertTriangle,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import EditDoctorNursePopup from "./EditDoctorNursePopup.jsx";
import { successToast, errorToast } from "../../components/Toast";
import api from "../../utils/axiosConfig";
import { usePermissions } from "../../components/PermissionContext";

// ── Delete Confirmation Dialog ────────────────────────────────────────────────
const DeleteConfirmDialog = ({ profileName, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[9999] font-[Helvetica]">
    <div className="w-[420px] rounded-[20px] bg-gray-100 dark:bg-[#000000E5] p-6 relative overflow-hidden">
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px", padding: "2px",
        background: "linear-gradient(to bottom right, rgba(239,68,68,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(239,68,68,0.7) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none",
      }} />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">Delete Profile</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black dark:text-white">"{profileName}"</span>?
          <br />
          This action <span className="text-red-500 font-semibold">cannot be undone</span>.
        </p>
        <div className="flex gap-4 mt-2 w-full justify-center">
          <button
            onClick={onCancel} disabled={loading}
            className="w-[120px] h-[36px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
              bg-gray-100 dark:bg-transparent text-black dark:text-white text-sm
              hover:bg-[#0EFF7B1A] disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} disabled={loading}
            className="w-[120px] h-[36px] rounded-[8px] border-b-2 border-red-700
              bg-red-600 hover:bg-red-700 text-white text-sm font-medium
              disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Trash2 size={14} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ProfileSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filtersData, setFiltersData] = useState({ department: "", specialist: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 9;

  // Delete state
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [specialists, setSpecialists] = useState([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAdmin } = usePermissions();
  const canEdit = isAdmin;
  const canAdd  = isAdmin;

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const getProfilePictureUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/static/")) return `${API_BASE}${path}`;
    const filename = path.split("/").pop();
    return filename ? `${API_BASE}/static/staffs_pictures/${filename}` : null;
  };

  // ── Transform raw API staff → display shape ────────────────────────────────
  const transformStaff = (staff) => ({
    id: staff.id,
    name: staff.full_name || "Unknown",
    qualification: staff.specialization || "N/A",
    department: staff.department || "N/A",
    joinDate: staff.date_of_joining
      ? new Date(staff.date_of_joining).toLocaleDateString("en-GB")
      : "N/A",
    contact: staff.phone || "N/A",
    email: staff.email || "N/A",
    type: (() => {
      const d = (staff.designation || "").toLowerCase();
      if (d === "doctor") return "Doctors";
      if (d === "nurse")  return "Nurses";
      return "Other Staff";
    })(),
    profilePicture: staff.profile_picture,
    originalData: staff,   // ← raw API object, passed directly to EditPopup
  });

  // ── Fetch active departments ───────────────────────────────────────────────
  const fetchActiveDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const r = await api.get("/patients/departments?status=active");
      const data = r.data;
      const list = Array.isArray(data.departments) ? data.departments
        : Array.isArray(data) ? data
        : Array.isArray(data.results) ? data.results : [];
      const formatted = list
        .filter((d) => {
          const s = (d.status || d.is_active || d.active || "").toString().toLowerCase();
          return ["active","1","true",""].includes(s);
        })
        .map((d) => d.name || d.department_name || d.label || "")
        .filter(Boolean)
        .sort();
      setDepartments(formatted);
    } catch {
      // fallback: extract from loaded profiles
      const fallback = [...new Set(profiles.map((p) => p.department).filter((d) => d && d !== "N/A"))].sort();
      setDepartments(fallback);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // ── Fetch specializations by department ───────────────────────────────────
  const fetchSpecializationsByDepartment = async (deptName) => {
    if (!deptName) { setSpecialists([]); return; }
    setSpecialistsLoading(true);
    try {
      let deptId = null;
      try {
        const r = await api.get(`/patients/departments/?name=${encodeURIComponent(deptName)}`);
        const d = r.data;
        if (Array.isArray(d) && d.length > 0) deptId = d[0].id;
        else if (d.departments?.length > 0) deptId = d.departments[0].id;
      } catch {}

      let list = [];
      if (deptId) {
        try {
          const r = await api.get(`/staff/specializations/?department_id=${deptId}`);
          const d = r.data;
          list = Array.isArray(d) ? d : Array.isArray(d.specializations) ? d.specializations : [];
        } catch {}
      }
      if (list.length === 0) {
        list = [...new Set(
          profiles.filter((p) => p.department === deptName).map((p) => p.qualification).filter((s) => s && s !== "N/A")
        )].map((s) => ({ name: s }));
      }
      setSpecialists(
        list.filter((s) => s && (s.name || s))
          .map((s) => ({ id: s.id || s.name || s, name: s.name || s }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch {
      setSpecialists([]);
    } finally {
      setSpecialistsLoading(false);
    }
  };

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await api.get("/staff/all/");
        if (r.status !== 200) throw new Error();
        setProfiles(r.data.map(transformStaff));
        await fetchActiveDepartments();
      } catch {
        errorToast("Failed to load profiles.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleDepartmentChange = async (value) => {
    setFiltersData({ department: value, specialist: "" });
    setCurrentPage(1);
    if (value) await fetchSpecializationsByDepartment(value);
    else setSpecialists([]);
  };

  const handleSpecialistChange = (value) => {
    setFiltersData((prev) => ({ ...prev, specialist: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFiltersData({ department: "", specialist: "" });
    setSpecialists([]);
    setCurrentPage(1);
  };

  // ── Filtered / paginated profiles ─────────────────────────────────────────
  const filteredProfiles = useMemo(() =>
    profiles.filter((p) => {
      if (searchTerm && !(
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase())
      )) return false;
      if (filtersData.department && p.department !== filtersData.department) return false;
      if (filtersData.specialist && p.qualification !== filtersData.specialist) return false;
      return true;
    }),
  [profiles, searchTerm, filtersData]);

  const totalPages = Math.ceil(filteredProfiles.length / rowsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * rowsPerPage, currentPage * rowsPerPage
  );

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEditProfile = (profile) => {
    if (!canEdit) { errorToast("You don't have permission to edit profiles"); return; }
    // Pass raw API object so EditPopup gets all original field names
    setSelectedProfile(profile.originalData);
    setShowEditPopup(true);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const r = await api.get("/staff/all/");
      setProfiles(r.data.map(transformStaff));
      successToast("Profile updated successfully");
    } catch {
      errorToast("Error refreshing profiles after update");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  // Find the lowest staff ID (first/primary admin) to protect
  const firstAdminId = useMemo(() => {
    if (profiles.length === 0) return null;
    return Math.min(...profiles.map((p) => p.id));
  }, [profiles]);

  const handleDeleteClick = (profile) => {
    // Only admins can delete
    if (!isAdmin) {
      errorToast("Access Denied: Only admins can delete profiles");
      return;
    }
    // Protect the first (primary) admin profile
    if (profile.id === firstAdminId) {
      errorToast("The primary admin profile cannot be deleted");
      return;
    }
    setProfileToDelete(profile);
  };

  const handleDeleteConfirm = async () => {
    if (!profileToDelete) return;
    // Double-check protection before confirming
    if (!isAdmin) { errorToast("Access Denied: Only admins can delete profiles"); return; }
    if (profileToDelete.id === firstAdminId) { errorToast("The primary admin profile cannot be deleted"); setProfileToDelete(null); return; }

    setDeleteLoading(true);
    try {
      const response = await api.delete(`/staff/${profileToDelete.id}/delete/`);
      if (response.status === 200 || response.status === 204) {
        successToast(`"${profileToDelete.name}" deleted successfully`);
        setProfiles((prev) => prev.filter((p) => p.id !== profileToDelete.id));
        setProfileToDelete(null);
        setCurrentPage((prev) => {
          const remaining = filteredProfiles.length - 1;
          const maxPage = Math.ceil(remaining / rowsPerPage) || 1;
          return Math.min(prev, maxPage);
        });
      } else {
        errorToast("Failed to delete profile");
      }
    } catch (err) {
      errorToast(err.response?.data?.detail || "Failed to delete profile");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Filter dropdown UI ─────────────────────────────────────────────────────
  const FilterDropdown = ({
    placeholder, value, onChange, options,
    loading: dLoading = false, disabled = false,
  }) => {
    const displayOptions = options.map((o) => (typeof o === "object" ? o.name : o)).filter(Boolean);
    return (
      <div className="relative">
        <Listbox value={value || ""} onChange={(v) => onChange(v === placeholder ? "" : v)} disabled={disabled || dLoading}>
          <div className="relative mt-1 w-[228px]">
            <Listbox.Button
              className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border
                ${disabled || dLoading
                  ? "border-gray-300 bg-gray-100 dark:bg-gray-900 opacity-50 cursor-not-allowed"
                  : "border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-[#000000]"}
                text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] z-[100]`}
              style={{
                borderColor: disabled ? "#9CA3AF" : "#3C3C3C",
                boxShadow: disabled ? "none" : "0px 0px 4px 0px #0EFF7B",
              }}
            >
              <span className="block truncate">{dLoading ? "Loading..." : (value || placeholder)}</span>
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg className={`h-4 w-4 ${disabled ? "text-gray-400" : "text-[#08994A] dark:text-[#0EFF7B]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </Listbox.Button>
            {!dLoading && !disabled && (
              <Listbox.Options
                className="absolute mt-1 w-full max-h-60 rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A] overflow-auto z-[100]"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#0EFF7B #1E1E1E" }}
              >
                <Listbox.Option key="default" value={placeholder}
                  className={({ active }) =>
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                    ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-600 dark:text-gray-400"}`
                  }>{placeholder}</Listbox.Option>
                {displayOptions.length === 0
                  ? <div className="py-2 px-2 text-sm text-gray-500 text-center">No options available</div>
                  : displayOptions.map((opt, idx) => (
                    <Listbox.Option key={idx} value={opt}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                        ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
                        ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                      }>{opt}</Listbox.Option>
                  ))}
              </Listbox.Options>
            )}
          </div>
        </Listbox>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#0EFF7B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalDoctors    = filteredProfiles.filter((p) => p.type === "Doctors").length;
  const totalNurses     = filteredProfiles.filter((p) => p.type === "Nurses").length;
  const totalOtherStaff = filteredProfiles.filter((p) => p.type === "Other Staff").length;

  return (
    <div className="mb-4 bg-gray-100 dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[2500px] mx-auto flex flex-col overflow-hidden font-[Helvetica] relative">
      {/* Background overlay */}
      <div className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{ background: "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)", zIndex: 0 }} />
      {/* Gradient border */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "10px", padding: "2px",
        background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Delete confirmation */}
      {profileToDelete && (
        <DeleteConfirmDialog
          profileName={profileToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setProfileToDelete(null)}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6 relative z-10">
        <h2 className="text-xl font-semibold text-black dark:text-white">Doctor/Nurse Profiles</h2>
        <div className="relative group">
          <button
            onClick={() => canAdd && navigate("/Doctors-Nurse/AddDoctorNurse")}
            disabled={!canAdd}
            className={`w-[200px] h-[40px] flex items-center justify-center gap-2
              border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-[8px]
              text-white font-semibold hover:scale-105 transition
              ${!canAdd ? "opacity-100 cursor-not-allowed" : ""}`}
            style={{ background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)" }}
          >
            <Plus size={18} className="text-white" />
            Add Doctor/Nurse
          </button>
          {!canAdd && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap
              px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white
              opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 pointer-events-none">
              Access Denied - Admin Only
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 w-[800px] relative z-10">
        <div className="flex items-center gap-4 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">Total Doctors</span>
            <span className="w-6 h-6 flex items-center justify-center rounded-[20px] border border-[#0EFF7B66] p-1 text-xs text-white bg-gradient-to-r from-[#14DC6F] to-[#09753A]">{totalDoctors}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">Total Nurse</span>
            <span className="w-6 h-6 flex items-center justify-center rounded-[20px] border border-[#2231FF] p-1 text-xs text-white bg-gradient-to-b from-[#6E92FF] to-[#425899]">{totalNurses}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-normal text-[14px] text-gray-600 dark:text-[#A0A0A0]">Other staff</span>
            <span className="w-6 h-6 flex items-center justify-center rounded-[20px] border border-[#FF930E] p-1 text-xs text-white bg-gradient-to-b from-[#FF930E] to-[#995808]">{totalOtherStaff}</span>
          </div>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="flex justify-between items-center mb-6 relative z-30">
        <div className="flex gap-4">
          <FilterDropdown placeholder="Select Department" value={filtersData.department}
            onChange={handleDepartmentChange} options={departments}
            loading={departmentsLoading} disabled={departmentsLoading} />
          <FilterDropdown
            placeholder={!filtersData.department ? "Select department first" : "Select Specialist"}
            value={filtersData.specialist} onChange={handleSpecialistChange}
            options={specialists} loading={specialistsLoading}
            disabled={!filtersData.department || specialistsLoading} />
        </div>
        <div className="flex gap-4">
          <div className="relative group min-w-[315px] flex items-center bg-[#0EFF7B1A] dark:bg-[#1E1E1E] rounded-full px-3 py-1 border border-[#0EFF7B1A]">
            <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-150">Search</span>
            <input type="text" placeholder="Search by name or department"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent px-2 text-[12px] placeholder-[#5CD592] outline-none text-[#08994A] dark:text-[#5CD592] w-48" />
          </div>
          <button onClick={() => setShowFilterPopup(true)}
            className="relative group flex items-center gap-2 bg-[#0EFF7B1A] text-[#08994A] dark:text-white px-4 py-2 rounded-full border border-[#0EFF7B1A] hover:bg-[#0EFF7B33]">
            <Filter size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-150">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter popup */}
      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="w-[600px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-gray-100 dark:bg-[#000000E5] p-6 shadow-lg relative z-50">
            <div style={{ position: "absolute", inset: 0, borderRadius: "20px", padding: "2px", background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none", zIndex: 0 }} />
            <div className="flex justify-between items-center pb-3 mb-4 relative z-10">
              <h3 className="font-medium text-[16px] text-black dark:text-white">Filter Profiles</h3>
              <button onClick={() => setShowFilterPopup(false)} className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B33]">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 relative z-30">
              <FilterDropdown placeholder="Select Department" value={filtersData.department} onChange={handleDepartmentChange} options={departments} loading={departmentsLoading} disabled={departmentsLoading} />
              <FilterDropdown placeholder={!filtersData.department ? "Select department first" : "Select Specialist"} value={filtersData.specialist} onChange={handleSpecialistChange} options={specialists} loading={specialistsLoading} disabled={!filtersData.department || specialistsLoading} />
            </div>
            <div className="flex justify-center gap-6 mt-8 relative z-10">
              <button onClick={handleClearFilters} className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-white text-sm hover:bg-[#0EFF7B1A]">Clear</button>
              <button onClick={() => setShowFilterPopup(false)} className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] text-white text-sm font-medium hover:scale-105 transition" style={{ background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)" }}>Filter</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit popup */}
      {showEditPopup && selectedProfile && (
        <EditDoctorNursePopup
          onClose={() => { setShowEditPopup(false); setSelectedProfile(null); }}
          profile={selectedProfile}
          onUpdate={handleUpdateProfile}
        />
      )}

      {/* Profile cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
        {paginatedProfiles.length > 0 ? (
          paginatedProfiles.map((profile, index) => (
            <div key={profile.id || index}
              className="w-full bg-gray-200 dark:bg-[#0EFF7B08] rounded-lg p-5
                border border-[#0EFF7B80] dark:border-[#0EFF7B80]
                shadow-[0px_0px_4px_0px_#A0A0A040] dark:shadow-[0px_0px_4px_0px_#0EFF7B]
                relative text-center flex flex-col items-center"
              style={{ zIndex: 20 }}
            >
              {/* Type badge — top left */}
              {/* Type badge — top left */}
<div className="absolute top-4 left-4">
  <span className={`
    px-2 py-1 rounded-full text-[12px] font-medium
    ${profile.type === "Doctors" 
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-[#0EFF7B]" 
      : profile.type === "Nurses"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-[#6E92FF]"
      : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-[#FF930E]"
    }
  `}>
    {profile.type}
  </span>
</div>

              {/* Edit + Delete — top right */}
     {/* Edit + Delete — top right */}
<div className="absolute top-4 right-4 flex items-center gap-2">

  {/* Edit button */}
  <div className="relative group">
    <button
      onClick={() => handleEditProfile(profile)}
      disabled={!canEdit}
      className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[12px] font-medium transition-all duration-200
        ${
          canEdit
            ? "text-blue-600 dark:text-[#6E92FF] border-transparent hover:text-blue-800 dark:hover:text-[#8FB2FF] hover:scale-105"
            : "text-black-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 border-black-300 dark:border-gray-700 opacity-80 cursor-not-allowed"
        }`}
    >
      <Edit
        size={15}
        className={`${
          canEdit
            ? "text-blue-600 dark:text-[#6E92FF]"
            : "text-balck-500 dark:text-gray-400"
        }`}
      />
      <span>Edit</span>
    </button>

    <span className="absolute top-8 right-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-md shadow-lg
      bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700
      opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 pointer-events-none">
      {canEdit ? "Edit Profile" : "Admin Only"}
    </span>
  </div>

  {/* Divider */}
  <span className="text-gray-400 dark:text-gray-600 select-none text-xs">|</span>

  {/* Delete button */}
  {(() => {
    const isPrimaryAdmin = profile.id === firstAdminId;
    const canDelete = isAdmin && !isPrimaryAdmin;

    const tooltip = !isAdmin
      ? "Admin Only"
      : isPrimaryAdmin
      ? "Primary admin cannot be deleted"
      : "Delete Profile";

    return (
      <div className="relative group">
        <button
          onClick={() => handleDeleteClick(profile)}
          disabled={!canDelete}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[12px] font-medium transition-all duration-200
            ${
              canDelete
                ? "text-red-600 dark:text-red-400 border-transparent hover:text-red-800 dark:hover:text-red-300 hover:scale-105"
                : "text-black-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 border-black-300 dark:border-gray-700 opacity-80 cursor-not-allowed"
            }`}
        >
          <Trash2
            size={15}
            className={`${
              canDelete
                ? "text-red-600 dark:text-red-400"
                : "text-black-500 dark:text-gray-400"
            }`}
          />
          <span>Delete</span>
        </button>

        <span className="absolute top-8 right-0 whitespace-nowrap px-3 py-1.5 text-xs rounded-md shadow-lg
          bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700
          opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 pointer-events-none">
          {tooltip}
        </span>
      </div>
    );
  })()}
</div>

              {/* Profile picture */}
              <div className="w-16 h-16 mx-auto mb-4 mt-10 rounded-full overflow-hidden border-2 border-[#0EFF7B] bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                {profile.profilePicture
                  ? <img src={getProfilePictureUrl(profile.profilePicture)} alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  : <User size={24} className="text-gray-400" />}
              </div>

              <p className="text-[18px] font-medium text-[#08994A] dark:text-[#0EFF7B] mb-1">{profile.name}</p>
              <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">{profile.qualification}</p>

              <div className="w-full text-left space-y-2 mb-4">
                {[
                  ["Department", profile.department],
                  ["Join Date",  profile.joinDate],
                  ["Contact",    profile.contact],
                  ["Email ID",   profile.email],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[14px] text-gray-600 dark:text-gray-400">{label}</span>
                    <span className="text-[14px] text-gray-600 dark:text-gray-400 truncate max-w-[160px]">{val}</span>
                  </div>
                ))}
              </div>

              <button
                className="relative group w-[112px] h-[33px] rounded-[8px] border-[2px] border-[#0EFF7B66] bg-[#08994A] dark:bg-[#0EFF7B1A] text-white text-[14px] font-medium hover:scale-105 transition"
                onClick={() => navigate("/Doctors-Nurse/ViewProfile", { state: { profile: profile.originalData } })}
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
      <div className="flex items-center mt-4 bg-gray-100 dark:bg-transparent p-4 rounded gap-x-4 relative z-10">
        <div className="text-sm text-black dark:text-white">
          Page {currentPage} of {totalPages || 1} ({Math.min((currentPage - 1) * rowsPerPage + 1, filteredProfiles.length)} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredProfiles.length)} from {filteredProfiles.length} Records)
        </div>
        <div className="flex items-center gap-x-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
            className={`w-5 h-5 flex items-center justify-center rounded-full border
              ${currentPage === 1 ? "bg-[#0EFF7B1A] opacity-50" : "bg-[#0EFF7B] hover:bg-[#0EFF7B1A]"}`}>
            <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
          </button>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
            className={`w-5 h-5 flex items-center justify-center rounded-full border
              ${currentPage === totalPages || totalPages === 0 ? "bg-[#0EFF7B1A] opacity-50" : "bg-[#0EFF7B] hover:bg-[#0EFF7B1A]"}`}>
            <ChevronRight size={12} className="text-[#08994A] dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;