// // EditDispatchModal.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { X, ChevronDown, CalendarClock } from "lucide-react";
// import { Listbox } from "@headlessui/react";
// import { successToast, errorToast } from "../../../components/Toast.jsx";

// const EditDispatchModal = ({
//   isOpen,
//   onClose,
//   dispatch,
//   onSave,
//   units = [],
// }) => {
//   const isEdit = !!dispatch?.id;

//   const freshTimestamp = () => {
//     const d = new Date();
//     const pad = (n) => String(n).padStart(2, "0");
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//       d.getDate()
//     )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
//   };

//   const toLocalDateTimeValue = (v) => {
//     if (!v) return freshTimestamp();
//     const d = new Date(v);
//     if (isNaN(d)) return freshTimestamp();
//     const pad = (n) => String(n).padStart(2, "0");
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//       d.getDate()
//     )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
//   };

//   const [form, setForm] = useState({
//     unit_id: "",
//     dispatcher: "",
//     call_type: "Emergency",
//     status: "Standby",
//     location: "",
//     timestamp: freshTimestamp(),
//   });

//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);

//   const timestampRef = useRef(null);

//   useEffect(() => {
//     if (isOpen) {
//       if (dispatch) {
//         setForm({
//           unit_id: dispatch.unit?.id || dispatch.unit_id || "",
//           dispatcher: dispatch.dispatcher || "",
//           call_type: dispatch.call_type || "Emergency",
//           status: dispatch.status || "Standby",
//           location: dispatch.location || "",
//           timestamp: toLocalDateTimeValue(dispatch.timestamp),
//         });
//       } else {
//         setForm({
//           unit_id: units[0]?.id || "",
//           dispatcher: "",
//           call_type: "Emergency",
//           status: "Standby",
//           location: "",
//           timestamp: freshTimestamp(),
//         });
//       }
//       setErrors({});
//       setShowErrors(false);
//     }
//   }, [isOpen, dispatch, units]);

//   const validateField = (name, value) => {
//     switch (name) {
//       case 'dispatcher':
//         if (!value.trim()) return "Dispatcher name is required";
//         if (!/^[A-Za-z\s]+$/.test(value.trim())) return "Only letters and spaces allowed";
//         if (value.trim().length < 2) return "Must be at least 2 characters";
//         return "";
      
//       case 'location':
//         if (!value.trim()) return "Location is required";
//         if (!/^[A-Za-z\s]+$/.test(value.trim())) return "Only letters and spaces allowed";
//         if (value.trim().length < 3) return "Must be at least 3 characters";
//         return "";
      
//       case 'unit_id':
//         if (!value) return "Unit selection is required";
//         return "";
      
//       default:
//         return "";
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
    
//     // Real-time validation while typing (only in create mode)
//     if (!isEdit) {
//       const error = validateField(name, value);
//       setErrors(prev => ({
//         ...prev,
//         [name]: error
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     newErrors.dispatcher = validateField('dispatcher', form.dispatcher);
//     newErrors.location = validateField('location', form.location);
//     newErrors.unit_id = validateField('unit_id', form.unit_id);
    
//     if (form.timestamp) {
//       const selectedDate = new Date(form.timestamp);
//       const now = new Date();
//       if (selectedDate > now) {
//         newErrors.timestamp = "Timestamp cannot be in the future";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.values(newErrors).every(error => error === "");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!isEdit) {
//       setShowErrors(true);
      
//       if (!validateForm()) {
//         errorToast("Please fix the validation errors before submitting");
//         return;
//       }
//     }
    
//     onSave(form);
//     onClose();
//   };

//   if (!isOpen) return null;

