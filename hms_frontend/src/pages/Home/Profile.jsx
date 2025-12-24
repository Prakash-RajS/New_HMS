import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaClock,
} from "react-icons/fa";
import ProfileImage from "../../assets/image.png";
import axios from "axios";
import { successToast, errorToast } from "../../components/Toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(ProfileImage);
  const [currentTime, setCurrentTime] = useState("");
  const [fileError, setFileError] = useState("");
  
  // State for form submission validation errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    location: ""
  });

  // State for real-time format validation during typing
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    location: ""
  });

  // Store original data to revert on cancel
  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joinedDate: "",
    location: "",
    timezone: "",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joinedDate: "",
    location: "",
    timezone: "",
  });

  const [profileImage, setProfileImage] = useState(ProfileImage);

  // Get JWT Token
  const getToken = () => localStorage.getItem("token") || "";
  const backendUrl =
    window.location.hostname === "18.119.210.2"
      ? "http://18.119.210.2:8000"
      : "http://localhost:8000";

  // Axios with auth - UPDATED BASE URL
  const api = axios.create({
    baseURL: backendUrl,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Add response interceptor for debugging
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data || error.message);
      console.error("API Error URL:", error.config?.url);
      return Promise.reject(error);
    }
  );

  // Validate image file function
  const validateImageFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only JPG, JPEG and PNG images are allowed');
      return false;
    }
    
    // Check file size (5MB max)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      setFileError('Image size should be less than 5MB');
      return false;
    }
    
    setFileError(''); // Clear error if validation passes
    return true;
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(''); // Clear previous errors
    
    if (!file) return;
    
    // Validate the file
    if (!validateImageFile(file)) {
      // Reset the file input
      e.target.value = '';
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  // Fetch current staff profile via /me/
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(
        "Fetching profile with token:",
        getToken() ? "Token exists" : "No token"
      );

      const res = await api.get("/api/profile/me/");
      const data = res.data;

      console.log("Profile API Response:", data);

      const location =
        [data.address, data.city, data.country].filter(Boolean).join(", ") ||
        "Not provided";

      const joinedDate = data.date_of_joining
        ? new Date(data.date_of_joining).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Not provided";

      const imageUrl = data.profile_picture
        ? `${backendUrl}/${data.profile_picture}`
        : ProfileImage;

      setProfileImage(imageUrl);
      setOriginalImage(imageUrl);

      // Format phone number with + for display
      const phoneNumber = data.phone || "";
      const formattedPhone = phoneNumber ? `+${phoneNumber}` : "";

      const newProfileData = {
        name: data.full_name || "",
        email: data.email || "",
        phone: formattedPhone,
        role: data.designation || "",
        department: data.department || "",
        joinedDate,
        location,
        timezone: data.timezone || "",
      };

      // Set both current and original data
      setProfileData(newProfileData);
      setOriginalProfileData(newProfileData);

      // Profile completion calculation
      const fields = [
        data.full_name,
        data.email,
        data.phone,
        data.designation,
        data.department,
        data.date_of_joining,
        data.address || data.city || data.country,
        data.timezone,
      ];
      const filled = fields.filter(Boolean).length;
      setProfileCompletion(Math.round((filled / 8) * 100));
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to load profile";
      setError(msg);
      console.error("Profile fetch error:", err.response?.data || err.message);
      console.error("Full error object:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update current time every second with 12-hour format + timezone name
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preview image on file select
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setProfileImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  // Real-time format validation functions (for typing)
  const validateNameFormat = (value) => {
    if (/[0-9]/.test(value)) return "Name should not contain numbers";
    if (value.trim() && !/^[A-Za-z\s.'-]{2,}$/.test(value)) return "Please enter a valid name";
    return "";
  };

  const validateEmailFormat = (value) => {
    if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
    // Check for @email.com
    if (value.trim() && /@email\.com$/i.test(value)) return "Please use a valid email domain, not @email.com";
    return "";
  };

  const validatePhoneFormat = (value) => {
    // Check if empty
    if (!value.trim()) return "";
    
    // Check if starts with +
    if (!value.startsWith('+')) {
      return "Phone number should start with + followed by country code";
    }
    
    // Remove + for validation
    const digitsOnly = value.substring(1).replace(/\D/g, '');
    
    // Check if there are digits after +
    if (digitsOnly.length === 0) {
      return "Please enter country code and phone number after +";
    }
    
    // Check country code (1-3 digits)
    if (!/^[1-9]\d{0,2}/.test(digitsOnly)) {
      return "Invalid country code. Country code should be 1-3 digits starting with 1-9";
    }
    
    // Extract country code (1-3 digits)
    const countryCodeMatch = digitsOnly.match(/^([1-9]\d{0,2})/);
    if (!countryCodeMatch) {
      return "Invalid country code format";
    }
    
    const countryCode = countryCodeMatch[1];
    const phoneNumber = digitsOnly.substring(countryCode.length);
    
    // Check phone number length after country code
    if (phoneNumber.length < 4) {
      return `Phone number too short. Need at least 4 digits after country code ${countryCode}`;
    }
    
    if (phoneNumber.length > 12) {
      return `Phone number too long. Maximum 12 digits after country code`;
    }
    
    // Total length validation (with country code)
    const totalDigits = digitsOnly.length;
    if (totalDigits < 7) {
      return "Phone number too short. Minimum 7 digits total (including country code)";
    }
    
    if (totalDigits > 15) {
      return "Phone number too long. Maximum 15 digits total (including country code)";
    }
    
    return "";
  };

  const validateRoleFormat = (value) => {
    if (/[0-9]/.test(value)) return "Role should not contain numbers";
    if (value.trim() && !/^[A-Za-z\s.'-]{2,}$/.test(value)) return "Please enter a valid role";
    return "";
  };

  const validateLocationFormat = (value) => {
    if (/[0-9]/.test(value)) return "Location should not contain numbers";
    if (value.trim() && value !== "Not provided" && !/^[A-Za-z\s,.'-]{2,}$/.test(value)) return "Please enter a valid location (letters and spaces only)";
    return "";
  };

  // Required field validation (only for submission)
  const validateRequiredFields = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      role: "",
      location: ""
    };
    let isValid = true;

    // Name validation
    if (!profileData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    }

    // Email validation
    if (!profileData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    // Phone validation
    if (!profileData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    }

    // Role validation
    if (!profileData.role.trim()) {
      errors.role = "Role is required";
      isValid = false;
    }

    // Location validation
    if (!profileData.location.trim() || profileData.location === "Not provided") {
      errors.location = "Location is required";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Function to capitalize first letter of each word
  const capitalizeName = (value) => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Real-time validation on input change (only format validation)
  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Capitalize first letter of each word for name field
    if (field === "name") {
      processedValue = capitalizeName(value);
    }
    
    // Capitalize first letter for role field
    if (field === "role") {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setProfileData((prev) => ({ ...prev, [field]: processedValue }));
    
    // Clear format validation error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [field]: ""
    }));
    
    // Perform real-time format validation on processed value
    let formatError = "";
    
    switch (field) {
      case "name":
        formatError = validateNameFormat(processedValue);
        break;
      case "email":
        formatError = validateEmailFormat(processedValue);
        break;
      case "phone":
        formatError = validatePhoneFormat(processedValue);
        break;
      case "role":
        formatError = validateRoleFormat(processedValue);
        break;
      case "location":
        formatError = validateLocationFormat(processedValue);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: formatError
    }));
  };

  // Format phone number as user types
  const handlePhoneChange = (value) => {
    // Remove all non-digit and non-plus characters
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with + and only one plus at the beginning
    if (cleaned.includes('+')) {
      const parts = cleaned.split('+');
      cleaned = '+' + parts.filter(p => p).join('');
    } else if (cleaned) {
      // If user types digits without +, prepend +
      cleaned = '+' + cleaned;
    }
    
    // Ensure only one + at the beginning
    if (cleaned.startsWith('++')) {
      cleaned = '+' + cleaned.substring(2);
    }
    
    handleInputChange("phone", cleaned);
  };

  // Validate all fields before submission
  const validateFields = () => {
    // First check required fields
    const requiredValid = validateRequiredFields();
    
    // Then check format validation
    const formatErrors = {
      name: validateNameFormat(profileData.name),
      email: validateEmailFormat(profileData.email),
      phone: validatePhoneFormat(profileData.phone),
      role: validateRoleFormat(profileData.role),
      location: validateLocationFormat(profileData.location)
    };
    
    // Update validation errors for display
    setValidationErrors(formatErrors);
    
    const formatValid = !Object.values(formatErrors).some(error => error !== "");
    
    return requiredValid && formatValid;
  };

  // Clear field errors when input changes
  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: ""
    }));
  };

  // Edit Toggle - FIXED: Revert to original data when canceling
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit mode - revert all changes
      setProfileData({...originalProfileData});
      setSelectedFile(null);
      setProfileImage(originalImage);
      setFileError(''); // Clear file error
      // Clear all field errors
      setFieldErrors({
        name: "",
        email: "",
        phone: "",
        role: "",
        location: ""
      });
      setValidationErrors({
        name: "",
        email: "",
        phone: "",
        role: "",
        location: ""
      });
    }
    setIsEditing(!isEditing);
  };

  // Save Changes
  const handleSaveChanges = async () => {
    // Validate fields before submitting
    if (!validateFields()) {
      errorToast("Please fix all validation errors before saving");
      return;
    }

    const formData = new FormData();
    if (selectedFile) formData.append("profile_picture", selectedFile);
    if (profileData.name) formData.append("full_name", profileData.name);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.phone) {
      // Remove + and any non-digit characters for backend storage
      const cleanPhone = profileData.phone.replace(/\D/g, '');
      formData.append("phone", cleanPhone);
    }
    if (profileData.role) formData.append("designation", profileData.role);

    // Parse location back to address, city, country
    const parts = profileData.location.split(",").map((p) => p.trim());
    formData.append("address", parts[0] || "");
    if (parts[1]) formData.append("city", parts[1]);
    if (parts[2]) formData.append("country", parts[2]);

    try {
      await api.put("/api/profile/update/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchProfile();
      setIsEditing(false);
      // Clear field errors on successful save
      setFieldErrors({
        name: "",
        email: "",
        phone: "",
        role: "",
        location: ""
      });
      setValidationErrors({
        name: "",
        email: "",
        phone: "",
        role: "",
        location: ""
      });
      successToast("Profile updated successfully!");

      // Full page refresh to update header profile image and other global states
      window.location.reload();
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Update failed";
      errorToast(errorMsg);
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  // Change Password
  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!");
      return;
    }
    try {
      await api.post("/api/profile/change-password/me/", {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setShowPasswordModal(false);
      successToast("Password changed successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Password change failed";
      setPasswordError(errorMsg);
    }
  };

  // Loading / Error states
  if (loading)
    return <div className="mt-[80px] text-center">Loading profile...</div>;
  if (error)
    return (
      <div className="mt-[80px] text-center text-red-500">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please check if:</p>
        <ul className="text-sm text-left max-w-md mx-auto mt-2">
          <li>• Backend server is running on port 8000</li>
          <li>• Profile endpoints are properly configured</li>
          <li>• User has an associated staff record</li>
        </ul>
        <button
          onClick={fetchProfile}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-[8px] p-4 w-full max-w-[2500px] mx-auto flex flex-col overflow-hidden relative font-[Helvetica]">
        {/* Gradient & Glow Effects */}
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
            zIndex: 0,
          }}
        ></div>
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
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        {/* Profile Card */}
<div className="relative w-[770px] min-h-[344px] rounded-[8px] mx-auto mt-10">
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
  ></div>
  <div
    className="absolute -top-32 -left-32 w-[730px] h-[300px] pointer-events-none"
    style={{
      background:
        "radial-gradient(circle, rgba(14,255,123,0.25) 0%, transparent 80%)",
      filter: "blur(150px)",
      zIndex: 0,
      border: "1px solid rgba(14, 255, 123, 0.1)",
    }}
  />

  <div className="relative z-10 flex justify-between items-start h-full px-6 py-4">
    {/* Left */}
    <div className="flex flex-col mt-4 items-center w-1/2">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover object-center border-2 border-[#0EFF7B] shadow-[0px_0px_40px_5px_#0EFF7B80]"
        />
        {isEditing && (
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="mt-2 text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#025126] file:to-[#0D7F41] file:text-white"
            />
            {fileError && (
              <p className="text-red-500 text-xs mt-1">{fileError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, JPEG, PNG (Max 5MB)
            </p>
          </div>
        )}
        <div className="text-center">
          <h3 className="text-xl font-semibold">
            {profileData.name || "User"}
          </h3>
          <div className="flex flex-col space-y-1 mt-2 items-center">
            <span className="text-green-500 text-sm">
              {profileData.role || "Staff"}
            </span>
            <span className="text-green-500 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </span>
          </div>
        </div>
      </div>
      {/* Buttons - they will cause container to expand if needed */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        <button
          onClick={handleEditToggle}
          className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-4 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 text-sm whitespace-nowrap"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
        <button
          onClick={handleChangePassword}
          className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-4 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 text-sm whitespace-nowrap"
        >
          Change password
        </button>
      </div>
    </div>

    {/* Right */}
    <div className="flex flex-col mt-5 space-y-8 w-1/2">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
          <p className="text-sm">{profileData.email}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaPhone className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
          <p className="text-sm">{profileData.phone}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaCalendarAlt className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
          <p className="text-sm">{profileData.joinedDate}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaMapMarkerAlt className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
          <p className="text-sm">{profileData.location}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm">Profile completion</span>
          <span className="text-green-500 text-sm font-semibold">
            {profileCompletion}%
          </span>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>
        {/* Personal Info */}
        <div className="mt-10">
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>
          <div className="relative grid grid-cols-2 gap-4 p-6 rounded-xl bg-white dark:bg-black">
            <div
              className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
                zIndex: 0,
              }}
            ></div>

            {[
              { 
                label: "Full name", 
                field: "name", 
                type: "text", 
                required: true,
                formatError: validationErrors.name,
                requiredError: fieldErrors.name
              },
              { 
                label: "Email", 
                field: "email", 
                type: "email", 
                required: true,
                formatError: validationErrors.email,
                requiredError: fieldErrors.email
              },
              { 
                label: "Phone", 
                field: "phone", 
                type: "tel", 
                required: true,
                formatError: validationErrors.phone,
                requiredError: fieldErrors.phone
              },
              { 
                label: "Role", 
                field: "role", 
                type: "text", 
                required: true,
                formatError: validationErrors.role,
                requiredError: fieldErrors.role
              },
              {
                label: "Department",
                field: "department",
                type: "text",
                readOnly: true,
              },
              {
                label: "Joined date",
                field: "joinedDate",
                type: "text",
                readOnly: true,
              },
              { 
                label: "Location", 
                field: "location", 
                type: "text", 
                required: true,
                formatError: validationErrors.location,
                requiredError: fieldErrors.location
              },
              {
                label: "Time",
                field: "currentTime",
                type: "text",
                readOnly: true,
                icon: (
                  <FaClock className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
                ),
              },
            ].map(({ label, field, type, readOnly, icon, required, formatError, requiredError }) => (
              <div key={field} className="flex flex-col">
                <div className="flex items-center mb-1">
                  <label className="text-sm">{label}</label>
                  {required && isEditing && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </div>

                {/* Input wrapper */}
                <div className="relative">
                  {icon && (
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      {icon}
                    </span>
                  )}
                  <input
                    type={type}
                    value={
                      field === "currentTime" ? currentTime : profileData[field]
                    }
                    onChange={(e) => {
                      if (field === "currentTime") return;
                      if (field === "phone") {
                        handlePhoneChange(e.target.value);
                      } else {
                        handleInputChange(field, e.target.value);
                      }
                    }}
                    readOnly={!isEditing || readOnly}
                    className={`w-full ${icon ? "pl-9" : "pl-2"} p-2 rounded-lg ${
                      isEditing && !readOnly
                        ? "bg-white dark:bg-black border border-[#0EFF7B] focus:ring-2 focus:ring-[#0EFF7B]"
                        : "bg-white dark:bg-[#0EFF7B1A] border border-[#0EFF7B] text-green-500"
                    }`}
                    placeholder={field === "phone" && isEditing ? "+country code phone number" : ""}
                  />
                </div>
                
                {/* Format validation error - shows while typing */}
                {isEditing && formatError && (
                  <p className="text-red-500 text-xs mt-1">{formatError}</p>
                )}
                
                {/* Required field error - only shows after submit attempt */}
                {isEditing && requiredError && !formatError && (
                  <p className="text-red-500 text-xs mt-1">{requiredError}</p>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-6 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={Object.values(validationErrors).some(error => error !== "")}
                >
                  Save changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-white dark:bg-black rounded-[19px] p-6 relative">
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-[#0EFF7B] p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded border dark:border-[#3A3A3A] bg-white dark:bg-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-[#0EFF7B]"
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded border dark:border-[#3A3A3A] bg-white dark:bg-transparent"
                      placeholder="Confirm password"
                    />
                    <button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-[#0EFF7B]"
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                  }}
                  className="px-4 py-2 border rounded text-black dark:text-white"
                >
                  Reset
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-[#025126] to-[#0D7F41] text-white rounded border-b-2 border-[#0EFF7B]"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;