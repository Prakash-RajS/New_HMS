import React, { useState, useEffect } from "react";
import { X, ChevronDown, Upload } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/axiosConfig";
import { usePermissions } from "../../components/PermissionContext";

// ── Designation options ───────────────────────────────────────────────────────
const designationOptions = [
  "Senior Doctor", "Junior Doctor", "Consultant", "Resident Doctor",
  "Head Nurse", "Staff Nurse", "Junior Nurse",
  "Paramedic", "Lab Technician", "Pharmacist",
];

const designationCategoryMap = {
  "Senior Doctor": "Doctor", "Junior Doctor": "Doctor",
  "Consultant": "Doctor", "Resident Doctor": "Doctor",
  "Head Nurse": "Nurse", "Staff Nurse": "Nurse", "Junior Nurse": "Nurse",
  "Paramedic": "Staff", "Lab Technician": "Staff", "Pharmacist": "Staff",
};

// Backend stores: "Doctor"/"Nurse"/"Staff"/"Admin" etc → best matching display label
const categoryToLabel = {
  doctor: "Senior Doctor",
  nurse: "Head Nurse",
  staff: "Paramedic",
  admin: "Senior Doctor", // fallback for old "Admin" entries
};

// ── Normalize raw API response → consistent field names ──────────────────────
const normalizeProfile = (raw) => {
  if (!raw) return {};
  
  // Debug logging to see what we're getting
  console.log("Raw API data for normalization:", raw);
  console.log("Address field:", raw.address);
  console.log("National ID field:", raw.national_id);
  console.log("City field:", raw.city);
  console.log("Country field:", raw.country);
  
  return {
    id:                       raw.id,
    full_name:                raw.full_name || raw.name || raw.fullName || "",
    date_of_birth:            raw.date_of_birth || raw.dob || raw.dateOfBirth || "",
    gender:                   raw.gender || "",
    blood_group:              raw.blood_group || raw.bloodGroup || raw.blood || "",
    age:                      raw.age != null ? String(raw.age) : "",
    marital_status:           raw.marital_status || raw.maritalStatus || "",
    address:                  raw.address || "",  // Make sure this is mapped
    phone:                    raw.phone || raw.phone_number || raw.contact || "",
    email:                    raw.email || "",
    national_id:              raw.national_id || raw.nationalId || raw.national_id_number || raw.nid || "", // Added all variations
    city:                     raw.city || "",  // Make sure this is mapped
    country:                  raw.country || "",  // Make sure this is mapped
    date_of_joining:          raw.date_of_joining || raw.joining_date || raw.dateOfJoining || "",
    designation:              raw.designation || "",
    department:               raw.department || raw.department_name || "",
    specialization:           raw.specialization || raw.qualification || raw.specialist || "",
    status:                   raw.status || "Available",
    shift_timing:             raw.shift_timing || raw.shiftTiming || raw.shift || "",
    education:                raw.education || "",
    about_physician:          raw.about_physician || raw.about || raw.bio || "",
    experience:               raw.experience || "",
    license_number:           raw.license_number || raw.licenseNumber || raw.license || "",
    board_certifications:     raw.board_certifications || raw.boardCertifications || "",
    professional_memberships: raw.professional_memberships || raw.professionalMemberships || "",
    languages_spoken:         raw.languages_spoken || raw.languages || "",
    awards_recognitions:      raw.awards_recognitions || raw.awards || "",
    profile_picture:          raw.profile_picture || raw.profilePicture || raw.photo || null,
    certificates:             raw.certificates || "",
  };
};

