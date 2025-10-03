import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditDepartmentPopup = ({ onClose, onUpdate, department }) => {
  const [formData, setFormData] = useState({
    departmentName: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        departmentName: department.departmentName || "",
        status: department.status || "",
        description: department.description || "",
      });
    }
  }, [department]);

  const handleUpdate = () => {
    if (onUpdate) onUpdate(formData);
    onClose();
  };

  const statuses = ["Active", "Inactive"];

  // Reusable Dropdown
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-gray-600 dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] 
                       bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] 
                       text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 
                       border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                    active
                      ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                      : selected
                      ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
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
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[504px] h-auto rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] 
                      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 
                      shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] 
                      dark:shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] 
                      backdrop-blur-md relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-black dark:text-white font-inter font-medium text-[16px] leading-[19px]">
            Edit Department
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] 
                       bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] shadow flex items-center justify-center 
                       text-gray-600 dark:text-white hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          {/* Department Name */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white">Department Name</label>
            <input
              name="departmentName"
              value={formData.departmentName}
              onChange={(e) =>
                setFormData({ ...formData, departmentName: e.target.value })
              }
              placeholder="Enter department"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] 
                         dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] 
                         dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <Dropdown
            label="Status"
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
            options={statuses}
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="text-sm text-gray-600 dark:text-white">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter description"
            rows={4}
            className="w-full mt-1 px-3 py-2 rounded-[12px] border border-[#0EFF7B] 
                       dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] 
                       dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#3A3A3A] 
                       px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] 
                       shadow opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[144px] h-[33px] rounded-[20px] border border-[#0EFF7B66] dark:border-[#0EFF7B66] 
                       px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] 
                       dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium 
                       text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
          >
            Update!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentPopup;
