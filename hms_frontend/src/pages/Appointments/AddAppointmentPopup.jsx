// src/components/AddAppointmentPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown, Clock, AlertCircle, User, Phone, Tag, Activity } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast.jsx";
import api from "../../utils/axiosConfig";
import { usePermissions } from "../../components/PermissionContext";

// ── Helpers ──────────────────────────────────────────────────────
const getTodayDate = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

const getDefaultTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
};

// Convert YYYY-MM-DD → Date object for react-datepicker
const parseDateForPicker = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

// Convert Date object → YYYY-MM-DD string for form state / backend
const formatDateForState = (date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// ---------- Date Field - Exactly same as NewRegistration ----------
const DateField = ({
  label,
  value,
  onChange,
  required = false,
  error = null,
  onFocus = () => {},
  onBlur = () => {},
  minDate = null,
}) => {
  const datePickerRef = useRef(null);

  // Parse the date value (expects YYYY-MM-DD format)
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(year, month - 1, day);
  };

  const selectedDate = parseDate(value);

  const handleDateChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <DatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          onFocus={onFocus}
          onBlur={onBlur}
          dateFormat="MM/dd/yyyy"
          placeholderText="MM/DD/YYYY"
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          minDate={minDate}
          className="w-full h-[33px] px-3 rounded-[8px] border-2 border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm focus:ring-2 focus:ring-[#0EFF7B]"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Calendar size={18} className="text-[#0EFF7B]" />
        </div>
      </div>
      
      {error && (
        <div className="mt-1 flex items-center gap-1">
          <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-400 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

// ---------- Time Field - With hidden scrollbar ----------
const TimeField = ({
  label,
  value,
  onChange,
  required = false,
  error = null,
  onFocus = () => {},
  onBlur = () => {},
  dateValue = null,
}) => {
  const timePickerRef = useRef(null);

  // Convert time string to Date object for react-datepicker
  const parseTimeForPicker = () => {
    if (!dateValue || !value) return null;
    return new Date(`${dateValue}T${value}`);
  };

  const selectedTime = parseTimeForPicker();

  const handleTimeChange = (time) => {
    if (time) {
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    } else {
      onChange("");
    }
  };

  // Custom styles to hide scrollbar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .react-datepicker__time-box {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .react-datepicker__time-box::-webkit-scrollbar {
        display: none !important;
      }
      .react-datepicker__time-list {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .react-datepicker__time-list::-webkit-scrollbar {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <DatePicker
          ref={timePickerRef}
          selected={selectedTime}
          onChange={handleTimeChange}
          onFocus={onFocus}
          onBlur={onBlur}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText="Select time"
          className="w-full h-[33px] px-3 rounded-[8px] border-2 border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm focus:ring-2 focus:ring-[#0EFF7B]"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Clock size={18} className="text-[#0EFF7B]" />
        </div>
      </div>
      
      {error && (
        <div className="mt-1 flex items-center gap-1">
          <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-400 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
export default function AddAppointmentPopup({ onClose, onSuccess, isEditMode = false, appointmentData = null }) {
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const { isAdmin, currentUser } = usePermissions();
  const userRole = currentUser?.role?.toLowerCase();
  const canAddAppointment = isAdmin || userRole === "receptionist";
  const canEditAppointment = isAdmin || userRole === "receptionist";

  const [formData, setFormData] = useState({
    patient_name: "",
    department_id: "",
    staff_id: "",
    phone_no: "",
    appointment_type: "",
    status: "new",
    appointment_date: getTodayDate(),
    appointment_time: getDefaultTime(),
  });

  useEffect(() => {
    if (isEditMode && appointmentData) {
      setFormData({
        patient_name: appointmentData.patient_name || "",
        department_id: appointmentData.department_id?.toString() || "",
        staff_id: appointmentData.staff_id?.toString() || "",
        phone_no: appointmentData.phone_no || "",
        appointment_type: appointmentData.appointment_type || "",
        status: appointmentData.status || "new",
        appointment_date: appointmentData.appointment_date || getTodayDate(),
        appointment_time: appointmentData.appointment_time || getDefaultTime(),
      });
      setValidationErrors({});
      setFieldErrors({});
    }
  }, [isEditMode, appointmentData]);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Validators ──────────────────────────────────────────────────
  const validatePatientNameFormat = (v) => {
    if (v.trim() && !/^[A-Za-z\s'-]+$/.test(v)) return "Name should only contain letters, spaces, hyphens, and apostrophes";
    if (v.trim() && v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };
  
  const validatePhoneFormat = (v) => {
    if (v.trim() && !/^\d{10}$/.test(v)) return "Phone number must be exactly 10 digits";
    if ([/^0{10}$/, /^1{10}$/, /^\d{5}0{5}$/].some(p => p.test(v))) return "Please enter a valid mobile number";
    if (/^(\d)\1{9}$/.test(v)) return "Please enter a valid mobile number";
    return "";
  };
  
  const validateTimeFormat = (v) => {
    if (!v) return "Appointment time is required";
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(v)) return "Please enter a valid time in HH:MM format";
    return "";
  };
  
  const validateAppointmentDateTime = (date, time, editMode = false) => {
    if (!date) return "Appointment date is required";
    if (!time) return "Appointment time is required";
    const apptMin = Math.floor(new Date(`${date}T${time}:00`).getTime() / 60000) * 60000;
    const nowMin = Math.floor(new Date().getTime() / 60000) * 60000;
    if (!editMode && apptMin < nowMin) return "Appointment date and time cannot be in the past";
    return "";
  };
  
  const validateRequiredFields = () => {
    const e = {};
    if (!formData.patient_name.trim()) e.patient_name = "Patient name is required";
    if (!formData.department_id) e.department_id = "Department is required";
    if (!formData.staff_id) e.staff_id = "Doctor is required";
    if (!formData.phone_no) e.phone_no = "Phone number is required";
    if (!formData.appointment_type) e.appointment_type = "Appointment type is required";
    if (!formData.status) e.status = "Status is required";
    if (!formData.appointment_date) e.appointment_date = "Appointment date is required";
    if (!formData.appointment_time) e.appointment_time = "Appointment time is required";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (field, value) => {
    let v = value;
    if (field === "patient_name") {
      v = value.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    setFormData(prev => ({ ...prev, [field]: v }));
    
    // Clear errors
    if (validationErrors[field]) setValidationErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    if (fieldErrors[field]) setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    
    // Real-time validation
    let fmt = "";
    if (field === "patient_name") fmt = validatePatientNameFormat(v);
    if (field === "phone_no") fmt = validatePhoneFormat(v);
    if (field === "appointment_time") fmt = validateTimeFormat(v);
    if (fmt) setValidationErrors(prev => ({ ...prev, [field]: fmt }));
    
    // Clear date-time combined error when either field changes
    if (field === "appointment_date" || field === "appointment_time") {
      setValidationErrors(prev => { const n = { ...prev }; delete n.appointment_date_time; return n; });
    }
  };

  const validateForm = () => {
    const reqOk = validateRequiredFields();
    const fmtErrs = {
      patient_name: validatePatientNameFormat(formData.patient_name),
      phone_no: validatePhoneFormat(formData.phone_no),
      appointment_time: validateTimeFormat(formData.appointment_time),
      appointment_date_time: validateAppointmentDateTime(formData.appointment_date, formData.appointment_time, isEditMode),
    };
    const filtered = Object.fromEntries(Object.entries(fmtErrs).filter(([, v]) => v !== ""));
    setValidationErrors(filtered);
    return reqOk && Object.keys(filtered).length === 0;
  };

  useEffect(() => {
    let mounted = true;
    setLoadingDept(true);
    api.get("/appointments/departments")
      .then(r => { if (mounted) setDepartments(Array.isArray(r.data) ? r.data : []); })
      .catch(() => errorToast("Failed to load departments"))
      .finally(() => { if (mounted) setLoadingDept(false); });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (!formData.department_id) { setDoctors([]); return; }
    let mounted = true;
    setLoadingDoc(true);
    api.get(`/appointments/staff?department_id=${formData.department_id}`)
      .then(r => { if (mounted) setDoctors(Array.isArray(r.data) ? r.data : []); })
      .catch(() => errorToast("Failed to load doctors"))
      .finally(() => { if (mounted) setLoadingDoc(false); });
    return () => (mounted = false);
  }, [formData.department_id]);

  const handleSave = async () => {
    if (isEditMode ? !canEditAppointment : !canAddAppointment) {
      errorToast("You don't have permission to add/edit appointments"); 
      return;
    }
    
    if (!validateForm()) {
      errorToast("Please fix all validation errors before saving"); 
      return;
    }
    
    setSaving(true);
    try {
      if (!isEditMode) {
        try {
          const nm = formData.patient_name.trim().toLowerCase();
          const ph = formData.phone_no;
          let all = [];
          try { const r = await api.get("/appointments/list_appointments"); all = r.data || []; } catch {}
          if (all.length > 0) {
            const exactDup = all.some(a =>
              (a.patient_name || "").trim().toLowerCase() === nm && (a.phone_no || "") === ph &&
              (a.appointment_date || "") === formData.appointment_date && (a.appointment_time || "") === formData.appointment_time
            );
            if (exactDup) { 
              errorToast("❌ Cannot create appointment: An exact duplicate already exists"); 
              setSaving(false); 
              return; 
            }
            const sameDay = all.filter(a =>
              (a.patient_name || "").trim().toLowerCase() === nm && (a.phone_no || "") === ph &&
              (a.appointment_date || "") === formData.appointment_date
            );
            if (sameDay.length > 0) {
              errorToast(`❌ Patient already has ${sameDay.length} appointment(s) today at ${sameDay.map(a => a.appointment_time || "Unknown").join(", ")}`);
              setSaving(false); 
              return;
            }
            const any = all.filter(a => (a.patient_name || "").trim().toLowerCase() === nm && (a.phone_no || "") === ph);
            if (any.length > 0) errorToast(`ℹ️ Note: This patient has ${any.length} previous appointment(s)`);
          }
        } catch {}
      }
      
      const payload = {
        patient_name: formData.patient_name.trim(),
        department_id: Number(formData.department_id),
        staff_id: Number(formData.staff_id),
        phone_no: formData.phone_no,
        appointment_type: formData.appointment_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: formData.status,
      };
      
      if (isEditMode && appointmentData?.id) {
        await api.put(`/appointments/${appointmentData.id}`, payload);
        successToast("✅ Appointment updated successfully!");
      } else {
        await api.post("/appointments/create_appointment", payload);
        successToast("✅ Appointment added successfully!");
      }
      onSuccess?.(); 
      onClose?.();
    } catch (error) {
      if (error.response?.status === 409) { 
        errorToast(error.response?.data?.detail || "❌ Duplicate appointment"); 
        return; 
      }
      if (error.response?.status === 422) {
        const d = error.response.data;
        if (d?.detail) {
          if (Array.isArray(d.detail)) {
            const errs = {};
            d.detail.forEach(e => { errs[e.loc?.[1] || "general"] = e.msg; });
            setValidationErrors(errs); 
            errorToast("❌ Please fix the validation errors");
          } else errorToast("❌ " + d.detail);
        } else errorToast("❌ Validation failed. Please check your inputs.");
      } else if (error.response?.status === 404) {
        errorToast("❌ Doctor or Department not found");
      } else {
        errorToast("❌ " + (error.response?.data?.detail || error.message || "Failed to save appointment"));
      }
    } finally { 
      setSaving(false); 
    }
  };

  const todayDate = new Date();
  const hasValidationErrors = Object.values(validationErrors).some(e => e !== "");
  const noPermission = isEditMode ? !canEditAppointment : !canAddAppointment;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica] overflow-y-auto py-4">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                      bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
                      dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]
                      overflow-visible my-4">
        <div className="w-[805px] rounded-[19px] bg-gray-100 dark:bg-[#000000] text-black dark:text-white p-6 relative overflow-visible"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>

          <div style={{
            position: "absolute", inset: 0, borderRadius: "20px", padding: "2px",
            background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none", zIndex: 0,
          }} />

          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              {isEditMode ? "Edit Appointment" : "Add Appointment"}
            </h3>
            <button onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center
                         hover:scale-105 transition-transform">
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-3 gap-6">

            {/* Patient Name */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Patient Name <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0EFF7B]" />
                <input 
                  value={formData.patient_name}
                  onChange={e => handleInputChange("patient_name", e.target.value)}
                  onFocus={() => setFocusedField("patient_name")} 
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter name"
                  className={`w-full h-[33px] pl-10 pr-3 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent
                             placeholder-gray-400 dark:placeholder-gray-500 outline-none text-[#08994A] dark:text-[#0EFF7B] text-sm
                             ${focusedField === "patient_name" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                               validationErrors.patient_name || fieldErrors.patient_name ? "border-red-500 ring-1 ring-red-500" :
                               "border-[#0EFF7B] dark:border-[#3A3A3A]"}`} />
              </div>
              {(validationErrors.patient_name || fieldErrors.patient_name) && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">
                    {validationErrors.patient_name || fieldErrors.patient_name}
                  </span>
                </div>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Department <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.department_id} onChange={v => { handleInputChange("department_id", v); handleInputChange("staff_id", ""); }}>
                <div className="relative">
                  <Listbox.Button 
                    onFocus={() => setFocusedField("department")} 
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] pl-10 pr-8 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent text-left text-[14px] leading-[16px] flex items-center justify-between
                                ${focusedField === "department" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                                  fieldErrors.department_id ? "border-red-500 ring-1 ring-red-500" :
                                  "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Tag size={16} className="text-[#0EFF7B]" />
                    </div>
                    <span className={`block truncate ml-2 ${formData.department_id ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-400 dark:text-gray-500"}`}>
                      {loadingDept ? "Loading…" : formData.department_id ? departments.find(o => String(o.id) === String(formData.department_id))?.name || formData.department_id : "Select Department"}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {departments.map(opt => (
                      <Listbox.Option key={opt.id} value={opt.id}
                        className={({ active, selected }) => 
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                           ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"} 
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`}>
                        {opt.name || String(opt.id)}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.department_id && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{fieldErrors.department_id}</span>
                </div>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Doctor <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.staff_id} onChange={v => handleInputChange("staff_id", v)}>
                <div className="relative">
                  <Listbox.Button 
                    onFocus={() => setFocusedField("doctor")} 
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] pl-10 pr-8 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent text-left text-[14px] leading-[16px] flex items-center justify-between
                                ${focusedField === "doctor" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                                  fieldErrors.staff_id ? "border-red-500 ring-1 ring-red-500" :
                                  "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Activity size={16} className="text-[#0EFF7B]" />
                    </div>
                    <span className={`block truncate ml-2 ${formData.staff_id ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-400 dark:text-gray-500"}`}>
                      {loadingDoc ? "Loading…" : formData.staff_id ? doctors.find(o => String(o.id) === String(formData.staff_id))?.full_name || formData.staff_id : "Select Doctor"}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {doctors.map(opt => (
                      <Listbox.Option key={opt.id} value={opt.id}
                        className={({ active, selected }) => 
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                           ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"} 
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`}>
                        {opt.full_name ? `${opt.full_name} - Doctor` : String(opt.id)}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.staff_id && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{fieldErrors.staff_id}</span>
                </div>
              )}
            </div>

            {/* Phone No */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Phone No <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0EFF7B]" />
                <input 
                  value={formData.phone_no}
                  onChange={e => handleInputChange("phone_no", e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onFocus={() => setFocusedField("phone")} 
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter phone no (10 digits)"
                  maxLength="10"
                  className={`w-full h-[33px] pl-10 pr-3 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent
                             placeholder-gray-400 dark:placeholder-gray-500 outline-none text-[#08994A] dark:text-[#0EFF7B] text-sm
                             ${focusedField === "phone" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                               validationErrors.phone_no || fieldErrors.phone_no ? "border-red-500 ring-1 ring-red-500" :
                               "border-[#0EFF7B] dark:border-[#3A3A3A]"}`} />
              </div>
              {(validationErrors.phone_no || fieldErrors.phone_no) && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">
                    {validationErrors.phone_no || fieldErrors.phone_no}
                  </span>
                </div>
              )}
            </div>

            {/* Appointment Type */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Appointment Type <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.appointment_type} onChange={v => handleInputChange("appointment_type", v)}>
                <div className="relative">
                  <Listbox.Button 
                    onFocus={() => setFocusedField("appointment")} 
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent text-left text-[14px] flex items-center justify-between
                                ${focusedField === "appointment" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                                  fieldErrors.appointment_type ? "border-red-500 ring-1 ring-red-500" :
                                  "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}>
                    <span className={`block truncate ${formData.appointment_type ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-400 dark:text-gray-500"}`}>
                      {formData.appointment_type === "checkup" ? "Check-up" : 
                       formData.appointment_type === "followup" ? "Follow-up" : 
                       formData.appointment_type === "emergency" ? "Emergency" : "Select Type"}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {["checkup", "followup", "emergency"].map(v => (
                      <Listbox.Option key={v} value={v}
                        className={({ active, selected }) => 
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                           ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"} 
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`}>
                        {v === "checkup" ? "Check-up" : v === "followup" ? "Follow-up" : "Emergency"}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.appointment_type && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{fieldErrors.appointment_type}</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Status <span className="text-red-700">*</span>
              </label>
              <Listbox value={formData.status} onChange={v => handleInputChange("status", v)}>
                <div className="relative">
                  <Listbox.Button 
                    onFocus={() => setFocusedField("status")} 
                    onBlur={() => setFocusedField(null)}
                    className={`w-full h-[33px] px-3 pr-8 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent text-left text-[14px] flex items-center justify-between
                                ${focusedField === "status" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                                  fieldErrors.status ? "border-red-500 ring-1 ring-red-500" :
                                  "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}>
                    <span className={`block truncate ${formData.status ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-400 dark:text-gray-500"}`}>
                      {formData.status === "new" ? "New" : 
                       formData.status === "normal" ? "Normal" : 
                       formData.status === "severe" ? "Severe" : 
                       formData.status === "completed" ? "Completed" :
                       formData.status === "cancelled" ? "Cancelled" :
                       formData.status}
                    </span>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-0.5 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {["new", "normal", "severe", "completed", "cancelled"].map(v => (
                      <Listbox.Option key={v} value={v}
                        className={({ active, selected }) => 
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                           ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"} 
                           ${selected ? "font-medium text-[#0EFF7B]" : ""}`}>
                        {v === "new" ? "New" : v === "normal" ? "Normal" : v === "severe" ? "Severe" : v === "completed" ? "Completed" : "Cancelled"}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {fieldErrors.status && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{fieldErrors.status}</span>
                </div>
              )}
            </div>

            {/* Appointment Date - EXACT same as NewRegistration */}
            <DateField
              label="Appointment Date"
              value={formData.appointment_date}
              onChange={(date) => handleInputChange("appointment_date", date)}
              required
              minDate={isEditMode ? null : todayDate}
              onFocus={() => setFocusedField("appointment_date")}
              onBlur={() => setFocusedField(null)}
              error={fieldErrors.appointment_date}
            />

            {/* Appointment Time - With hidden scrollbar */}
            <TimeField
              label="Appointment Time"
              value={formData.appointment_time}
              onChange={(time) => handleInputChange("appointment_time", time)}
              required
              dateValue={formData.appointment_date}
              onFocus={() => setFocusedField("appointment_time")}
              onBlur={() => setFocusedField(null)}
              error={validationErrors.appointment_time || fieldErrors.appointment_time}
            />

          </div>

          {/* Combined date-time error */}
          {validationErrors.appointment_date_time && (
            <div className="mt-2 flex items-center gap-1">
              <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.appointment_date_time}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-[#3A3A3A] text-gray-800 dark:text-white font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] bg-gray-100 dark:bg-transparent
                         hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <div className="relative group">
              <button 
                onClick={handleSave}
                disabled={saving || hasValidationErrors || noPermission}
                className={`w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                            bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                            shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] transition
                            ${noPermission || saving || hasValidationErrors ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving…
                  </span>
                ) : isEditMode ? "Update" : "Add Appointment"}
              </button>
              {noPermission && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none">
                  {isEditMode ? "Access Denied - Cannot Edit" : "Access Denied - Admin/Receptionist Only"}
                </span>
              )}
              {!noPermission && hasValidationErrors && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none">
                  Fix validation errors first
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}