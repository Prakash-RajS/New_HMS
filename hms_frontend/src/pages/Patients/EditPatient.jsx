import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown, Upload, Loader2 } from "lucide-react";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { successToast, errorToast } from "../../components/Toast.jsx";

const API_BASE = "http://localhost:8000";

const EditPatientPopup = ({
  patientId,
  patient: initialPatient,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/default-avatar.png");
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [error, setError] = useState("");

  // API Helpers
  const api = {
    getPatient: (id) => axios.get(`${API_BASE}/patients/${id}`),
    getDepartments: () => axios.get(`${API_BASE}/patients/departments`),
    getDoctors: (deptId) =>
      axios.get(`${API_BASE}/patients/staff?department_id=${deptId}`),
    updatePatient: (uniqueId, payload) => {
      const form = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          form.append(k, v);
        }
      });
      return axios.put(`${API_BASE}/patients/${uniqueId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  };

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.getDepartments();
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error("Failed to load departments:", err);
        errorToast("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch patient and initialize
  useEffect(() => {
    if (initialPatient) {
      initializeForm(initialPatient);
      return;
    }
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        setError("");
        const res = await api.getPatient(patientId);
        initializeForm(res.data);
      } catch (err) {
        console.error("Failed to fetch patient:", err);
        errorToast("Patient not found");
        onClose();
      }
    };
    fetchPatient();
  }, [patientId, initialPatient, onClose]);

  // Initialize form with defaults/fallbacks for preloading
  const initializeForm = (p) => {
    // Debug logs to check raw values from backend
    console.log('Raw backend data for edit:', {
      casualty_status: p.casualty_status,
      appointment_type: p.appointment_type,
      staff_id: p.staff_id,
      department_id: p.department_id,
    });

    const data = {
      id: p.id,
      patient_unique_id: p.patient_unique_id || "",
      full_name: p.full_name || "",
      phone_number: p.phone_number || "",
      department_id: p.department_id || "",
      staff_id: p.staff_id || "",
      appointment_type: p.appointment_type || "Check-up",
      status: p.casualty_status || "Active",
      date_of_registration: p.date_of_registration || "",
      photo_file: null,
      photo_url: p.photo_url || "/default-avatar.png",
    };

    // Additional debug after defaults
    console.log('Initialized formData:', {
      status: data.status,
      appointment_type: data.appointment_type,
    });

    setFormData(data);
    setPreviewUrl(p.photo_url || "/default-avatar.png");
  };

  // Load doctors (with loading state)
  const loadDoctors = async (deptId) => {
    if (!deptId) {
      setDoctors([]);
      return;
    }
    setDoctorsLoading(true);
    try {
      const res = await api.getDoctors(deptId);
      setDoctors(res.data.staff || []);
      console.log(`Loaded ${res.data.staff?.length || 0} doctors for dept ${deptId}`);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      errorToast("Failed to load doctors");
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Load doctors on dept change or initial
  useEffect(() => {
    if (formData?.department_id) {
      loadDoctors(formData.department_id);
    }
  }, [formData?.department_id]);

  // Photo preview
  useEffect(() => {
    if (formData?.photo_file) {
      const url = URL.createObjectURL(formData.photo_file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData?.photo_file]);

  // Date helpers
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [m, d, y] = dateStr.split("/").map(Number);
    return new Date(y, m - 1, d);
  };
  const formatDate = (date) => {
    if (!date) return "";
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Submit update
  const handleUpdate = async () => {
    if (!formData?.patient_unique_id) {
      errorToast("Patient ID is missing!");
      return;
    }
    const payload = {
      full_name: formData.full_name.trim(),
      phone_number: formData.phone_number.trim(),
      appointment_type: formData.appointment_type,
      status: formData.status,
      date_of_registration: formData.date_of_registration,
      department_id: formData.department_id || null,
      staff_id: formData.staff_id || null,
    };
    if (formData.photo_file) {
      payload.photo = formData.photo_file;
    }
    try {
      setError("");
      await api.updatePatient(formData.patient_unique_id, payload);
      successToast(`Patient "${formData.full_name}" updated successfully!`);
      onUpdate?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Update failed";
      setError(msg);
      errorToast(msg);
    }
  };

  // Department change
  const handleDeptChange = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      department_id: deptId,
      staff_id: "",
    }));
  };

  // Dropdown Component (updated to fallback to raw value if not in options)
  const Dropdown = ({
    label,
    value,
    onChange,
    options,
    disabled = false,
    placeholder = "Select",
    fullWidth = false,
    loading = false,
  }) => {
    // Find matching option or fallback to value
    const selectedLabel = options.find((o) => o.id === value)?.name ||
                         options.find((o) => o.id === value)?.full_name ||
                         value || // Fallback: show raw value if not in options
                         placeholder;

    return (
      <div>
        <label className="text-sm text-black dark:text-white block mb-1">
          {label}
        </label>
        <Listbox value={value} onChange={onChange} disabled={disabled || loading}>
          <div className="relative">
            <Listbox.Button
              className={`${fullWidth ? 'w-full' : 'w-full sm:w-[160px]'} h-[33px] px-3 pr-8 rounded-[8px] border flex items-center ${
                disabled || loading
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                  : "border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent"
              } text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] truncate`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                selectedLabel
              )}
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-[100] mt-1 w-full min-w-[160px] rounded-[12px] bg-white dark:bg-black shadow-lg border border-gray-300 dark:border-[#3A3A3A] max-h-40 overflow-auto">
              {options.length === 0 ? (
                <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option.id}
                    className={({ active }) =>
                      `cursor-pointer select-none py-2 px-3 text-sm ${
                        active
                          ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                          : "text-black dark:text-white"
                      }`
                    }
                  >
                    {option.name || option.full_name}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    );
  };

  const appointmentTypes = ["Check-up", "Follow-up", "Emergency"];
  const statuses = ["Active", "New", "Normal", "Severe", "Critical", "Completed", "Cancelled"];

  if (!formData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="flex items-center gap-2 text-white text-lg">
          <Loader2 className="animate-spin" />
          Loading patient data...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="w-full max-w-4xl rounded-[20px] p-[1px] backdrop-blur-md shadow-xl bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
        <div className="rounded-[19px] bg-white dark:bg-[#000000] p-4 sm:p-6 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-1">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              Edit Patient
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-[#0EFF7B] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:scale-110 transition"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>
          {error && (
            <div className="mb-1 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
          {/* Photo */}
          <div className="flex justify-center mb-1">
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#0EFF7B] shadow-md"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-gradient-to-r from-[#025126] to-[#0D7F41] p-1.5 sm:p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition"
              >
                <Upload size={14} className="text-white" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, photo_file: file }));
                    }
                  }}
                />
              </label>
            </div>
          </div>
          {/* Form - 3 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Column 1 */}
            <div className="space-y-4 sm:space-y-6">
              {/* Patient Name */}
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Patient Name
                </label>
                <input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  placeholder="Enter name"
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
                />
              </div>
              {/* Department */}
              <Dropdown
                label="Department"
                value={formData.department_id}
                onChange={handleDeptChange}
                options={departments}
                placeholder="Select Department"
                fullWidth
              />
              {/* Registration Date */}
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Registration Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={parseDate(formData.date_of_registration)}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_of_registration: formatDate(date),
                      }))
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    className="w-full !h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none text-sm"
                    wrapperClassName="w-full"
                    showPopperArrow={false}
                    popperClassName="z-[100]"
                    popperProps={{ strategy: "fixed" }}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none"
                  />
                </div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-4 sm:space-y-6">
              {/* Normal ID (Django PK) - Read-only */}
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  ID
                </label>
                <input
                  value={formData.id}
                  readOnly
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] bg-gray-100 dark:bg-green-100 text-black dark:text-black cursor-not-allowed text-sm"
                />
              </div>
              {/* Doctor */}
              <Dropdown
                label="Doctor"
                value={formData.staff_id}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, staff_id: val }))
                }
                options={doctors}
                placeholder={
                  doctorsLoading 
                    ? "Loading..." 
                    : !formData.department_id 
                      ? "Select Dept First" 
                      : "Select Doctor"
                }
                disabled={!formData.department_id || doctorsLoading}
                fullWidth
                loading={doctorsLoading}
              />
              {/* Status */}
              <Dropdown
                label="Status"
                value={formData.status}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
                options={statuses.map((s) => ({ id: s, name: s }))}
                fullWidth
              />
            </div>
            {/* Column 3 */}
            <div className="space-y-4 sm:space-y-6">
              {/* Patient Unique ID - Read-only */}
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Patient ID
                </label>
                <input
                  value={formData.patient_unique_id || ""}
                  readOnly
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] bg-gray-100 dark:bg-green-100 text-black dark:text-black cursor-not-allowed text-sm"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                  placeholder="Enter phone"
                  maxLength="15"
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
                />
              </div>
              {/* Appointment Type */}
              <Dropdown
                label="Appointment Type"
                value={formData.appointment_type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, appointment_type: val }))
                }
                options={appointmentTypes.map((t) => ({ id: t, name: t }))}
                fullWidth
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 sm:mt-8">
            <button
              onClick={onClose}
              className="w-full sm:w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] text-gray-800 dark:text-white font-medium text-[14px] leading-[16px] shadow bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="w-full sm:w-[144px] h-[34px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] shadow text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition flex items-center justify-center gap-2"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPatientPopup;