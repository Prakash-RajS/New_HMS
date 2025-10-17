import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import ProfileImage from "../../assets/image.png";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(80);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Sample data for the profile
  const [profileData, setProfileData] = useState({
    name: "Victoria Addams",
    email: "victoriaaddams@admin.com",
    phone: "+1-78654327-7896",
    role: "Administration",
    department: "Management",
    joinedDate: "April 2023",
    location: "7th street Main gate London, UK",
    timezone: "GMT +1",
  });

  // Sample recent activity data
  const recentActivity = [
    { time: "9:24 AM", action: "Logged in", user: "Victoria Addams" },
    { time: "8:24 AM", action: "Approved Doctor", category: "Administration" },
    { time: "8:00 AM", action: "Updated dashboard", category: "Management" },
    { time: "Yesterday", action: "Change password", category: "Management" },
    { time: "Yesterday", action: "Download reports", category: "Reserves" },
  ];

  // Handle Edit Toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    setIsEditing(false);
    // Update profile completion based on filled fields
    const completion = 100; // All fields are filled in this example
    setProfileCompletion(completion);
    alert("Profile updated successfully!");
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Change Password
  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // Handle Password Submit
  const handlePasswordSubmit = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!");
      return;
    }
    setShowPasswordModal(false);
    setPasswordError("");
    alert("Password changed successfully!");
  };

  return (
    <>
      <div
        className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-[8px] p-4 w-full max-w-[1400px] mx-auto flex flex-col  
         bg-white dark:bg-transparent overflow-hidden relative"
      >
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
        {/* Green Glow Effect */}
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black dark:text-white">Profile</h1>
        </div>

        {/* Admin Profile Section with Spray-like Blur Effect - Centered */}
        <div className="relative w-[770px] h-[344px] rounded-[8px] mx-auto mt-10">
          {/* Gradient Border */}
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

          {/* Green Spray Background */}
          <div
            className="absolute -top-32 -left-32 w-[730px] h-[300px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(14,255,123,0.25) 0%, transparent 80%)",
              filter: "blur(150px)",
              zIndex: 0,
              border: "1px solid rgba(14, 255, 123, 0.1)",
            }}
          />

          {/* Profile Content */}
          <div className="relative z-10 flex justify-between items-start h-full px-6 py-4">
            {/* Left Side - Profile Picture and Basic Info */}
            <div className="flex flex-col mt-4 items-center w-1/2">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={ProfileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#0EFF7B] shadow-[0px_0px_40px_5px_#0EFF7B80]"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-black dark:text-white">Victoria Addams</h3>
                  {/* Admin Profile text */}
                  <div className="flex flex-col space-y-1 mt-2 items-center">
                    <span className="text-green-500 text-sm">Admin</span>
                    <span className="text-green-500 text-sm flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-4 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 transition text-sm"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={handleChangePassword}
                  className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-4 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 transition text-sm"
                >
                  Change password
                </button>
              </div>
            </div>

            {/* Right Side - Contact Info and Profile Completion */}
            <div className="flex flex-col mt-5 space-y-8 w-1/2">
              {/* Contact Information with Icons */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white text-sm">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FaPhone className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white text-sm">{profileData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white text-sm">Oct 14, 2025</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-[#08994A] dark:text-[#0EFF7B] text-lg" />
                  </div>
                  <div>
                    <p className="text-black dark:text-white text-sm">{profileData.location}</p>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="text-left">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-black dark:text-white text-sm">Profile completion</span>
                  <span className="text-green-500 text-sm font-semibold">{profileCompletion}%</span>
                </div>
                <div className="min-w-[319px] bg-gray-300 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information with 4x4 Grid Layout */}
        <div className="mt-10">
  <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
    Personal Information
  </h2>

  <div className="relative bg-white dark:bg-black text-black dark:text-white grid grid-cols-2 gap-4 p-6 rounded-xl w-full overflow-hidden">
    {/* Gradient overlay for dark mode */}
    <div
      className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
        zIndex: 0,
      }}
    ></div>

    {/* Form Fields */}
    {[
      { label: "Full name", field: "name", type: "text" },
      { label: "Email", field: "email", type: "email" },
      { label: "Phone", field: "phone", type: "tel" },
      { label: "Role", field: "role", type: "text" },
      { label: "Department", field: "department", type: "text" },
      { label: "Joined date", field: "joinedDate", type: "text" },
      { label: "Location", field: "location", type: "text" },
      { label: "Timezone", field: "timezone", type: "text" },
    ].map(({ label, field, type }) => (
      <div key={field} className="flex flex-col">
        <label className="text-black dark:text-white text-sm mb-1">{label}</label>
        <input
          type={type}
          value={profileData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          readOnly={!isEditing}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isEditing
              ? "bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0EFF7B]"
              : "bg-white dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#3C3C3C] text-green-500"
          }`}
        />
      </div>
    ))}

    {/* Save button aligned to the right */}
    {isEditing && (
      <div className="col-span-2 flex justify-end mt-4">
        <button
          onClick={handleSaveChanges}
          className="bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] px-6 py-2 rounded-lg text-white border-b-2 border-[#0EFF7B] hover:opacity-90 transition"
        >
          Save changes
        </button>
      </div>
    )}
  </div>
</div>

      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[300px] sm:w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-4 sm:p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans relative">
              {/* Gradient Border */}
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
              <div className="flex justify-between items-center pb-2 sm:pb-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

              {/* Password Fields */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black dark:text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[#08994A] dark:text-[#0EFF7B]"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black dark:text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[32px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left focus:outline-none focus:ring-1 focus:ring-[#0EFF7B]"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[#08994A] dark:text-[#0EFF7B]"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-xs sm:text-sm">{passwordError}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="w-[120px] sm:w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Reset
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="w-[120px] sm:w-[144px] h-[32px] rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition"
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