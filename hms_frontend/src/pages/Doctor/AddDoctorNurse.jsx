// import { useState, useEffect } from "react";
// import { Listbox } from "@headlessui/react";
// import { ChevronDown, Upload, ArrowLeft, UserPlus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { successToast, errorToast } from "../../components/Toast";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const API_BASE = "http://127.0.0.1:8000";

// const PhotoUploadBox = ({ photo, setPhoto }) => {
//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPhoto({ file, preview: URL.createObjectURL(file) });
//     }
//   };

//   return (
//     <div className="flex justify-center md:justify-end">
//       <input
//         type="file"
//         id="photoUpload"
//         accept="image/*"
//         className="hidden"
//         onChange={handlePhotoUpload}
//       />
//       <label
//         htmlFor="photoUpload"
//         className="border-2 mr-12 border-dashed bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] border-[#0EFF7B] dark:border-[#0EFF7B] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-gray-600 dark:text-gray-400 cursor-pointer rounded-lg overflow-hidden hover:border-[#0EFF7B] dark:hover:border-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
//       >
//         {photo?.preview ? (
//           <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
//         ) : (
//           <span className="text-xs md:text-sm">+ Add Photo</span>
//         )}
//       </label>
//     </div>
//   );
// };

// const CertificateUploadBox = ({ certificates, setCertificates }) => {
//   const handleCertificateUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const fileObjects = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
//     setCertificates(prev => [...prev, ...fileObjects]);
//   };

//   const handleRemoveCertificate = (index) => {
//     setCertificates(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-1 w-full">
//       <label className="text-sm text-black dark:text-white">Certificates</label>
//       <input
//         type="file"
//         id="certificateUpload"
//         accept="image/*,application/pdf"
//         multiple
//         className="hidden"
//         onChange={handleCertificateUpload}
//       />
//       <label
//         htmlFor="certificateUpload"
//         className="border-[1px] border-[#0EFF7B] dark:border-[#3A3A3A] w-full h-10 md:h-[42px] flex items-center justify-center text-gray-600 dark:text-gray-400 cursor-pointer rounded-[8px] hover:border-[#0EFF7B] dark:hover:border-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
//       >
//         <Upload size={16} className="mr-2 text-[#08994A] dark:text-[#0EFF7B]" />
//         <span className="text-sm">Upload Certificates</span>
//       </label>
//       {certificates.length > 0 && (
//         <div className="mt-2 flex flex-wrap gap-2">
//           {certificates.map((cert, index) => (
//             <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//               <span>Certificate {index + 1}</span>
//               <button
//                 onClick={() => handleRemoveCertificate(index)}
//                 className="text-red-500 hover:text-red-600 dark:hover:text-red-500"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const Dropdown = ({ label, value, onChange, options }) => (
//   <div className="space-y-1 w-full">
//     <label className="text-sm text-black dark:text-white">{label}</label>
//     <Listbox value={value} onChange={onChange}>
//       <div className="relative">
//         <Listbox.Button
//           className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]"
//         >
//           {value || "Select"}
//           <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//             <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
//           </span>
//         </Listbox.Button>
//         <Listbox.Options
//           className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-40 overflow-y-auto"
//           style={{
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none'
//           }}
//         >
//           {options.map((option, idx) => (
//             <Listbox.Option
//               key={idx}
//               value={option}
//               className={({ active, selected }) =>
//                 `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
//                   active ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"
//                 } ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
//               }
//             >
//               {option}
//             </Listbox.Option>
//           ))}
//         </Listbox.Options>
//       </div>
//     </Listbox>
//   </div>
// );

// const DatePickerField = ({ label, name, value, onChange, placeholder }) => {
//   const selectedDate = (() => {
//     if (!value) return null;
//     const parts = value.split('/');
//     if (parts.length !== 3) return null;
//     const [month, day, year] = parts.map(Number);
//     if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
//     const date = new Date(year, month - 1, day);
//     if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
//     return date;
//   })();

//   return (
//     <div className="space-y-1 w-full">
//       <label className="text-sm text-black dark:text-white">{label}</label>
//       <div className="relative">
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => {
//             const formatted = date
//               ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
//                   date.getDate()
//                 ).padStart(2, "0")}/${date.getFullYear()}`
//               : "";
//             onChange({ target: { name, value: formatted } });
//           }}
//           dateFormat="MM/dd/yyyy"
//           placeholderText={placeholder}
//           showYearDropdown
//           scrollableYearDropdown
//           yearDropdownItemNumber={100}
//           className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px] focus:ring-1 focus:ring-[#0EFF7B]"
//           wrapperClassName="w-full"
//           popperClassName="z-50"
//         />
//         <div className="absolute right-3 top-2.5 pointer-events-none">
//           <svg
//             width="18"
//             height="18"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             className="text-[#0EFF7B]"
//           >
//             <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//             <line x1="16" y1="2" x2="16" y2="6" />
//             <line x1="8" y1="2" x2="8" y2="6" />
//             <line x1="3" y1="10" x2="21" y2="10" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
//   <div className="space-y-1 w-full">
//     <label className="text-sm text-black dark:text-white">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={["fullname", "age", "address", "phone", "email", "nid", "city", "country", "designation", "specialization"].includes(name)}
//       className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px]"
//     />
//   </div>
// );

// export default function NewRegistration({ isSidebarOpen }) {
//   const [formData, setFormData] = useState({
//     fullname: "", dob: "", gender: "", age: "", maritalStatus: "", address: "", phone: "",
//     email: "", nid: "", city: "", country: "", doj: "", designation: "", department: "",
//     specialization: "", status: "", shiftTiming: ""
//   });
//   const [photo, setPhoto] = useState(null);
//   const [certificates, setCertificates] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const maritalStatus = ["Single", "Married", "Divorced", "Widowed"];
//   const statusOptions = ["Active", "Inactive", "On Leave"];
//   const shiftTimingOptions = ["09:00 AM - 05:00 PM", "05:00 PM - 01:00 AM", "01:00 AM - 09:00 AM"];

//   // Fetch departments
//   useEffect(() => {
//     fetch(`${API_BASE}/departments/`)
//       .then(res => res.ok ? res.json() : Promise.reject("Failed to load departments"))
//       .then(data => setDepartments(data.map(d => d.name)))
//       .catch(() => errorToast("Failed to load departments"));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.fullname || !formData.email || !formData.phone || !formData.designation || !formData.department) {
//       errorToast("Please fill all required fields");
//       return;
//     }

//     setLoading(true);
//     const form = new FormData();
//     const deptId = await fetch(`${API_BASE}/departments/`)
//       .then(r => r.json())
//       .then(d => d.find(x => x.name === formData.department)?.id);

//     if (!deptId) { errorToast("Invalid department"); setLoading(false); return; }

//     // Append all fields
//     form.append("full_name", formData.fullname);
//     form.append("date_of_birth", formData.dob);
//     form.append("gender", formData.gender);
//     form.append("age", formData.age);
//     form.append("marital_status", formData.maritalStatus);
//     form.append("address", formData.address);
//     form.append("phone", formData.phone);
//     form.append("email", formData.email);
//     form.append("national_id", formData.nid);
//     form.append("city", formData.city);
//     form.append("country", formData.country);
//     form.append("date_of_joining", formData.doj);
//     form.append("designation", formData.designation);
//     form.append("department_id", deptId);
//     form.append("specialization", formData.specialization || "");
//     form.append("status", formData.status);
//     form.append("shift_timing", formData.shiftTiming);

//     // Photo
//     if (photo) form.append("profile_picture", photo.file);

//     // Certificates (multiple)
//     certificates.forEach(c => form.append("certificates", c.file));

//     try {
//       const res = await fetch(`${API_BASE}/staff/add/`, {
//         method: "POST",
//         body: form,
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.detail || "Failed to add staff");
//       }

//       const staff = await res.json();
//       successToast(`"${staff.full_name}" added! ID: ${staff.employee_id}`);
//       navigate(-1);
//     } catch (err) {
//       errorToast(err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({});
//     setPhoto(null);
//     setCertificates([]);
//   };