//   const Dropdown = ({
//     label,
//     value,
//     onChange,
//     options,
//     placeholder,
//     isObject = false,
//     error = ""
//   }) => (
//     <div>
//       <label className="text-sm text-black dark:text-white">
//         {label} 
//         {!isEdit && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <Listbox value={value} onChange={(v) => {
//         onChange(v);
//         // Real-time validation for dropdown change
//         if (!isEdit) {
//           const error = validateField('unit_id', v);
//           setErrors(prev => ({
//             ...prev,
//             unit_id: error
//           }));
//         }
//       }}>
//         <div className="relative mt-1 w-[228px]">
//           <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
//             {value
//               ? isObject
//                 ? options.find((o) => String(o.id) === String(value))
//                     ?.unit_number || value
//                 : value
//               : placeholder}
//             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
//           </Listbox.Button>
//           <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
//             {options.map((opt) => {
//               const label = isObject ? opt.unit_number || opt.id : opt;
//               const val = isObject ? opt.id : opt;
//               return (
//                 <Listbox.Option
//                   key={val}
//                   value={val}
//                   className={({ active, selected }) =>
//                     `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
//                       active
//                         ? "bg-[#0EFF7B33] text-[#0EFF7B]"
//                         : "text-black dark:text-white"
//                     } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                   }
//                 >
//                   {label}
//                 </Listbox.Option>
//               );
//             })}
//           </Listbox.Options>
//         </div>
//       </Listbox>
//       {/* Show real-time validation errors while typing */}
//       {!isEdit && error && (
//         <p className="text-red-500 text-xs mt-1">{error}</p>
//       )}
//     </div>
//   );

//   const openTimestampPicker = () => {
//     timestampRef.current?.showPicker?.() || timestampRef.current?.focus();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
//       <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
//         <div className="w-[504px] h-auto rounded-[19px] bg-gray-100 dark:bg-black text-black dark:text-white p-6 relative">
//           <div className="flex justify-between items-center pb-2 mb-3">
//             <h3 className="font-medium text-[16px]">
//               {isEdit ? "Edit Dispatch" : "Add Dispatch"}
//             </h3>
//             <button
//               onClick={onClose}
//               className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
//           >
//             <Dropdown
//               label="Unit"
//               value={form.unit_id}
//               onChange={(v) => {
//                 setForm((p) => ({ ...p, unit_id: v }));
//               }}
//               options={units}
//               placeholder="Select Unit"
//               isObject={true}
//               error={errors.unit_id}
//             />
//             <div>
//               <label className="text-sm text-black dark:text-white">
//                 Dispatcher 
//                 {!isEdit && <span className="text-red-500 ml-1">*</span>}
//               </label>
//               <input
//                 name="dispatcher"
//                 value={form.dispatcher}
//                 onChange={handleChange}
//                 placeholder="Enter name"
//                 className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]"
//               />
//               {/* Show real-time validation errors while typing */}
//               {!isEdit && errors.dispatcher && (
//                 <p className="text-red-500 text-xs mt-1">{errors.dispatcher}</p>
//               )}
//             </div>
//             <div>
//               <label className="text-sm text-black dark:text-white">
//                 Call Type 
//                 {!isEdit && <span className="text-red-500 ml-1">*</span>}
//               </label>
//               <Listbox 
//                 value={form.call_type} 
//                 onChange={(v) => setForm((p) => ({ ...p, call_type: v }))}
//               >
//                 <div className="relative mt-1 w-[228px]">
//                   <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
//                     {form.call_type}
//                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
//                   </Listbox.Button>
//                   <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
//                     {["Emergency", "Non-Emergency", "Transfer"].map((opt) => (
//                       <Listbox.Option
//                         key={opt}
//                         value={opt}
//                         className={({ active, selected }) =>
//                           `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
//                             active
//                               ? "bg-[#0EFF7B33] text-[#0EFF7B]"
//                               : "text-black dark:text-white"
//                           } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                         }
//                       >
//                         {opt}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </div>
//               </Listbox>
//             </div>
//             <div>
//               <label className="text-sm text-black dark:text-white">
//                 Status 
//                 {!isEdit && <span className="text-red-500 ml-1">*</span>}
//               </label>
//               <Listbox 
//                 value={form.status} 
//                 onChange={(v) => setForm((p) => ({ ...p, status: v }))}
//               >
//                 <div className="relative mt-1 w-[228px]">
//                   <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
//                     {form.status}
//                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
//                   </Listbox.Button>
//                   <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
//                     {["Standby", "En Route", "Completed", "Cancelled"].map((opt) => (
//                       <Listbox.Option
//                         key={opt}
//                         value={opt}
//                         className={({ active, selected }) =>
//                           `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
//                             active
//                               ? "bg-[#0EFF7B33] text-[#0EFF7B]"
//                               : "text-black dark:text-white"
//                           } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
//                         }
//                       >
//                         {opt}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </div>
//               </Listbox>
//             </div>
//             <div className="col-span-2">
//               <label className="text-sm text-black dark:text-white">
//                 Location 
//                 {!isEdit && <span className="text-red-500 ml-1">*</span>}
//               </label>
//               <input
//                 name="location"
//                 value={form.location}
//                 onChange={handleChange}
//                 placeholder="Enter location"
//                 className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]"
//               />
//               {/* Show real-time validation errors while typing */}
//               {!isEdit && errors.location && (
//                 <p className="text-red-500 text-xs mt-1">{errors.location}</p>
//               )}
//             </div>
//             <div className="col-span-2">
//               <label
//                 htmlFor="timestamp"
//                 className="block mb-1 cursor-pointer text-sm text-black dark:text-white"
//                 onClick={openTimestampPicker}
//               >
//                 Timestamp 
//                 {!isEdit && <span className="text-red-500 ml-1">*</span>}
//               </label>
//               <div className="relative">
//                 <input
//                   ref={timestampRef}
//                   type="datetime-local"
//                   name="timestamp"
//                   value={form.timestamp}
//                   onChange={handleChange}
//                   className="w-full h-[33px] pr-7 pl-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] cursor-pointer"
//                 />
//                 <CalendarClock
//                   onClick={openTimestampPicker}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer"
//                 />
//               </div>
//               {/* Show real-time validation errors while typing */}
//               {!isEdit && errors.timestamp && (
//                 <p className="text-red-500 text-xs mt-1">{errors.timestamp}</p>
//               )}
//             </div>
//             <div className="col-span-2 flex justify-center gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="w-[144px] h-[34px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white"
//               >
//                 {isEdit ? "Save" : "Create"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditDispatchModal;

// EditDispatchModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CalendarClock, MapPin } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const EditDispatchModal = ({
  isOpen,
  onClose,
  dispatch,
  onSave,
  units = [],
}) => {
  const isEdit = !!dispatch?.id;

  const freshTimestamp = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const toLocalDateTimeValue = (v) => {
    if (!v) return freshTimestamp();
    const d = new Date(v);
    if (isNaN(d)) return freshTimestamp();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Valid Vizag locations
  const vizagLocations = [
    "Gajuwaka",
    "NAD Kotha Road",
    "Dwaraka Nagar",
    "Seethammadhara",
    "Madhurawada",
    "Simhachalam",
    "King George Hospital (KGH)",
    "Care Hospital",
    "Apollo Hospital",
    "Seven Hills Hospital",
    "Gitam Hospital",
    "Rushikonda",
    "MVP Colony",
    "Akkayyapalem",
    "Gopalapatnam",
    "Lawson's Bay Colony",
    "Jagadamba Junction",
    "RTC Complex",
    "Railway Station",
    "Airport"
  ];

  const [form, setForm] = useState({
    unit_id: "",
    dispatcher: "",
    call_type: "Emergency",
    status: "Standby",
    location: "",
    phone_number: "",
    timestamp: freshTimestamp(),
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const timestampRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (dispatch) {
        setForm({
          unit_id: dispatch.unit?.id || dispatch.unit_id || "",
          dispatcher: dispatch.dispatcher || "",
          call_type: dispatch.call_type || "Emergency",
          status: dispatch.status || "Standby",
          location: dispatch.location || "",
          phone_number: dispatch.phone_number || "",
          timestamp: toLocalDateTimeValue(dispatch.timestamp),
        });
      } else {
        setForm({
          unit_id: units[0]?.id || "",
          dispatcher: "",
          call_type: "Emergency",
          status: "Standby",
          location: "",
          phone_number: "",
          timestamp: freshTimestamp(),
        });
      }
      setErrors({});
      setShowErrors(false);
      setSuggestions([]);
    }
  }, [isOpen, dispatch, units]);

  // Sanitize input to remove special characters
  const sanitizeInput = (value) => {
    // Remove special characters except spaces, commas, parentheses, and dots
    return value.replace(/[^\w\s\-,.()]/gi, '');
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'dispatcher':
        if (!value.trim()) return "Dispatcher name is required";
        if (!/^[A-Za-z\s]+$/.test(value.trim())) return "Only letters and spaces allowed";
        if (value.trim().length < 2) return "Must be at least 2 characters";
        if (value.trim().length > 50) return "Must be less than 50 characters";
        return '';
      
      case 'location':
        if (!value.trim()) return "Location is required";
        
        // Check for invalid characters
        const invalidChars = /[$*@#%^&!{}[\]<>\\]/;
        if (invalidChars.test(value)) {
          return "Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\ are not allowed";
        }
        
        // Check if it's a valid Vizag location (case-insensitive)
        const isVizagLocation = vizagLocations.some(loc => 
          value.toLowerCase().includes(loc.toLowerCase())
        );
        
        if (!isVizagLocation) {
          // Allow custom locations but validate format
          if (value.trim().length < 3) return "Must be at least 3 characters";
          if (value.trim().length > 100) return "Must be less than 100 characters";
          
          // Validate address format (should contain at least a word and number)
          const words = value.trim().split(/\s+/);
          if (words.length < 2) {
            return "Please provide more specific location (e.g., 'Main Road, Gajuwaka')";
          }
        }
        return '';
      
      case 'unit_id':
        if (!value) return "Unit selection is required";
        return '';
      
      case 'phone_number':
        if (value && value.trim()) {
          const phoneRegex = /^[\d\s\-+()]{10,15}$/;
          const digitsOnly = value.replace(/\D/g, '');
          
          if (!phoneRegex.test(value)) {
            return "Invalid phone number format";
          }
          if (digitsOnly.length < 10) {
            return "Phone number must have at least 10 digits";
          }
          if (digitsOnly.length > 15) {
            return "Phone number too long";
          }
        }
        return '';
      
      case 'timestamp':
        if (form.timestamp) {
          const selectedDate = new Date(form.timestamp);
          const now = new Date();
          if (selectedDate > now) {
            return "Timestamp cannot be in the future";
          }
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize location and dispatcher inputs
    if (name === 'location' || name === 'dispatcher') {
      sanitizedValue = sanitizeInput(value);
    }
    
    setForm((p) => ({ ...p, [name]: sanitizedValue }));
    
    // Show location suggestions
    if (name === 'location' && value.trim().length > 1) {
      const searchTerm = value.toLowerCase();
      const filtered = vizagLocations.filter(loc => 
        loc.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
    
    // Real-time validation while typing
    if (!isEdit) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setForm(prev => ({ ...prev, location: suggestion }));
    setSuggestions([]);
    
    // Validate the selected suggestion
    if (!isEdit) {
      const error = validateField('location', suggestion);
      setErrors(prev => ({
        ...prev,
        location: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all required fields
    newErrors.dispatcher = validateField('dispatcher', form.dispatcher);
    newErrors.location = validateField('location', form.location);
    newErrors.unit_id = validateField('unit_id', form.unit_id);
    newErrors.phone_number = validateField('phone_number', form.phone_number);
    newErrors.timestamp = validateField('timestamp', form.timestamp);
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isEdit) {
      setShowErrors(true);
      
      if (!validateForm()) {
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField) {
          const fieldName = firstErrorField.replace('_', ' ');
          errorToast(`Please fix the ${fieldName} error before submitting`);
        } else {
          errorToast("Please fix the validation errors before submitting");
        }
        return;
      }
    }
    
    // Ensure location is valid
    const locationError = validateField('location', form.location);
    if (locationError) {
      errorToast(locationError);
      return;
    }
    
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  const Dropdown = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    isObject = false,
    error = ""
  }) => (
    <div>
      <label className="text-sm text-black dark:text-white">
        {label} 
        {!isEdit && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Listbox value={value} onChange={(v) => {
        onChange(v);
        // Real-time validation for dropdown change
        if (!isEdit) {
          const error = validateField('unit_id', v);
          setErrors(prev => ({
            ...prev,
            unit_id: error
          }));
        }
      }}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
            {value
              ? isObject
                ? options.find((o) => String(o.id) === String(value))
                    ?.unit_number || value
                : value
              : placeholder}
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
            {options.map((opt) => {
              const label = isObject ? opt.unit_number || opt.id : opt;
              const val = isObject ? opt.id : opt;
              return (
                <Listbox.Option
                  key={val}
                  value={val}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                      active
                        ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                        : "text-black dark:text-white"
                    } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                  }
                >
                  {label}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
      {!isEdit && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );

  const openTimestampPicker = () => {
    timestampRef.current?.showPicker?.() || timestampRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[504px] h-auto rounded-[19px] bg-gray-100 dark:bg-black text-black dark:text-white p-6 relative">
          <div className="flex justify-between items-center pb-2 mb-3">
            <h3 className="font-medium text-[16px]">
              {isEdit ? "Edit Dispatch" : "Add Dispatch"}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
          >
            <Dropdown
              label="Unit"
              value={form.unit_id}
              onChange={(v) => {
                setForm((p) => ({ ...p, unit_id: v }));
              }}
              options={units}
              placeholder="Select Unit"
              isObject={true}
              error={errors.unit_id}
            />
            <div>
              <label className="text-sm text-black dark:text-white">
                Dispatcher 
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                name="dispatcher"
                value={form.dispatcher}
                onChange={handleChange}
                placeholder="Enter name"
                maxLength="50"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]"
              />
              {!isEdit && errors.dispatcher && (
                <p className="text-red-500 text-xs mt-1">{errors.dispatcher}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-black dark:text-white">
                Call Type 
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Listbox 
                value={form.call_type} 
                onChange={(v) => setForm((p) => ({ ...p, call_type: v }))}
              >
                <div className="relative mt-1 w-[228px]">
                  <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
                    {form.call_type}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {["Emergency", "Non-Emergency", "Transfer"].map((opt) => (
                      <Listbox.Option
                        key={opt}
                        value={opt}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active
                              ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                              : "text-black dark:text-white"
                          } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {opt}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div>
              <label className="text-sm text-black dark:text-white">
                Status 
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Listbox 
                value={form.status} 
                onChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <div className="relative mt-1 w-[228px]">
                  <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
                    {form.status}
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {["Standby", "En Route", "Completed", "Cancelled"].map((opt) => (
                      <Listbox.Option
                        key={opt}
                        value={opt}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                            active
                              ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                              : "text-black dark:text-white"
                          } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                        }
                      >
                        {opt}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <div>
              <label className="text-sm text-black dark:text-white">
                Phone Number
              </label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="e.g., +91-XXXXXXXXXX"
                maxLength="15"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]"
              />
              {!isEdit && errors.phone_number && (
                <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm text-black dark:text-white">
                Location 
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter Vizag location (e.g., Gajuwaka, KGH)"
                  maxLength="100"
                  className="w-full h-[33px] mt-1 px-3 pl-9 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B]"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B]" />
                
                {/* Location suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-700">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {!isEdit && errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Valid locations: {vizagLocations.slice(0, 3).join(", ")}...
              </p>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="timestamp"
                className="block mb-1 cursor-pointer text-sm text-black dark:text-white"
              >
                Timestamp 
                {!isEdit && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  ref={timestampRef}
                  type="datetime-local"
                  name="timestamp"
                  value={form.timestamp}
                  onChange={handleChange}
                  className="w-full h-[33px] pr-10 pl-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] cursor-pointer"
                  style={{ paddingRight: '2.5rem' }}
                />
                <CalendarClock
                  onClick={openTimestampPicker}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer"
                />
              </div>
              {!isEdit && errors.timestamp && (
                <p className="text-red-500 text-xs mt-1">{errors.timestamp}</p>
              )}
            </div>
            <div className="col-span-2 flex justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[144px] h-[34px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white hover:opacity-90 transition"
              >
                {isEdit ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDispatchModal;