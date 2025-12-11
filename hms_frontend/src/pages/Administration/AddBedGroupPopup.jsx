import React, { useState } from "react";
import { X } from "lucide-react";
import { successToast, errorToast } from "../../components/Toast";

const AddBedGroupPopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bedGroupName: "",
    bedFrom: "",
    bedTo: "",
  });
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({}); // Format validation
  const [fieldErrors, setFieldErrors] = useState({}); // Required validation (submit only)
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---------- Format Validation Functions (while typing) ---------- */
  const validateBedGroupNameFormat = (value) => {
    if (value.trim() && !/^[A-Za-z0-9\s&.,'-]+$/.test(value)) return "Bed group name can contain letters, numbers, spaces, &, ., ,, ' and -";
    if (value.trim().length < 2) return "Bed group name must be at least 2 characters";
    if (value.trim().length > 50) return "Bed group name cannot exceed 50 characters";
    return "";
  };

  const validateBedFromFormat = (value) => {
    if (value.trim() && (isNaN(value) || parseInt(value) <= 0)) return "Starting bed number must be a positive number";
    if (value.trim() && parseInt(value) > 999) return "Starting bed number cannot exceed 999";
    return "";
  };

  const validateBedToFormat = (value) => {
    if (value.trim() && (isNaN(value) || parseInt(value) <= 0)) return "Ending bed number must be a positive number";
    if (value.trim() && parseInt(value) > 999) return "Ending bed number cannot exceed 999";
    if (value.trim() && formData.bedFrom.trim() && parseInt(value) <= parseInt(formData.bedFrom)) {
      return "Ending number must be greater than starting number";
    }
    return "";
  };

  /* ---------- Required Field Validation (only for submission) ---------- */
  const validateRequiredFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.bedGroupName.trim()) {
      errors.bedGroupName = "Bed group name is required";
      isValid = false;
    }
    
    if (!formData.bedFrom) {
      errors.bedFrom = "Starting bed number is required";
      isValid = false;
    }
    
    if (!formData.bedTo) {
      errors.bedTo = "Ending bed number is required";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  /* ---------- Capitalize Functions ---------- */
  const capitalizeWords = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  /* ---------- Handle Input Change ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Apply auto-capitalization for bed group name
    if (name === "bedGroupName") {
      processedValue = capitalizeWords(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Perform real-time format validation
    let formatError = "";
    switch (name) {
      case "bedGroupName":
        formatError = validateBedGroupNameFormat(processedValue);
        break;
      case "bedFrom":
        formatError = validateBedFromFormat(processedValue);
        // Also trigger re-validation of bedTo when bedFrom changes
        if (formData.bedTo) {
          const bedToError = validateBedToFormat(formData.bedTo);
          if (bedToError) {
            setValidationErrors(prev => ({
              ...prev,
              bedTo: bedToError
            }));
          } else if (validationErrors.bedTo) {
            setValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.bedTo;
              return newErrors;
            });
          }
        }
        break;
      case "bedTo":
        formatError = validateBedToFormat(processedValue);
        break;
      default:
        break;
    }
    
    if (formatError) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: formatError
      }));
    }
  };

  /* ---------- Validate Form Before Submission ---------- */
  const validateForm = () => {
    // First check required fields
    const requiredValid = validateRequiredFields();
    
    // Then check format validation
    const formatErrors = {
      bedGroupName: validateBedGroupNameFormat(formData.bedGroupName),
      bedFrom: validateBedFromFormat(formData.bedFrom),
      bedTo: validateBedToFormat(formData.bedTo)
    };
    
    // Update validation errors for display
    setValidationErrors(formatErrors);
    
    const formatValid = !Object.values(formatErrors).some(error => error !== "");
    
    setIsSubmitted(true);
    return requiredValid && formatValid;
  };

  const API =
    window.location.hostname === "18.119.210.2"
      ? "http://18.119.210.2:8000"
      : "http://localhost:8000";

  const handleAdd = async () => {
    // Validate all fields
    if (!validateForm()) {
      errorToast("Please fix all validation errors before saving.");
      return;
    }

    setLoading(true);
    setServerError("");

    const capacity = parseInt(formData.bedTo) - parseInt(formData.bedFrom) + 1;
    const payload = {
      bedGroup: formData.bedGroupName.trim(),
      capacity: capacity,
    };

    try {
      const response = await fetch(`${API}/bedgroups/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create bed group.";

        if (response.status === 400) {
          const err = await response.json();
          errorMessage = err.detail || "Bed group already exists.";
        } else {
          try {
            const err = await response.json();
            errorMessage = err.detail || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
        }

        setServerError(errorMessage);
        errorToast(errorMessage);
        setLoading(false);
        return;
      }

      const newGroup = await response.json();
      successToast(`"${newGroup.bedGroup}" created successfully!`);
      
      if (onAdd) onAdd(newGroup);
      
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      const networkError = "Network error. Please check your connection.";
      setServerError(networkError);
      errorToast(networkError);
      console.error("Create BedGroup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-[Helvetica]">
      <div className="w-[420px] h-auto rounded-[20px]  
      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-md backdrop-blur-md relative">
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
            Add Bed Group
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] 
            flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Bed Group Name */}
          <div>
            <label className="text-sm text-black dark:text-white">
              Bed Group Name <span className="text-red-500">*</span>
            </label>
            <input
              name="bedGroupName"
              value={formData.bedGroupName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('bedGroupName')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., ICU, Ward, General"
              className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border 
                ${focusedField === 'bedGroupName' ? 'border-[#0EFF7B] ring-1 ring-[#0EFF7B]' : 'border-[#0EFF7B] dark:border-[#0D0D0D]'}
                bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                outline-none`}
            />
            {/* Format validation error - shows while typing */}
            {validationErrors.bedGroupName && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.bedGroupName}</p>
            )}
            {/* Required field error - only shows after submit attempt */}
            {fieldErrors.bedGroupName && !validationErrors.bedGroupName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.bedGroupName}</p>
            )}
          </div>

          {/* Bed Numbers (From - To) */}
          <div>
            <label className="text-sm text-black dark:text-white">
              Bed No's <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1/2">
                <input
                  type="number"
                  name="bedFrom"
                  value={formData.bedFrom}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('bedFrom')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="From"
                  className={`w-full h-[33px] px-3 rounded-[8px] border 
                    ${focusedField === 'bedFrom' ? 'border-[#0EFF7B] ring-1 ring-[#0EFF7B]' : 'border-[#0EFF7B] dark:border-[#0D0D0D]'}
                    bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                    outline-none`}
                />
                {/* Format validation error - shows while typing */}
                {validationErrors.bedFrom && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.bedFrom}</p>
                )}
                {/* Required field error - only shows after submit attempt */}
                {fieldErrors.bedFrom && !validationErrors.bedFrom && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.bedFrom}</p>
                )}
              </div>
              <span className="text-gray-600 dark:text-gray-300">to</span>
              <div className="w-1/2">
                <input
                  type="number"
                  name="bedTo"
                  value={formData.bedTo}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('bedTo')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="To"
                  className={`w-full h-[33px] px-3 rounded-[8px] border 
                    ${focusedField === 'bedTo' ? 'border-[#0EFF7B] ring-1 ring-[#0EFF7B]' : 'border-[#0EFF7B] dark:border-[#0D0D0D]'}
                    bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                    outline-none`}
                />
                {/* Format validation error - shows while typing */}
                {validationErrors.bedTo && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.bedTo}</p>
                )}
                {/* Required field error - only shows after submit attempt */}
                {fieldErrors.bedTo && !validationErrors.bedTo && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.bedTo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Server error display */}
          {serverError && <p className="text-red-500 text-xs mt-2">{serverError}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
            px-3 py-2 text-[#08994A] dark:text-white font-medium text-[14px] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || Object.values(validationErrors).some(error => error !== "")}
            className="w-[104px] h-[33px] rounded-[8px] text-white font-medium text-[14px] 
            transition border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66]
            disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBedGroupPopup;