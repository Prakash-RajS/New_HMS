import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";

const AddDepartmentPopup = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    departmentName: "",
    status: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : "http://localhost:8000";
const handleSave = async () => {
  // Basic validation
  if (!formData.departmentName.trim() || !formData.status) {
    setError("Department name and status are required.");
    errorToast("Department name and status are required.");
    return;
  }

  setLoading(true);
  setError("");

  const payload = {
    name: formData.departmentName.trim(),
    status: formData.status.toLowerCase(), // Backend expects "active"/"inactive"
    description: formData.description.trim() || null,
  };

  try {
    const response = await fetch(`${API}/departments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Failed to create department.";

      if (response.status === 409) {
        const err = await response.json();
        errorMessage = err.detail || "Department with this name already exists.";
      } else {
        try {
          const err = await response.json();
          errorMessage = err.detail || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
      }

      setError(errorMessage);
      errorToast(errorMessage);
      setLoading(false);
      return;
    }

    const newDepartment = await response.json();

    // SUCCESS TOAST
    successToast(`"${newDepartment.name}" created successfully!`);

    // Notify parent to refresh list
    if (onSave) onSave(newDepartment);

    // Close popup with a tiny delay for toast visibility
    setTimeout(() => {
      onClose();
    }, 600);

  } catch (err) {
    const networkError = "Network error. Please check your connection.";
    setError(networkError);
    errorToast(networkError);
    console.error("Create Department Error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setFormData({ departmentName: "", status: "", description: "" });
    setError("");
  };

  const statuses = ["Active", "Inactive"];

  // Reusable Dropdown
  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-gray-600 dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className={`
              w-full h-[33px] px-3 pr-8 rounded-[8px] border text-left text-[14px] leading-[16px]
              ${
                value
                  ? "text-[#08994A] dark:text-[#0EFF7B]"
                  : "text-gray-500 dark:text-gray-400"
              }
              bg-white dark:bg-transparent border-[#0EFF7B] dark:border-[#3A3A3A]
              flex items-center justify-between
            `}
            disabled={loading}
          >
            <span>{value || "Select"}</span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px] max-h-60 overflow-auto"
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica]">
      <div className="w-[504px] h-auto rounded-[20px] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 backdrop-blur-md relative">
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
            Add Department
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] shadow flex items-center justify-center text-gray-600 dark:text-white hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 text-sm rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          {/* Department Name */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              name="departmentName"
              value={formData.departmentName}
              onChange={(e) =>
                setFormData({ ...formData, departmentName: e.target.value })
              }
              placeholder="Enter department"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Status Dropdown */}
          <Dropdown
            label={
              <>
                Status <span className="text-red-500">*</span>
              </>
            }
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
            options={statuses}
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="text-sm text-gray-600 dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter description"
            rows={4}
            className="w-full mt-1 px-3 py-2 rounded-[12px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 dark:placeholder-gray-500 outline-none disabled:opacity-50"
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={handleClear}
            disabled={loading}
            className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] px-3 py-2 text-black dark:text-white font-medium text-[14px] leading-[16px] shadow opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-gray-900 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A] shadow text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentPopup;