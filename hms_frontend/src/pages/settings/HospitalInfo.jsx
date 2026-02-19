import { useState } from "react";
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
} from "lucide-react";
import api, { uploadFile } from "../../utils/axiosConfig.js";
import { useHospital } from "../../components/HospitalContext.jsx";
import { successToast, errorToast } from "../../components/Toast.jsx";
import { getMediaUrl } from "../../utils/axiosConfig";

export default function HospitalInfo({ data, onUpdate }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { updateLogo } = useHospital();
  // ✅ Removed refreshHospitalInfo — it caused a flicker by briefly
  //    resetting the logo to null while the fetch was in-flight.

  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleLogoUpload = async (e) => {
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

      // Backend now returns bare relative path e.g.
      // "hospital_logo/hospital_logo_20250101_120000.png"
      const rawLogoPath = response.data.logo_url;

      // 1. Update the settings page form preview
      onUpdate({ ...data, logo: rawLogoPath });

      // 2. Update the sidebar logo via context
      //    updateLogo calls normalizeLogo → full browser URL
      updateLogo(rawLogoPath);

      successToast("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      errorToast(error.response?.data?.detail || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
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
              <div className="w-48 h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3A3A3A] flex items-center justify-center overflow-hidden bg-white dark:bg-[#0D0D0D] mb-4">
                {data.logo ? (
                  <img
  src={getMediaUrl(data.logo)}
  alt="Hospital Logo"
  className="w-full h-full object-contain p-4"
  onError={(e) => {
    console.error("Failed to load logo in settings:", data.logo);
    e.target.style.display = "none";
  }}
/>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Upload className="text-gray-400 mb-2" size={48} />
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      No logo uploaded
                    </span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploadingLogo}
                />
                <div
                  className={`px-4 py-2 rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                    uploadingLogo
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
                  onChange={(e) =>
                    handleChange("emergency_contact", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="+91 99999 99999"
                />
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Multispeciality Hospital"
                />
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
                  onChange={(e) => handleChange("gstin", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="22AAAAA0000A1Z5"
                />
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
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="9988556655"
                />
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="example@gmail.com"
                />
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
                  onChange={(e) =>
                    handleChange("established_year", parseInt(e.target.value) || "")
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  placeholder="2026"
                />
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
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent resize-none transition-all duration-200"
                required
                placeholder="Street, City, State, PIN Code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}