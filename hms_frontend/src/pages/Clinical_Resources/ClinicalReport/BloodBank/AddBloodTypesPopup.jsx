// import React, { useState } from "react";
// import { X, ChevronDown } from "lucide-react";
// import { Listbox } from "@headlessui/react";

// const AddBloodTypePopup = ({ onClose, bloodData, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     bloodType: bloodData?.bloodType || "",
//     units: bloodData?.units || "",
//     status: bloodData?.status || "",
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
//     if (!formData.units || isNaN(formData.units) || formData.units < 0)
//       newErrors.units = "Valid units (non-negative number) is required";
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

//   const bloodTypes = [
//     "A",
//     "A+",
//     "A-",
//     "B",
//     "B+",
//     "B-",
//     "O",
//     "O+",
//     "O-",
//     "AB",
//     "AB+",
//     "AB-",
//   ];
//   const statuses = ["Available", "Low Stock", "Out of Stock"];

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
//           style={{
//                       scrollbarWidth: "none",
//                       msOverflowStyle: "none",
//                     }}>
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
//               Add Blood Type
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
//             <Dropdown
//               label="Blood Type"
//               value={formData.bloodType}
//               onChange={(val) => setFormData({ ...formData, bloodType: val })}
//               options={bloodTypes}
//               error={errors.bloodType}
//             />

//             <div>
//               <label
//                 className="text-sm text-black dark:text-white"
//                 style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
//               >
//                 Available Units
//               </label>
//               <input
//                 type="text"
//                 name="units"
//                 value={formData.units}
//                 onChange={(e) =>
//                   setFormData({ ...formData, units: e.target.value })
//                 }
//                 placeholder="Enter units"
//                 className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
//               />
//               {errors.units && (
//                 <p className="text-red-500 text-xs mt-1">{errors.units}</p>
//               )}
//             </div>

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
//               className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
//               bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdate}
//               className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
//               text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddBloodTypePopup;
import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../../../components/Toast.jsx";

const AddBloodTypePopup = ({ onClose, bloodData, onUpdate, onAdd }) => {
  const [formData, setFormData] = useState({
    blood_type: bloodData?.blood_type || "",
    available_units: bloodData?.available_units || "",
    status: bloodData?.status || "Available",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const statuses = ["Available", "Low Stock", "Out of Stock"];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.blood_type) newErrors.blood_type = "Blood type is required";
    if (
      !formData.available_units ||
      isNaN(formData.available_units) ||
      formData.available_units < 0
    )
      newErrors.available_units =
        "Valid units (non-negative number) is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const API_BASE =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000"
    : "http://localhost:8000";

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        blood_type: formData.blood_type,
        available_units: parseInt(formData.available_units, 10),
        status: formData.status,
      };

      console.log(
        "Sending request to: http://localhost:8000/api/blood-groups/add"
      );
      console.log("Payload:", payload);

      const response = await fetch(`${API_BASE}/api/blood-groups/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMsg = "Failed to add blood group";
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorData.message || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(`HTTP ${response.status}: ${errorMsg}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      // Trigger callback
      onAdd?.(result);

      // Show success toast
      successToast("Blood group added successfully!");

      // Close popup
      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      errorToast(error.message || "Failed to add blood group");
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        blood_type: formData.blood_type,
        available_units: parseInt(formData.available_units),
        status: formData.status,
      };

      const response = await fetch(
        `${API_BASE}/blood-groups/${bloodData.id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update blood group");
      }

      const result = await response.json();

      if (onUpdate) {
        onUpdate(result);
      }

      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Modified Dropdown to accept required prop
  const Dropdown = ({
    label,
    value,
    onChange,
    options,
    error,
    required = false,
  }) => (
    <div>
      <label className="text-sm text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
            focus:outline-none"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black
            shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica]">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
        bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
        dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
      >
        <div className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              {bloodData ? "Edit Blood Type" : "Add Blood Type"}
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 rounded-[8px] bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <Dropdown
              label="Blood Type"
              value={formData.blood_type}
              onChange={(val) => setFormData({ ...formData, blood_type: val })}
              options={bloodTypes}
              error={errors.blood_type}
              required={true}
            />

            <div>
              <label className="text-sm text-black dark:text-white">
                Available Units <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.available_units}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_units: e.target.value,
                  })
                }
                placeholder="e.g. 1 or 2 or 3"
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
              {errors.available_units && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.available_units}
                </p>
              )}
            </div>

            <Dropdown
              label="Status"
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={statuses}
              error={errors.status}
              required={true}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]
              disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={bloodData ? handleUpdate : handleSubmit}
              disabled={loading}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
              text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Processing..." : bloodData ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBloodTypePopup;