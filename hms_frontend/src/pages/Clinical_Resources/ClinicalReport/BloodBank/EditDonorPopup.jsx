import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { successToast, errorToast } from "../../../../components/Toast.jsx";
import api from "../../../../utils/axiosConfig";
import { usePermissions } from "../../../../components/PermissionContext.jsx";

const EditDonorPopup = ({ onClose, donor, onUpdate }) => {
  const [formData, setFormData] = useState({
    donor_name: "",
    phone: "",
    email: "",
    gender: "",
    blood_type: "",
    last_donation_date: null,
  });

  const [errors, setErrors] = useState({});
  const [formatErrors, setFormatErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAdmin, currentUser } = usePermissions();
  const userRole = currentUser?.role?.toLowerCase();
  const canEdit = isAdmin || userRole === "nurse";

  // List of blocked disposable/fake domains
  const blockedDomains = [
    "mailinator.com",
    "tempmail.com",
    "yopmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "throwawaymail.com",
    "fakeemail.com",
    "temp-mail.org",
    "dispostable.com",
    "maildrop.cc",
    "example.com",
    "test.com",
    "domain.com",
    "fake.com",
    "dummy.com",
    "123.com",
    "123.in"
  ];

  // Levenshtein distance for typo detection
  const levenshtein = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0
      )
    );

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1
              );
      }
    }
    return matrix[b.length][a.length];
  };

  // Safe date conversion function
  const safeDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      if (dateValue instanceof Date && !isNaN(dateValue)) {
        return dateValue;
      }
      let date;
      if (typeof dateValue === 'string' && dateValue.includes("-")) {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'string' && dateValue.includes("/")) {
        const [month, day, year] = dateValue.split("/");
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        date = new Date(dateValue);
      }
      return date instanceof Date && !isNaN(date) ? date : null;
    } catch (error) {
      console.error("Date conversion error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (donor) {
      const donationDate = safeDate(donor.last_donation_date || donor.lastDonation);
      setFormData({
        donor_name: donor.donor_name || donor.name || "",
        phone: donor.phone || "",
        email: donor.email || "",
        gender: donor.gender || "",
        blood_type: donor.blood_type || donor.blood || "",
        last_donation_date: donationDate,
      });
    }
  }, [donor]);

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().split("T")[0];
  };

  // Updated: Donor name validation (max 50 characters)
  const validateNameFormat = (value) => {
    if (!value) return "";
    
    // Check for numbers
    if (/[0-9]/.test(value)) {
      return "Name should not contain numbers";
    }
    
    // Check minimum length
    if (value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    
    // Check maximum length (50 characters)
    if (value.length > 50) {
      return "Name cannot exceed 50 characters";
    }
    
    // Check for valid characters (letters, spaces, apostrophes, hyphens, periods)
    if (!/^[A-Za-z\s.'-]+$/.test(value)) {
      return "Name can only contain letters, spaces, apostrophes, hyphens, and periods";
    }
    
    return "";
  };

  // Updated: Phone validation for Indian numbers (start with 9,8,7,6 and not repetitive patterns)
  const validatePhoneFormat = (value) => {
    if (!value) return "";
    
    // Check if contains only digits
    if (!/^\d*$/.test(value)) {
      return "Phone must contain only digits";
    }
    
    // Check length (must be exactly 10 digits when complete)
    if (value.length > 0 && value.length !== 10) {
      return "Phone must be exactly 10 digits";
    }
    
    if (value.length === 10) {
      // Check if phone starts with valid Indian mobile prefix (9,8,7,6)
      const firstDigit = value.charAt(0);
      if (!['9', '8', '7', '6'].includes(firstDigit)) {
        return "Phone must start with 9, 8, 7, or 6";
      }
      
      // Check for repetitive patterns (all same digits)
      if (/^(\d)\1{9}$/.test(value)) {
        return "Invalid phone number - repetitive pattern not allowed";
      }
      
      // Check for common repetitive patterns like 9898989898, 7676767676
      if (/^(\d{2})\1{4}$/.test(value) || /^(\d{2})\1{3}\d{2}$/.test(value)) {
        return "Invalid phone number - repetitive pattern not allowed";
      }
      
      // Check for sequential patterns (1234567890, 9876543210)
      const isAscending = "1234567890".includes(value);
      const isDescending = "9876543210".includes(value);
      if (isAscending || isDescending) {
        return "Invalid phone number - sequential pattern not allowed";
      }
      
      // Check for patterns like 9876543210 (descending)
      let isDescendingSeq = true;
      for (let i = 1; i < value.length; i++) {
        if (parseInt(value[i]) !== parseInt(value[i-1]) - 1) {
          isDescendingSeq = false;
          break;
        }
      }
      if (isDescendingSeq && value[0] === '9') {
        return "Invalid phone number - sequential pattern not allowed";
      }
    }
    
    return "";
  };

  // Updated: Email validation with max 50 characters
  const validateEmailFormat = (value) => {
    const email = value.trim();
    if (!email) return "";

    // Check maximum length (50 characters)
    if (email.length > 50) {
      return "Email cannot exceed 50 characters";
    }

    // Basic structure check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address (e.g., name@company.com)";
    }

    // Suspicious formatting
    if (email.includes("..") || email.includes(".@") || email.includes("@.")) {
      return "Invalid email format";
    }

    const [localPart, domain] = email.toLowerCase().split("@");

    // Local-part sanity
    if (localPart.length < 2) {
      return "Email username is too short";
    }

    if (/(.)\1{5,}/.test(localPart)) {
      return "Email appears to be invalid";
    }

    if (/(\.\.|__|--|\+\+)/.test(localPart)) {
      return "Email contains invalid characters";
    }

    // Block known disposable/fake domains
    if (blockedDomains.includes(domain)) {
      return "Disposable or invalid email domains are not allowed";
    }

    // Dynamic typo detection for major providers
    const providers = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com"
    ];

    for (const provider of providers) {
      const distance = levenshtein(domain, provider);
      if (distance > 0 && distance <= 2) {
        return `Did you mean ${localPart}@${provider}?`;
      }
    }

    // TLD sanity
    const tld = domain.split(".").pop();
    if (tld.length < 2) {
      return "Please use a valid domain extension";
    }

    return "";
  };

  // Real-time format validation functions
  const validateFieldFormat = (field, value) => {
    switch (field) {
      case "donor_name":
        return validateNameFormat(value);
      
      case "phone":
        return validatePhoneFormat(value);
      
      case "email":
        return validateEmailFormat(value);
      
      default:
        return "";
    }
  };

  // Full form validation on submit
  const validateForm = () => {
    const newErrors = {};

    // Donor Name
    if (!formData.donor_name.trim()) {
      newErrors.donor_name = "Donor name is required";
    } else {
      const nameError = validateNameFormat(formData.donor_name);
      if (nameError) newErrors.donor_name = nameError;
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneError = validatePhoneFormat(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailError = validateEmailFormat(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    // Gender & Blood Type
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.blood_type) newErrors.blood_type = "Blood type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!canEdit) {
      errorToast("You don't have permission to edit donors");
      return;
    }
    
    if (!validateForm()) {
      errorToast("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        donor_name: formData.donor_name.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        gender: formData.gender,
        blood_type: formData.blood_type,
        last_donation_date: formatDateForAPI(formData.last_donation_date),
      };
      
      const response = await api.put(`/api/donors/${donor.id}`, updateData);
      
      successToast("Donor updated successfully!");
      if (onUpdate) onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Failed to update donor";
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Session expired. Please login again.";
        } else if (error.response.status === 400) {
          const result = error.response.data;
          if (result.detail) {
            errorMessage = Array.isArray(result.detail)
              ? result.detail.map((e) => `${e.loc?.join(" → ")}: ${e.msg}`).join("\n")
              : result.detail;
          } else {
            errorMessage = "Invalid donor data. Please check all fields.";
          }
        } else if (error.response.status === 404) {
          errorMessage = "Donor not found.";
        } else if (error.response.status === 409) {
          errorMessage = error.response.data?.detail || "Email already exists";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Donor Name Change with auto-capitalization
  const handleDonorNameChange = (e) => {
    let value = e.target.value;
    
    // Auto-capitalize first letter of each word
    if (value) {
      value = value.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    setFormData({ ...formData, donor_name: value });
    
    if (errors.donor_name) {
      setErrors(prev => ({ ...prev, donor_name: "" }));
    }
    
    const formatError = validateFieldFormat("donor_name", value);
    if (formatError) {
      setFormatErrors(prev => ({ ...prev, donor_name: formatError }));
    } else {
      setFormatErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.donor_name;
        return newErrors;
      });
    }
  };

  // Handle Phone Change with filtering
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Allow only numbers
    let numericValue = value.replace(/[^\d]/g, '');
    
    // Limit to 10 digits
    if (numericValue.length > 10) {
      numericValue = numericValue.slice(0, 10);
    }
    
    setFormData({ ...formData, phone: numericValue });
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
    
    const formatError = validateFieldFormat("phone", numericValue);
    if (formatError) {
      setFormatErrors(prev => ({ ...prev, phone: formatError }));
    } else {
      setFormatErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  // Handle Email Change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
    
    const formatError = validateFieldFormat("email", value);
    if (formatError) {
      setFormatErrors(prev => ({ ...prev, email: formatError }));
    } else {
      setFormatErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    const value = formData[field];
    const formatError = validateFieldFormat(field, value);
    
    if (formatError) {
      setFormatErrors(prev => ({ ...prev, [field]: formatError }));
    }
  };

  const getFieldError = (field) => {
    if (formatErrors[field]) {
      return formatErrors[field];
    }
    return errors[field] || "";
  };

  const genders = ["Male", "Female", "Other"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const Dropdown = ({ label, value, onChange, options, error }) => (
    <div>
      <label className="text-sm text-black dark:text-white">
        {label} <span className="text-red-500">*</span>
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-full">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
            bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
            focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50"
            disabled={loading}
          >
            <span className="block truncate">{value || "Select"}</span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-gray-100 dark:bg-[#1a1a1a]
            shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm ${
                    active
                      ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && (
        <p className="text-red-700 dark:text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-[Helvetica]">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
        <div className="w-[600px] h-auto rounded-[19px] bg-gray-100 dark:bg-[#000000] text-black dark:text-white p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              Edit Donor
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
              bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center
              hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>
          
          {/* Current Status Display */}
          {/* {donor?.status && (
            <div className="mb-4 p-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Current Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  donor.status === "Eligible"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}>
                  {donor.status}
                </span>
              </div>
              {donor.last_donation_date && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Last donation: {new Date(donor.last_donation_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              )}
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                Status is automatically calculated based on donation dates
              </p>
            </div>
          )} */}
          
          {/* Form Fields - 2x2 Grid Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Donor Name */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Donor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.donor_name}
                onChange={handleDonorNameChange}
                onBlur={() => {
                  if (formData.donor_name) {
                    setFormData(prev => ({ 
                      ...prev, 
                      donor_name: prev.donor_name.trim() 
                    }));
                  }
                  handleBlur("donor_name");
                }}
                maxLength={50}
                disabled={loading}
                className="w-full h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50"
                placeholder="Enter donor name (max 50 chars)"
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.donor_name.length}/50
              </div>
              {getFieldError("donor_name") && (
                <p className="text-red-700 dark:text-red-500 text-xs mt-1 font-medium">
                  {getFieldError("donor_name")}
                </p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("phone")}
                maxLength={10}
                disabled={loading}
                className="w-full h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50"
                placeholder="e.g. 9876543210"
              />
              {getFieldError("phone") && (
                <p className="text-red-700 dark:text-red-500 text-xs mt-1 font-medium">
                  {getFieldError("phone")}
                </p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Must be 10 digits, start with 9,8,7, or 6
              </p>
            </div>
            
            {/* Email */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={() => {
                  if (formData.email) {
                    setFormData(prev => ({ 
                      ...prev, 
                      email: prev.email.trim() 
                    }));
                  }
                  handleBlur("email");
                }}
                maxLength={50}
                disabled={loading}
                className="w-full h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50"
                placeholder="example@company.com (max 50 chars)"
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.email.length}/50
              </div>
              {getFieldError("email") && (
                <p className="text-red-700 dark:text-red-500 text-xs mt-1 font-medium">
                  {getFieldError("email")}
                </p>
              )}
            </div>
            
            {/* Gender Dropdown */}
            <Dropdown
              label="Gender"
              value={formData.gender}
              onChange={(val) => {
                setFormData({ ...formData, gender: val });
                if (errors.gender) {
                  setErrors(prev => ({ ...prev, gender: "" }));
                }
              }}
              options={genders}
              error={errors.gender}
            />
            
            {/* Blood Type Dropdown */}
            <Dropdown
              label="Blood Type"
              value={formData.blood_type}
              onChange={(val) => {
                setFormData({ ...formData, blood_type: val });
                if (errors.blood_type) {
                  setErrors(prev => ({ ...prev, blood_type: "" }));
                }
              }}
              options={bloodTypes}
              error={errors.blood_type}
            />
            
            {/* Last Donation Date */}
            <div>
              <label className="text-sm text-black dark:text-white">
                Last Donation Date <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.last_donation_date}
                  onChange={(date) => {
                    setFormData({ ...formData, last_donation_date: date });
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  maxDate={new Date()}
                  disabled={loading}
                  className="w-full h-[32px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                           bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                           focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50"
                  wrapperClassName="w-full"
                  popperClassName="z-50"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                />
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-500 dark:text-[#0EFF7B]"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Information Note */}
          <div className="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Status is automatically calculated based on the last donation date.
              Donors become "Eligible" 6 months after their last donation.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-gray-100 dark:bg-transparent text-black dark:text-white font-medium
              hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-[144px] h-[32px] border-b-[2px] border-[#0EFF7B] rounded-[8px]
              bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium
              hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Donor"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDonorPopup;