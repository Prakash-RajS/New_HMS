import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditMedicineAllocationPopup = ({ onClose, medicineData, onUpdate }) => {
  const [formData, setFormData] = useState({
    medicineName: medicineData?.medicine_name || "",
    dosage: medicineData?.dosage || "",
    quantity: medicineData?.quantity || "",
    frequency: medicineData?.frequency || "",
    duration: medicineData?.duration || "",
    time: medicineData?.time || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.medicineName) newErrors.medicineName = "Medicine name is required";
    if (!formData.dosage) newErrors.dosage = "Dosage is required";
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 0)
      newErrors.quantity = "Valid quantity (non-negative number) is required";
    if (!formData.frequency) newErrors.frequency = "Frequency is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      if (onUpdate) onUpdate(formData);
      onClose();
    }
  };

  const medicineNames = ["Amoxicillin", "Paracetamol", "Cefixime", "Ibuprofen", "Aspirin", "Metformin", "Atorvastatin", "Levothyroxine"];
  const dosages = ["250 mg", "500 mg", "750 mg", "1000 mg"];
  const quantities = ["10", "20", "30", "50", "100"];
  const frequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "As needed"];
  const durations = ["3 days", "5 days", "7 days", "10 days", "14 days", "30 days", "As directed"];
  const times = ["8:00 AM", "12:00 PM", "6:00 PM", "8:00 PM", "Before meals", "After meals", "At bedtime"];

  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
            focus:outline-none"
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
            }}
          >
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
        <p
          className="text-red-500 dark:text-red-400 text-xs mt-1"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
        bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
        dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
      >
        <div
          className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2
              className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Edit Medicine Allocation
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Medicine Name"
              value={formData.medicineName}
              onChange={(val) => setFormData({ ...formData, medicineName: val })}
              options={medicineNames}
              error={errors.medicineName}
            />

            <Dropdown
              label="Dosage"
              value={formData.dosage}
              onChange={(val) => setFormData({ ...formData, dosage: val })}
              options={dosages}
              error={errors.dosage}
            />

            <Dropdown
              label="Quantity"
              value={formData.quantity}
              onChange={(val) => setFormData({ ...formData, quantity: val })}
              options={quantities}
              error={errors.quantity}
            />

            <Dropdown
              label="Frequency"
              value={formData.frequency}
              onChange={(val) => setFormData({ ...formData, frequency: val })}
              options={frequencies}
              error={errors.frequency}
            />

            <Dropdown
              label="Duration"
              value={formData.duration}
              onChange={(val) => setFormData({ ...formData, duration: val })}
              options={durations}
              error={errors.duration}
            />

            <Dropdown
              label="Time"
              value={formData.time}
              onChange={(val) => setFormData({ ...formData, time: val })}
              options={times}
              error={errors.time}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
              text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineAllocationPopup;