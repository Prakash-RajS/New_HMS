// import React, { useState, useEffect } from "react";
// import { X, ChevronDown } from "lucide-react";
// import { Listbox } from "@headlessui/react";

// /* NEW: Import react-datepicker */
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const EditDonorPopup = ({ onClose, donor, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     blood: "",
//     lastDonation: "",
//     status: "",
//   });
//   const [errors, setErrors] = useState({});

//   // Initialize formData when donor changes
//   useEffect(() => {
//     if (donor) {
//       setFormData({
//         name: donor.name || "",
//         email: donor.email || "",
//         phone: donor.phone || "",
//         gender: donor.gender || "",
//         blood: donor.blood || "",
//         lastDonation: donor.lastDonation || "",
//         status: donor.status || "",
//       });
//     }
//   }, [donor]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = "Phone number must be 10 digits";
//     }
//     if (!formData.gender) newErrors.gender = "Gender is required";
//     if (!formData.blood) newErrors.blood = "Blood type is required";
//     if (!formData.lastDonation)
//       newErrors.lastDonation = "Last donation date is required";
//     if (!formData.status) newErrors.status = "Status is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleUpdate = () => {
//     if (validateForm()) {
//       if (onUpdate) onUpdate(formData);
//       onClose();
//     }
//   };

//   const genders = ["Male", "Female", "Other"];
//   const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   const statuses = ["Eligible", "Not Eligible"];

//   const Dropdown = ({ label, value, onChange, options, error }) => (
//     <div>
//       <label className="text-sm text-black dark:text-white">{label}</label>
//       <Listbox value={value} onChange={onChange}>
//         <div className="relative mt-1 w-[228px]">
//           <Listbox.Button
//             className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//             bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
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
//         <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
//       )}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//       <div className="rounded-[20px] p-[1px] backdrop-blur-md bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
//         <div className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative">
//           {/* Header */}
//           <div className="flex justify-between items-center pb-3 mb-4">
//             <h2 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
//               Edit Donor
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
//             {/* Name */}
//             <div>
//               <label className="text-sm text-black dark:text-white">Name</label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
//               />
//               {errors.name && (
//                 <p className="text-red-500 dark:text-red-400 text-xs mt-1">
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-sm text-black dark:text-white">Email</label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
//               />
//               {errors.email && (
//                 <p className="text-red-500 dark:text-red-400 text-xs mt-1">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="text-sm text-black dark:text-white">Phone</label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 maxLength={10}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 dark:text-red-400 text-xs mt-1">
//                   {errors.phone}
//                 </p>
//               )}
//             </div>

//             {/* Gender */}
//             <Dropdown
//               label="Gender"
//               value={formData.gender}
//               onChange={(val) => setFormData({ ...formData, gender: val })}
//               options={genders}
//               error={errors.gender}
//             />

//             {/* Blood Type */}
//             <Dropdown
//               label="Blood Type"
//               value={formData.blood}
//               onChange={(val) => setFormData({ ...formData, blood: val })}
//               options={bloodTypes}
//               error={errors.blood}
//             />

//             {/* Last Donation Date – react-datepicker */}
//             <div>
//               <label className="text-sm text-black dark:text-white">
//                 Last Donation Date
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={
//                     formData.lastDonation
//                       ? new Date(formData.lastDonation)
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
//                     setFormData({ ...formData, lastDonation: formatted });
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
//               {errors.lastDonation && (
//                 <p className="text-red-500 dark:text-red-400 text-xs mt-1">
//                   {errors.lastDonation}
//                 </p>
//               )}
//             </div>

//             {/* Status */}
//             <Dropdown
//               label="Status"
//               value={formData.status}
//               onChange={(val) => setFormData({ ...formData, status: val })}
//               options={statuses}
//               error={errors.status}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-center gap-4 mt-8">
//             <button
//               onClick={onClose}
//               className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdate}
//               className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium"
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditDonorPopup;

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { successToast, errorToast } from "../../../../components/Toast.jsx";

const EditDonorPopup = ({ onClose, donor, onUpdate }) => {
  const [formData, setFormData] = useState({
    donor_name: "",
    phone: "",
    gender: "",
    blood_type: "",
    last_donation_date: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Safe date conversion function
  const safeDate = (dateString) => {
    if (!dateString) return null;

    try {
      // If it's already a Date object, return it
      if (dateString instanceof Date && !isNaN(dateString)) {
        return dateString;
      }

      // Handle different date formats
      let date;

      // Handle YYYY-MM-DD format (from backend)
      if (dateString.includes("-")) {
        date = new Date(dateString);
      }
      // Handle MM/DD/YYYY format (from frontend display)
      else if (dateString.includes("/")) {
        const [month, day, year] = dateString.split("/");
        date = new Date(`${year}-${month}-${day}`);
      }
      // Try direct parsing as last resort
      else {
        date = new Date(dateString);
      }

      // Check if the date is valid
      return date instanceof Date && !isNaN(date) ? date : null;
    } catch (error) {
      console.error("Date conversion error:", error, "for date:", dateString);
      return null;
    }
  };

  // Initialize formData when donor changes
  useEffect(() => {
    if (donor) {
      console.log("🟡 EditDonorPopup received donor:", donor);

      // Convert the date safely
      const donationDate = safeDate(
        donor.last_donation_date || donor.lastDonation
      );

      setFormData({
        donor_name: donor.donor_name || donor.name || "",
        phone: donor.phone || "",
        gender: donor.gender || "",
        blood_type: donor.blood_type || donor.blood || "",
        last_donation_date: donationDate
          ? donationDate.toISOString().split("T")[0]
          : "",
        status: donor.status || "",
      });
    }
  }, [donor]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.donor_name.trim()) newErrors.donor_name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.blood_type) newErrors.blood_type = "Blood type is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      // Prepare data for backend - match the DonorSchema
      const updateData = {
        donor_name: formData.donor_name,
        phone: formData.phone,
        gender: formData.gender,
        blood_type: formData.blood_type,
        last_donation_date: formData.last_donation_date || null,
        status: formData.status,
      };

      console.log("🟡 Sending update data:", updateData);

      if (onUpdate) onUpdate(updateData);
      successToast("Donor updated successfully!");
      onClose();
    }
  };

  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statuses = ["Eligible", "Not Eligible"];

  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black 
            shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A] no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                    active
                      ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );

  // Get the selected date for DatePicker
  const selectedDate = safeDate(formData.last_donation_date);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica]">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
        <div className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              Edit Donor
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* Donor Name */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Donor Name
              </label>
              <input
                type="text"
                value={formData.donor_name}
                onChange={(e) =>
                  setFormData({ ...formData, donor_name: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                placeholder="Enter donor name"
              />
              {errors.donor_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.donor_name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => {
                  // Only allow numbers
                  if (/^\d*$/.test(e.target.value)) {
                    setFormData({ ...formData, phone: e.target.value });
                  }
                }}
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Gender */}
            <Dropdown
              label="Gender"
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val })}
              options={genders}
              error={errors.gender}
            />

            {/* Blood Type */}
            <Dropdown
              label="Blood Type"
              value={formData.blood_type}
              onChange={(val) => setFormData({ ...formData, blood_type: val })}
              options={bloodTypes}
              error={errors.blood_type}
            />

            {/* Last Donation Date */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Last Donation Date (Optional)
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    // Convert to YYYY-MM-DD format for backend
                    const formatted = date
                      ? date.toISOString().split("T")[0]
                      : "";
                    setFormData({ ...formData, last_donation_date: formatted });
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select date"
                  className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                             bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                             focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                  wrapperClassName="w-full"
                  popperClassName="z-50"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                />
                {/* Calendar Icon */}
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
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
              {errors.last_donation_date && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.last_donation_date}
                </p>
              )}
            </div>

            {/* Status */}
            <Dropdown
              label="Status"
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={statuses}
              error={errors.status}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDonorPopup;
