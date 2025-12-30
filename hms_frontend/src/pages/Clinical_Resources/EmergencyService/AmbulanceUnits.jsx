// src/components/AmbulanceUnitsModal.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

// Move ErrorMessage outside
const ErrorMessage = ({ field, errors, submitted, isCreateMode, form }) => {
  if (!errors[field]) return null;
  
  // Show format errors immediately, required errors only after submission
  const isFormatError = errors[field].includes("must be") || 
                       errors[field].includes("cannot") || 
                       errors[field].includes("seems") ||
                       errors[field].includes("valid") ||
                       errors[field].includes("at least") ||
                       errors[field].includes("maximum");
  
  if (isFormatError || submitted) {
    return (
      <div className="mt-1 text-red-500 text-xs">
        <span>{errors[field]}</span>
      </div>
    );
  }
  
  return null;
};

// Move TextInput outside
const TextInput = React.memo(({ 
  label, 
  name, 
  required = false, 
  placeholder, 
  type = "text",
  value,
  onChange,
  error,
  submitted,
  isCreateMode,
  inputRef
}) => {
  return (
    <div>
      <label className="text-black dark:text-white">
        {label} {isCreateMode && required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={false}
        placeholder={placeholder}
        className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                    bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]
                    placeholder-gray-400 dark:placeholder-gray-500 outline-none"
      />
      <ErrorMessage 
        field={name} 
        errors={{[name]: error}} 
        submitted={submitted} 
        isCreateMode={isCreateMode}
        form={{[name]: value}}
      />
    </div>
  );
});

