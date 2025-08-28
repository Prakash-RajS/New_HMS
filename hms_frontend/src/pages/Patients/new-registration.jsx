import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Photo Upload Component
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
        className="border-2 mr-12 border-dashed border-gray-600 w-24 h-24 md:w-32 md:h-32 
        flex items-center justify-center text-gray-400 cursor-pointer 
        rounded-lg overflow-hidden hover:border-[#0EFF7B] hover:text-[#0EFF7B]"
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
    <label className="text-sm text-white">{label}</label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-full border border-[#3A3A3A]
  bg-transparent text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 
          border border-[#3A3A3A] max-h-60 overflow-y-auto"
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"}
                ${selected ? "font-medium text-[#0EFF7B]" : ""}`
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

// ✅ Reusable Input
const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-10 md:h-[42px] px-3 rounded-full border border-[#3A3A3A] 
      bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px]"
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

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="bg-black mt-16 md:mt-[90px] mb-4 p-4 md:p-6 text-white rounded-xl w-full max-w-screen-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            className="px-4 py-2 md:px-6 md:py-2 bg-green-500 rounded-lg hover:bg-green-600 text-sm md:text-base"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">New Registration</h2>
              <p className="text-gray-400 text-sm md:text-base">
                Input new patient details carefully
              </p>
            </div>
            <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full">
            {/* General Info */}
            <div>
              <h3 className="text-lg font-medium mb-1 md:mb-2">General Info</h3>
              <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
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
                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  placeholder="DD/MM/YYYY"
                />
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
                <InputField
                  label="Date of Registration"
                  name="dor"
                  type="date"
                  value={formData.dor || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dor: e.target.value })
                  }
                  placeholder="DD/MM/YYYY"
                />
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

            {/* Medical Info */}
            <div>
              <h3 className="text-lg font-medium mb-2 md:mb-4">Medical Info</h3>
              <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
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
                  onChange={(val) =>
                    setFormData({ ...formData, apptType: val })
                  }
                  options={appointmentTypes}
                />
                <InputField
                  label="Admit Date"
                  name="admitDate"
                  type="date"
                  value={formData.admitDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, admitDate: e.target.value })
                  }
                  placeholder="DD/MM/YYYY"
                />
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
                  onChange={(val) =>
                    setFormData({ ...formData, casualty: val })
                  }
                  options={casualtyTypes}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm text-white">Reason for Visit</label>
                <textarea
                  name="reason"
                  value={formData.reason || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Describe the symptoms"
                  className="w-full h-20 mt-1 px-3 py-2 rounded-lg border border-[#3A3A3A] bg-transparent text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
              <button
                type="reset"
                className="px-4 py-2 md:px-6 md:py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white text-sm md:text-base"
                onClick={() => {
                  setFormData({});
                  setPhoto(null);
                }}
              >
                ✕ Clear
              </button>
              <button
                type="submit"
                className="px-4 py-2 md:px-6 md:py-2 bg-green-500 rounded-lg hover:bg-green-600 text-sm md:text-base"
              >
                + Add Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}