import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Calendar,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Photo Upload Component
const PhotoUploadBox = ({ photo, setPhoto }) => {
  const navigate = useNavigate();
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
        className="border border-dashed border-[#0EFF7B] mr-12 w-24 h-24 md:w-32 md:h-32 
    flex items-center justify-center text-gray-600 cursor-pointer 
    rounded-lg overflow-hidden bg-[#0EFF7B1A] hover:border-[#08994A] hover:text-[#08994A]"
      >
        {photo ? (
          <img
            src={photo}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs md:text-sm">+ Add Photo</span>
        )}
      </label>
    </div>
  );
};

// ✅ Reusable Dropdown
const Dropdown = ({ label, value, onChange, options }) => (
  <div className="space-y-1 w-full">
    <label
      className="text-sm text-black dark:text-white"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {label}
    </label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
          bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 
          border border-gray-300 dark:border-[#3A3A3A] left-[2px] max-h-60 overflow-y-auto"
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                ${
                  active
                    ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                    : "text-black dark:text-white"
                }
                ${selected ? "font-medium text-[#0EFF7B]" : ""}`
              }
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  </div>
);

// ✅ Reusable Input
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-1 w-full">
    <label
      className="text-sm text-black dark:text-white"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-[33px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
      bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-[14px]"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    />
  </div>
);

export default function NewRegistration({ isSidebarOpen }) {
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  // Dropdown options
  const doctors = ["Dr. Smith", "Dr. John", "Dr. Williams"];
  const maritalStatus = ["Single", "Married", "Divorced", "Widowed"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const consultationTypes = ["General", "Specialist", "Emergency"];
  const appointmentTypes = ["In-person", "Online", "Follow-up"];
  const departments = ["Cardiology", "Neurology", "Orthopedics", "ENT"];
  const casualtyTypes = ["Yes", "No"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, photo });
  };

  const openDatePicker = (e) => {
    e.currentTarget.showPicker();
  };

  return (
    <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
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
      {/* Back Button */}
      <div className="mt-4 mb-6">
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
            <h2
              className="text-xl md:text-2xl font-bold text-black dark:text-white"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              New Registration
            </h2>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Input new patient details carefully
            </p>
          </div>
          <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full">
          {/* General Info */}
          <div>
            <h3
              className="text-lg font-medium mb-1 md:mb-2 text-black dark:text-white"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              General Info
            </h3>
            <p
              className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Input new patient details carefully
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <InputField
                label="Full Name"
                name="fullname"
                value={formData.fullname || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
                placeholder="Enter full name"
              />
              <div className="space-y-1 w-full">
                <label
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    onClick={openDatePicker}
                    className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                      bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none text-[14px]"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none"
                  />
                </div>
              </div>
              <Dropdown
                label="Gender"
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
                options={["Male", "Female", "Other"]}
              />
              <InputField
                label="Age Group"
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Enter age"
              />
              <Dropdown
                label="Marital Status"
                value={formData.maritalStatus}
                onChange={(val) =>
                  setFormData({ ...formData, maritalStatus: val })
                }
                options={maritalStatus}
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter address"
              />
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
              <InputField
                label="Email ID"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
              />
              <InputField
                label="National ID"
                name="nid"
                value={formData.nid || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nid: e.target.value })
                }
                placeholder="Enter National ID"
              />
              <InputField
                label="City place"
                name="city"
                value={formData.city || ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="City"
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country || ""}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Country"
              />
              <div className="space-y-1 w-full">
                <label
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Date of Registration
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dor"
                    value={formData.dor || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dor: e.target.value })
                    }
                    onClick={openDatePicker}
                    className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                      bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none text-[14px]"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none"
                  />
                </div>
              </div>
              <InputField
                label="Occupation"
                name="occupation"
                value={formData.occupation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                placeholder="Enter occupation"
              />
              <InputField
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight || ""}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="Enter weight in kg"
              />
              <InputField
                label="Height"
                name="height"
                type="number"
                value={formData.height || ""}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                placeholder="Enter height in cm"
              />
            </div>
          </div>

          {/* /* Medical Info */}
          <div>
            <h3
              className="text-lg font-medium mb-2 md:mb-4 text-black dark:text-white"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Medical Info
            </h3>
            <p
              className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Input new patient details carefully
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Dropdown
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={(val) =>
                  setFormData({ ...formData, bloodGroup: val })
                }
                options={bloodGroups}
              />
              <InputField
                label="Blood Pressure"
                name="bp"
                value={formData.bp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bp: e.target.value })
                }
                placeholder="e.g. 120/80 mmHg"
              />
              <InputField
                label="Temperature"
                name="temperature"
                type="number"
                value={formData.temperature || ""}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: e.target.value })
                }
                placeholder="Enter temperature"
              />
              <Dropdown
                label="Consultation Type"
                value={formData.consultType}
                onChange={(val) =>
                  setFormData({ ...formData, consultType: val })
                }
                options={consultationTypes}
              />
              <InputField
                label="Patient ID"
                name="patientId"
                value={formData.patientId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                placeholder="Enter patient ID"
              />
              <Dropdown
                label="Department"
                value={formData.department}
                onChange={(val) =>
                  setFormData({ ...formData, department: val })
                }
                options={departments}
              />
              <Dropdown
                label="Consulting Doctor"
                value={formData.doctor}
                onChange={(val) => setFormData({ ...formData, doctor: val })}
                options={doctors}
              />
              <Dropdown
                label="Appointment Type"
                value={formData.apptType}
                onChange={(val) => setFormData({ ...formData, apptType: val })}
                options={appointmentTypes}
              />
              <div className="space-y-1 w-full">
                <label
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Admit Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="admitDate"
                    value={formData.admitDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, admitDate: e.target.value })
                    }
                    onClick={openDatePicker}
                    className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                      bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none text-[14px]"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  />
                  <Calendar
                    size={18}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none"
                  />
                </div>
              </div>
              <InputField
                label="Room No"
                name="roomNo"
                value={formData.roomNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, roomNo: e.target.value })
                }
                placeholder="Enter room no"
              />
              <InputField
                label="Test Report"
                name="testReport"
                value={formData.testReport || ""}
                onChange={(e) =>
                  setFormData({ ...formData, testReport: e.target.value })
                }
                placeholder="Enter test report"
              />
              <Dropdown
                label="Casualty"
                value={formData.casualty}
                onChange={(val) => setFormData({ ...formData, casualty: val })}
                options={casualtyTypes}
              />
            </div>

            <div className="mt-4">
              <label
                className="text-sm text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Reason for Visit
              </label>
              <textarea
                name="reason"
                value={formData.reason || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Describe the symptoms"
                className="w-full h-20 mt-1 px-3 py-2 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-[14px]"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-8">
            <button
              type="reset"
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-[#3C3C3C] text-black font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] opacity-100 bg-[#0EFF7B1A] dark:bg-transparent dark:text-white"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              onClick={() => {
                setFormData({});
                setPhoto(null);
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