//   return (
//     <div className="w-full max-w-screen-2xl mb-4 mx-auto">
//       <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative">
//         {/* Dark Overlay */}
//         <div
//           className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
//           style={{
//             background: "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
//             zIndex: 0,
//           }}
//         ></div>

//         {/* Gradient Border */}
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             borderRadius: "10px",
//             padding: "2px",
//             background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
//             WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//             WebkitMaskComposite: "xor",
//             maskComposite: "exclude",
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         ></div>

//         {/* Back Button */}
//         <div className="mb-6">
//           <button
//             className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
//             onClick={() => navigate(-1)}
//             disabled={loading}
//             style={{
//               background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
//             }}
//           >
//             <ArrowLeft size={18} /> Back
//           </button>
//         </div>

//         <div className="grid grid-cols-1 gap-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="space-y-2">
//               <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">Add Doctor / Nurse</h2>
//               <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
//                 *Required to fill all input
//               </p>
//             </div>
//             <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full">
//             <div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                 <InputField label="Full Name" name="fullname" value={formData.fullname || ""} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} placeholder="Enter full name" />
//                 <DatePickerField label="Date of Birth" name="dob" value={formData.dob || ""} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} placeholder="MM/DD/YYYY" />
//                 <Dropdown label="Gender" value={formData.gender} onChange={(val) => setFormData({ ...formData, gender: val })} options={["Male", "Female", "Other"]} />
//                 <InputField label="Age" name="age" type="number" value={formData.age || ""} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="Enter age" />
//                 <Dropdown label="Marital Status" value={formData.maritalStatus} onChange={(val) => setFormData({ ...formData, maritalStatus: val })} options={maritalStatus} />
//                 <InputField label="Address" name="address" value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address" />
//                 <InputField label="Phone" name="phone" type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" />
//                 <InputField label="Email ID" name="email" type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
//                 <InputField label="National ID" name="nid" value={formData.nid || ""} onChange={(e) => setFormData({ ...formData, nid: e.target.value })} placeholder="Enter National ID" />
//                 <InputField label="City" name="city" value={formData.city || ""} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Enter city" />
//                 <InputField label="Country" name="country" value={formData.country || ""} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Enter country" />
//                 <DatePickerField label="Date of Joining" name="doj" value={formData.doj || ""} onChange={(e) => setFormData({ ...formData, doj: e.target.value })} placeholder="MM/DD/YYYY" />
//                 <InputField label="Designation" name="designation" value={formData.designation || ""} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} placeholder="Enter designation (e.g., Doctor, Nurse)" />
//                 <Dropdown label="Department" value={formData.department} onChange={(val) => setFormData({ ...formData, department: val })} options={departments} />
//                 <InputField label="Specialization" name="specialization" value={formData.specialization || ""} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="Enter specialization (e.g., Cardiologist)" />
//                 <Dropdown label="Status" value={formData.status} onChange={(val) => setFormData({ ...formData, status: val })} options={statusOptions} />
//                 <Dropdown label="Shift Timing" value={formData.shiftTiming} onChange={(val) => setFormData({ ...formData, shiftTiming: val })} options={shiftTimingOptions} />
//                 <CertificateUploadBox certificates={certificates} setCertificates={setCertificates} />
//               </div>
//             </div>

//             <div className="flex flex-col pt-7 sm:flex-row justify-end gap-3 md:gap-4">
//               <button
//                 type="reset"
//                 className="px-4 py-2 md:px-6 md:py-2 rounded-[8px] border border-[#0EFF7B] dark:border-gray-600 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm md:text-base"
//                 onClick={handleReset}
//                 disabled={loading}
//               >
//                 ✕ Clear
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-lg hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base disabled:opacity-50"
//                 style={{
//                   background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus size={18} className="text-white" />
//                     Add Staff
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Upload, ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../../components/Toast";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://127.0.0.1:8000";

