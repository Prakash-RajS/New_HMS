// import React, { useState } from "react";
// import { X, ChevronDown } from "lucide-react";
// import { Listbox } from "@headlessui/react";

// /* NEW: Import react-datepicker */
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const AddDonorPopup = ({ onClose, onAdd }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     gender: "",
//     blood: "",
//     donationDate: "", // string: "MM/DD/YYYY"
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = "Phone number must be 10 digits";
//     }
//     if (!formData.gender) newErrors.gender = "Gender is required";
//     if (!formData.blood) newErrors.blood = "Blood type is required";
//     if (!formData.donationDate)
//       newErrors.donationDate = "Donation date is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAdd = () => {
//     if (validateForm()) {
//       if (onAdd) onAdd(formData);
//       onClose();
//     }
//   };

//   const genders = ["Male", "Female", "Other"];
//   const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//   const Dropdown = ({ label, value, onChange, options, error }) => (
//     <div>
//       <label
//         className="text-sm text-black dark:text-white"
//         style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//       >
//         {label}
//       </label>
//       <Listbox value={value} onChange={onChange}>
//         <div className="relative mt-1 w-[228px]">
//           <Listbox.Button
//             className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//             bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
//             focus:outline-none"
//           >
//             {value || "Select"}
//             <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//               <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
//             </span>
//           </Listbox.Button>
//           <Listbox.Options
//             className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black
//             shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A] no-scrollbar"
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             {options.map((option, idx) => (
//               <Listbox.Option
//                 key={idx}
//                 value={option}
//                 className={({ active, selected }) =>
//                   `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
//                     active
//                       ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
//                       : "text-black dark:text-white"
//                   } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                 }
//               >
//                 {option}
//               </Listbox.Option>
//             ))}
//           </Listbox.Options>
//         </div>
//       </Listbox>
//       {error && (
//         <p
//           className="text-red-500 dark:text-red-400 text-xs mt-1"
//           style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//         >
//           {error}
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div
//         className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
//         bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
//         dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
//       >
//         <div
//           className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
//           style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center pb-3 mb-4">
//             <h2
//               className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
//               style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//             >
//               Add Donor
//             </h2>
//             <button
//               onClick={onClose}
//               className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
//             >
//               <X size={16} className="text-black dark:text-white" />
//             </button>
//           </div>

//           {/* Form Fields */}
//           <div className="grid grid-cols-2 gap-6">
//             {/* Donor Name */}
//             <div>
//               <label
//                 className="text-sm text-black dark:text-white"
//                 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//               >
//                 Donor Name
//               </label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 placeholder="Enter donor name"
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label
//                 className="text-sm text-black dark:text-white"
//                 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//               >
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 placeholder="Enter phone number"
//                 maxLength="10"
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
//               )}
//             </div>

//             {/* Gender Dropdown */}
//             <Dropdown
//               label="Gender"
//               value={formData.gender}
//               onChange={(val) => setFormData({ ...formData, gender: val })}
//               options={genders}
//               error={errors.gender}
//             />

//             {/* Blood Type Dropdown */}
//             <Dropdown
//               label="Blood Type"
//               value={formData.blood}
//               onChange={(val) => setFormData({ ...formData, blood: val })}
//               options={bloodTypes}
//               error={errors.blood}
//             />

//             {/* Donation Date – react-datepicker */}
//             <div>
//               <label
//                 className="text-sm text-black dark:text-white"
//                 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//               >
//                 Donation Date
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={
//                     formData.donationDate
//                       ? new Date(formData.donationDate)
//                       : null
//                   }
//                   onChange={(date) => {
//                     const formatted = date
//                       ? `${String(date.getMonth() + 1).padStart(
//                           2,
//                           "0"
//                         )}/${String(date.getDate()).padStart(
//                           2,
//                           "0"
//                         )}/${date.getFullYear()}`
//                       : "";
//                     setFormData({ ...formData, donationDate: formatted });
//                   }}
//                   dateFormat="MM/dd/yyyy"
//                   placeholderText="MM/DD/YYYY"
//                   className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                              bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
//                              focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
//                   wrapperClassName="w-full"
//                   popperClassName="z-50"
//                 />
//                 {/* Calendar Icon */}
//                 <div className="absolute right-3 top-2.5 pointer-events-none">
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     className="text-gray-500 dark:text-[#0EFF7B]"
//                   >
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                 </div>
//               </div>
//               {errors.donationDate && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.donationDate}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-center gap-4 mt-8">
//             <button
//               onClick={onClose}
//               className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//               bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAdd}
//               className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
//               text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
//             >
//               Add Donor
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddDonorPopup;

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { successToast, errorToast } from "../../../../components/Toast.jsx";

const AddDonorPopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    donor_name: "",
    phone: "",
    gender: "",
    blood_type: "",
    last_donation_date: null, // ← Store as Date object
    status: "Not Eligible",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Format Date → YYYY-MM-DD for API */
  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().split("T")[0]; // e.g., "2025-11-11"
  };

  /* Validate form */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.donor_name.trim()) newErrors.donor_name = "Name is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.blood_type) newErrors.blood_type = "Blood type is required";
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      donor_name: formData.donor_name,
      gender: formData.gender,
      blood_type: formData.blood_type,
      phone: formData.phone,
      last_donation_date: formatDateForAPI(formData.last_donation_date),
      status: formData.status,
    };

    try {
      const response = await fetch("http://localhost:8000/api/donors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to add donor";
        if (result.detail) {
          errorMessage = Array.isArray(result.detail)
            ? result.detail
                .map((e) => `${e.loc.join(" → ")}: ${e.msg}`)
                .join("\n")
            : result.detail;
        }
        throw new Error(errorMessage);
      }

      console.log("Donor added:", result);
      successToast("Donor added successfully!");
      onClose();
      if (typeof onAdd === "function") onAdd(); // Trigger parent refresh
    } catch (err) {
      errorToast(error.message || "Failed to add Donor");
      alert(`Error adding donor:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Reusable Dropdown */
  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]">
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                    active
                      ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  }`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusOptions = ["Eligible", "Not Eligible"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[505px] bg-white dark:bg-black p-6 rounded-[19px] relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black dark:text-white font-medium text-[16px]">
              Add Donor
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-6">
            {/* Donor Name */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Donor Name *
              </label>
              <input
                value={formData.donor_name}
                onChange={(e) =>
                  setFormData({ ...formData, donor_name: e.target.value })
                }
                placeholder="Enter donor name"
                className="w-[228px] h-[32px] mt-1 px-3 rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]"
              />
              {errors.donor_name && (
                <p className="text-red-500 text-xs mt-1">{errors.donor_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone *
              </label>
              <input
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 10) {
                    setFormData({ ...formData, phone: val });
                  }
                }}
                maxLength={10}
                placeholder="Enter phone"
                className="w-[228px] h-[32px] mt-1 px-3 rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <Dropdown
              label="Gender *"
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val })}
              options={genders}
              error={errors.gender}
            />

            {/* Blood Type */}
            <Dropdown
              label="Blood Type *"
              value={formData.blood_type}
              onChange={(val) => setFormData({ ...formData, blood_type: val })}
              options={bloodTypes}
              error={errors.blood_type}
            />

            {/* Status */}
            <Dropdown
              label="Status *"
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={statusOptions}
              error={errors.status}
            />

            {/* Last Donation Date */}
            <div className="relative">
              <label className="text-sm text-black dark:text-white">
                Last Donation Date (Optional)
              </label>
              <DatePicker
                selected={formData.last_donation_date}
                onChange={(date) => {
                  setFormData({ ...formData, last_donation_date: date });
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select date"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                className="w-[228px] h-[32px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                wrapperClassName="w-full"
                popperClassName="z-50"
              />
              {/* Calendar Icon */}
              <div className="absolute right-3 top-9 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-500 dark:text-[#0EFF7B]"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-[144px] h-[32px] rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-[144px] h-[32px] rounded bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] border-b-[2px] border-[#0EFF7B] text-white hover:scale-105 transition"
            >
              {loading ? "Adding..." : "Add Donor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDonorPopup;
