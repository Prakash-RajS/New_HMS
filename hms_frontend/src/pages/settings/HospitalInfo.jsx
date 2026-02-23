import { useState, useEffect } from "react";
import {
  Upload,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  AlertCircle,
  Calendar,
  Tag,
  FileDigit,
  Trash2,
} from "lucide-react";
import api, { uploadFile } from "../../utils/axiosConfig.js";
import { useHospital } from "../../components/HospitalContext.jsx";
import { useUser } from "../../contexts/UserContext";
import { successToast, errorToast } from "../../components/Toast.jsx";
import { getMediaUrl } from "../../utils/axiosConfig";

export default function HospitalInfo({ data, onUpdate }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState(null);
  const { updateLogo } = useHospital();
  const { userData, fetchUserData } = useUser();

  // Fetch user role from API to ensure we have the latest
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await api.get("/profile/me/");
        console.log("User data from API:", response.data);
        // Based on your backend, role and is_superuser are at the root level
        setUserRole({
          role: response.data.role,
          is_superuser: response.data.is_superuser
        });
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    
    getUserRole();
  }, []);

  // Check if user is admin based on your backend response
  const isAdmin = userRole?.role === "admin" || userRole?.is_superuser === true;
  
  console.log("User role from API:", userRole);
  console.log("Is admin:", isAdmin);

  const validateField = (field, value) => {
    let error = "";
    
    switch (field) {
      case "gstin":
        // GSTIN validation: 15 characters (2 digits + 5 letters + 4 digits + 1 letter + 1 digit + 1 letter + 1 digit)
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (value && !gstRegex.test(value)) {
          error = "Invalid GSTIN format. Should be 15 characters (e.g., 22AAAAA0000A1Z5)";
        }
        break;
        
      case "phone":
        // Phone number validation: exactly 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (value && !phoneRegex.test(value)) {
          error = "Phone number must be exactly 10 digits";
        }
        break;
        
      case "emergency_contact":
        // Emergency contact validation: exactly 10 digits
        const emergencyRegex = /^[0-9]{10}$/;
        if (value && !emergencyRegex.test(value)) {
          error = "Emergency contact must be exactly 10 digits";
        }
        break;
        
      case "hospital_name":
        if (!value || !value.trim()) {
          error = "Hospital name is required";
        }
        break;
        
      case "email":
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !value.trim()) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "address":
        if (!value || !value.trim()) {
          error = "Address is required";
        }
        break;
        
      case "established_year":
        if (value) {
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (year < 1900 || year > currentYear) {
            error = `Year must be between 1900 and ${currentYear}`;
          }
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (field, value) => {
    // Only admin can edit
    if (!isAdmin) {
      errorToast("Only admin can edit hospital information");
      return;
    }

    // Validate field
    const error = validateField(field, value);
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Update data
    onUpdate({ ...data, [field]: value });
  };

  const handleLogoUpload = async (e) => {
    // Only admin can upload
    if (!isAdmin) {
      errorToast("Only admin can upload logo");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      errorToast("Please select an image file (PNG, JPG, JPEG, GIF, SVG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorToast("File size should be less than 5MB");
      return;
    }

    try {
      setUploadingLogo(true);

      const response = await uploadFile(
        "/hospital/upload-logo",
        file,
        (progress) => console.log(`Upload progress: ${progress}%`),
      );

      const rawLogoPath = response.data.logo_url;

      // Update the settings page form preview
      onUpdate({ ...data, logo: rawLogoPath });

      // Update the sidebar logo via context
      updateLogo(rawLogoPath);

      successToast("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      errorToast(error.response?.data?.detail || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    // Only admin can remove
    if (!isAdmin) {
      errorToast("Only admin can remove logo");
      return;
    }

    if (!window.confirm("Are you sure you want to remove the logo?")) {
      return;
    }

    try {
      setRemovingLogo(true);
      
      // Call API to remove logo
      await api.post("/hospital/remove-logo");
      
      // Update local state
      onUpdate({ ...data, logo: null });
      
      // Update context
      updateLogo(null);
      
      successToast("Logo removed successfully!");
    } catch (error) {
      console.error("Error removing logo:", error);
      errorToast(error.response?.data?.detail || "Failed to remove logo");
    } finally {
      setRemovingLogo(false);
    }
  };

  // Check if all required fields are filled
  const validateAllFields = () => {
    const requiredFields = {
      hospital_name: data.hospital_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
    };

    const newErrors = {};
    let isValid = true;

    Object.entries(requiredFields).forEach(([field, value]) => {
      if (!value || !value.trim()) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
        isValid = false;
      }
    });

    // Validate formats
    if (data.phone && !/^[0-9]{10}$/.test(data.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (data.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin)) {
      newErrors.gstin = "Invalid GSTIN format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Validate on mount and when data changes
  useEffect(() => {
    validateAllFields();
  }, [data]);

  // Show loading state while fetching user role
  if (userRole === null) {
    return <div className="p-4">Loading user information...</div>;
  }

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">
            ⚠️ You are in view-only mode. Only admin can edit hospital information.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Building className="text-[#08994A]" size={24} />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Hospital Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Logo & Emergency Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* Logo Upload */}
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-6 border border-gray-200 dark:border-[#2A2A2A]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Hospital Logo
            </label>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3A3A3A] flex items-center justify-center overflow-hidden bg-white dark:bg-[#0D0D0D] mb-4 relative group">
                {data.logo ? (
                  <>
                    <img
                      src={getMediaUrl(data.logo)}
                      alt="Hospital Logo"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        console.error("Failed to load logo in settings:", data.logo);
                        e.target.style.display = "none";
                      }}
                    />
                    {/* Remove logo button - only visible for admin */}
                    {isAdmin && data.logo && (
                      <button
                        onClick={handleRemoveLogo}
                        disabled={removingLogo}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                        title="Remove logo"
                      >
                        {removingLogo ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Upload className="text-gray-400 mb-2" size={48} />
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      No logo uploaded
                    </span>
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo || removingLogo}
                  />
                  <div
                    className={`px-4 py-2 rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                      uploadingLogo || removingLogo
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0EFF7B] to-[#08994A] hover:opacity-90 cursor-pointer"
                    } text-white`}
                  >
                    {uploadingLogo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Logo
                      </>
                    )}
                  </div>
                </label>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Recommended: 400x400px
                <br />
                PNG or JPG (max 5MB)
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800/30">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-red-500" size={20} />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Emergency Contact
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="text"
                  value={data.emergency_contact || ""}
                  onChange={(e) => {
                    // Allow only digits
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleChange("emergency_contact", value);
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.emergency_contact
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="9999999999"
                  maxLength={10}
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.emergency_contact && (
                  <p className="text-red-500 text-xs mt-1">{errors.emergency_contact}</p>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                24/7 emergency contact number displayed in critical areas
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hospital Name *
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={data.hospital_name || ""}
                  onChange={(e) => handleChange("hospital_name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.hospital_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Multispeciality Hospital"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.hospital_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.hospital_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GSTIN Number
              </label>
              <div className="relative">
                <Shield
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={data.gstin || ""}
                  onChange={(e) => {
                    // Allow only uppercase letters and digits, max 15 chars
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
                    handleChange("gstin", value);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.gstin
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.gstin && (
                  <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={data.phone || ""}
                  onChange={(e) => {
                    // Allow only digits, max 10 chars
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    handleChange("phone", value);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="9988556655"
                  maxLength={10}
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={data.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="example@gmail.com"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="url"
                  value={data.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="https://www.hms.stacklycloud.com"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tagline
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={data.tagline || ""}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="Your care, our commitment"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Established Year
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={data.established_year || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : "";
                    handleChange("established_year", value);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.established_year
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                  } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="2026"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
                {errors.established_year && (
                  <p className="text-red-500 text-xs mt-1">{errors.established_year}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Number
              </label>
              <div className="relative">
                <FileDigit
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={data.registration_number || ""}
                  onChange={(e) =>
                    handleChange("registration_number", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="AP/S3/S/S/"
                  disabled={!isAdmin}
                  readOnly={!isAdmin}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Address *
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                value={data.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-[#3A3A3A] focus:ring-[#0EFF7B]"
                } bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:border-transparent resize-none transition-all duration-200`}
                required
                placeholder="Street, City, State, PIN Code"
                disabled={!isAdmin}
                readOnly={!isAdmin}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}