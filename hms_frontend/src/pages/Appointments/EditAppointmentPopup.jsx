// src/components/EditAppointmentPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown, Clock, AlertCircle, User, Phone, Tag, Activity } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast.jsx";
import api from "../../utils/axiosConfig";
import { usePermissions } from "../../components/PermissionContext";

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
      
      <div className="relative w-[228px]">
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
          className="w-full h-[33px] px-3 rounded-[8px] border-2 border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm focus:ring-1 focus:ring-[#0EFF7B]"
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
      
      <div className="relative w-[228px]">
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
          className="w-full h-[33px] px-3 rounded-[8px] border-2 border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm focus:ring-1 focus:ring-[#0EFF7B]"
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

// ── Date helpers ───────────────────────────────────────────────
const parseDateForPicker = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const formatDateForState = (date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// ── Main Component ────────────────────────────────────────────────
export default function EditAppointmentPopup({ onClose, appointment, onUpdate }) {
  const parseTimeFromAppointment = (appt) => {
    let appointmentDate = appt.appointment_date || "";
    let appointmentTime = appt.appointment_time || "";
    if (appt.appointment_time) {
      try {
        const parts = appt.appointment_time.split(":");
        if (parts.length >= 2) appointmentTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
      } catch { appointmentTime = ""; }
    }
    return { appointmentDate, appointmentTime };
  };

  const { appointmentDate, appointmentTime } = parseTimeFromAppointment(appointment);

  const [formData, setFormData] = useState({
    id: appointment.id,
    patient_name: appointment.patient_name || "",
    patient_id: appointment.patient_id || "",
    department_id: appointment.department_id || "",
    staff_id: appointment.staff_id || "",
    phone_no: appointment.phone_no || "",
    appointment_type: appointment.appointment_type || "checkup",
    status: appointment.status || "new",
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    department_name: appointment.department_name || "",
    staff_name: appointment.staff_name || "",
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const { isAdmin, currentUser } = usePermissions();
  const userRole = currentUser?.role?.toLowerCase();
  const canEditAppointment = isAdmin || userRole === "receptionist";

  const validatePatientNameFormat = (v) => {
    if (!v.trim()) return "Patient name is required";
    if (!/^[A-Za-z\s'-]+$/.test(v)) return "Name should only contain letters, spaces, hyphens, and apostrophes";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };
  
  const validatePhoneFormat = (v) => {
    if (!v.trim()) return "Phone number is required";
    if (!/^\d{10}$/.test(v)) return "Phone number must be exactly 10 digits";
    if ([/^0{10}$/, /^1{10}$/, /^\d{5}0{5}$/].some(p => p.test(v))) return "Please enter a valid mobile number";
    if (/^(\d)\1{9}$/.test(v)) return "Please enter a valid mobile number";
    return "";
  };
  
  const validateAppointmentDate = (d) => (!d ? "Appointment date is required" : "");
  
  const validateAppointmentTime = (t) => {
    if (!t) return "Appointment time is required";
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t)) return "Please enter a valid time format (HH:MM)";
    return "";
  };

  const handleInputChange = (field, value) => {
    let v = value;
    if (field === "patient_name") {
      v = value.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    setFormData(prev => ({ ...prev, [field]: v }));
    
    // Clear errors
    if (validationErrors[field]) setValidationErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    
    // Real-time validation
    let fmt = "";
    if (field === "patient_name") fmt = validatePatientNameFormat(v);
    if (field === "phone_no") fmt = validatePhoneFormat(v);
    if (field === "appointment_date") fmt = validateAppointmentDate(v);
    if (field === "appointment_time") fmt = validateAppointmentTime(v);
    if (fmt) setValidationErrors(prev => ({ ...prev, [field]: fmt }));
    
    // Clear date-time combined error when either field changes
    if (field === "appointment_date" || field === "appointment_time") {
      setValidationErrors(prev => { const n = { ...prev }; delete n.appointment_date_time; return n; });
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoadingDept(true);
    api.get("/appointments/departments")
      .then(r => { if (mounted) setDepartments(Array.isArray(r.data) ? r.data : []); })
      .catch(e => console.error(e))
      .finally(() => { if (mounted) setLoadingDept(false); });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (departments.length > 0 && formData.department_name && !formData.department_id) {
      const match = departments.find(d => d.name === formData.department_name);
      if (match) setFormData(prev => ({ ...prev, department_id: match.id, department_name: "" }));
    }
  }, [departments, formData.department_name, formData.department_id]);

  useEffect(() => {
    if (!formData.department_id) { setDoctors([]); return; }
    let mounted = true;
    setLoadingDoc(true);
    api.get(`/appointments/staff?department_id=${formData.department_id}`)
      .then(r => { if (mounted) setDoctors(Array.isArray(r.data) ? r.data : []); })
      .catch(e => console.error(e))
      .finally(() => { if (mounted) setLoadingDoc(false); });
    return () => (mounted = false);
  }, [formData.department_id]);

  useEffect(() => {
    if (doctors.length > 0 && formData.staff_name && !formData.staff_id) {
      const match = doctors.find(s => s.full_name === formData.staff_name);
      if (match) setFormData(prev => ({ ...prev, staff_id: match.id, staff_name: "" }));
    }
  }, [doctors, formData.staff_name, formData.staff_id]);

  const Dropdown = ({ label, value, onChange, options, placeholder, loading, isObject = false, required = false, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white block mb-1">
        {label} {required && <span className="text-red-700">*</span>}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-[228px]">
          <Listbox.Button 
            onFocus={() => setFocusedField(label.toLowerCase())}
            onBlur={() => setFocusedField(null)}
            className={`w-full h-[33px] pl-10 pr-8 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] flex items-center justify-between
                        ${focusedField === label.toLowerCase() ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                          error ? "border-red-500 ring-1 ring-red-500" :
                          "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {label === "Department" ? <Tag size={16} className="text-[#0EFF7B]" /> : 
               label === "Doctor" ? <Activity size={16} className="text-[#0EFF7B]" /> : 
               <Tag size={16} className="text-[#0EFF7B]" />}
            </div>
            <span className={`block truncate ml-2 ${value ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-gray-400 dark:text-gray-500"}`}>
              {loading ? <span className="text-gray-500">Loading…</span>
                : value ? (isObject ? options.find(o => String(o.id) === String(value))?.name || options.find(o => String(o.id) === String(value))?.full_name || value : value)
                : placeholder}
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          {error && (
            <div className="mt-1 flex items-center gap-1">
              <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-400 text-xs">{error}</span>
            </div>
          )}
          <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
            {options.map(opt => {
              const lbl = isObject ? (opt.full_name ? `${opt.full_name} - Doctor` : opt.name || String(opt.id)) : opt;
              const val = isObject ? opt.id : opt;
              return (
                <Listbox.Option key={val} value={val}
                  className={({ active, selected }) => 
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                     ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"} 
                     ${selected ? "font-medium text-[#0EFF7B]" : ""}`}>
                  {lbl}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  const handleUpdate = async () => {
    if (!canEditAppointment) { 
      errorToast("You don't have permission to edit appointments"); 
      return; 
    }
    
    setValidationErrors({});
    const errs = {};
    
    // Required field validation
    if (!formData.patient_name.trim()) errs.patient_name = "Patient name is required";
    if (!formData.department_id) errs.department_id = "Department is required";
    if (!formData.staff_id) errs.staff_id = "Doctor is required";
    if (!formData.phone_no) errs.phone_no = "Phone number is required";
    if (!formData.appointment_type) errs.appointment_type = "Appointment type is required";
    if (!formData.status) errs.status = "Status is required";
    
    // Format validation
    const dateErr = validateAppointmentDate(formData.appointment_date);
    if (dateErr) errs.appointment_date = dateErr;
    
    const timeErr = validateAppointmentTime(formData.appointment_time);  
    if (timeErr) errs.appointment_time = timeErr;
    
    const nameErr = validatePatientNameFormat(formData.patient_name);
    if (nameErr) errs.patient_name = nameErr;
    
    const phoneErr = validatePhoneFormat(formData.phone_no);
    if (phoneErr) errs.phone_no = phoneErr;
    
    if (Object.keys(errs).length > 0) { 
      setValidationErrors(errs); 
      errorToast("Please fix validation errors"); 
      return; 
    }

    setSaving(true);
    try {
      const formatTime = (t) => { 
        if (!t) return ""; 
        const [h, m] = t.split(":"); 
        return `${h}:${m}:00`; 
      };
      
      const payload = {
        patient_name: formData.patient_name,
        department_id: Number(formData.department_id),
        staff_id: Number(formData.staff_id),
        phone_no: formData.phone_no || "",
        appointment_type: formData.appointment_type,
        status: formData.status,
        appointment_date: formData.appointment_date,
        appointment_time: formatTime(formData.appointment_time),
      };
      
      const response = await api.put(`/appointments/${formData.id}`, payload);
      successToast("Appointment updated successfully!");
      onUpdate?.(response.data);
      onClose?.();
    } catch (error) {
      if (error.response?.status === 422) {
        const d = error.response.data;
        if (d?.detail) {
          if (Array.isArray(d.detail)) {
            const e2 = {};
            d.detail.forEach(e => { e2[e.loc?.[1] || "general"] = e.msg; });
            setValidationErrors(e2); 
            errorToast("Please fix the validation errors");
          } else errorToast(d.detail);
        } else errorToast("Validation failed. Please check your inputs.");
      } else {
        errorToast(error.response?.data?.detail || error.message || "Something went wrong.");
      }
    } finally { 
      setSaving(false); 
    }
  };

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

          <div className="flex justify-between items-center pb-3 mb-4">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">Edit Appointment</h3>
            <button onClick={onClose} 
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center
                         hover:scale-105 transition-transform">
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* Patient Name */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Patient Name <span className="text-red-700">*</span>
              </label>
              <div className="relative w-[228px]">
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
                               validationErrors.patient_name ? "border-red-500 ring-1 ring-red-500" :
                               "border-[#0EFF7B] dark:border-[#3A3A3A]"}`} />
              </div>
              {validationErrors.patient_name && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{validationErrors.patient_name}</span>
                </div>
              )}
            </div>

            {/* Patient ID */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">Patient ID</label>
              <div className="relative w-[228px]">
                <input 
                  value={formData.patient_id} 
                  readOnly 
                  className="w-full h-[33px] px-3 rounded-[8px] border-2 border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-gray-500 dark:text-gray-400 outline-none text-sm cursor-not-allowed" 
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <Dropdown 
              label="Department" 
              value={formData.department_id}
              onChange={v => { 
                setFormData({ ...formData, department_id: v, staff_id: "" }); 
                setValidationErrors(prev => { const n = { ...prev }; delete n.department_id; return n; });
              }}
              options={departments} 
              placeholder={loadingDept ? "Loading…" : "Select Department"} 
              loading={loadingDept} 
              isObject 
              required 
              error={validationErrors.department_id} 
            />

            {/* Appointment Date - EXACT same as NewRegistration */}
            <DateField
              label="Appointment Date"
              value={formData.appointment_date}
              onChange={(date) => handleInputChange("appointment_date", date)}
              required
              onFocus={() => setFocusedField("appointment_date")}
              onBlur={() => setFocusedField(null)}
              error={validationErrors.appointment_date}
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
              error={validationErrors.appointment_time}
            />

            {/* Doctor Dropdown */}
            <Dropdown 
              label="Doctor" 
              value={formData.staff_id}
              onChange={v => { 
                setFormData({ ...formData, staff_id: v }); 
                setValidationErrors(prev => { const n = { ...prev }; delete n.staff_id; return n; });
              }}
              options={doctors} 
              placeholder={loadingDoc ? "Loading…" : "Select Doctor"} 
              loading={loadingDoc} 
              isObject 
              required 
              error={validationErrors.staff_id} 
            />

            {/* Status Dropdown */}
            <Dropdown 
              label="Status" 
              value={formData.status}
              onChange={v => { 
                setFormData({ ...formData, status: v }); 
                setValidationErrors(prev => { const n = { ...prev }; delete n.status; return n; });
              }}
              options={["new", "normal", "severe", "completed", "cancelled"]}
              placeholder="Select Status" 
              required 
              error={validationErrors.status} 
            />

            {/* Phone Number */}
            <div>
              <label className="text-sm text-black dark:text-white block mb-1">
                Phone Number <span className="text-red-700">*</span>
              </label>
              <div className="relative w-[228px]">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0EFF7B]" />
                <input 
                  type="tel" 
                  value={formData.phone_no} 
                  onChange={e => handleInputChange("phone_no", e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter phone" 
                  maxLength="10"
                  className={`w-full h-[33px] pl-10 pr-3 rounded-[8px] border-2 bg-gray-100 dark:bg-transparent
                             placeholder-gray-400 dark:placeholder-gray-500 outline-none text-[#08994A] dark:text-[#0EFF7B] text-sm
                             ${focusedField === "phone" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : 
                               validationErrors.phone_no ? "border-red-500 ring-1 ring-red-500" :
                               "border-[#0EFF7B] dark:border-[#3A3A3A]"}`} />
              </div>
              {validationErrors.phone_no && (
                <div className="mt-1 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400 text-xs">{validationErrors.phone_no}</span>
                </div>
              )}
            </div>

            {/* Appointment Type Dropdown */}
            <Dropdown 
              label="Appointment Type" 
              value={formData.appointment_type}
              onChange={v => { 
                setFormData({ ...formData, appointment_type: v }); 
                setValidationErrors(prev => { const n = { ...prev }; delete n.appointment_type; return n; });
              }}
              options={["checkup", "followup", "emergency"]} 
              placeholder="Select Type" 
              required 
              error={validationErrors.appointment_type} 
            />

          </div>

          {validationErrors.appointment_date_time && (
            <div className="mt-4 flex items-center gap-1">
              <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-500 text-xs">{validationErrors.appointment_date_time}</span>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-8">
            <button onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-gray-600 text-gray-600 dark:text-white font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] bg-gray-100 dark:bg-transparent
                         hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <div className="relative group">
              <button 
                onClick={handleUpdate} 
                disabled={saving || !canEditAppointment || Object.keys(validationErrors).length > 0}
                className={`w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66] 
                            bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                            shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] transition
                            ${!canEditAppointment || saving || Object.keys(validationErrors).length > 0 
                              ? "opacity-50 cursor-not-allowed" 
                              : "hover:scale-105"}`}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating…
                  </span>
                ) : "Update"}
              </button>
              {!canEditAppointment && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-3 py-1 text-xs rounded-md shadow-md bg-gray-100 dark:bg-black text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none">
                  Access Denied - Admin/Receptionist Only
                </span>
              )}
              {canEditAppointment && Object.keys(validationErrors).length > 0 && (
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