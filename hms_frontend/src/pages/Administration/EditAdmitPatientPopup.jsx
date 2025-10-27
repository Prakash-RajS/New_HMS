import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

/* -------------------------------------------------
   Dropdown – same as AdmitPatientPopup
------------------------------------------------- */
const Dropdown = ({ label, value, onChange, options, error }) => (
  <div>
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1 w-[228px]">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                     bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
                     outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>

        <Listbox.Options
          className="absolute mt-1 w-full max-h-40 overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 
                     border border-gray-300 dark:border-[#3A3A3A] left-[2px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((opt, idx) => (
            <Listbox.Option
              key={idx}
              value={opt}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-[12px] 
                 ${active ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-[#0EFF7B]"}
                 ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
              }
            >
              {opt}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </Listbox>
  </div>
);

/* -------------------------------------------------
   EditAdmitPatientPopup – matches AdmitPatientPopup
------------------------------------------------- */
const EditAdmitPatientPopup = ({ onClose, onUpdate, existingData }) => {
  const [formData, setFormData] = useState({
    name: existingData?.name || "",
    patientId: existingData?.patientId || "",
    bedGroup: existingData?.bedGroup || "",
    bedNumber: existingData?.bedNumber || "",
    admitDate: existingData?.admitDate || "", // "MM/DD/YYYY"
    dischargeDate: existingData?.dischargeDate || "",
  });

  const [errors, setErrors] = useState({});

  const bedGroups = ["ICU", "Ward", "Emergency"];

  /* ---------- Validation ---------- */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.patientId.trim()) newErrors.patientId = "Patient ID is required";
    if (!formData.bedGroup) newErrors.bedGroup = "Bed group is required";
    if (!formData.bedNumber.trim()) newErrors.bedNumber = "Bed number is required";
    if (!formData.admitDate) newErrors.admitDate = "Admit date is required";

    if (formData.dischargeDate && formData.admitDate) {
      if (formData.dischargeDate < formData.admitDate) {
        newErrors.dischargeDate = "Discharge date cannot be before admit date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      onUpdate?.(formData);
      onClose();
    }
  };

  /* ---------- Parse MM/DD/YYYY → Date ---------- */
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [m, d, y] = dateStr.split("/").map(Number);
    if (!m || !d || !y) return null;
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="w-[504px] h-auto rounded-[20px] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 relative"
        style={{
          boxShadow: "0px 0px 4px 0px rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background:
              "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
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
          <h3 className="font-inter font-medium text-[16px] leading-[19px]">
            Edit Patient Admission
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Patient Name */}
          <div>
            <label className="text-sm">Patient Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                         bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
                         focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Patient ID */}
          <div>
            <label className="text-sm">Patient ID</label>
            <input
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              placeholder="Enter ID"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                         bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
                         focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>}
          </div>

          {/* Bed Group */}
          <Dropdown
            label="Bed Group"
            value={formData.bedGroup}
            onChange={(v) => setFormData({ ...formData, bedGroup: v })}
            options={bedGroups}
            error={errors.bedGroup}
          />

          {/* Bed Number */}
          <div>
            <label className="text-sm">Bed Number</label>
            <input
              value={formData.bedNumber}
              onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
              placeholder="Enter bed number"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                         bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
                         focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.bedNumber && <p className="text-red-500 text-xs mt-1">{errors.bedNumber}</p>}
          </div>

          {/* Admit Date – compact dropdown style */}
          <div>
            <label className="text-sm">Admit Date</label>
            <div className="relative">
              <DatePicker
                selected={parseDate(formData.admitDate)}
                onChange={(date) => {
                  const formatted = date
                    ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                        date.getDate()
                      ).padStart(2, "0")}/${date.getFullYear()}`
                    : "";
                  setFormData({ ...formData, admitDate: formatted });
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="w-[228px] h-[33px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                           bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                           focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-sm"
                wrapperClassName="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                customInput={
                  <input
                    style={{
                      paddingRight: "2.5rem",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  />
                }
              />
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <Calendar size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
              </div>
            </div>
            {errors.admitDate && <p className="text-red-500 text-xs mt-1">{errors.admitDate}</p>}
          </div>

          {/* Discharge Date – same style */}
          <div>
            <label className="text-sm">Discharge Date</label>
            <div className="relative">
              <DatePicker
                selected={parseDate(formData.dischargeDate)}
                onChange={(date) => {
                  const formatted = date
                    ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                        date.getDate()
                      ).padStart(2, "0")}/${date.getFullYear()}`
                    : "";
                  setFormData({ ...formData, dischargeDate: formatted });
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="w-[228px] h-[33px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                           bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                           focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-sm"
                wrapperClassName="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                customInput={
                  <input
                    style={{
                      paddingRight: "2.5rem",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  />
                }
              />
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <Calendar size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
              </div>
            </div>
            {errors.dischargeDate && <p className="text-red-500 text-xs mt-1">{errors.dischargeDate}</p>}
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
            style={{
              background:
                "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
            className="w-[104px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] text-white font-medium text-[14px] leading-[16px] hover:bg-[#0cd968]"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdmitPatientPopup;