// src/components/AddAppointmentPopup.jsx
import React, { useState, useEffect } from "react";
import { X,Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast.jsx";

const API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/appointments"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000/appointments"
    : "http://localhost:8000/appointments";

const BED_API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/bedgroups"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000/bedgroups"
    : "http://localhost:8000/bedgroups";

// ── Get tomorrow's date for default (MOVE THIS UP) ────────────────────────────────
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ── Also create a function to get default time ───────────────────────────────────
const getDefaultTime = () => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

export default function AddAppointmentPopup({ onClose, onSuccess }) {
  // Add validation state
  const [validationErrors, setValidationErrors] = useState({}); // Format validation
  const [fieldErrors, setFieldErrors] = useState({}); // Required field validation (submit only)
  const [focusedField, setFocusedField] = useState(null);
  
  // ── Form state (backend keys) ─────────────────────────────────────
  const [formData, setFormData] = useState({
    patient_name: "",
    department_id: "",
    staff_id: "",
    room_no: "", // This should be the bed selection (e.g., "WardA-101")
    phone_no: "",
    appointment_type: "",
    status: "new", // Set default status
    appointment_date: getTomorrowDate(), // ✅ Now this works!
    appointment_time: getDefaultTime(), // Use current time as default
  });

  // ── Dropdown data ───────────────────────────────────────────────────
  const [departments, setDepartments] = useState([]); // [{id, name}]
  const [doctors, setDoctors] = useState([]); // [{id, full_name}]
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Format validation functions (while typing) ───────────────────────
  const validatePatientNameFormat = (value) => {
    if (value.trim() && !/^[A-Za-z\s'-]+$/.test(value)) return "Name should only contain letters, spaces, hyphens, and apostrophes";
    if (value.trim() && value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validatePhoneFormat = (value) => {
    if (value.trim() && !/^\d{10}$/.test(value))
      return "Phone number must be exactly 10 digits";
 
    // Additional validation for invalid patterns
    const invalidPatterns = [
      /^0{10}$/, // All zeros
      /^1{10}$/, // All ones
      /^\d{5}0{5}$/, // Patterns like 1234500000
    ];
 
    if (invalidPatterns.some((pattern) => pattern.test(value))) {
      return "Please enter a valid mobile number";
    }
 
    // Validate for sequential numbers
    if (/^(\d)\1{9}$/.test(value)) {
      return "Please enter a valid mobile number";
    }
 
    return "";
  };

  const validateAppointmentDateTime = () => {
    if (!formData.appointment_date) return "Appointment date is required";
    if (!formData.appointment_time) return "Appointment time is required";
    
    const selectedDate = new Date(`${formData.appointment_date}T${formData.appointment_time}`);
    const now = new Date();
    
    if (selectedDate < now) return "Appointment date and time cannot be in the past";
    return "";
  };

  // ── Required field validation (only for submission) ──────────────────
  const validateRequiredFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.patient_name.trim()) {
      errors.patient_name = "Patient name is required";
      isValid = false;
    }
    
    if (!formData.department_id) {
      errors.department_id = "Department is required";
      isValid = false;
    }
    
    if (!formData.staff_id) {
      errors.staff_id = "Doctor is required";
      isValid = false;
    }
    
    if (!formData.room_no) {
      errors.room_no = "Room/Bed is required";
      isValid = false;
    }
    
    if (!formData.phone_no) {
      errors.phone_no = "Phone number is required";
      isValid = false;
    }
    
    if (!formData.appointment_type) {
      errors.appointment_type = "Appointment type is required";
      isValid = false;
    }
    
    if (!formData.status) {
      errors.status = "Status is required";
      isValid = false;
    }
    
    if (!formData.appointment_date) {
      errors.appointment_date = "Appointment date is required";
      isValid = false;
    }
    
    if (!formData.appointment_time) {
      errors.appointment_time = "Appointment time is required";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  // ── Handle input change with format validation ────────────────────────
  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Capitalize first letter of each word for patient name
    if (field === "patient_name") {
      processedValue = value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear format validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear required field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Perform real-time format validation
    let formatError = "";
    
    switch (field) {
      case "patient_name":
        formatError = validatePatientNameFormat(processedValue);
        break;
      case "phone_no":
        formatError = validatePhoneFormat(processedValue);
        break;
      default:
        break;
    }
    
    if (formatError) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: formatError
      }));
    }
    
    // Clear datetime validation when either date or time changes
    if (field === "appointment_date" || field === "appointment_time") {
      if (validationErrors.appointment_date_time) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.appointment_date_time;
          return newErrors;
        });
      }
    }
  };

  // ── Validate all fields before submission ────────────────────────────
  const validateForm = () => {
    // First check required fields
    const requiredValid = validateRequiredFields();
    
    // Then check format validation
    const formatErrors = {
      patient_name: validatePatientNameFormat(formData.patient_name),
      phone_no: validatePhoneFormat(formData.phone_no),
      appointment_date_time: validateAppointmentDateTime()
    };
    
    // Update validation errors for display
    setValidationErrors(formatErrors);
    
    const formatValid = !Object.values(formatErrors).some(error => error !== "");
    
    return requiredValid && formatValid;
  };

  // ── Load departments (once) ───────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setLoadingDept(true);
    fetch(`${API}/departments`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load departments");
        return r.json();
      })
      .then((data) => {
        if (mounted) setDepartments(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error(e);
        errorToast("Failed to load departments");
      })
      .finally(() => {
        if (mounted) setLoadingDept(false);
      });
    return () => (mounted = false);
  }, []);

  // ── Load available beds ────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setLoadingBeds(true);
    fetch(`${BED_API}/all`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load beds");
        return r.json();
      })
      .then((data) => {
        if (mounted) {
          const beds = data.flatMap((group) =>
            group.beds
              .filter((bed) => !bed.is_occupied)
              .map((bed) => ({
                id: `${group.bedGroup}-${bed.bed_number}`, // 👈 STORE STRING
                name: `${group.bedGroup}-${bed.bed_number}`,
              }))
          );
          setAvailableBeds(beds);
        }
      })
      .catch((e) => {
        console.error(e);
        errorToast("Failed to load beds");
      })
      .finally(() => {
        if (mounted) setLoadingBeds(false);
      });
    return () => (mounted = false);
  }, []);

  // ── Load doctors when department changes ───────────────────────────
  useEffect(() => {
    if (!formData.department_id) {
      setDoctors([]);
      return;
    }
    let mounted = true;
    setLoadingDoc(true);
    fetch(`${API}/staff?department_id=${formData.department_id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load doctors");
        return r.json();
      })
      .then((data) => {
        if (mounted) setDoctors(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error(e);
        errorToast("Failed to load doctors");
      })
      .finally(() => {
        if (mounted) setLoadingDoc(false);
      });
    return () => (mounted = false);
  }, [formData.department_id]);

  // ── Save handler with validation ───────────────────────────────────
  const handleSave = async () => {
    if (!validateForm()) {
      errorToast("Please fix all validation errors before saving");
      return;
    }

    setSaving(true);
    try {
      // Duplicate check
      const duplicateCheck = await fetch(`${API}/check_duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: formData.patient_name.trim(),
          phone_no: formData.phone_no,
          appointment_date: formData.appointment_date,
        }),
      });

      if (duplicateCheck.ok) {
        const duplicateResult = await duplicateCheck.json();
        if (duplicateResult.exists) {
          errorToast("An appointment already exists for this patient with the same phone number and date");
          setSaving(false);
          return;
        }
      }

      // ✅ CORRECTED PAYLOAD - Match backend expectations
      const payload = {
        patient_name: formData.patient_name.trim(),
        department_id: Number(formData.department_id),
        staff_id: Number(formData.staff_id),
        room_no: formData.room_no, // ← Use room_no not bed_id
        phone_no: formData.phone_no,
        appointment_type: formData.appointment_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: formData.status, // ← Include status field
      };

      console.log("Sending payload:", payload);

      const res = await fetch(`${API}/create_appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check for validation errors
      if (res.status === 422) {
        const errorData = await res.json();
        console.error("Validation errors:", errorData);
        
        // Display validation errors from backend
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Handle Pydantic validation errors
            const errors = {};
            errorData.detail.forEach(error => {
              const field = error.loc?.[1] || 'general';
              errors[field] = error.msg;
            });
            setValidationErrors(errors);
            errorToast("Please fix the validation errors");
          } else {
            errorToast(errorData.detail);
          }
        } else {
          errorToast("Validation failed. Please check your inputs.");
        }
        setSaving(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create appointment");
      }

      successToast("Appointment added successfully!");
      onSuccess?.();
      onClose?.();
    } catch (e) {
      errorToast(e.message || "Something went wrong. Please try again.");
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica] overflow-y-auto py-4">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                   bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
                   dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]
                   overflow-visible my-4"
      >
        <div
          className="w-[505px] rounded-[19px] bg-white dark:bg-[#000000]
                     text-black dark:text-white p-6 relative overflow-visible"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {/* Gradient inner border */}
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
          <div className="flex justify-between items-center pb-3 mb-4">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              Add Appointment
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                         bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>
          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Patient Name */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Patient Name <span className="text-red-700">*</span>
              </label>
              <input
                value={formData.patient_name}
                onChange={(e) =>
                  handleInputChange("patient_name", e.target.value)
                }
                onFocus={() => setFocusedField("patient_name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter name"
                className={`w-full h-[32px] mt-1 px-3 rounded-[8px] border bg-white dark:bg-transparent 
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                           text-black dark:text-[#0EFF7B]
                           ${focusedField === "patient_name" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {/* Format validation error - shows while typing */}
              {validationErrors.patient_name && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.patient_name}</span>
                </div>
              )}
              {/* Required field error - only shows after submit attempt */}
              {fieldErrors.patient_name && !validationErrors.patient_name && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.patient_name}</span>
                </div>
              )}
            </div>
            {/* Department */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Department <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.department_id} onChange={(v) => {
                handleInputChange("department_id", v);
                handleInputChange("staff_id", "");
              }}>
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("department")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-white dark:bg-transparent 
                               text-left text-[14px] leading-[16px] flex items-center justify-between group
                               ${focusedField === "department" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className={`block truncate ${formData.department_id ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {loadingDept ? (
                        <span className="text-gray-500">Loading…</span>
                      ) : formData.department_id ? (
                        departments.find((o) => String(o.id) === String(formData.department_id))?.name ||
                        formData.department_id
                      ) : (
                        "Select"
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options
                    className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black
                               shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {departments.map((opt) => {
                      const label = opt.name || String(opt.id);
                      return (
                        <Listbox.Option
                          key={opt.id}
                          value={opt.id}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                             ${
                               active
                                 ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                                 : "text-black dark:text-white"
                             }
                             ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                          }
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          {label}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.department_id && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.department_id}</span>
                </div>
              )}
            </div>
            {/* Doctor */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Doctor <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.staff_id} onChange={(v) => handleInputChange("staff_id", v)}>
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("doctor")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-white dark:bg-transparent 
                               text-left text-[14px] leading-[16px] flex items-center justify-between group
                               ${focusedField === "doctor" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className={`block truncate ${formData.staff_id ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {loadingDoc ? (
                        <span className="text-gray-500">Loading…</span>
                      ) : formData.staff_id ? (
                        doctors.find((o) => String(o.id) === String(formData.staff_id))?.full_name ||
                        formData.staff_id
                      ) : (
                        "Select"
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options
                    className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black
                               shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {doctors.map((opt) => {
                      const label = opt.full_name || String(opt.id);
                      return (
                        <Listbox.Option
                          key={opt.id}
                          value={opt.id}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                             ${
                               active
                                 ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                                 : "text-black dark:text-white"
                             }
                             ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                          }
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          {label}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.staff_id && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.staff_id}</span>
                </div>
              )}
            </div>
            {/* Room / Bed No */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Room / Bed No <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.room_no} onChange={(v) => handleInputChange("room_no", v)}>
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("room")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-white dark:bg-transparent 
                               text-left text-[14px] leading-[16px] flex items-center justify-between group
                               ${focusedField === "room" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className={`block truncate ${formData.room_no ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {loadingBeds ? (
                        <span className="text-gray-500">Loading…</span>
                      ) : formData.room_no ? (
                        availableBeds.find((o) => String(o.id) === String(formData.room_no))?.name ||
                        formData.room_no
                      ) : (
                        "Select"
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options
                    className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black
                               shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {availableBeds.map((opt) => {
                      const label = opt.name || String(opt.id);
                      return (
                        <Listbox.Option
                          key={opt.id}
                          value={opt.id}
                          className={({ active, selected }) =>
                            `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                             ${
                               active
                                 ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                                 : "text-black dark:text-white"
                             }
                             ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                          }
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          {label}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.room_no && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.room_no}</span>
                </div>
              )}
            </div>
            {/* Phone No */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone No <span className="text-red-700">*</span>
              </label>
              <input
                value={formData.phone_no}
                onChange={(e) => {
                  handleInputChange("phone_no", e.target.value);
                }}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter phone no (10 digits)"
                className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border bg-white dark:bg-transparent 
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                           text-black dark:text-[#0EFF7B]
                           ${focusedField === "phone" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {/* Format validation error - shows while typing */}
              {validationErrors.phone_no && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.phone_no}</span>
                </div>
              )}
              {/* Required field error - only shows after submit attempt */}
              {fieldErrors.phone_no && !validationErrors.phone_no && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.phone_no}</span>
                </div>
              )}
            </div>
            {/* Appointment Type */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Appointment Type <span className="text-red-700">*</span>
              </label>
              <Listbox
                value={formData.appointment_type}
                onChange={(v) => handleInputChange("appointment_type", v)}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("appointment")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-white dark:bg-transparent 
                               text-left text-[14px] flex items-center justify-between group
                               ${focusedField === "appointment" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  >
                    <span className={`block truncate ${formData.appointment_type ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {formData.appointment_type === "checkup"
                        ? "Check-up"
                        : formData.appointment_type === "followup"
                        ? "Follow-up"
                        : formData.appointment_type === "emergency"
                        ? "Emergency"
                        : "Select"}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
                    {["checkup", "followup", "emergency"].map((v) => (
                      <Listbox.Option
                        key={v}
                        value={v}
                        className="cursor-pointer py-2 px-2 text-sm"
                      >
                        {v === "checkup" ? "Check-up" : v === "followup" ? "Follow-up" : "Emergency"}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.appointment_type && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.appointment_type}</span>
                </div>
              )}
            </div>
            {/* Status */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Status <span className="text-red-700">*</span>
              </label>
              <Listbox
                value={formData.status}
                onChange={(v) => handleInputChange("status", v)}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("status")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-white dark:bg-transparent 
                               text-left text-[14px] flex items-center justify-between group
                               ${focusedField === "status" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  >
                    <span className={`block truncate ${formData.status ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {formData.status === "new"
                        ? "New"
                        : formData.status === "normal"
                        ? "Normal"
                        : formData.status === "severe"
                        ? "Severe"
                        : "Select"}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
                    {["new", "normal", "severe"].map((v) => (
                      <Listbox.Option
                        key={v}
                        value={v}
                        className="cursor-pointer py-2 px-2 text-sm"
                      >
                        {v === "new" ? "New" : v === "normal" ? "Normal" : "Severe"}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.status && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.status}</span>
                </div>
              )}
            </div>
            {/* Appointment Date */}
            <div>
  <label className="text-sm text-black dark:text-white">
    Appointment Date <span className="text-red-700">*</span>
  </label>

  <div className="relative mt-1">
    <input
      type="date"
      id="appointment_date"
      value={formData.appointment_date}
      onChange={(e) =>
        handleInputChange("appointment_date", e.target.value)
      }
      onFocus={() => setFocusedField("appointment_date")}
      onBlur={() => setFocusedField(null)}
      min={new Date().toISOString().split("T")[0]} // ✅ upcoming dates only
      className={`w-full h-[33px] px-3 pr-10 rounded-[8px] border
                  bg-white dark:bg-transparent outline-none
                  text-black dark:text-[#0EFF7B] cursor-pointer
                  appearance-none
                  [&::-webkit-calendar-picker-indicator]:opacity-0
                  [&::-webkit-calendar-picker-indicator]:hidden
                  ${
                    focusedField === "appointment_date"
                      ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]"
                      : "border-[#0EFF7B] dark:border-[#3A3A3A]"
                  }`}
    />

    {/* Custom calendar icon */}
    <Calendar
      size={18}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] cursor-pointer"
      onClick={() =>
        document.getElementById("appointment_date")?.showPicker()
      }
    />
  </div>

  {fieldErrors.appointment_date && (
    <div className="mt-1">
      <span className="text-red-700 dark:text-red-500 text-xs">
        {fieldErrors.appointment_date}
      </span>
    </div>
  )}
</div>



            {/* Appointment Time */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Appointment Time <span className="text-red-700">*</span>
              </label>
              <input
                type="time"
                value={formData.appointment_time}
                onChange={(e) => handleInputChange("appointment_time", e.target.value)}
                onFocus={() => setFocusedField("appointment_time")}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border bg-white dark:bg-transparent 
                           outline-none text-black dark:text-[#0EFF7B]
                           ${focusedField === "appointment_time" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {fieldErrors.appointment_time && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.appointment_time}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Combined date-time validation error */}
          {validationErrors.appointment_date_time && (
            <div className="mt-2">
              <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.appointment_date_time}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-gray-600
                         text-gray-600 dark:text-white font-medium text-[14px] leading-[16px]
                         shadow-[0_2px_12px_0px_#00000040] bg-white dark:bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || Object.values(validationErrors).some(error => error !== "")}
              className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                         bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                         shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px]
                         hover:scale-105 transition disabled:opacity-70"
            >
              {saving ? "Saving…" : "Add Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}