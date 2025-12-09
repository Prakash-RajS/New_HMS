// src/components/AddAppointmentPopup.jsx
import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast.jsx";

const API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/appointments"
    : "http://localhost:8000/appointments";

const BED_API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/bedgroups"
    : "http://localhost:8000/bedgroups";

export default function AddAppointmentPopup({ onClose, onSuccess }) {
  // Add validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  
  // ── Form state (backend keys) ─────────────────────────────────────
  const [formData, setFormData] = useState({
    patient_name: "",
    department_id: "",
    staff_id: "",
    room_no: "",
    phone_no: "",
    appointment_type: "",
    status: "",
  });

  // ── Dropdown data ───────────────────────────────────────────────────
  const [departments, setDepartments] = useState([]); // [{id, name}]
  const [doctors, setDoctors] = useState([]); // [{id, full_name}]
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Validation function ──────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};
    
    if (!formData.patient_name.trim()) {
      errors.patient_name = "Patient name is required";
    }
    
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    
    if (!formData.staff_id) {
      errors.staff_id = "Doctor is required";
    }
    
    if (!formData.room_no) {
      errors.room_no = "Room/Bed is required";
    }
    
    if (!formData.phone_no) {
      errors.phone_no = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_no)) {
      errors.phone_no = "Phone number must be 10 digits";
    }
    
    if (!formData.appointment_type) {
      errors.appointment_type = "Appointment type is required";
    }
    
    if (!formData.status) {
      errors.status = "Status is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handle input change with validation ──────────────────────────────
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
                id: bed.id.toString(),
                name: `${group.bedGroup} - ${bed.bed_number}`,
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
    // Validate all fields
    if (!validateForm()) {
      errorToast("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patient_name: formData.patient_name.trim(),
        department_id: Number(formData.department_id),
        staff_id: Number(formData.staff_id),
        room_no: formData.room_no || null,
        phone_no: formData.phone_no || null,
        appointment_type: formData.appointment_type,
        status: formData.status,
      };
      const res = await fetch(`${API}/create_appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to create appointment";
        try {
          const err = await res.json();
          msg = err.detail || err.message || JSON.stringify(err);
        } catch {}
        throw new Error(msg);
      }
      successToast("Appointment added successfully!");
      onSuccess?.();
      onClose?.();
    } catch (e) {
      const message = e.message || "Something went wrong. Please try again.";
      errorToast(message);
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
                Patient Name <span className="text-red-500">*</span>
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
              {validationErrors.patient_name && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.patient_name}</span>
                </div>
              )}
            </div>
            {/* Department */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Department <span className="text-red-500">*</span>
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
              {validationErrors.department_id && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.department_id}</span>
                </div>
              )}
            </div>
            {/* Doctor */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Doctor <span className="text-red-500">*</span>
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
              {validationErrors.staff_id && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.staff_id}</span>
                </div>
              )}
            </div>
            {/* Room / Bed No */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Room / Bed No <span className="text-red-500">*</span>
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
              {validationErrors.room_no && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.room_no}</span>
                </div>
              )}
            </div>
            {/* Phone No */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone No <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.phone_no}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    handleInputChange("phone_no", value);
                  }
                }}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter phone no (10 digits)"
                className={`w-full h-[33px] mt-1 px-3 rounded-[8px] border bg-white dark:bg-transparent 
                           placeholder-gray-400 dark:placeholder-gray-500 outline-none 
                           text-black dark:text-[#0EFF7B]
                           ${focusedField === "phone" ? "border-[#0EFF7B] ring-1 ring-[#0EFF7B]" : "border-[#0EFF7B] dark:border-[#3A3A3A]"}`}
              />
              {validationErrors.phone_no && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.phone_no}</span>
                </div>
              )}
            </div>
            {/* Appointment Type */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Appointment Type <span className="text-red-500">*</span>
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
              {validationErrors.appointment_type && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.appointment_type}</span>
                </div>
              )}
            </div>
            {/* Status */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Status <span className="text-red-500">*</span>
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
              {validationErrors.status && (
                <div className="mt-1">
                  <span className="text-red-400 text-xs">{validationErrors.status}</span>
                </div>
              )}
            </div>
          </div>
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
              disabled={saving}
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