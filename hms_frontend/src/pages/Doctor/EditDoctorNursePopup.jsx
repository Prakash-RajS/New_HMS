import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditDoctorNursePopup = ({ onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState({ ...profile });

  const handleUpdate = () => {
    if (onUpdate) onUpdate(formData);
    onClose();
  };

  const departments = ["Orthopedics", "Cardiology", "Neurology", "Dermatology"];
  const roles = ["Doctor", "Nurse"];
  const statuses = ["Active", "Inactive"];

  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value || "Select"} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                    active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                  } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
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
      <div
        className="w-[504px] h-[520px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)] dark:shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative"
      >
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-black dark:text-white font-inter font-medium text-[16px] leading-[19px]">
            Edit Doctor/Nurse
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-black dark:text-white">Full Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>
          <Dropdown
            label="Role"
            value={formData.type || "Select"}
            onChange={(val) => setFormData({ ...formData, type: val })}
            options={roles}
          />
          <Dropdown
            label="Department"
            value={formData.department || "Select"}
            onChange={(val) => setFormData({ ...formData, department: val })}
            options={departments}
          />
          <div>
            <label className="text-sm text-black dark:text-white">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.contact || ""}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Enter phone number"
              maxLength="10"
              required
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-black dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
              required
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-black dark:text-white">Joining Date</label>
            <div className="relative">
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate || ""}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                required
                className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] outline-none"
              />
              <Calendar
                size={18}
                className="absolute right-0 top-3 text-[#08994A] dark:text-white pointer-events-none"
              />
            </div>
          </div>
          <Dropdown
            label="Status"
            value={formData.status || "Select"}
            onChange={(val) => setFormData({ ...formData, status: val })}
            options={statuses}
          />
        </div>
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-white font-medium text-[14px] leading-[16px] hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E]"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B66] dark:border-[#0EFF7B66] bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorNursePopup;