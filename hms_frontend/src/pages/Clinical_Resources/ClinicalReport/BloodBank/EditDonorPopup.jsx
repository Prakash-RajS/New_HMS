import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditDonorPopup = ({ onClose, donor, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    blood: "",
    lastDonation: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  // Initialize formData when donor changes
  useEffect(() => {
    if (donor) {
      setFormData({
        name: donor.name || "",
        email: donor.email || "",
        phone: donor.phone || "",
        gender: donor.gender || "",
        blood: donor.blood || "",
        lastDonation: donor.lastDonation || "",
        status: donor.status || "",
      });
    }
  }, [donor]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.blood) newErrors.blood = "Blood type is required";
    if (!formData.lastDonation)
      newErrors.lastDonation = "Last donation date is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      if (onUpdate) onUpdate(formData);
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
                    }}>
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
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
            <div>
              <label className="text-sm text-black dark:text-white">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-black dark:text-white">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                maxLength={10}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <Dropdown
              label="Gender"
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val })}
              options={genders}
              error={errors.gender}
            />

            <Dropdown
              label="Blood Type"
              value={formData.blood}
              onChange={(val) => setFormData({ ...formData, blood: val })}
              options={bloodTypes}
              error={errors.blood}
            />

            <div>
              <label className="text-sm text-black dark:text-white">
                Last Donation Date
              </label>
              <input
                type="date"
                value={formData.lastDonation}
                onChange={(e) =>
                  setFormData({ ...formData, lastDonation: e.target.value })
                }
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
              {errors.lastDonation && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.lastDonation}
                </p>
              )}
            </div>

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
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDonorPopup;