// Move TextArea outside
const TextArea = React.memo(({ 
  label, 
  name, 
  required = false, 
  placeholder, 
  value,
  onChange,
  error,
  submitted,
  isCreateMode,
  inputRef
}) => {
  return (
    <div className="col-span-2">
      <label className="text-black dark:text-white">
        {label} {isCreateMode && required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        required={false}
        placeholder={placeholder}
        className="w-full mt-1 px-3 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                    bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]
                    placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
      />
      <ErrorMessage 
        field={name} 
        errors={{[name]: error}} 
        submitted={submitted} 
        isCreateMode={isCreateMode}
        form={{[name]: value}}
      />
    </div>
  );
});

const AmbulanceUnitsModal = ({
  isOpen,
  onClose,
  unit, // null = Add, object = Edit
  onSave,
}) => {
  const isEdit = !!unit?.id;
  const isCreateMode = !isEdit;

  const [form, setForm] = useState({
    unit_number: "",
    vehicle_make: "",
    vehicle_model: "",
    in_service: true,
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const unitNumberRef = useRef(null);
  const vehicleMakeRef = useRef(null);
  const vehicleModelRef = useRef(null);
  const notesRef = useRef(null);

  // Reset form when modal opens/closes or unit changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSubmitted(false);
      
      if (unit) {
        setForm({
          unit_number: unit.unit_number ?? "",
          vehicle_make: unit.vehicle_make ?? "",
          vehicle_model: unit.vehicle_model ?? "",
          in_service: unit.in_service ?? true,
          notes: unit.notes ?? "",
        });
      } else {
        setForm({
          unit_number: "",
          vehicle_make: "",
          vehicle_model: "",
          in_service: true,
          notes: "",
        });
      }
    }
  }, [isOpen, unit]);

  // Validation rules - useCallback
  const validateField = useCallback((name, value) => {
    if (!isCreateMode) return "";
    
    switch (name) {
      case "unit_number":
        if (!value.trim()) return "Unit number is required";
        if (value.trim().length < 3) return "Unit number must be at least 3 characters";
        if (!/^[A-Za-z0-9\-_]+$/.test(value.trim())) return "Unit number can only contain letters, numbers, hyphens and underscores";
        return "";
        
      case "vehicle_make":
        if (!value.trim()) return "Vehicle make is required";
        if (value.trim().length < 2) return "Vehicle make must be at least 2 characters";
        if (value.trim().length > 50) return "Vehicle make cannot exceed 50 characters";
        return "";
        
      case "vehicle_model":
        if (!value.trim()) return "Vehicle model is required";
        if (value.trim().length < 2) return "Vehicle model must be at least 2 characters";
        if (value.trim().length > 50) return "Vehicle model cannot exceed 50 characters";
        return "";
        
      case "notes":
        // Notes is optional, but validate if provided
        if (value && value.trim()) {
          if (value.trim().length > 500) return "Notes cannot exceed 500 characters";
        }
        return "";
        
      default:
        return "";
    }
  }, [isCreateMode]);

  // Handle change - useCallback
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Always validate format errors while typing (for create mode)
    if (isCreateMode) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [isCreateMode, validateField]);

  // Validate entire form
  const validateForm = useCallback(() => {
    if (!isCreateMode) return true;
    
    const newErrors = {};
    let isValid = true;
    
    Object.keys(form).forEach(key => {
      // Skip in_service checkbox from validation
      if (key === 'in_service') return;
      
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [isCreateMode, form, validateField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isCreateMode) {
      setSubmitted(true);
      if (!validateForm()) {
        // Focus on first error field
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField === 'unit_number' && unitNumberRef.current) unitNumberRef.current.focus();
        else if (firstErrorField === 'vehicle_make' && vehicleMakeRef.current) vehicleMakeRef.current.focus();
        else if (firstErrorField === 'vehicle_model' && vehicleModelRef.current) vehicleModelRef.current.focus();
        else if (firstErrorField === 'notes' && notesRef.current) notesRef.current.focus();
        return;
      }
    } else {
      // For edit mode, use original validation
      if (!e.target.checkValidity()) {
        e.target.reportValidity();
        return;
      }
    }
    
    try {
      // Pass full data (add id only if editing)
      const dataToSave = isEdit ? { ...form, id: unit.id } : form;

      onSave(dataToSave);

      // Success toast
      successToast(
        isEdit
          ? `Ambulance "${form.unit_number}" updated successfully!`
          : `Ambulance "${form.unit_number}" added successfully!`
      );

      // Close modal
      onClose();
    } catch (error) {
      errorToast(
        isEdit ? "Failed to update ambulance" : "Failed to add ambulance"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                    bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70"
      >
        <div
          className="w-[504px] h-[420px] rounded-[19px] bg-gray-100 dark:bg-[#000000] p-6 relative"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {/* Inner gradient border */}
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
          />

          {/* Header */}
          <div className="flex justify-between items-center pb-2 mb-3">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              {unit ? "Edit Unit" : "Add Unit"}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                          bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
          >
            <TextInput
              label="Unit Number"
              name="unit_number"
              required={true}
              placeholder="e.g. AMB-09"
              value={form.unit_number}
              onChange={handleChange}
              error={errors.unit_number}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={unitNumberRef}
            />

            <div>
              <label className="text-black dark:text-white">
                In Service {isCreateMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="checkbox"
                  name="in_service"
                  checked={form.in_service}
                  onChange={handleChange}
                  className="appearance-none w-5 h-5 ml-3 border border-[#0EFF7B] dark:border-white rounded-sm bg-gray-100 dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                />
                <span className="ml-2 text-sm">
                  {form.in_service ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <TextInput
              label="Make"
              name="vehicle_make"
              required={true}
              placeholder="e.g. Ford"
              value={form.vehicle_make}
              onChange={handleChange}
              error={errors.vehicle_make}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={vehicleMakeRef}
            />

            <TextInput
              label="Model"
              name="vehicle_model"
              required={true}
              placeholder="Transit"
              value={form.vehicle_model}
              onChange={handleChange}
              error={errors.vehicle_model}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={vehicleModelRef}
            />

            <TextArea
              label="Notes"
              name="notes"
              placeholder="Any special notes... (Optional)"
              value={form.notes}
              onChange={handleChange}
              error={errors.notes}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={notesRef}
            />

            <div className="col-span-2 flex justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-gray-600
                            text-gray-600 dark:text-white font-medium text-[14px] leading-[16px]
                            shadow-[0_2px_12px_0px_#00000040] bg-gray-100 dark:bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                            bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                            shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px]
                            hover:scale-105 transition"
              >
                {unit ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceUnitsModal;