// src/components/patients/NewRegistration.jsx
import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
// DIRECT TOAST FUNCTIONS
import { successToast, errorToast } from "../../components/Toast.jsx";

const API_BASE =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : "http://localhost:8000";

const BED_API =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000/bedgroups"
    : "http://localhost:8000/bedgroups";

const formatToYMD = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  const [m, d, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};
const safeStr = (v) => (v === undefined || v === null ? "" : String(v).trim());

/* ---------- Photo Upload ---------- */
const PhotoUploadBox = ({ photoPreview, setPhotoPreview, onFileSelect, error = null }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };
  return (
    <div className="flex justify-center md:justify-end">
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <label
        htmlFor="photoUpload"
        className="border border-dashed border-[#0EFF7B] mr-12 w-24 h-24 md:w-32 md:h-32
                   flex items-center justify-center text-gray-600 cursor-pointer
                   rounded-lg overflow-hidden bg-[#0EFF7B1A] hover:border-[#08994A] hover:text-[#08994A]"
      >
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs md:text-sm">+ Add Photo</span>
        )}
      </label>
      {error && <p className="text-red-500 text-xs mt-1 w-32 text-center">{error}</p>}
    </div>
  );
};

/* ---------- Dropdown ---------- */
const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  idField = "id",
  nameField = "name",
  loading = false,
  placeholder = "Select",
  required = false,
  error = null,
}) => (
  <div className="space-y-1 w-full">
    <label
      className="text-sm text-black dark:text-white"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-left text-[14px] leading-[16px]
                     flex items-center justify-between bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          <span>
            {loading
              ? "Loading..."
              : value
              ? options.find((o) => String(o[idField]) === String(value))?.[
                  nameField
                ] || String(value)
              : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-[#0EFF7B] absolute right-2" />
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50
                     border border-gray-300 dark:border-[#3A3A3A] left-[2px] max-h-60 overflow-y-auto"
        >
          {loading ? (
            <Listbox.Option
              disabled
              value=""
              className="px-2 py-2 text-sm text-gray-500"
            >
              Loading...
            </Listbox.Option>
          ) : options.length === 0 ? (
            <Listbox.Option
              disabled
              value=""
              className="px-2 py-2 text-sm text-gray-500"
            >
              No options
            </Listbox.Option>
          ) : (
            options.map((option) => (
              <Listbox.Option
                key={option[idField]}
                value={option[idField]}
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
                {option[nameField]}
              </Listbox.Option>
            ))
          )}
        </Listbox.Options>
      </div>
    </Listbox>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* ---------- Input ---------- */
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error = null,
}) => (
  <div className="space-y-1 w-full">
    <label
      className="text-sm text-black dark:text-white"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-[33px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                 bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 outline-none text-[14px]"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* ---------- Date Field (Native Style) ---------- */
const DateField = ({ label, value, onChange, placeholder, required = false, error = null }) => {
  const dateRef = React.useRef(null);
  const handleDateChange = (e) => {
    onChange(e.target.value);
  };
  const handleClick = () => {
    dateRef.current?.showPicker();
  };
  return (
    <div className="space-y-1 w-full">
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative cursor-pointer" onClick={handleClick}>
        <input
          type="date"
          ref={dateRef}
          value={value}
          onChange={handleDateChange}
          className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                     bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer text-[14px]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        />
        <Calendar
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

/* ---------- Main Component ---------- */
export default function NewRegistration({ isSidebarOpen }) {
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    gender: "",
    age: "",
    maritalStatus: "",
    address: "",
    phone: "",
    email: "",
    nid: "",
    city: "",
    country: "",
    dor: "",
    occupation: "",
    weight: "",
    height: "",
    bloodGroup: "",
    bp: "",
    temperature: "",
    consultType: "",
    apptType: "",
    admitDate: "",
    roomNo: "",
    testReport: "",
    casualty: "",
    reason: "",
    department_id: "",
    staff_id: "",
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const styleRef = React.useRef(null);
  const navigate = useNavigate();
  
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const consultationTypes = ["General", "Specialist", "Emergency"];
  const appointmentTypes = ["In-person", "Online", "Follow-up"];
  const casualtyTypes = ["Yes", "No"];

  /* ---------- Validation Rules ---------- */
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "fullname":
        return value.trim() === "" ? "Full name is required" : "";
      case "dob":
        return value === "" ? "Date of birth is required" : "";
      case "gender":
        return value === "" ? "Gender is required" : "";
      case "age":
        if (value === "") return "Age is required";
        if (isNaN(value) || Number(value) <= 0) return "Age must be a positive number";
        return "";
      case "maritalStatus":
        return value === "" ? "Marital status is required" : "";
      case "address":
        return value.trim() === "" ? "Address is required" : "";
      case "phone":
        if (value === "") return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be exactly 10 digits";
        return "";
      case "email":
        if (value === "") return "Email is required";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) return "Email must be a valid Gmail address";
        return "";
      case "nid":
        return value.trim() === "" ? "National ID is required" : "";
      case "city":
        return value.trim() === "" ? "City is required" : "";
      case "country":
        return value.trim() === "" ? "Country is required" : "";
      case "dor":
        return value === "" ? "Date of registration is required" : "";
      case "occupation":
        return value.trim() === "" ? "Occupation is required" : "";
      case "weight":
        if (value === "") return "Weight is required";
        if (isNaN(value) || Number(value) <= 0) return "Weight must be a positive number";
        return "";
      case "height":
        if (value === "") return "Height is required";
        if (isNaN(value) || Number(value) <= 0) return "Height must be a positive number";
        return "";
      case "bloodGroup":
        return value === "" ? "Blood group is required" : "";
      case "bp":
        return value.trim() === "" ? "Blood pressure is required" : "";
      case "temperature":
        if (value === "") return "Temperature is required";
        if (isNaN(value)) return "Temperature must be a number";
        return "";
      case "consultType":
        return value === "" ? "Consultation type is required" : "";
      case "department_id":
        return value === "" ? "Department is required" : "";
      case "staff_id":
        return value === "" ? "Consulting doctor is required" : "";
      case "apptType":
        return value === "" ? "Appointment type is required" : "";
      case "admitDate":
        return value === "" ? "Admit date is required" : "";
      case "roomNo":
        return value === "" ? "Room / Bed No is required" : "";
      case "testReport":
        return value.trim() === "" ? "Test report is required" : "";
      case "casualty":
        return value === "" ? "Casualty status is required" : "";
      case "reason":
        return value.trim() === "" ? "Reason for visit is required" : "";
      case "photo":
        return !photoFile ? "Photo is required" : "";
      default:
        return "";
    }
  };

  /* ---------- Load Departments ---------- */
  useEffect(() => {
    let mounted = true;
    setLoadingDepts(true);
    fetch(`${API_BASE}/patients/departments`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          setDepartments(data.departments || []);
          setLoadingDepts(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load departments:", err);
        if (mounted) setLoadingDepts(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- Load Available Beds ---------- */
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
                id: `${group.bedGroup} - ${bed.bed_number}`,
                bedGroup: group.bedGroup,
                bedNumber: bed.bed_number.toString(),
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

  /* ---------- Load Staff ---------- */
  useEffect(() => {
    if (!formData.department_id) {
      setDoctors([]);
      setFormData((p) => ({ ...p, staff_id: "" }));
      return;
    }
    let mounted = true;
    setLoadingStaff(true);
    fetch(`${API_BASE}/patients/staff?department_id=${formData.department_id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          setDoctors(data.staff || []);
          setLoadingStaff(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load staff:", err);
        if (mounted) setLoadingStaff(false);
      });
    return () => {
      mounted = false;
    };
  }, [formData.department_id]);

  // Add CSS to hide default date picker icon
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
      }
      input[type="date"] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    // Clear error for this field when user starts typing
    if (isSubmitted && errors[field]) {
      const error = validateField(field, val);
      if (error === "") {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleDropdownChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user selects an option
    if (isSubmitted && errors[field]) {
      const error = validateField(field, value);
      if (error === "") {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    // Clear error for this field when user selects a date
    if (isSubmitted && errors[field]) {
      const error = validateField(field, date);
      if (error === "") {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate photo separately
    const photoError = validateField("photo", "");
    if (photoError) {
      newErrors.photo = photoError;
      isValid = false;
    }

    setErrors(newErrors);
    setIsSubmitted(true);
    return isValid;
  };

  const handleClear = () => {
    setFormData({
      fullname: "",
      dob: "",
      gender: "",
      age: "",
      maritalStatus: "",
      address: "",
      phone: "",
      email: "",
      nid: "",
      city: "",
      country: "",
      dor: "",
      occupation: "",
      weight: "",
      height: "",
      bloodGroup: "",
      bp: "",
      temperature: "",
      consultType: "",
      apptType: "",
      admitDate: "",
      roomNo: "",
      testReport: "",
      casualty: "",
      reason: "",
      department_id: "",
      staff_id: "",
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setErrors({});
    setIsSubmitted(false);
  };

  /* ---------- Submit with Toast ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isValid = validateForm();
    if (!isValid) {
      errorToast("Please fill all required fields correctly.");
      return;
    }
    
    const body = new FormData();
    body.append("full_name", safeStr(formData.fullname));
    body.append("date_of_birth", formData.dob || "");
    body.append("gender", safeStr(formData.gender));
    body.append("age", safeStr(formData.age));
    body.append("marital_status", safeStr(formData.maritalStatus));
    body.append("address", safeStr(formData.address));
    body.append("phone_number", safeStr(formData.phone));
    body.append("email_address", safeStr(formData.email));
    body.append("national_id", safeStr(formData.nid));
    body.append("city", safeStr(formData.city));
    body.append("country", safeStr(formData.country));
    body.append("date_of_registration", formData.dor || "");
    body.append("occupation", safeStr(formData.occupation));
    body.append("weight_in_kg", safeStr(formData.weight));
    body.append("height_in_cm", safeStr(formData.height));
    body.append("blood_group", safeStr(formData.bloodGroup));
    body.append("blood_pressure", safeStr(formData.bp));
    body.append("body_temperature", safeStr(formData.temperature));
    body.append("consultation_type", safeStr(formData.consultType));
    body.append("appointment_type", safeStr(formData.apptType));
    body.append("admission_date", formData.admitDate || "");
    body.append("room_number", safeStr(formData.roomNo));
    body.append("test_report_details", safeStr(formData.testReport));
    body.append("casualty_status", safeStr(formData.casualty));
    body.append("reason_for_visit", safeStr(formData.reason));
    body.append("department_id", safeStr(formData.department_id));
    body.append("staff_id", safeStr(formData.staff_id));
    if (photoFile) body.append("photo", photoFile);
    
    try {
      const res = await fetch(`${API_BASE}/patients/register`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      successToast(`Patient registered: ${data.patient_id}`);
      handleClear();
    } catch (err) {
      errorToast(`Registration failed: ${err.message}`);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[2500px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative font-[Helvetica]">
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
      {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px",
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
      <div className="mt-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] text-white"
          style={{
            background:
              "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="md:flex-1">
            <h2 className="text-2xl font-bold">New Registration</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Input new patient details carefully
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <PhotoUploadBox
              photoPreview={photoPreview}
              setPhotoPreview={setPhotoPreview}
              onFileSelect={(file) => {
                setPhotoFile(file);
                if (isSubmitted && errors.photo) {
                  setErrors((prev) => ({ ...prev, photo: "" }));
                }
              }}
              error={errors.photo}
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          encType="multipart/form-data"
          noValidate
        >
          {/* General Info */}
          <div>
            <h3 className="text-lg font-medium mb-2">General Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <InputField
                label="Full Name"
                value={formData.fullname}
                onChange={handleChange("fullname")}
                placeholder="Enter full name"
                required
                error={errors.fullname}
              />
              <DateField
                label="Date of Birth"
                value={formData.dob}
                onChange={handleDateChange("dob")}
                required
                error={errors.dob}
              />
              <Dropdown
                label="Gender"
                value={formData.gender}
                onChange={handleDropdownChange("gender")}
                options={["Male", "Female", "Other"].map((g) => ({
                  id: g,
                  name: g,
                }))}
                required
                error={errors.gender}
              />
              <InputField
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange("age")}
                placeholder="Enter age"
                required
                error={errors.age}
              />
              <Dropdown
                label="Marital Status"
                value={formData.maritalStatus}
                onChange={handleDropdownChange("maritalStatus")}
                options={maritalStatusOptions.map((m) => ({ id: m, name: m }))}
                required
                error={errors.maritalStatus}
              />
              <InputField
                label="Address"
                value={formData.address}
                onChange={handleChange("address")}
                placeholder="Enter address"
                required
                error={errors.address}
              />
              <InputField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange("phone")}
                placeholder="Enter 10 digit phone no"
                required
                error={errors.phone}
              />
              <InputField
                label="Email ID"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="Enter email"
                required
                error={errors.email}
              />
              <InputField
                label="National ID"
                value={formData.nid}
                onChange={handleChange("nid")}
                placeholder="Enter NID"
                required
                error={errors.nid}
              />
              <InputField
                label="City"
                value={formData.city}
                onChange={handleChange("city")}
                placeholder="City"
                required
                error={errors.city}
              />
              <InputField
                label="Country"
                value={formData.country}
                onChange={handleChange("country")}
                placeholder="Country"
                required
                error={errors.country}
              />
              <DateField
                label="Date of Registration"
                value={formData.dor}
                onChange={handleDateChange("dor")}
                required
                error={errors.dor}
              />
              <InputField
                label="Occupation"
                value={formData.occupation}
                onChange={handleChange("occupation")}
                placeholder="Enter occupation"
                required
                error={errors.occupation}
              />
              <InputField
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange("weight")}
                placeholder="kg"
                required
                error={errors.weight}
              />
              <InputField
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={handleChange("height")}
                placeholder="cm"
                required
                error={errors.height}
              />
            </div>
          </div>
          {/* Medical Info */}
          <div>
            <h3 className="text-lg font-medium mb-2">Medical Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Dropdown
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={handleDropdownChange("bloodGroup")}
                options={bloodGroups.map((b) => ({ id: b, name: b }))}
                required
                error={errors.bloodGroup}
              />
              <InputField
                label="Blood Pressure"
                value={formData.bp}
                onChange={handleChange("bp")}
                placeholder="e.g. 120/80"
                required
                error={errors.bp}
              />
              <InputField
                label="Temperature"
                type="number"
                value={formData.temperature}
                onChange={handleChange("temperature")}
                placeholder="°C"
                required
                error={errors.temperature}
              />
              <Dropdown
                label="Consultation Type"
                value={formData.consultType}
                onChange={handleDropdownChange("consultType")}
                options={consultationTypes.map((c) => ({ id: c, name: c }))}
                required
                error={errors.consultType}
              />
              <Dropdown
                label="Department"
                value={formData.department_id}
                onChange={handleDropdownChange("department_id")}
                options={departments}
                loading={loadingDepts}
                required
                error={errors.department_id}
              />
              <Dropdown
                label="Consulting Doctor"
                value={formData.staff_id}
                onChange={handleDropdownChange("staff_id")}
                options={doctors.map((d) => ({
                  id: d.id,
                  display: `${d.full_name} – ${d.designation}`,
                }))}
                loading={loadingStaff}
                placeholder="Select Department First"
                idField="id"
                nameField="display"
                required
                error={errors.staff_id}
              />
              <Dropdown
                label="Appointment Type"
                value={formData.apptType}
                onChange={handleDropdownChange("apptType")}
                options={appointmentTypes.map((a) => ({ id: a, name: a }))}
                required
                error={errors.apptType}
              />
              <DateField
                label="Admit Date"
                value={formData.admitDate}
                onChange={handleDateChange("admitDate")}
                required
                error={errors.admitDate}
              />
              <Dropdown
                label="Room / Bed No"
                value={formData.roomNo}
                onChange={handleDropdownChange("roomNo")}
                options={availableBeds}
                placeholder={loadingBeds ? "Loading…" : "Select Available Bed"}
                loading={loadingBeds}
                required
                error={errors.roomNo}
              />
              <InputField
                label="Test Report"
                value={formData.testReport}
                onChange={handleChange("testReport")}
                placeholder="Details"
                required
                error={errors.testReport}
              />
              <Dropdown
                label="Casualty"
                value={formData.casualty}
                onChange={handleDropdownChange("casualty")}
                options={casualtyTypes.map((c) => ({ id: c, name: c }))}
                required
                error={errors.casualty}
              />
            </div>
            <div className="mt-4">
              <label
                className="text-sm text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={handleChange("reason")}
                placeholder="Describe symptoms"
                className="w-full h-20 mt-1 px-3 py-2 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none text-[14px]"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              />
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="button"
              onClick={handleClear}
              className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] bg-[#0EFF7B1A] dark:bg-transparent text-black dark:text-white"
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white border-b-[2px] border-[#0EFF7B]"
            >
              Add Patient..!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}