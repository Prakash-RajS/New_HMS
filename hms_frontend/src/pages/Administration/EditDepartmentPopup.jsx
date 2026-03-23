import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";
import api from "../../utils/axiosConfig"; // Cookie-based axios instance
import { usePermissions } from "../../components/PermissionContext"; // ✅ Import permissions

const EditDepartmentPopup = ({ onClose, onSave, department }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin } = usePermissions();
    const canCRUD = isAdmin;

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        status: department.status ? department.status.charAt(0).toUpperCase() + department.status.slice(1).toLowerCase() : "Active",
        description: department.description || "",
      });
    }
  }, [department]);

  // Handle department name change - prevent numbers and invalid characters
  // Handle department name change - prevent numbers, invalid characters, and limit to 50 characters
const handleNameChange = (e) => {
  // Allow only letters, spaces, hyphens, and apostrophes, and limit to 50 characters
  let value = e.target.value;
  
  // Limit to 50 characters
  if (value.length > 50) {
    value = value.slice(0, 50);
  }
  
  // Remove invalid characters
  value = value.replace(/[^a-zA-Z\s\-']/, '');
  
  setFormData({ ...formData, name: value });
};

// Add validation functions
const validateDepartmentName = (name) => {
  if (!name.trim()) return "Department name is required";
  if (name.trim().length > 50) return "Department name cannot exceed 50 characters";
  if (!/^[A-Za-z\s\-']+$/.test(name.trim())) return "Department name should contain only letters, spaces, hyphens, and apostrophes";
  return "";
};

const validateDescription = (desc) => {
  if (desc && desc.length > 200) return "Description cannot exceed 200 characters";
  if (desc && !/^[A-Za-z0-9\s.,!?'-]+$/.test(desc)) return "Description can contain letters, numbers, spaces and basic punctuation";
  return "";
};

  const handleUpdate = async () => {
  if (!canCRUD) {
    errorToast("You do not have permission to perform this action.");
    return;
  }
  
  // Validate department name
  const nameError = validateDepartmentName(formData.name);
  if (nameError) {
    setError(nameError);
    errorToast(nameError);
    return;
  }
  
  // Validate description
  const descError = validateDescription(formData.description);
  if (descError) {
    setError(descError);
    errorToast(descError);
    return;
  }
  
  if (!formData.status) {
    setError("Status is required.");
    errorToast("Status is required.");
    return;
  }

  setLoading(true);
  setError("");

  const payload = {
    name: formData.name.trim(),
    status: formData.status.toLowerCase(),
    description: formData.description.trim() || null,
  };

  try {
    const response = await api.put(`/departments/${department.id}`, payload);

    // Success Toast
    successToast(`"${response.data.name}" updated successfully!`);

    // Trigger parent refresh
    if (onSave) onSave(response.data);

    // Close popup after short delay
    setTimeout(() => {
      onClose();
    }, 800);
  } catch (err) {
    let errorMessage = "Failed to update department.";
    
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response.status === 400) {
        errorMessage = err.response.data?.detail || "Invalid data.";
      } else if (err.response.status === 404) {
        errorMessage = "Department not found.";
      } else if (err.response.status === 409) {
        errorMessage = err.response.data?.detail || "Department with this name already exists.";
      } else {
        errorMessage = err.response.data?.detail || errorMessage;
      }
    } else if (err.request) {
      errorMessage = "Network error. Please check your connection.";
    } else {
      errorMessage = err.message || errorMessage;
    }
    
    setError(errorMessage);
    errorToast(errorMessage);
    console.error("Update failed:", err);
  } finally {
    setLoading(false);
  }
};

  const statuses = ["Active", "Inactive"];

  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="text-sm text-gray-600 dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] 
                       bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] 
                       text-left text-[14px] leading-[16px] disabled:opacity-50"
            disabled={loading}
          >
            {value || "Select"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 
                       border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px] max-h-40 overflow-auto"
          >
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
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
      <div className="w-[504px] rounded-[20px] bg-gray-100 dark:bg-[#000000E5] text-black dark:text-white p-6 backdrop-blur-md relative">
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background:
              "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="font-medium text-[16px]">Edit Department</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-6 h-6 rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B1A] 
                       bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B33] 
                       disabled:opacity-50 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Local Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-2 gap-6">
          <div>
  <label className="text-sm text-gray-600 dark:text-white">
    Department Name <span className="text-red-500">*</span>
  </label>
  <input
    value={formData.name}
    onChange={handleNameChange}
    placeholder="Enter department (max 50 chars)"
    maxLength="50"
    className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border 
               border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent 
               text-[#08994A] dark:text-[#0EFF7B] outline-none disabled:opacity-50
               ${error && error.includes("Department name") ? "border-red-500 ring-1 ring-red-500" : ""}`}
    disabled={loading}
  />
  {/* Character counter */}
  <div className="text-right text-xs text-gray-500 mt-1">
    {formData.name.length}/50
  </div>
</div>

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

        <div className="mt-6">
  <label className="text-sm text-gray-600 dark:text-white">
    Description <span className="text-gray-500 text-xs">(Optional, max 200 chars)</span>
  </label>
  <textarea
    value={formData.description}
    onChange={(e) => {
      const value = e.target.value;
      if (value.length <= 200) {
        setFormData({ ...formData, description: value });
      }
    }}
    placeholder="Enter description (max 200 characters)"
    rows={4}
    maxLength="200"
    className={`w-full mt-1 px-3 py-2 rounded-[8px] border 
               border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent 
               text-[#08994A] dark:text-[#0EFF7B] outline-none resize-none disabled:opacity-50
               ${error && error.includes("Description") ? "border-red-500 ring-1 ring-red-500" : ""}`}
    disabled={loading}
  />
  {/* Character counter */}
  <div className="text-right text-xs text-gray-500 mt-1">
    {formData.description.length}/200
  </div>
</div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] 
                       px-3 py-2 text-black dark:text-white font-medium text-[14px] 
                       hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-[144px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] 
                       px-3 py-2 bg-gradient-to-r from-[#0EFF7B] to-[#08994A] 
                       shadow text-white font-medium text-[14px] hover:scale-105 
                       transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentPopup;