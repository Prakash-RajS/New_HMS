import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditDonorPopup = ({ onClose, donor, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: donor?.name || "",
    email: donor?.email || "",
    phone: donor?.phone || "",
    gender: donor?.gender || "",
    blood: donor?.blood || "",
    lastDonation: donor?.lastDonation || "",
    status: donor?.status || "",
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.lastDonation) newErrors.lastDonation = "Last donation date is required";
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

  // Dropdown options
  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statuses = ["Eligible", "Not Eligible"];

  // Reusable Dropdown
  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
            bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] 
            focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[12px] bg-white dark:bg-black 
            shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
                  ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[504px] h-auto rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] 
      backdrop-blur-md relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="font-inter font-medium text-[16px] leading-[19px] text-black dark:text-[#0EFF7B]">
            Edit Donor
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] 
            shadow-[0px_0px_4px_0px_#0EFF7B1A] flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="text-sm text-black dark:text-white">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-black dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-black dark:text-white">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              maxLength="10"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone}</p>}
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
            value={formData.blood}
            onChange={(val) => setFormData({ ...formData, blood: val })}
            options={bloodTypes}
            error={errors.blood}
          />

          {/* Last Donation Date */}
          <div>
            <label className="text-sm text-black dark:text-white">Last Donation Date</label>
            <div className="relative">
              <input
                type="date"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={(e) => setFormData({ ...formData, lastDonation: e.target.value })}
                className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
                bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] outline-none 
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
              <Calendar
                size={18}
                className="absolute right-3 top-3.5 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
              />
              {errors.lastDonation && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.lastDonation}</p>}
            </div>
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
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
            px-3 py-2 text-[#08994A] dark:text-white font-medium text-[14px] leading-[16px] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[20px] px-3 py-2 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] 
            text-white dark:text-black font-medium text-[14px] leading-[16px] hover:bg-[#0cd968] transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDonorPopup;