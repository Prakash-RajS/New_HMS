import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Upload } from "lucide-react";
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

// ✅ Certificate Upload Component
const CertificateUploadBox = ({ certificates, setCertificates }) => {
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setCertificates([...certificates, ...fileUrls]);
  };

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-white">Certificates</label>
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
        className="border-[1px] 
         border-[#3A3A3A] w-full h-10 md:h-[42px] 
        flex items-center justify-center text-gray-400 cursor-pointer 
        rounded-full hover:border-[#0EFF7B] hover:text-[#0EFF7B]"
      >
        <Upload size={16} className="mr-2" />
        <span className="text-sm">Upload Certificates</span>
      </label>
      {certificates.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {certificates.map((cert, index) => (
            <div key={index} className="text-sm text-gray-400">
              Certificate {index + 1}
            </div>
          ))}
        </div>
      )}
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
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  // Dropdown options
  const maritalStatus = ["Single", "Married", "Divorced", "Widowed"];
  const departments = ["Cardiology", "Neurology", "Orthopedics", "ENT", "Anesthesiology", "Dermatology", "Gastroenterology", "Pharmacy"];
  const statusOptions = ["Active", "Inactive", "On Leave"];
  const shiftTimingOptions = ["09:00 AM - 05:00 PM", "05:00 PM - 01:00 AM", "01:00 AM - 09:00 AM"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { ...formData, photo, certificates });
    // Add logic to send data to backend or navigate
  };

  return (
    <div className="w-full  max-w-screen-2xl mb-4 mx-auto">
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
              <h2 className="text-xl md:text-2xl font-bold">Add Doctor / Nurse</h2>
              <p className="text-gray-400 text-sm md:text-base">
                *Required to fill all input 
              </p>
            </div>
            <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full min-h-[690px]">
            {/* General Info */}
            <div>
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
                  label="Age"
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
                  label="City"
                  name="city"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Enter city"
                />
                <InputField
                  label="Country"
                  name="country"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Enter country"
                />
                <InputField
                  label="Date of Joining"
                  name="doj"
                  type="date"
                  value={formData.doj || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, doj: e.target.value })
                  }
                  placeholder="DD/MM/YYYY"
                />
                <InputField
                  label="Designation"
                  name="designation"
                  value={formData.designation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="Enter designation (e.g., Doctor, Nurse)"
                />
                <Dropdown
                  label="Department"
                  value={formData.department}
                  onChange={(val) => setFormData({ ...formData, department: val })}
                  options={departments}
                />
                <InputField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder="Enter specialization (e.g., Cardiologist)"
                />
                <Dropdown
                  label="Status"
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={statusOptions}
                />
                <Dropdown
                  label="Shift Timing"
                  value={formData.shiftTiming}
                  onChange={(val) => setFormData({ ...formData, shiftTiming: val })}
                  options={shiftTimingOptions}
                />
                <CertificateUploadBox
                  certificates={certificates}
                  setCertificates={setCertificates}
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
                  setCertificates([]);
                }}
              >
                ✕ Clear
              </button>
              <button
                type="submit"
                className="px-4 py-2 md:px-6 md:py-2 bg-green-500 rounded-lg hover:bg-green-600 text-sm md:text-base"
              >
                + Add Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}