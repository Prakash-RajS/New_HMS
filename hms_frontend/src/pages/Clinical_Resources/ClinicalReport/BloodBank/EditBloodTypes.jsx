import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditBloodTypePopup = ({ onClose, bloodData, onUpdate }) => {
  const [formData, setFormData] = useState({
    type: bloodData?.type || "",
    units: bloodData?.units || "",
    status: bloodData?.status || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Blood type is required";
    if (!formData.units || isNaN(formData.units) || formData.units < 0)
      newErrors.units = "Valid units (non-negative number) is required";
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
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statuses = ["Available", "Low Stock", "Out of Stock"];

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
            className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 
            border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-40 overflow-auto"
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
            Edit Blood Type
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
          {/* Blood Type */}
          <Dropdown
            label="Blood Type"
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val })}
            options={bloodTypes}
            error={errors.type}
          />

          {/* Available Units */}
          <div>
            <label className="text-sm text-black dark:text-white">Available Units</label>
            <input
              type="text"
              name="units"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              placeholder="Enter units"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.units && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.units}</p>}
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

export default EditBloodTypePopup;