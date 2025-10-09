import React, { useState } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditAdmitPatientPopup = ({ onClose, onUpdate, existingData }) => {
  const [formData, setFormData] = useState({
    name: existingData?.name || "",
    patientId: existingData?.patientId || "",
    bedGroup: existingData?.bedGroup || "",
    bedNumber: existingData?.bedNumber || "",
    admitDate: existingData?.admitDate || "",
    dischargeDate: existingData?.dischargeDate || "", // new field
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.patientId.trim()) newErrors.patientId = "Patient ID is required";
    if (!formData.bedGroup) newErrors.bedGroup = "Bed group is required";
    if (!formData.bedNumber.trim()) newErrors.bedNumber = "Bed number is required";
    if (!formData.admitDate) newErrors.admitDate = "Admit date is required";
    // Discharge date optional, but if filled should be >= admit date
    if (formData.dischargeDate && formData.dischargeDate < formData.admitDate) {
      newErrors.dischargeDate = "Discharge date cannot be before admit date";
    }
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
  const bedGroups = ["ICU", "Ward", "Emergency"];

  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
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
      <div className="w-[504px] h-auto rounded-[20px] 
      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] 
      backdrop-blur-md relative">
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
          <h3 className="font-inter font-medium text-[16px] leading-[19px] text-black dark:text-white">
            Edit Patient Admission
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] 
            shadow-[0px_0px_4px_0px_#0EFF7B1A] flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          {/* Patient Name */}
          <div>
            <label className="text-sm text-black dark:text-white">Patient Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] 
              dark:border-[#0D0D0D] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Patient ID */}
          <div>
            <label className="text-sm text-black dark:text-white">Patient ID</label>
            <input
              name="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              placeholder="Enter ID"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] 
              dark:border-[#0D0D0D] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>}
          </div>

          {/* Bed Group */}
          <Dropdown
            label="Bed Group"
            value={formData.bedGroup}
            onChange={(val) => setFormData({ ...formData, bedGroup: val })}
            options={bedGroups}
            error={errors.bedGroup}
          />

          {/* Bed Number */}
          <div>
            <label className="text-sm text-black dark:text-white">Bed Number</label>
            <input
              name="bedNumber"
              value={formData.bedNumber}
              onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
              placeholder="Enter bed number"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] 
              dark:border-[#0D0D0D] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.bedNumber && <p className="text-red-500 text-xs mt-1">{errors.bedNumber}</p>}
          </div>

          {/* Admit Date */}
          <div>
            <label className="text-sm text-black dark:text-white">Admit Date</label>
            <div className="relative">
              <input
                type="date"
                name="admitDate"
                value={formData.admitDate}
                onChange={(e) => setFormData({ ...formData, admitDate: e.target.value })}
                className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] 
                dark:border-[#0D0D0D] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] 
                outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
              <Calendar
                size={18}
                className="absolute right-3 top-3.5 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
              />
            </div>
            {errors.admitDate && <p className="text-red-500 text-xs mt-1">{errors.admitDate}</p>}
          </div>

          {/* Discharge Date */}
          <div>
            <label className="text-sm text-black dark:text-white">Discharge Date</label>
            <div className="relative">
              <input
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={(e) => setFormData({ ...formData, dischargeDate: e.target.value })}
                className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] 
                dark:border-[#0D0D0D] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] 
                outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
              <Calendar
                size={18}
                className="absolute right-3 top-3.5 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
              />
            </div>
            {errors.dischargeDate && <p className="text-red-500 text-xs mt-1">{errors.dischargeDate}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
            text-[#08994A] dark:text-white font-medium text-[14px] hover:bg-[#0EFF7B1A] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-[104px] h-[33px] rounded-[8px] bg-gradient-to-r from-[#14DC6F] to-[#09753A] 
            text-white dark:text-black font-medium text-[14px] hover:bg-[#0cd968] transition border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66]"
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

export default EditAdmitPatientPopup;
