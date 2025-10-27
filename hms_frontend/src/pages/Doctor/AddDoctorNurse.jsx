import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Upload, ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* NEW: Import react-datepicker */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* PhotoUploadBox and CertificateUploadBox remain unchanged */
const PhotoUploadBox = ({ photo, setPhoto }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
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
        className="border-2 mr-12 border-dashed bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] border-[#0EFF7B] dark:border-[#0EFF7B] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-gray-600 dark:text-gray-400 cursor-pointer rounded-lg overflow-hidden hover:border-[#0EFF7B] dark:hover:border-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
      >
        {photo ? (
          <img src={photo} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs md:text-sm">+ Add Photo</span>
        )}
      </label>
    </div>
  );
};

const CertificateUploadBox = ({ certificates, setCertificates }) => {
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setCertificates([...certificates, ...fileUrls]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-black dark:text-white">Certificates</label>
      <input
        type="file"
        id="certificateUpload"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleCertificateUpload}
      />
      <label
        htmlFor="certificateUpload"
        className="border-[1px] border-[#0EFF7B] dark:border-[#3A3A3A] w-full h-10 md:h-[42px] flex items-center justify-center text-gray-600 dark:text-gray-400 cursor-pointer rounded-[8px] hover:border-[#0EFF7B] dark:hover:border-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
      >
        <Upload size={16} className="mr-2 text-[#08994A] dark:text-[#0EFF7B]" />
        <span className="text-sm">Upload Certificates</span>
      </label>
      {certificates.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {certificates.map((cert, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Certificate {index + 1}</span>
              <button
                onClick={() => handleRemoveCertificate(index)}
                className="text-red-500 hover:text-red-600 dark:hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dropdown = ({ label, value, onChange, options }) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-40 overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                  active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
                } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
              }
            >
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  </div>
);

/* NEW: DatePickerField component using react-datepicker */
const DatePickerField = ({ label, name, value, onChange, placeholder }) => {
  // Safe parsing: only create Date if value is a valid MM/DD/YYYY string
  const selectedDate = (() => {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length !== 3) return null;
    const [month, day, year] = parts.map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    const date = new Date(year, month - 1, day);
    // Check if the date is valid (e.g., not Feb 30)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  })();

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-black dark:text-white">{label}</label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            const formatted = date
              ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                  date.getDate()
                ).padStart(2, "0")}/${date.getFullYear()}`
              : "";
            onChange({ target: { name, value: formatted } });
          }}
          dateFormat="MM/dd/yyyy"
          placeholderText={placeholder}
          className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px] focus:ring-1 focus:ring-[#0EFF7B]"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
        {/* Calendar Icon */}
        <div className="absolute right-3 top-2.5 pointer-events-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#0EFF7B]"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* InputField component (removed old date icon logic) */
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-black dark:text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={["fullname", "age", "address", "phone", "email", "nid", "city", "country", "designation", "specialization"].includes(name)}
      className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px]"
    />
  </div>
);

export default function NewRegistration({ isSidebarOpen }) {
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  const maritalStatus = ["Single", "Married", "Divorced", "Widowed"];
  const departments = ["Cardiology", "Neurology", "Orthopedics", "ENT", "Anesthesiology", "Dermatology", "Gastroenterology", "Pharmacy"];
  const statusOptions = ["Active", "Inactive", "On Leave"];
  const shiftTimingOptions = ["09:00 AM - 05:00 PM", "05:00 PM - 01:00 AM", "01:00 AM - 09:00 AM"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, photo, certificates });
    navigate(-1);
  };

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto">
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative">
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
          style={{
            background: "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
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
            background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
            onClick={() => navigate(-1)}
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">Add Doctor / Nurse</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                *Required to fill all input
              </p>
            </div>
            <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Full Name */}
                <InputField
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname || ""}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  placeholder="Enter full name"
                />

                {/* Date of Birth – react-datepicker */}
                <DatePickerField
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  placeholder="MM/DD/YYYY"
                />

                {/* Gender */}
                <Dropdown
                  label="Gender"
                  value={formData.gender}
                  onChange={(val) => setFormData({ ...formData, gender: val })}
                  options={["Male", "Female", "Other"]}
                />

                {/* Age */}
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                />

                {/* Marital Status */}
                <Dropdown
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={(val) => setFormData({ ...formData, maritalStatus: val })}
                  options={maritalStatus}
                />

                {/* Address */}
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />

                {/* Phone */}
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />

                {/* Email ID */}
                <InputField
                  label="Email ID"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />

                {/* National ID */}
                <InputField
                  label="National ID"
                  name="nid"
                  value={formData.nid || ""}
                  onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                  placeholder="Enter National ID"
                />

                {/* City */}
                <InputField
                  label="City"
                  name="city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />

                {/* Country */}
                <InputField
                  label="Country"
                  name="country"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                />

                {/* Date of Joining – react-datepicker */}
                <DatePickerField
                  label="Date of Joining"
                  name="doj"
                  value={formData.doj || ""}
                  onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
                  placeholder="MM/DD/YYYY"
                />

                {/* Designation */}
                <InputField
                  label="Designation"
                  name="designation"
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation (e.g., Doctor, Nurse)"
                />

                {/* Department */}
                <Dropdown
                  label="Department"
                  value={formData.department}
                  onChange={(val) => setFormData({ ...formData, department: val })}
                  options={departments}
                />

                {/* Specialization */}
                <InputField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Enter specialization (e.g., Cardiologist)"
                />

                {/* Status */}
                <Dropdown
                  label="Status"
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={statusOptions}
                />

                {/* Shift Timing */}
                <Dropdown
                  label="Shift Timing"
                  value={formData.shiftTiming}
                  onChange={(val) => setFormData({ ...formData, shiftTiming: val })}
                  options={shiftTimingOptions}
                />

                {/* Certificates */}
                <CertificateUploadBox certificates={certificates} setCertificates={setCertificates} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
              <button
                type="reset"
                className="px-4 py-2 md:px-6 md:py-2 rounded-[8px] border border-[#0EFF7B] dark:border-gray-600 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm md:text-base"
                onClick={() => {
                  setFormData({});
                  setPhoto(null);
                  setCertificates([]);
                }}
              >
                ✕ Clear
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-lg hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
                style={{
                  background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                }}
              >
                <UserPlus size={18} className="text-white" />
                Add Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}