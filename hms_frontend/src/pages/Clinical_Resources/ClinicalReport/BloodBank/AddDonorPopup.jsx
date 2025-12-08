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
    email: "",
    gender: "",
    blood_type: "",
    last_donation_date: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Format Date → YYYY-MM-DD for API */
  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().split("T")[0];
  };

  /* Validate form */
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.donor_name.trim()) {
      newErrors.donor_name = "Donor name is required";
    } else if (formData.donor_name.trim().length < 2) {
      newErrors.donor_name = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    // Email validation - NOW REQUIRED
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
const API_BASE =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/api"
    : "http://localhost:8000/api";
  /* Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      donor_name: formData.donor_name.trim(),
      gender: formData.gender,
      blood_type: formData.blood_type,
      phone: formData.phone,
      email: formData.email.trim(), // Email is now required
      last_donation_date: formatDateForAPI(formData.last_donation_date),
    };

    try {
      const response = await fetch(`${API_BASE}/donors/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to add donor";
        if (result.detail) {
          errorMessage = Array.isArray(result.detail)
            ? result.detail.map((e) => `${e.loc.join(" → ")}: ${e.msg}`).join("\n")
            : result.detail;
        }
        throw new Error(errorMessage);
      }

      successToast("Donor added successfully!");
      onClose();
      if (typeof onAdd === "function") onAdd();
    } catch (err) {
      console.error("Add donor error:", err);
      errorToast(err.message || "Failed to add donor");
    } finally {
      setLoading(false);
    }
  };

  /* Reusable Dropdown Component */
  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]">
            <span className="block truncate">{value || "Select"}</span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-50 mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-[#1a1a1a] shadow-lg border border-gray-300 dark:border-[#3A3A3A]">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm ${active
                    ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                    : "text-black dark:text-white"
                  }`
                }
              >
                {({ selected }) => (
                  <span className={selected ? "font-medium text-[#0EFF7B]" : ""}>
                    {option}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica]">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
        <div className="w-[505px] bg-white dark:bg-[#000000] p-6 rounded-[19px] relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black dark:text-white font-medium text-[16px]">
              Add New Donor
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* Donor Name */}
              <div>
                <label className="text-sm text-black dark:text-white">
                  Donor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.donor_name}
                  onChange={(e) =>
                    setFormData({ ...formData, donor_name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
                {errors.donor_name && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.donor_name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-black dark:text-white">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 10) {
                      setFormData({ ...formData, phone: val });
                    }
                  }}
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
                {errors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email - NOW REQUIRED */}
              <div>
                <label className="text-sm text-black dark:text-white">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@domain.com"
                  className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Gender */}
              <Dropdown
                label={<>Gender <span className="text-red-500">*</span></>}
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                options={genders}
                error={errors.gender}
              />

              {/* Blood Type */}
              <Dropdown
                label={<>Blood Type <span className="text-red-500">*</span></>}
                value={formData.blood_type}
                onChange={(val) => setFormData({ ...formData, blood_type: val })}
                options={bloodTypes}
                error={errors.blood_type}
              />

              {/* Last Donation Date */}
              <div className="relative">
                <label className="text-sm text-black dark:text-white">
                  Last Donation Date <span className="text-gray-500">(Optional)</span>
                </label>
                <DatePicker
                  selected={formData.last_donation_date}
                  onChange={(date) => setFormData({ ...formData, last_donation_date: date })}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select date"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  isClearable
                  className="w-[228px] h-[32px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                  wrapperClassName="w-full"
                  popperClassName="z-50"
                />
                <div className="absolute right-3 top-9 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 dark:text-[#0EFF7B]">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Information Note */}
            <div className="mt-5 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Donor status is auto-calculated. New donors are "Not Eligible" until 6 months after their last donation.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Donor"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonorPopup;