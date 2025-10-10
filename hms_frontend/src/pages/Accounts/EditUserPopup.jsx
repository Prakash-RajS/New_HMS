import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const UpdateUserPopup = ({ onClose, user, onUpdate }) => {
  // ✅ Safe fallback in case `user` is undefined
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    joinedOn: "",
  });

  // ✅ Update state when `user` prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        joinedOn: user.joinedOn || "",
      });
    }
  }, [user]);

  // Input validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidForm = () => formData.name.trim() !== "" && isValidEmail(formData.email);

  const handleUpdate = () => {
    if (!isValidForm()) {
      alert("Please provide a valid name and email address.");
      return;
    }

    // Convert joinedOn to MM/DD/YYYY format if provided
    const formattedData = {
      ...formData,
      joinedOn: formData.joinedOn
        ? new Date(formData.joinedOn).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        : "",
    };

    if (onUpdate) onUpdate(formattedData);
    onClose();
  };

  // Dropdown options synced with UserSettings.jsx
  const roles = ["Doctor", "Staff", "Receptionist"];
  const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];

  // Reusable Dropdown component
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-black text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 
            border border-gray-300 dark:border-[#3A3A3A] left-[2px]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-[12px] 
                  ${active ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-[#0EFF7B]"}
                  ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
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
      <div className="w-[504px] h-auto rounded-[20px]  bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 relative">
        {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-black dark:text-white font-inter font-medium text-[16px] leading-[19px]">
            Update User
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
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
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
              bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
              focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-black dark:text-white">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
              bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
              focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
          </div>

          {/* Role */}
          <Dropdown
            label="Role"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            options={roles}
          />

          {/* Department */}
          <Dropdown
            label="Department"
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
            options={departments}
          />

          {/* Joined Date */}
          <div>
            <label className="text-sm text-black dark:text-white">Joined Date</label>
            <div className="relative">
              <input
                type="date"
                name="joinedOn"
                value={formData.joinedOn || ""}
                onChange={(e) =>
                  setFormData({ ...formData, joinedOn: e.target.value })
                }
                className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
              <Calendar
                size={18}
                className="absolute right-0 top-3 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
            bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-medium text-[14px] leading-[16px] hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] 
             text-white dark:text-white font-medium text-[14px] leading-[16px] hover:bg-[#0cd968] dark:hover:bg-[#0cd968]"
          style={{
    background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
  }}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserPopup;