// ── Parse any date string → "MM/DD/YYYY" ────────────────────────────────────
const toFormDate = (raw) => {
  if (!raw) return "";
  if (raw instanceof Date) {
    const m = String(raw.getMonth() + 1).padStart(2, "0");
    const d = String(raw.getDate()).padStart(2, "0");
    return `${m}/${d}/${raw.getFullYear()}`;
  }
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [year, month, day] = s.substring(0, 10).split("-");
    return `${month}/${day}/${year}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
  return s;
};

// ── Resolve designation: any stored value → display label ───────────────────
const resolveDesignationLabel = (stored) => {
  if (!stored) return "";
  if (designationOptions.includes(stored)) return stored;
  return categoryToLabel[stored.toLowerCase()] || designationOptions[0];
};

// ── Field components ──────────────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <label className="text-sm text-black dark:text-white">
    {children}{required && <span className="text-red-500 ml-1">*</span>}
  </label>
);
const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-500 dark:text-red-400">{msg}</p> : null;

const InputField = ({ label, value, onChange, onBlur, placeholder, type = "text", required = false, error, disabled = false, maxLength }) => (
  <div className="space-y-1 w-full">
    <FieldLabel required={required}>{label}</FieldLabel>
    <input 
      type={type} 
      value={value ?? ""} 
      onChange={onChange} 
      onBlur={onBlur}
      placeholder={placeholder} 
      disabled={disabled} 
      maxLength={maxLength}
      className={`w-full h-10 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
        bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B]
        placeholder-gray-500 outline-none text-sm ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    />
    <FieldError msg={error} />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3, required = false, error, disabled = false }) => (
  <div className="space-y-1 w-full">
    <FieldLabel required={required}>{label}</FieldLabel>
    <textarea 
      value={value ?? ""} 
      onChange={onChange} 
      placeholder={placeholder} 
      rows={rows} 
      disabled={disabled}
      className={`w-full px-3 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
        bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B]
        placeholder-gray-500 outline-none text-sm resize-none ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    />
    <FieldError msg={error} />
  </div>
);

const DropdownField = ({ label, value, onChange, options, required = false, error, disabled = false }) => (
  <div className="space-y-1 w-full">
    <FieldLabel required={required}>{label}</FieldLabel>
    <Listbox value={value || ""} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className={`w-full h-10 px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
          bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B]
          text-left text-sm ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-gray-100 dark:bg-black shadow-lg
          border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-48 overflow-y-auto no-scrollbar z-[9999]">
          {options.map((opt, i) => (
            <Listbox.Option key={i} value={opt}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                ${active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
                ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
              }>{opt}</Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
    <FieldError msg={error} />
  </div>
);

const DatePickerField = ({ label, name, value, onChange, required = false, error, maxDate = null, disabled = false }) => {
  const selectedDate = (() => {
    if (!value) return null;
    const parts = value.split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts.map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  })();

  return (
    <div className="space-y-1 w-full">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            const formatted = date
              ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`
              : "";
            onChange({ target: { name, value: formatted } });
          }}
          dateFormat="MM/dd/yyyy" 
          placeholderText="MM/DD/YYYY"
          showYearDropdown 
          scrollableYearDropdown 
          yearDropdownItemNumber={100}
          maxDate={maxDate} 
          disabled={disabled}
          className="w-full h-10 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
            bg-gray-100 dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B]
            placeholder-gray-500 outline-none text-sm"
          wrapperClassName="w-full" 
          popperClassName="z-[9999]"
        />
        <div className="absolute right-3 top-2.5 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0EFF7B]">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>
      <FieldError msg={error} />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const EditDoctorNursePopup = ({ onClose, profile, onUpdate }) => {
  const { isAdmin } = usePermissions();

  // ── Empty form state ───────────────────────────────────────────────────────
  const emptyForm = {
    full_name: "", date_of_birth: "", gender: "", blood_group: "",
    age: "", marital_status: "", address: "", phone: "", email: "",
    national_id: "", city: "", country: "", date_of_joining: "",
    designation: "", designation_category: "", department: "",
    specialization: "", status: "", shift_timing: "",
    education: "", about_physician: "", experience: "",
    license_number: "", board_certifications: "",
    professional_memberships: "", languages_spoken: "", awards_recognitions: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [existingPicUrl, setExistingPicUrl] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);  // loading fresh data
  const [saving, setSaving] = useState(false);
  const [formatErrors, setFormatErrors] = useState({});
  const [requiredErrors, setRequiredErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const statusOptions        = ["Available", "Unavailable", "On Leave"];
  const shiftTimingOptions   = ["09:00 AM - 05:00 PM", "05:00 PM - 01:00 AM", "01:00 AM - 09:00 AM"];
  const bloodGroupOptions    = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genderOptions        = ["Male", "Female", "Other"];

  // ── Fetch fresh staff data by ID + departments ────────────────────────────
  useEffect(() => {
    if (!profile?.id) { 
      errorToast("Invalid profile ID"); 
      onClose(); 
      return; 
    }

    const loadAll = async () => {
      setFetchLoading(true);
      try {
        // Fetch departments and individual staff record in parallel
        const [deptRes, staffRes] = await Promise.all([
          api.get("/departments/").catch(() => ({ data: [] })),
          api.get(`/staff/${profile.id}/`).catch(() => null),
        ]);

        // Load departments
        const deptList = Array.isArray(deptRes.data) ? deptRes.data : [];
        setDepartments(deptList);

        // Use fresh staff data if available, else fall back to passed profile
        const rawData = staffRes?.data || profile;
        console.log("Staff API raw data:", rawData); // Debug log
        console.log("Address from API:", rawData?.address); // Debug log
        console.log("National ID from API:", rawData?.national_id); // Debug log
        console.log("City from API:", rawData?.city); // Debug log
        console.log("Country from API:", rawData?.country); // Debug log
        
        const norm = normalizeProfile(rawData);
        console.log("Normalized data:", norm); // Debug log

        // Resolve picture URL
        const pic = norm.profile_picture;
        if (pic) {
          if (pic.startsWith("http")) setExistingPicUrl(pic);
          else if (pic.startsWith("/static/")) setExistingPicUrl(`${API_BASE}${pic}`);
          else setExistingPicUrl(`${API_BASE}/static/staffs_pictures/${pic.split("/").pop()}`);
        }

        // Resolve designation label from whatever is stored
        const desigLabel = resolveDesignationLabel(norm.designation);
        const desigCat   = designationCategoryMap[desigLabel] || "Staff";

        // Resolve department name (API may return ID or name)
        let deptName = norm.department;
        if (deptName && !isNaN(deptName)) {
          // It's an ID — find the name
          const found = deptList.find((d) => String(d.id) === String(deptName));
          deptName = found?.name || deptName;
        }

        setFormData({
          full_name:                norm.full_name,
          date_of_birth:            toFormDate(norm.date_of_birth),
          gender:                   norm.gender,
          blood_group:              norm.blood_group,
          age:                      norm.age,
          marital_status:           norm.marital_status,
          address:                  norm.address,  // This should now work
          phone:                    norm.phone,
          email:                    norm.email,
          national_id:              norm.national_id,  // This should now work
          city:                     norm.city,  // This should now work
          country:                  norm.country,  // This should now work
          date_of_joining:          toFormDate(norm.date_of_joining),
          designation:              desigLabel,
          designation_category:     desigCat,
          department:               deptName,
          specialization:           norm.specialization,
          status:                   norm.status || "Available",
          shift_timing:             norm.shift_timing,
          education:                norm.education,
          about_physician:          norm.about_physician,
          experience:               norm.experience,
          license_number:           norm.license_number,
          board_certifications:     norm.board_certifications,
          professional_memberships: norm.professional_memberships,
          languages_spoken:         norm.languages_spoken,
          awards_recognitions:      norm.awards_recognitions,
        });
      } catch (err) {
        console.error("Failed to load staff data:", err);
        errorToast("Failed to load profile data");
      } finally {
        setFetchLoading(false);
      }
    };

    loadAll();
  }, [profile?.id, API_BASE, onClose]);

  // ── Auto-calculate age from DOB ────────────────────────────────────────────
  useEffect(() => {
    if (!formData.date_of_birth || fetchLoading) return;
    const parts = formData.date_of_birth.split("/");
    if (parts.length !== 3) return;
    const [month, day, year] = parts.map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return;
    const dob = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const md = today.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
    if (age >= 0 && age <= 150) {
      setFormData((prev) => ({ ...prev, age: String(age) }));
      setFormatErrors((prev) => { const n = { ...prev }; delete n.age; return n; });
    }
  }, [formData.date_of_birth, fetchLoading]);

  // ── Validation ─────────────────────────────────────────────────────────────
  const levenshtein = (a, b) => {
    const m = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= b.length; i++)
      for (let j = 1; j <= a.length; j++)
        m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
    return m[b.length][a.length];
  };

  const validateEmailFormat = (value) => {
    const email = value.trim();
    if (!email) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    if (email.includes("..") || email.includes(".@") || email.includes("@.")) return "Invalid email format";
    const [local, domain] = email.toLowerCase().split("@");
    if (local.length < 2) return "Email username is too short";
    const badDomains = ["email.com","example.com","test.com","domain.com","mailinator.com","tempmail.com","guerrillamail.com","10minutemail.com","yopmail.com","fakeemail.com","temp-mail.org"];
    if (badDomains.includes(domain)) return "Disposable email domains are not allowed";
    for (const p of ["gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com"]) {
      const d = levenshtein(domain, p);
      if (d > 0 && d <= 2) return `Did you mean ${local}@${p}?`;
    }
    if (domain.split(".").pop().length < 2) return "Please use a valid domain extension";
    return "";
  };

  const validateFieldFormat = (field, value) => {
    if (!value || value.toString().trim() === "") return "";
    switch (field) {
      case "full_name":
        if (value.length < 2) return "Full name must be at least 2 characters";
        if (value.length > 100) return "Full name cannot exceed 100 characters";
        if (/[0-9]/.test(value)) return "Name should not contain numbers";
        if (!/^[A-Za-zÀ-ÿ\s.'\-]+$/.test(value)) return "Full name contains invalid characters";
        return "";
      case "email": return validateEmailFormat(value);
      case "phone":
        if (!/^\d+$/.test(value)) return "Phone number must contain only digits";
        if (value.length !== 10) return "Phone number must be exactly 10 digits";
        return "";
      case "national_id":
        if (value.length > 50) return "Cannot exceed 50 characters";
        if (!/^[A-Za-z0-9\s\-_]+$/.test(value)) return "Invalid characters";
        return "";
      case "city": 
      case "country":
        if (value.length > 50) return "Cannot exceed 50 characters";
        if (!/^[A-Za-zÀ-ÿ\s.,'\-]+$/.test(value)) return "Invalid characters";
        return "";
      case "address":
        if (value.length > 200) return "Address cannot exceed 200 characters";
        if (!/^[A-Za-zÀ-ÿ0-9\s\-.,#'&/]+$/.test(value)) return "Invalid characters";
        return "";
      case "specialization":
        if (value.length > 100) return "Cannot exceed 100 characters";
        if (!/^[A-Za-zÀ-ÿ\s.,'\-]+$/.test(value)) return "Invalid characters";
        return "";
      case "age": {
        if (!/^\d+$/.test(value)) return "Age must be a number";
        const a = parseInt(value);
        if (a < 0) return "Age must be at least 0";
        if (a > 100) return "Age cannot exceed 100";
        return "";
      }
      case "license_number":
        if (value.length > 50) return "Cannot exceed 50 characters";
        if (!/^[A-Za-z0-9\s\-_]+$/.test(value)) return "Invalid characters";
        return "";
      case "experience":
        if (value.length > 50) return "Cannot exceed 50 characters";
        return "";
      case "languages_spoken":
        if (value.length > 100) return "Cannot exceed 100 characters";
        if (!/^[A-Za-zÀ-ÿ\s,]+$/.test(value)) return "Only letters, spaces, commas";
        return "";
      case "education": 
      case "about_physician": 
      case "board_certifications":
      case "professional_memberships": 
      case "awards_recognitions":
        if (value.length > 500) return "Cannot exceed 500 characters";
        return "";
      default: return "";
    }
  };

  // ── Input handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (requiredErrors[name]) setRequiredErrors((p) => { const n = { ...p }; delete n[name]; return n; });
    const err = value?.trim() ? validateFieldFormat(name, value) : "";
    err
      ? setFormatErrors((p) => ({ ...p, [name]: err }))
      : setFormatErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleDropdown = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setRequiredErrors((p) => { const n = { ...p }; delete n[field]; return n; });
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const handleDesignationChange = (val) => {
    const cat = designationCategoryMap[val] || "Staff";
    setFormData((prev) => ({ ...prev, designation: val, designation_category: cat }));
    setRequiredErrors((p) => { const n = { ...p }; delete n.designation; return n; });
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const getError = (field) => {
    if (formatErrors[field]) return formatErrors[field];
    if ((showAllErrors || touched[field]) && requiredErrors[field]) return requiredErrors[field];
    return "";
  };

  // ── Photo / cert upload ────────────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { errorToast("File size exceeds 5MB limit."); return; }
    if (!["image/jpeg","image/jpg","image/png"].includes(file.type)) { errorToast("JPG/PNG only."); return; }
    setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const handleCertUpload = (e) => {
    const files = Array.from(e.target.files);
    setCertificates((prev) => [...prev, ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))]);
  };

  // ── Validate & submit ──────────────────────────────────────────────────────
  const validateForm = () => {
    setShowAllErrors(true);
    const req = {};
    ["full_name","phone","email","designation","department"].forEach((f) => {
      if (!formData[f]?.toString().trim()) req[f] = "This field is required";
    });
    setRequiredErrors(req);
    const fmt = {};
    Object.keys(formData).forEach((f) => {
      const v = formData[f];
      if (v?.toString().trim()) { const e = validateFieldFormat(f, v); if (e) fmt[f] = e; }
    });
    setFormatErrors(fmt);
    return Object.keys(req).length === 0 && Object.keys(fmt).length === 0;
  };

  const handleUpdate = async () => {
    if (!isAdmin) { errorToast("Admin access required"); return; }
    if (!validateForm()) { errorToast("Please fix all errors before saving"); return; }
    if (!profile?.id) { errorToast("Invalid profile"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "designation_category" || key === "designation") return;
        const v = formData[key];
        if (v !== null && v !== undefined && v !== "") fd.append(key, v);
      });
      
      fd.append("designation", formData.designation_category || "Staff");
      fd.append("designation_label", formData.designation);

      const dept = departments.find((d) => d.name === formData.department);
      if (dept) fd.append("department_id", dept.id);

      if (photo?.file) fd.append("profile_picture", photo.file);
      certificates.forEach((c) => fd.append("certificates", c.file));

      const res = await api.put(`/staff/update/${profile.id}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        successToast("Profile updated successfully");
        onUpdate(res.data);
        onClose();
      } else {
        errorToast(res.data?.detail || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      errorToast(err.response?.data?.detail || err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9990]">
        <div className="w-64 bg-gray-100 dark:bg-[#000000E5] rounded-[20px] p-8 flex flex-col items-center gap-4 relative overflow-hidden">
          <div style={{ position: "absolute", inset: 0, borderRadius: "20px", padding: "2px", background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
          <div className="w-10 h-10 border-2 border-[#0EFF7B] border-t-transparent rounded-full animate-spin relative z-10" />
          <p className="text-sm text-black dark:text-white relative z-10">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9990] font-[Helvetica]">
      <div className="w-[90vw] max-w-[860px] max-h-[90vh] rounded-[20px] bg-gray-100 dark:bg-[#000000E5] p-6 relative overflow-hidden flex flex-col">
        {/* Gradient border */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "20px", padding: "2px", background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />

        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-2 relative z-10 flex-shrink-0">
          <h3 className="font-semibold text-[18px] text-black dark:text-white">Edit Doctor / Nurse</h3>
          <button onClick={onClose} disabled={saving}
            className="w-7 h-7 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#0EFF7B33] disabled:opacity-50">
            <X size={16} className="text-[#08994A] dark:text-white" />
          </button>
        </div>

        {/* Scrollable body - WITHOUT scrollbar */}
        <div className="overflow-y-auto flex-1 pr-1 relative z-10 no-scrollbar">

          {/* Profile photo */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full border-2 border-[#0EFF7B] overflow-hidden bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                {photo?.preview
                  ? <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                  : existingPicUrl
                  ? <img src={existingPicUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  : <span className="text-3xl text-gray-400">👤</span>}
              </div>
              <input type="file" id="editPhotoUpload" accept="image/jpeg,image/jpg,image/png" className="hidden" onChange={handlePhotoUpload} />
              <label htmlFor="editPhotoUpload" className="text-xs text-[#08994A] dark:text-[#0EFF7B] cursor-pointer hover:underline">Change Photo</label>
              <p className="text-xs text-gray-500">JPG, JPEG, PNG · Max 5MB</p>
            </div>
          </div>

          {/* ── Basic Information ────────────────────────────────────── */}
          <div className="mb-6">
            <h4 className="text-base font-semibold text-black dark:text-white border-b border-[#0EFF7B] pb-1 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <InputField label="Full Name" required value={formData.full_name}
                onChange={(e) => handleChange({ target: { name: "full_name", value: e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()) } })}
                onBlur={() => handleBlur("full_name")} placeholder="Enter full name"
                error={getError("full_name")} disabled={saving} />

              <DatePickerField label="Date of Birth" name="date_of_birth"
                value={formData.date_of_birth} onChange={handleChange}
                maxDate={new Date()} disabled={saving} error={getError("date_of_birth")} />

              <DropdownField label="Gender" value={formData.gender}
                onChange={(v) => handleDropdown("gender", v)}
                options={genderOptions} disabled={saving} error={getError("gender")} />

              <DropdownField label="Blood Group" value={formData.blood_group}
                onChange={(v) => handleDropdown("blood_group", v)}
                options={bloodGroupOptions} disabled={saving} error={getError("blood_group")} />

              <InputField label="Age" value={formData.age}
                onChange={(e) => handleChange({ target: { name: "age", value: e.target.value } })}
                onBlur={() => handleBlur("age")} placeholder="Auto-calculated from DOB"
                type="number" error={getError("age")} disabled={saving || !!formData.date_of_birth} />

              <DropdownField label="Marital Status" value={formData.marital_status}
                onChange={(v) => handleDropdown("marital_status", v)}
                options={maritalStatusOptions} disabled={saving} error={getError("marital_status")} />

              <TextAreaField label="Address" value={formData.address}
                onChange={(e) => handleChange({ target: { name: "address", value: e.target.value } })}
                onBlur={() => handleBlur("address")} placeholder="Enter address"
                rows={2} error={getError("address")} disabled={saving} />

              <InputField label="Phone" required value={formData.phone}
                onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleChange({ target: { name: "phone", value: e.target.value } }); }}
                onBlur={() => handleBlur("phone")} placeholder="e.g. 9876543210"
                type="tel" maxLength={10} error={getError("phone")} disabled={saving} />

              <InputField label="Email" required value={formData.email}
                onChange={(e) => handleChange({ target: { name: "email", value: e.target.value } })}
                onBlur={() => handleBlur("email")} placeholder="example@gmail.com"
                type="email" error={getError("email")} disabled={saving} />

              <InputField label="National ID" value={formData.national_id}
                onChange={(e) => handleChange({ target: { name: "national_id", value: e.target.value } })}
                onBlur={() => handleBlur("national_id")} placeholder="Enter National ID"
                error={getError("national_id")} disabled={saving} />

              <InputField label="City" value={formData.city}
                onChange={(e) => handleChange({ target: { name: "city", value: e.target.value } })}
                onBlur={() => handleBlur("city")} placeholder="Enter city"
                error={getError("city")} disabled={saving} />

              <InputField label="Country" value={formData.country}
                onChange={(e) => handleChange({ target: { name: "country", value: e.target.value } })}
                onBlur={() => handleBlur("country")} placeholder="Enter country"
                error={getError("country")} disabled={saving} />

              <DatePickerField label="Date of Joining" name="date_of_joining"
                value={formData.date_of_joining} onChange={handleChange}
                maxDate={new Date()} disabled={saving} error={getError("date_of_joining")} />

              <DropdownField label="Designation" required value={formData.designation}
                onChange={handleDesignationChange}
                options={designationOptions} disabled={saving} error={getError("designation")} />

              <DropdownField label="Department" required value={formData.department}
                onChange={(v) => handleDropdown("department", v)}
                options={departments.map((d) => d.name)} disabled={saving} error={getError("department")} />

              <InputField label="Specialization" value={formData.specialization}
                onChange={(e) => handleChange({ target: { name: "specialization", value: e.target.value } })}
                onBlur={() => handleBlur("specialization")} placeholder="e.g., Cardiologist"
                error={getError("specialization")} disabled={saving} />

              <DropdownField label="Status" value={formData.status}
                onChange={(v) => handleDropdown("status", v)}
                options={statusOptions} disabled={saving} error={getError("status")} />

              <DropdownField label="Shift Timing" value={formData.shift_timing}
                onChange={(v) => handleDropdown("shift_timing", v)}
                options={shiftTimingOptions} disabled={saving} error={getError("shift_timing")} />

              {/* Certificate upload */}
              <div className="space-y-1 w-full">
                <FieldLabel>Update Certificates</FieldLabel>
                <input type="file" id="editCertUpload" accept="image/*,application/pdf" multiple className="hidden" onChange={handleCertUpload} />
                <label htmlFor="editCertUpload"
                  className="border border-[#0EFF7B] dark:border-[#3A3A3A] w-full h-10
                    flex items-center justify-center cursor-pointer rounded-[8px]
                    text-gray-600 dark:text-gray-400 text-sm gap-2 hover:text-[#08994A] dark:hover:text-[#0EFF7B]">
                  <Upload size={14} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  Upload New Certificates
                </label>
                {certificates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {certificates.map((c, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <span>Cert {i + 1}</span>
                        <button onClick={() => setCertificates((p) => p.filter((_, x) => x !== i))} className="text-red-500 hover:text-red-400">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Professional Information ──────────────────────────────── */}
          <div>
            <h4 className="text-base font-semibold text-black dark:text-white border-b border-[#0EFF7B] pb-1 mb-4">Professional Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <InputField label="Experience" value={formData.experience}
                onChange={(e) => handleChange({ target: { name: "experience", value: e.target.value } })}
                onBlur={() => handleBlur("experience")} placeholder="e.g., 10+ years"
                error={getError("experience")} disabled={saving} />

              <InputField label="License Number" value={formData.license_number}
                onChange={(e) => handleChange({ target: { name: "license_number", value: e.target.value } })}
                onBlur={() => handleBlur("license_number")} placeholder="Enter license number"
                error={getError("license_number")} disabled={saving} />

              <InputField label="Languages Spoken" value={formData.languages_spoken}
                onChange={(e) => handleChange({ target: { name: "languages_spoken", value: e.target.value } })}
                onBlur={() => handleBlur("languages_spoken")} placeholder="e.g., English, Spanish"
                error={getError("languages_spoken")} disabled={saving} />

              <TextAreaField label="Education" value={formData.education}
                onChange={(e) => handleChange({ target: { name: "education", value: e.target.value } })}
                placeholder="e.g., MBBS, MD Cardiology" error={getError("education")} disabled={saving} />

              <TextAreaField label="About Physician" value={formData.about_physician}
                onChange={(e) => handleChange({ target: { name: "about_physician", value: e.target.value } })}
                placeholder="Brief bio..." error={getError("about_physician")} disabled={saving} />

              <TextAreaField label="Board Certifications" value={formData.board_certifications}
                onChange={(e) => handleChange({ target: { name: "board_certifications", value: e.target.value } })}
                placeholder="e.g., American Board of Orthopedic Surgery"
                error={getError("board_certifications")} disabled={saving} />

              <TextAreaField label="Professional Memberships" value={formData.professional_memberships}
                onChange={(e) => handleChange({ target: { name: "professional_memberships", value: e.target.value } })}
                placeholder="e.g., American Medical Association"
                error={getError("professional_memberships")} disabled={saving} />

              <TextAreaField label="Awards & Recognitions" value={formData.awards_recognitions}
                onChange={(e) => handleChange({ target: { name: "awards_recognitions", value: e.target.value } })}
                placeholder="e.g., Top Doctor awards"
                error={getError("awards_recognitions")} disabled={saving} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-5 pt-4 border-t border-[#0EFF7B33] relative z-10 flex-shrink-0">
          <button onClick={onClose} disabled={saving}
            className="px-5 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
              bg-gray-100 dark:bg-transparent text-black dark:text-white text-sm
              hover:bg-[#0EFF7B1A] disabled:opacity-50 transition">
            Cancel
          </button>
          <button onClick={handleUpdate} disabled={saving}
            style={{ background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)" }}
            className="px-5 py-2 rounded-[8px] border-b-2 border-[#0EFF7B66]
              text-white text-sm font-medium hover:scale-105 transition
              disabled:opacity-50 flex items-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Add the no-scrollbar styles */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EditDoctorNursePopup;