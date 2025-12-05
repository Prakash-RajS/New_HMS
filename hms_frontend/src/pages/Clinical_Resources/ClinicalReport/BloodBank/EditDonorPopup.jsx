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
    email: "",
    gender: "",
    blood_type: "",
    last_donation_date: null,
  });
 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Safe date conversion function
  const safeDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      // If it's already a Date object, return it
      if (dateValue instanceof Date && !isNaN(dateValue)) {
        return dateValue;
      }
      // Handle different date formats
      let date;
      // Handle YYYY-MM-DD format (from backend)
      if (typeof dateValue === 'string' && dateValue.includes("-")) {
        date = new Date(dateValue);
      }
      // Handle MM/DD/YYYY format (from frontend display)
      else if (typeof dateValue === 'string' && dateValue.includes("/")) {
        const [month, day, year] = dateValue.split("/");
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      }
      // Try direct parsing as last resort
      else {
        date = new Date(dateValue);
      }
      // Check if the date is valid
      return date instanceof Date && !isNaN(date) ? date : null;
    } catch (error) {
      console.error("Date conversion error:", error, "for date:", dateValue);
      return null;
    }
  };
  // Initialize formData when donor changes
  useEffect(() => {
    if (donor) {
      console.log("🟡 EditDonorPopup received donor:", donor);
      // Map display keys to API keys and convert date safely
      const donationDate = safeDate(donor.last_donation_date || donor.lastDonation);
      setFormData({
        donor_name: donor.donor_name || donor.name || "",
        phone: donor.phone || "",
        email: donor.email || "",
        gender: donor.gender || "",
        blood_type: donor.blood_type || donor.blood || "",
        last_donation_date: donationDate,
      });
    }
  }, [donor]);
  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().split("T")[0];
  };
  const validateForm = () => {
    const newErrors = {};
   
    // Name validation
    if (!formData.donor_name.trim()) {
      newErrors.donor_name = "Name is required";
    } else if (formData.donor_name.trim().length < 2) {
      newErrors.donor_name = "Name must be at least 2 characters";
    }
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    // Blood type validation
    if (!formData.blood_type) {
      newErrors.blood_type = "Blood type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Prepare data for backend - match the updated DonorSchema
      const updateData = {
        donor_name: formData.donor_name.trim(),
        phone: formData.phone,
        email: formData.email.trim() || null, // Send null if empty
        gender: formData.gender,
        blood_type: formData.blood_type,
        last_donation_date: formatDateForAPI(formData.last_donation_date),
      };
      console.log("🟡 Sending update data:", updateData);
      const response = await fetch(`http://localhost:8000/api/donors/${donor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const result = await response.json();
      if (!response.ok) {
        let errorMessage = "Failed to update donor";
        if (result.detail) {
          errorMessage = Array.isArray(result.detail)
            ? result.detail
                .map((e) => `${e.loc.join(" → ")}: ${e.msg}`)
                .join("\n")
            : result.detail;
        }
        throw new Error(errorMessage);
      }
      successToast("Donor updated successfully!");
     
      if (onUpdate) {
        onUpdate(result); // Pass the updated donor data back
      }
     
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      errorToast(error.message || "Failed to update donor");
      alert(`Error updating donor:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
            focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
          >
            <span className="block truncate">{value || "Select"}</span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-[#1a1a1a]
            shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
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
                  `cursor-pointer select-none py-2 px-3 text-sm ${
                    active
                      ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  } ${selected ? "font-medium" : ""}`
                }
              >
                {({ selected }) => (
                  <span className={selected ? "text-[#0EFF7B] dark:text-[#0EFF7B]" : ""}>
                    {option}
                  </span>
                )}
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
  const selectedDate = formData.last_donation_date;
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
              disabled={loading}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
              bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center
              hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>
          {/* Current Status Display (Read-only) */}
          {donor?.status && (
            <div className="mb-4 p-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Current Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  donor.status === "Eligible"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {donor.status}
                </span>
              </div>
              {donor.last_donation_date && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Last donation: {donor.last_donation_date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                Status is automatically calculated based on donation dates
              </p>
            </div>
          )}
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* Donor Name */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Donor Name *
              </label>
              <input
                type="text"
                value={formData.donor_name}
                onChange={(e) =>
                  setFormData({ ...formData, donor_name: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
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
                Phone *
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
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email}
                </p>
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
            {/* Last Donation Date */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Last Donation Date (Optional)
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setFormData({ ...formData, last_donation_date: date });
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select date"
                  className="w-[228px] h-[32px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                             bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                             focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                  wrapperClassName="w-full"
                  popperClassName="z-50"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                 
                  maxDate={new Date()}
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
            </div>
          </div>
          {/* Information Note */}
          <div className="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Status is automatically calculated based on the last donation date.
              Donors become "Eligible" 6 months after their last donation.
            </p>
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-white font-medium
              hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px]
              bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium
              hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Donor"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditDonorPopup;