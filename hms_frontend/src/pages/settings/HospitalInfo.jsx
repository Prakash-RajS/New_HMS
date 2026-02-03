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
  Clock,
} from "lucide-react";
import api, {
  uploadFile,
  getMediaUrl,
  preloadImage,
} from "../../utils/axiosConfig.js";
import { useHospital } from "../../components/HospitalContext.jsx";
import { successToast, errorToast } from "../../components/Toast.jsx";

export default function HospitalInfo({ data, onUpdate }) {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { updateLogo, refreshHospitalInfo } = useHospital();

  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleWorkingHoursChange = (day, field, value) => {
    const workingHours = data.working_hours || {
      monday: { start: "09:00", end: "18:00", open: true },
      tuesday: { start: "09:00", end: "18:00", open: true },
      wednesday: { start: "09:00", end: "18:00", open: true },
      thursday: { start: "09:00", end: "18:00", open: true },
      friday: { start: "09:00", end: "18:00", open: true },
      saturday: { start: "09:00", end: "14:00", open: true },
      sunday: { start: "09:00", end: "14:00", open: false },
    };
    onUpdate({
      ...data,
      working_hours: {
        ...workingHours,
        [day]: {
          ...workingHours[day],
          [field]: field === "open" ? value === "true" : value,
        },
      },
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      errorToast(
        "Please select an image file (PNG, JPG, JPEG, GIF, SVG, WEBP)",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorToast("File size should be less than 5MB");
      return;
    }

    try {
      setUploadingLogo(true);

      // Use the uploadFile utility with progress tracking
      const response = await uploadFile(
  "/hospital/upload-logo",
  file,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);


      // Get full media URL using helper
      const fullLogoUrl = getMediaUrl(response.data.logo_url);

      // Update local state
      onUpdate({
        ...data,
        logo: fullLogoUrl,
      });

      // Update global context
      if (fullLogoUrl) {
        updateLogo(fullLogoUrl);
      }

      // Preload image to ensure it's cached
      await preloadImage(fullLogoUrl);

      successToast("Logo uploaded successfully!");

      // Refresh hospital info to get all updated data
      await refreshHospitalInfo();
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
                    src={data.logo}
                    alt="Hospital Logo"
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      console.error("Failed to load logo in settings");
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          {/* Basic Information */}
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
                  onChange={(e) =>
                    handleChange("hospital_name", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:ring-2 focus:ring-[#0EFF7B] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Sravan Multispeciality Hospital"
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
                  placeholder="sravan@gmail.com"
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
                    handleChange(
                      "established_year",
                      parseInt(e.target.value) || "",
                    )
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

          {/* Working Hours */}
          {/* <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-6 border border-gray-200 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-[#08994A]" size={20} />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Working Hours
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(
                data.working_hours || {
                  monday: { start: "09:00", end: "18:00", open: true },
                  tuesday: { start: "09:00", end: "18:00", open: true },
                  wednesday: { start: "09:00", end: "18:00", open: true },
                  thursday: { start: "09:00", end: "18:00", open: true },
                  friday: { start: "09:00", end: "18:00", open: true },
                  saturday: { start: "09:00", end: "14:00", open: true },
                  sunday: { start: "09:00", end: "14:00", open: false },
                },
              ).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {day}
                    </label>
                    <select
                      value={hours.open.toString()}
                      onChange={(e) =>
                        handleWorkingHoursChange(day, "open", e.target.value)
                      }
                      className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] transition-all duration-200"
                    >
                      <option value="true">Open</option>
                      <option value="false">Closed</option>
                    </select>
                  </div>
                  {hours.open && (
                    <div className="flex gap-2 items-center">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) =>
                          handleWorkingHoursChange(day, "start", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] transition-all duration-200"
                      />
                      <span className="self-center text-gray-500 dark:text-gray-400">
                        to
                      </span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) =>
                          handleWorkingHoursChange(day, "end", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#0D0D0D] focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