const PhotoUploadBox = ({ photo, setPhoto }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto({ file, preview: URL.createObjectURL(file) });
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
        {photo?.preview ? (
          <img
            src={photo.preview}
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

const CertificateUploadBox = ({ certificates, setCertificates }) => {
  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setCertificates((prev) => [...prev, ...fileObjects]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index));
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
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
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
        <Listbox.Button className="w-full h-10 md:h-[42px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] text-left text-sm md:text-[14px] leading-[16px]">
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] max-h-40 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                  active
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                    : "text-black dark:text-white"
                } ${
                  selected
                    ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                    : ""
                }`
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

const DatePickerField = ({ label, name, value, onChange, placeholder }) => {
  const selectedDate = (() => {
    if (!value) return null;
    const parts = value.split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts.map(Number);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    )
      return null;
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
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px] focus:ring-1 focus:ring-[#0EFF7B]"
          wrapperClassName="w-full"
          popperClassName="z-50"
        />
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

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-black dark:text-white">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full h-10 md:h-[42px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px]"
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}) => (
  <div className="space-y-1 w-full">
    <label className="text-sm text-black dark:text-white">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 outline-none text-sm md:text-[14px] resize-none"
    />
  </div>
);

export default function NewRegistration({ isSidebarOpen }) {
  const [formData, setFormData] = useState({
    // Basic Information
    full_name: "",
    date_of_birth: "",
    gender: "",
    age: "",
    marital_status: "",
    address: "",
    phone: "",
    email: "",
    national_id: "",
    city: "",
    country: "",
    date_of_joining: "",
    designation: "",
    department: "",
    specialization: "",
    status: "",
    shift_timing: "",

    // New Dynamic Fields
    education: "",
    about_physician: "",
    experience: "",
    license_number: "",
    board_certifications: "",
    professional_memberships: "",
    languages_spoken: "",
    awards_recognitions: "",
  });

  const [photo, setPhoto] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const maritalStatus = ["Single", "Married", "Divorced", "Widowed"];
  const statusOptions = ["Active", "Inactive", "On Leave"];
  const shiftTimingOptions = [
    "09:00 AM - 05:00 PM",
    "05:00 PM - 01:00 AM",
    "01:00 AM - 09:00 AM",
  ];

  // Fetch departments
  useEffect(() => {
    fetch(`${API_BASE}/departments/`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load departments")
      )
      .then((data) => {
        setDepartments(data.map((d) => d.name));
        // Store department mapping for ID lookup
        setDepartmentId(
          data.reduce((acc, dept) => {
            acc[dept.name] = dept.id;
            return acc;
          }, {})
        );
      })
      .catch(() => errorToast("Failed to load departments"));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started", formData);

    // Validation
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.designation ||
      !formData.department
    ) {
      errorToast("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      // Append all form fields with correct field names
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      });

      // Append department_id instead of department name
      if (formData.department && departmentId[formData.department]) {
        form.append("department_id", departmentId[formData.department]);
      } else {
        errorToast("Invalid department selected");
        setLoading(false);
        return;
      }

      // Append files
      if (photo) {
        form.append("profile_picture", photo.file);
      }

      if (certificates.length > 0) {
        certificates.forEach((cert) => {
          form.append("certificates", cert.file);
        });
      }

      // Log form data for debugging
      console.log("Submitting form data:");
      for (let [key, value] of form.entries()) {
        if (key !== "profile_picture" && key !== "certificates") {
          console.log(`${key}: ${value}`);
        } else {
          console.log(`${key}: [File]`);
        }
      }

      const response = await fetch(`${API_BASE}/staff/add/`, {
        method: "POST",
        body: form,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Server response error:", responseData);
        throw new Error(
          responseData.detail || `HTTP error! status: ${response.status}`
        );
      }

      successToast(
        `"${responseData.full_name}" added! ID: ${responseData.employee_id}`
      );
      navigate(-1);
    } catch (err) {
      console.error("Submission error:", err);
      errorToast(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      full_name: "",
      date_of_birth: "",
      gender: "",
      age: "",
      marital_status: "",
      address: "",
      phone: "",
      email: "",
      national_id: "",
      city: "",
      country: "",
      date_of_joining: "",
      designation: "",
      department: "",
      specialization: "",
      status: "",
      shift_timing: "",
      education: "",
      about_physician: "",
      experience: "",
      license_number: "",
      board_certifications: "",
      professional_memberships: "",
      languages_spoken: "",
      awards_recognitions: "",
    });
    setPhoto(null);
    setCertificates([]);
  };

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto font-[Helvetica]">
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative">
        {/* Dark Overlay */}
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
        <div className="mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 rounded-[8px] hover:bg-[#0EFF7B1A] border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base"
            onClick={() => navigate(-1)}
            disabled={loading}
            style={{
              background:
                "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                Add Doctor / Nurse
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                *Required to fill all input
              </p>
            </div>
            <PhotoUploadBox photo={photo} setPhoto={setPhoto} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 min-w-full w-full">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white border-b border-[#0EFF7B] pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <InputField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
                <DatePickerField
                  label="Date of Birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  placeholder="MM/DD/YYYY"
                />
                <Dropdown
                  label="Gender"
                  value={formData.gender}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: val }))
                  }
                  options={["Male", "Female", "Other"]}
                />
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  required
                />
                <Dropdown
                  label="Marital Status"
                  value={formData.marital_status}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, marital_status: val }))
                  }
                  options={maritalStatus}
                />
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  required
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
                <InputField
                  label="Email ID"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
                <InputField
                  label="National ID"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleInputChange}
                  placeholder="Enter National ID"
                  required
                />
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
                <InputField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  required
                />
                <DatePickerField
                  label="Date of Joining"
                  name="date_of_joining"
                  value={formData.date_of_joining}
                  onChange={handleInputChange}
                  placeholder="MM/DD/YYYY"
                />
                <InputField
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Enter designation (e.g., Doctor, Nurse)"
                  required
                />
                <Dropdown
                  label="Department"
                  value={formData.department}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, department: val }))
                  }
                  options={departments}
                />
                <InputField
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="Enter specialization (e.g., Cardiologist)"
                />
                <Dropdown
                  label="Status"
                  value={formData.status}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, status: val }))
                  }
                  options={statusOptions}
                />
                <Dropdown
                  label="Shift Timing"
                  value={formData.shift_timing}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, shift_timing: val }))
                  }
                  options={shiftTimingOptions}
                />
                <CertificateUploadBox
                  certificates={certificates}
                  setCertificates={setCertificates}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white border-b border-[#0EFF7B] pb-2">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <TextAreaField
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiologist"
                />
                <TextAreaField
                  label="About Physician"
                  name="about_physician"
                  value={formData.about_physician}
                  onChange={handleInputChange}
                  placeholder="Dedicated to providing compassionate, patient-centered care."
                />
                <InputField
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 10+ years"
                />
                <InputField
                  label="License Number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="Enter license number"
                />
                <TextAreaField
                  label="Board Certifications"
                  name="board_certifications"
                  value={formData.board_certifications}
                  onChange={handleInputChange}
                  placeholder="e.g., American Board of Orthopedic Surgery"
                />
                <TextAreaField
                  label="Professional Memberships"
                  name="professional_memberships"
                  value={formData.professional_memberships}
                  onChange={handleInputChange}
                  placeholder="e.g., American Medical Association (AMA)"
                />
                <InputField
                  label="Languages Spoken"
                  name="languages_spoken"
                  value={formData.languages_spoken}
                  onChange={handleInputChange}
                  placeholder="e.g., English, Spanish"
                />
                <TextAreaField
                  label="Awards & Recognitions"
                  name="awards_recognitions"
                  value={formData.awards_recognitions}
                  onChange={handleInputChange}
                  placeholder="e.g., Top Doctor awards, hospital honors"
                />
              </div>
            </div>

            <div className="flex flex-col pt-7 sm:flex-row justify-end gap-3 md:gap-4">
              <button
                type="reset"
                className="px-4 py-2 md:px-6 md:py-2 rounded-[8px] border border-[#0EFF7B] dark:border-gray-600 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm md:text-base"
                onClick={handleReset}
                disabled={loading}
              >
                ✕ Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2 border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66] rounded-lg hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 text-white dark:text-white text-sm md:text-base disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="text-white" />
                    Add Staff
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
