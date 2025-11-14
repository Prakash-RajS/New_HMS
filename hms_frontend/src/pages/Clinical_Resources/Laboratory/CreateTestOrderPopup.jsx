import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Radiology",
  "Pathology",
  "General Medicine",
];

const CreateTestOrderPopup = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    department: "",
    testType: "",
  });

  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/medicine_allocation/edit")
      .then(res => res.json())
      .then(data => setPatients(data.patients || []))
      .catch(err => console.error("Failed to fetch patients", err));
  }, []);

  const patientNames = [...new Set(patients.map(p => p.full_name || ""))].filter(Boolean);
  const patientIds = patients.map(p => p.patient_unique_id || "").filter(Boolean);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim())
      newErrors.patientName = "Patient name is required";
    if (!formData.patientId.trim())
      newErrors.patientId = "Patient ID is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.testType.trim()) newErrors.testType = "Test type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      try {
        onSave(formData);
        successToast(
          `Test order for "${formData.patientName}" created successfully!`
        );
        onClose();
      } catch (error) {
        errorToast("Failed to create test order");
      }
    } else {
      errorToast("Please fix the errors below");
    }
  };

  const Dropdown = ({ label, value, onChange, options, error, isPatientName = false, isPatientId = false }) => (
    <div>
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label}
      </label>
      <Listbox value={value} onChange={(val) => {
        if (isPatientName) {
          const patient = patients.find(p => p.full_name === val);
          setFormData({ ...formData, patientName: val, patientId: patient ? patient.patient_unique_id : formData.patientId });
        } else if (isPatientId) {
          const patient = patients.find(p => p.patient_unique_id === val);
          setFormData({ ...formData, patientId: val, patientName: patient ? patient.full_name : formData.patientName });
        } else {
          onChange(val);
        }
      }}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
            focus:outline-none"
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B] no-scrollbar" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black
            shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
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
        <p className="text-red-500 text-xs mt-1">
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
              Create Test Order
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            {/* Patient Name Dropdown */}
            <Dropdown
              label="Patient Name"
              value={formData.patientName}
              onChange={(val) => {}}
              options={patientNames}
              error={errors.patientName}
              isPatientName={true}
            />

            {/* Patient ID Dropdown */}
            <Dropdown
              label="Patient ID"
              value={formData.patientId}
              onChange={(val) => {}}
              options={patientIds}
              error={errors.patientId}
              isPatientId={true}
            />

            {/* Department */}
            <Dropdown
              label="Department"
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              options={departments}
              error={errors.department}
            />

            {/* Test Type */}
            <div>
              <label
                className="text-sm text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Test Type
              </label>
              <input
                name="testType"
                value={formData.testType}
                onChange={(e) =>
                  setFormData({ ...formData, testType: e.target.value })
                }
                placeholder="e.g., X-ray, MRI, Blood Test"
                className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
              {errors.testType && (
                <p className="text-red-500 text-xs mt-1">{errors.testType}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
              text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Save Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestOrderPopup;