import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const AddBloodTypePopup = ({ onClose, bloodData, onUpdate }) => {
  const [formData, setFormData] = useState({ ...bloodData });

  const handleUpdate = () => {
    if (onUpdate) onUpdate(formData);
    onClose();
  };

  // Dropdown options
  const bloodTypes = [
    "A", "A+", "A-", "B", "B+", "B-",
    "O", "O+", "O-", "AB", "AB+", "AB-"
  ];
  const statuses = ["Available", "Low Stock", "Out of Stock"];

  // ✅ Reusable Dropdown
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#3A3A3A]
            bg-transparent text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 max-h-40 overflow-auto w-full rounded-[12px] bg-black shadow-lg z-50 
            border border-[#3A3A3A] left-[2px]"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"}
                  ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[504px] h-auto rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-white font-inter font-medium text-[16px] leading-[19px]">
            Add Blood Type
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] shadow flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          {/* Blood Type */}
          <Dropdown
            label="Blood Type"
            value={formData.bloodType}
            onChange={(val) => setFormData({ ...formData, bloodType: val })}
            options={bloodTypes}
          />

          {/* Available Units */}
          <div>
            <label className="text-sm text-white">Available Units</label>
            <input
              type="text"
              name="units"
              value={formData.units || ""}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              placeholder="Enter units"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] 
              bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>

          {/* Status */}
          <Dropdown
            label="Status"
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
            options={statuses}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] 
            px-3 py-2 text-white font-medium text-[14px] leading-[16px] shadow opacity-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B66] px-3 py-2 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] shadow 
            text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBloodTypePopup;
