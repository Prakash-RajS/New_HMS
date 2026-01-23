// EditSurgeryPopup.jsx
import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast.jsx";
import api from "../../utils/axiosConfig";

export default function EditSurgeryPopup({ onClose, surgery, onUpdate }) {
  const parseDateTime = (datetimeStr) => {
    if (!datetimeStr) return { date: "", time: "" };
    
    try {
      const dateObj = new Date(datetimeStr);
      const date = dateObj.toISOString().split('T')[0];
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;
      return { date, time };
    } catch (err) {
      return { date: "", time: "" };
    }
  };

  const { date, time } = parseDateTime(surgery?.scheduled_date || "");

  const [formData, setFormData] = useState({
    id: surgery?.id || "",
    patient_id: surgery?.patient_id || "",
    patient_name: surgery?.patient_name || "",
    doctor_id: surgery?.doctor_id || "",
    doctor_name: surgery?.doctor_name || "",
    surgery_type: surgery?.surgery_type || "",
    description: surgery?.description || "",
    status: surgery?.status || "pending",
    price: surgery?.price || "",
    scheduled_date: date,
    scheduled_time: time,
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Format validation functions
  const validateSurgeryType = (value) => {
    if (value.trim() && !/^[A-Za-z0-9\s\-.,()]+$/.test(value)) 
      return "Surgery type can only contain letters, numbers, spaces, hyphens, commas, periods, and parentheses";
    if (value.trim() && value.trim().length < 2) 
      return "Surgery type must be at least 2 characters";
    return "";
  };

  const validateDateTime = () => {
    if (!formData.scheduled_date) return "Surgery date is required";
    if (!formData.scheduled_time) return "Surgery time is required";
    
    return "";
  };

  const validatePrice = (value) => {
    if (value && !/^\d+(\.\d{1,2})?$/.test(value)) 
      return "Price must be a valid number with up to 2 decimal places";
    if (value && parseFloat(value) <= 0) 
      return "Price must be greater than 0";
    return "";
  };

  // Required field validation
  const validateRequiredFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.patient_id) {
      errors.patient_id = "Patient is required";
      isValid = false;
    }
    
    if (!formData.doctor_id) {
      errors.doctor_id = "Doctor is required";
      isValid = false;
    }
    
    if (!formData.surgery_type.trim()) {
      errors.surgery_type = "Surgery type is required";
      isValid = false;
    }
    
    if (!formData.status) {
      errors.status = "Status is required";
      isValid = false;
    }
    
    if (!formData.scheduled_date) {
      errors.scheduled_date = "Surgery date is required";
      isValid = false;
    }
    
    if (!formData.scheduled_time) {
      errors.scheduled_time = "Surgery time is required";
      isValid = false;
    }
    
    // Validate price if status is completed or failed
    if ((formData.status === "success" || formData.status === "failed") && !formData.price) {
      errors.price = "Price is required for success or failed surgeries";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Capitalize first letter of each word for surgery type
    if (field === "surgery_type") {
      processedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear validation errors
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
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
      case "surgery_type":
        formatError = validateSurgeryType(processedValue);
        break;
      case "price":
        formatError = validatePrice(processedValue);
        break;
      case "scheduled_date":
      case "scheduled_time":
        formatError = validateDateTime();
        if (formatError) {
          setValidationErrors(prev => ({
            ...prev,
            scheduled_date_time: formatError
          }));
        } else {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.scheduled_date_time;
            return newErrors;
          });
        }
        return; // Early return for date/time fields
      default:
        break;
    }
    
    if (formatError) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: formatError
      }));
    }
  };

  // Load patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPatients(true);
      setLoadingDoctors(true);
      
      try {
        // Fetch patients
        const patientsResponse = await api.get("/surgeries/patients");
        setPatients(patientsResponse.data || []);
        
        // Fetch doctors
        const doctorsResponse = await api.get("/surgeries/doctors");
        setDoctors(doctorsResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        errorToast("Failed to load data");
      } finally {
        setLoadingPatients(false);
        setLoadingDoctors(false);
      }
    };
    
    fetchData();
  }, []);

  // Validate form before submission
  const validateForm = () => {
    const requiredValid = validateRequiredFields();
    
    const formatErrors = {
      surgery_type: validateSurgeryType(formData.surgery_type),
      scheduled_date_time: validateDateTime(),
      price: validatePrice(formData.price)
    };
    
    const newValidationErrors = {};
    if (formatErrors.surgery_type) newValidationErrors.surgery_type = formatErrors.surgery_type;
    if (formatErrors.scheduled_date_time) newValidationErrors.scheduled_date_time = formatErrors.scheduled_date_time;
    if (formatErrors.price) newValidationErrors.price = formatErrors.price;
    
    setValidationErrors(prev => ({ ...prev, ...newValidationErrors }));
    
    const formatValid = !Object.values(formatErrors).some(error => error !== "");
    
    return requiredValid && formatValid;
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) {
      errorToast("Please fix all validation errors before saving");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        surgery_type: formData.surgery_type.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        scheduled_date: `${formData.scheduled_date}T${formData.scheduled_time}:00`
      };

      // Add price only if status is completed or failed
      if (formData.status === "success" || formData.status === "failed") {
        payload.price = parseFloat(formData.price);
      }

      const response = await api.put(`/surgeries/${formData.id}`, payload);

      if (response.status === 422) {
        const errorData = response.data;
        console.error("Validation errors:", errorData);
        
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
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

      successToast("Surgery updated successfully!");
      onUpdate?.();
      onClose?.();
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message || "Something went wrong. Please try again.";
      errorToast(errorMessage);
      console.error("Update error:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica] overflow-y-auto py-4">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                   bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
                   dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]
                   overflow-visible my-4"
      >
        <div
          className="w-[805px] rounded-[19px] bg-gray-100 dark:bg-[#000000]
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
              Edit Surgery
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                         bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>
          
          {/* Form Grid - 3x3 layout */}
          <div className="grid grid-cols-3 gap-4">
            {/* Patient Selection - Row 1, Column 1 */}
            <div className="col-span-1">
              <label className="text-sm text-black dark:text-white">
                Patient <span className="text-red-700">*</span>
              </label>
              <Listbox 
                value={formData.patient_id} 
                onChange={(v) => handleInputChange("patient_id", v)}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("patient")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                               text-left text-[14px] leading-[16px] flex items-center justify-between group
                               ${focusedField === "patient" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  >
                    <span className={`block truncate ${formData.patient_id ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {loadingPatients ? (
                        <span className="text-gray-500">Loading…</span>
                      ) : formData.patient_id ? (
                        patients.find((p) => String(p.id) === String(formData.patient_id))?.full_name || 
                        formData.patient_name || 
                        `ID: ${formData.patient_id}`
                      ) : (
                        "Select Patient"
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
                    {patients.map((patient) => (
                      <Listbox.Option
                        key={patient.id}
                        value={patient.id}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                           ${
                             active
                               ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                               : "text-black dark:text-white"
                           }
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {patient.full_name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.patient_id && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.patient_id}</span>
                </div>
              )}
            </div>
            
            {/* Doctor Selection - Row 1, Column 2 */}
            <div className="col-span-1">
              <label className="text-sm text-black dark:text-white">
                Doctor <span className="text-red-700">*</span>
              </label>
              <Listbox 
                value={formData.doctor_id} 
                onChange={(v) => handleInputChange("doctor_id", v)}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    onFocus={() => setFocusedField("doctor")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                               text-left text-[14px] leading-[16px] flex items-center justify-between group
                               ${focusedField === "doctor" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  >
                    <span className={`block truncate ${formData.doctor_id ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {loadingDoctors ? (
                        <span className="text-gray-500">Loading…</span>
                      ) : formData.doctor_id ? (
                        doctors.find((d) => String(d.id) === String(formData.doctor_id))?.full_name || 
                        formData.doctor_name || 
                        `ID: ${formData.doctor_id}`
                      ) : (
                        "Select Doctor"
                      )}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
                    {doctors.map((doctor) => (
                      <Listbox.Option
                        key={doctor.id}
                        value={doctor.id}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                           ${
                             active
                               ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                               : "text-black dark:text-white"
                           }
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {doctor.full_name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.doctor_id && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.doctor_id}</span>
                </div>
              )}
            </div>
            
            {/* Surgery Type - Row 1, Column 3 */}
            <div className="col-span-1">
              <label className="text-sm text-black dark:text-white">
                Surgery Type <span className="text-red-700">*</span>
              </label>
              <input
                value={formData.surgery_type}
                onChange={(e) => handleInputChange("surgery_type", e.target.value)}
                onFocus={() => setFocusedField("surgery_type")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter surgery type"
                className={`w-full h-[32px] mt-1 px-3 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                           text-black dark:text-[#0EFF7B]
                           ${focusedField === "surgery_type" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {validationErrors.surgery_type && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.surgery_type}</span>
                </div>
              )}
              {fieldErrors.surgery_type && !validationErrors.surgery_type && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.surgery_type}</span>
                </div>
              )}
            </div>
            
            {/* Status - Row 2, Column 1 */}
            <div className="col-span-1">
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
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                               text-left text-[14px] flex items-center justify-between group
                               ${focusedField === "status" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  >
                    <span className={`block truncate ${formData.status ? "text-black dark:text-[#0EFF7B]" : "text-[#0EFF7B] dark:text-[#0EFF7B]"}`}>
                      {formData.status === "pending" ? "Pending" : 
                       formData.status === "success" ? "Success" : 
                       formData.status === "cancelled" ? "Cancelled" : 
                       formData.status === "failed" ? "Failed" : formData.status}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]">
                    {["pending", "success", "cancelled", "failed"].map((v) => (
                      <Listbox.Option
                        key={v}
                        value={v}
                        className="cursor-pointer py-2 px-2 text-sm"
                      >
                        {v === "pending" ? "Pending" : 
                         v === "success" ? "Success" : 
                         v === "cancelled" ? "Cancelled" : 
                         "Failed"}
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
            
            {/* Surgery Date - Row 2, Column 2 */}
            <div className="col-span-1">
              <label className="text-sm text-black dark:text-white">
                Surgery Date <span className="text-red-700">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => handleInputChange("scheduled_date", e.target.value)}
                  onFocus={() => setFocusedField("scheduled_date")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-[33px] px-3 pr-10 rounded-[8px] border
                            bg-gray-100 dark:bg-transparent outline-none
                            text-black dark:text-[#0EFF7B] cursor-pointer
                            appearance-none
                            [&::-webkit-calendar-picker-indicator]:opacity-0
                            [&::-webkit-calendar-picker-indicator]:hidden
                            ${focusedField === "scheduled_date"
                              ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]"
                              : "border-[#0EFF7B] dark:border-[#3A3A3A]"
                            }`}
                />
                <Calendar
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] cursor-pointer"
                  onClick={() => {
                    const input = document.querySelector('input[type="date"]');
                    if (input) input.showPicker();
                  }}
                />
              </div>
              {fieldErrors.scheduled_date && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.scheduled_date}</span>
                </div>
              )}
            </div>
            
            {/* Surgery Time - Row 2, Column 3 */}
            <div className="col-span-1">
              <label className="text-sm text-black dark:text-white">
                Surgery Time <span className="text-red-700">*</span>
              </label>
              <input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange("scheduled_time", e.target.value)}
                onFocus={() => setFocusedField("scheduled_time")}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                           outline-none text-black dark:text-[#0EFF7B]
                           ${focusedField === "scheduled_time" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {fieldErrors.scheduled_time && (
                <div className="mt-1">
                  <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.scheduled_time}</span>
                </div>
              )}
            </div>
            
            {/* Price Field - Row 3, Column 1 (only when status is success or failed) */}
            {(formData.status === "success" || formData.status === "failed") ? (
              <div className="col-span-1">
                <label className="text-sm text-black dark:text-white">
                  Price <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-[#0EFF7B]">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter price"
                    className={`w-full h-[32px] mt-1 pl-8 pr-3 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                               placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                               text-black dark:text-[#0EFF7B]
                               ${focusedField === "price" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
                  />
                </div>
                {validationErrors.price && (
                  <div className="mt-1">
                    <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.price}</span>
                  </div>
                )}
                {fieldErrors.price && !validationErrors.price && (
                  <div className="mt-1">
                    <span className="text-red-700 dark:text-red-500 text-xs">{fieldErrors.price}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-span-1"></div> // Empty placeholder when price is not shown
            )}
            
            {/* Description - Row 3, Column 2 & 3 (spans 2 columns) */}
            <div className="col-span-2">
              <label className="text-sm text-black dark:text-white">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter surgery description"
                rows="3"
                className={`w-full mt-1 px-3 py-2 rounded-[8px] border bg-gray-100 dark:bg-transparent 
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                           text-black dark:text-[#0EFF7B] resize-none
                           ${focusedField === "description" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
            </div>
          </div>
          
          {/* Combined date-time validation error */}
          {validationErrors.scheduled_date_time && (
            <div className="mt-2">
              <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.scheduled_date_time}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-gray-600
                         text-gray-600 dark:text-white font-medium text-[14px] leading-[16px]
                         shadow-[0_2px_12px_0px_#00000040] bg-gray-100 dark:bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving || Object.values(validationErrors).some(error => error !== "")}
              className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                         bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                         shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px]
                         hover:scale-105 transition disabled:opacity-70"
            >
              {saving ? "Updating…" : "Update Surgery"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}