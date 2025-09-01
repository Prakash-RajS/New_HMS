import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditAppointmentPopup = ({ onClose, appointment, onUpdate }) => {
  const [formData, setFormData] = useState({ ...appointment });

  const handleUpdate = () => {
    if (onUpdate) onUpdate(formData);
    onClose();
  };

  // Options
  const departments = ["Orthopedics", "Cardiology", "Neurology", "Dermatology"];
  const doctors = ["Dr. Sravan", "Dr. Ramesh", "Dr. Kavya"];
  const appointmentTypes = ["Check-up", "Follow-up", "Emergency"];
  const statuses = ["New", "Normal", "Severe", "Completed", "Cancelled"];

  // ✅ Reusable Dropdown (same as AddAppointmentPopup)
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          {/* Button */}
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#3A3A3A]
          bg-transparent text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          >
            {value || "Select"}
            {/* Icon fixed at end */}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 
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
      <div className="w-[504px] h-[485px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-white font-inter font-medium text-[16px] leading-[19px]">
            Edit Patient
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
          {/* Patient Name */}
          <div>
            <label className="text-sm text-white">Patient Name</label>
            <input
              name="patient"
              value={formData.patient}
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>

          {/* Patient ID */}
          <div>
            <label className="text-sm text-white">Patient ID</label>
            <input
              name="patientId"
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              placeholder="Enter patient ID"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>

          {/* Department Dropdown */}
          <Dropdown
            label="Department"
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
            options={departments}
          />

          {/* Appointment Date */}
          <div>
            <label className="text-sm text-white">Appointment Date</label>
            <div className="relative">
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] outline-none"
              />
              <Calendar
                size={18}
                className="absolute right-0 top-3 text-[white] pointer-events-none"
              />
            </div>
          </div>

          {/* Doctor Dropdown */}
          <Dropdown
            label="Doctor"
            value={formData.doctor}
            onChange={(val) => setFormData({ ...formData, doctor: val })}
            options={doctors}
          />

          {/* Status Dropdown */}
          <Dropdown
            label="Status"
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
            options={statuses}
          />

          {/* Phone */}
          <div>
            <label className="text-sm text-white">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
              maxLength="10"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-full border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none"
            />
          </div>

          {/* Appointment Type Dropdown */}
          <Dropdown
            label="Appointment Type"
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val })}
            options={appointmentTypes}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] px-3 py-2 
            text-white font-medium text-[14px] leading-[16px] shadow opacity-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B66] px-3 py-2 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] shadow 
            text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentPopup;
