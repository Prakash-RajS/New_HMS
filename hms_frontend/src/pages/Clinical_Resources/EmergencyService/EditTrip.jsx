// // EditTrip.jsx - WITH VALIDATION (Format while typing, required after submission)
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { X, ChevronDown, CalendarClock } from "lucide-react";
// import { Listbox } from "@headlessui/react";

// // Move ErrorMessage outside
// const ErrorMessage = ({ field, errors, submitted, isCreateMode, form }) => {
//   if (!isCreateMode || !errors[field]) return null;
  
//   // Show format errors immediately, required errors only after submission
//   const isFormatError = errors[field].includes("must be") || 
//                        errors[field].includes("cannot") || 
//                        errors[field].includes("seems") ||
//                        errors[field].includes("after") ||
//                        errors[field].includes("valid");
  
//   if (isFormatError || submitted) {
//     return (
//       <div className="mt-1 text-red-500 text-xs">
//         <span>{errors[field]}</span>
//       </div>
//     );
//   }
  
//   return null;
// };

// // Move TextInput outside
// const TextInput = React.memo(({ 
//   label, 
//   name, 
//   required = false, 
//   placeholder, 
//   type = "text",
//   value,
//   onChange,
//   error,
//   submitted,
//   isCreateMode,
//   inputRef
// }) => {
//   return (
//     <div className="flex flex-col">
//       <label className="text-black dark:text-white mb-1">
//         {label} {isCreateMode && required && <span className="text-red-500">*</span>}
//       </label>
//       <input
//         ref={inputRef}
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={false}
//         placeholder={placeholder}
//         className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
//       />
//       <ErrorMessage 
//         field={name} 
//         errors={{[name]: error}} 
//         submitted={submitted} 
//         isCreateMode={isCreateMode}
//         form={{[name]: value}}
//       />
//     </div>
//   );
// });

// // Move DateTimeField outside
// const DateTimeField = React.memo(({ 
//   label, 
//   name, 
//   required = false,
//   value,
//   onChange,
//   startTimeRef,
//   endTimeRef,
//   error,
//   submitted,
//   isCreateMode
// }) => {
//   const openPicker = (ref) => ref.current?.showPicker?.() || ref.current?.focus();
  
//   return (
//     <div className="flex flex-col">
//       <label
//         onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
//         className="text-sm text-black dark:text-white mb-1 cursor-pointer select-none"
//       >
//         {label} {isCreateMode && required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           ref={name === "start_time" ? startTimeRef : endTimeRef}
//           type="datetime-local"
//           name={name}
//           value={value}
//           onChange={onChange}
//           required={false}
//           className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
//         />
//         <CalendarClock
//           onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer"
//         />
//       </div>
//       <ErrorMessage 
//         field={name} 
//         errors={{[name]: error}} 
//         submitted={submitted} 
//         isCreateMode={isCreateMode}
//         form={{[name]: value}}
//       />
//     </div>
//   );
// });

// // Move Dropdown outside
// const Dropdown = React.memo(({ 
//   label, 
//   name, 
//   value, 
//   onChange, 
//   options, 
//   placeholder, 
//   displayField, 
//   secondaryField,
//   error,
//   submitted,
//   isCreateMode
// }) => {
//   return (
//     <div className="flex flex-col">
//       <label className="text-sm text-black dark:text-white mb-1 select-none">
//         {label} {isCreateMode && <span className="text-red-500">*</span>}
//       </label>
//       <Listbox value={value} onChange={onChange}>
//         <div className="relative">
//           <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
//             <span className="truncate">
//               {value
//                 ? (() => {
//                     const opt = options.find(o => String(o.id) === String(value));
//                     return opt
//                       ? `${opt[displayField] || opt.patient_unique_id} - ${opt[secondaryField] || opt.full_name || opt.unit_number}`
//                       : value;
//                   })()
//                 : placeholder}
//             </span>
//             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
//           </Listbox.Button>
//           <Listbox.Options className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
//             {options.map((opt) => (
//               <Listbox.Option
//                 key={opt.id}
//                 value={opt.id}
//                 className={({ active }) =>
//                   `cursor-pointer py-2 px-3 text-sm ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"}`
//                 }
//               >
//                 <div>
//                   <div className="font-medium">{opt[displayField] || opt.patient_unique_id}</div>
//                   <div className="text-xs opacity-70">
//                     {opt.full_name || opt.unit_number || opt.dispatch_id}
//                   </div>
//                 </div>
//               </Listbox.Option>
//             ))}
//           </Listbox.Options>
//         </div>
//       </Listbox>
//       <ErrorMessage 
//         field={name} 
//         errors={{[name]: error}} 
//         submitted={submitted} 
//         isCreateMode={isCreateMode}
//         form={{[name]: value}}
//       />
//     </div>
//   );
// });

// const EditTripModal = ({
//   isOpen,
//   onClose,
//   trip,
//   onSave,
//   units = [],
//   dispatches = [],
//   patients = [],
// }) => {
//   const isEdit = !!trip?.id;
//   const isCreateMode = !isEdit;

//   const [form, setForm] = useState({
//     dispatch_id: "",
//     unit_id: "",
//     crew: "",
//     patient_id: "",
//     mileage: "",
//     pickup_location: "",
//     destination: "",
//     status: "Standby",
//     start_time: "",
//     end_time: "",
//     notes: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
  
//   const startTimeRef = useRef(null);
//   const endTimeRef = useRef(null);
//   const crewRef = useRef(null);
//   const mileageRef = useRef(null);
//   const pickupRef = useRef(null);
//   const destinationRef = useRef(null);
//   const notesRef = useRef(null);

//   const freshTime = () => new Date().toISOString().slice(0, 16);

//   useEffect(() => {
//     if (!isOpen) return;
    
//     setErrors({});
//     setSubmitted(false);

//     if (trip) {
//       setForm({
//         dispatch_id: trip.dispatch?.id || trip.dispatch_id || "",
//         unit_id: trip.unit?.id || trip.unit_id || "",
//         crew: trip.crew || "",
//         patient_id: trip.patient?.id || trip.patient_id || "",
//         mileage: trip.mileage || "",
//         pickup_location: trip.pickup_location || "",
//         destination: trip.destination || "",
//         status: trip.status || "Standby",
//         start_time: trip.start_time ? trip.start_time.slice(0, 16) : "",
//         end_time: trip.end_time ? trip.end_time.slice(0, 16) : "",
//         notes: trip.notes || "",
//       });
//     } else {
//       setForm(prev => ({
//         ...prev,
//         unit_id: units[0]?.id?.toString() || "",
//         start_time: freshTime(),
//         patient_id: "",
//       }));
//     }
//   }, [isOpen, trip, units]);

//   // Validation rules - useCallback
//   const validateField = useCallback((name, value) => {
//     if (!isCreateMode) return "";
    
//     switch (name) {
//       case "dispatch_id":
//         if (!value) return "Dispatch is required";
//         return "";
        
//       case "unit_id":
//         if (!value) return "Unit is required";
//         return "";
        
//       case "crew":
//         if (!value.trim()) return "Crew is required";
//         if (value.trim().length < 2) return "Crew must be at least 2 characters";
//         return "";
        
//       case "patient_id":
//         if (!value) return "Patient is required";
//         return "";
        
//       case "pickup_location":
//         if (!value.trim()) return "Pickup location is required";
//         if (value.trim().length < 5) return "Pickup location must be at least 5 characters";
//         return "";
        
//       case "start_time":
//         if (!value) return "Start time is required";
//         if (new Date(value) < new Date()) {
//           return "Start time cannot be in the past";
//         }
//         return "";
        
//       case "mileage":
//         if (value && value.trim()) {
//           const num = parseFloat(value);
//           if (isNaN(num)) return "Mileage must be a valid number";
//           if (num < 0) return "Mileage cannot be negative";
//           if (num > 9999) return "Mileage seems too high";
//         }
//         return "";
        
//       case "destination":
//         if (value && value.trim() && value.trim().length < 3) {
//           return "Destination must be at least 3 characters";
//         }
//         return "";
        
//       case "end_time":
//         if (value && form.start_time) {
//           if (new Date(value) <= new Date(form.start_time)) {
//             return "End time must be after start time";
//           }
//         }
//         return "";
        
//       default:
//         return "";
//     }
//   }, [isCreateMode, form.start_time]);

//   // Handle change - useCallback
//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setForm(p => ({ ...p, [name]: value }));
    
//     // Always validate format errors while typing (for create mode)
//     if (isCreateMode) {
//       const error = validateField(name, value);
//       setErrors(prev => ({
//         ...prev,
//         [name]: error
//       }));
//     }
//   }, [isCreateMode, validateField]);

//   // Validate entire form
//   const validateForm = useCallback(() => {
//     if (!isCreateMode) return true;
    
//     const newErrors = {};
//     let isValid = true;
    
//     Object.keys(form).forEach(key => {
//       const error = validateField(key, form[key]);
//       if (error) {
//         newErrors[key] = error;
//         isValid = false;
//       }
//     });
    
//     setErrors(newErrors);
//     return isValid;
//   }, [isCreateMode, form, validateField]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (isCreateMode) {
//       setSubmitted(true);
//       if (!validateForm()) {
//         const firstErrorField = Object.keys(errors).find(key => errors[key]);
//         if (firstErrorField === 'crew' && crewRef.current) crewRef.current.focus();
//         else if (firstErrorField === 'pickup_location' && pickupRef.current) pickupRef.current.focus();
//         else if (firstErrorField === 'mileage' && mileageRef.current) mileageRef.current.focus();
//         else if (firstErrorField === 'destination' && destinationRef.current) destinationRef.current.focus();
//         else if (firstErrorField === 'notes' && notesRef.current) notesRef.current.focus();
//         return;
//       }
//     } else {
//       // For edit mode, use original validation
//       if (!e.target.checkValidity()) {
//         e.target.reportValidity();
//         return;
//       }
//     }
    
//     const payload = {
//       dispatch_id: form.dispatch_id ? Number(form.dispatch_id) : null,
//       unit_id: form.unit_id ? Number(form.unit_id) : null,
//       crew: form.crew.trim(),
//       patient_id: form.patient_id ? Number(form.patient_id) : null,
//       pickup_location: form.pickup_location.trim(),
//       destination: form.destination ? form.destination.trim() : null,
//       start_time: form.start_time || null,
//       end_time: form.end_time || null,
//       mileage: form.mileage ? form.mileage.trim() : null,
//       status: form.status,
//       notes: form.notes ? form.notes.trim() : null,
//     };

//     onSave(payload);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
//       <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
//         <div className="w-[960px] max-h-[90vh] overflow-y-auto rounded-[19px] bg-gray-100 dark:bg-black p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-medium text-black dark:text-white">
//               {isEdit ? "Edit Trip" : "Create New Trip"}
//             </h3>
//             <button
//               onClick={onClose}
//               className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B22]"
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} noValidate className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
//             <Dropdown
//               label="Dispatch"
//               name="dispatch_id"
//               value={form.dispatch_id}
//               onChange={(v) => {
//                 setForm(p => ({ ...p, dispatch_id: v }));
//                 if (isCreateMode) {
//                   const error = validateField('dispatch_id', v);
//                   setErrors(prev => ({ ...prev, dispatch_id: error }));
//                 }
//               }}
//               options={dispatches}
//               placeholder="Select Dispatch"
//               displayField="dispatch_id"
//               error={errors.dispatch_id}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//             />

//             <Dropdown
//               label="Unit"
//               name="unit_id"
//               value={form.unit_id}
//               onChange={(v) => {
//                 setForm(p => ({ ...p, unit_id: v }));
//                 if (isCreateMode) {
//                   const error = validateField('unit_id', v);
//                   setErrors(prev => ({ ...prev, unit_id: error }));
//                 }
//               }}
//               options={units}
//               placeholder="Select Unit"
//               displayField="unit_number"
//               error={errors.unit_id}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//             />

//             <TextInput
//               label="Crew"
//               name="crew"
//               required={true}
//               placeholder="Driver + EMT names"
//               value={form.crew}
//               onChange={handleChange}
//               error={errors.crew}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//               inputRef={crewRef}
//             />

//             <Dropdown
//               label="Patient"
//               name="patient_id"
//               value={form.patient_id}
//               onChange={(v) => {
//                 setForm(p => ({ ...p, patient_id: v }));
//                 if (isCreateMode) {
//                   const error = validateField('patient_id', v);
//                   setErrors(prev => ({ ...prev, patient_id: error }));
//                 }
//               }}
//               options={patients}
//               placeholder="Select Patient"
//               displayField="patient_unique_id"
//               secondaryField="full_name"
//               error={errors.patient_id}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//             />

//             <TextInput
//               label="Mileage"
//               name="mileage"
//               placeholder="e.g. 15.2 km (Optional)"
//               value={form.mileage}
//               onChange={handleChange}
//               error={errors.mileage}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//               inputRef={mileageRef}
//             />

//             <div className="flex flex-col">
//               <label className="text-black dark:text-white mb-1">Status</label>
//               <Listbox value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))}>
//                 <div className="relative">
//                   <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
//                     <span>{form.status}</span>
//                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
//                   </Listbox.Button>
//                   <Listbox.Options className="absolute z-50 mt-1 w-full rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
//                     {["Standby", "En Route", "Completed", "Cancelled"].map((s) => (
//                       <Listbox.Option
//                         key={s}
//                         value={s}
//                         className={({ active }) =>
//                           `cursor-pointer py-2 px-3 text-sm ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"}`
//                         }
//                       >
//                         {s}
//                       </Listbox.Option>
//                     ))}
//                   </Listbox.Options>
//                 </div>
//               </Listbox>
//             </div>

//             <TextInput
//               label="Pickup Location"
//               name="pickup_location"
//               required={true}
//               placeholder="Full address"
//               value={form.pickup_location}
//               onChange={handleChange}
//               error={errors.pickup_location}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//               inputRef={pickupRef}
//             />

//             <TextInput
//               label="Destination"
//               name="destination"
//               placeholder="Hospital / Drop-off (Optional)"
//               value={form.destination}
//               onChange={handleChange}
//               error={errors.destination}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//               inputRef={destinationRef}
//             />

//             <TextInput
//               label="Notes (Optional)"
//               name="notes"
//               placeholder="Any extra info"
//               value={form.notes}
//               onChange={handleChange}
//               error={errors.notes}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//               inputRef={notesRef}
//             />

//             <DateTimeField 
//               label="Start Time" 
//               name="start_time" 
//               required={true}
//               value={form.start_time}
//               onChange={handleChange}
//               startTimeRef={startTimeRef}
//               endTimeRef={endTimeRef}
//               error={errors.start_time}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//             />
            
//             <DateTimeField 
//               label="End Time" 
//               name="end_time"
//               value={form.end_time}
//               onChange={handleChange}
//               startTimeRef={startTimeRef}
//               endTimeRef={endTimeRef}
//               error={errors.end_time}
//               submitted={submitted}
//               isCreateMode={isCreateMode}
//             />

//             <div className="col-span-3 flex justify-center gap-6 mt-10">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-[160px] h-[40px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent font-medium hover:bg-gray-50 dark:hover:bg-[#0EFF7B11]"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="w-[160px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium shadow-lg hover:scale-105 transition"
//               >
//                 {isEdit ? "Save Changes" : "Create Trip"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTripModal;

/// EditTrip.jsx - WITH VALIDATION (Format while typing, required after submission)
// EditTrip.jsx - WITH FIXED duplicate validation + UTC timezone fix + Calendar icon added
import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown, MapPin, Phone, Calendar } from "lucide-react";
import { Listbox } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ---------------------------------------------------------------------------
// Valid Vizag locations
// ---------------------------------------------------------------------------
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
  "Airport",
  "Pendurthi",
  "Anakapalle",
  "Bheemili",
  "Vizag Steel Plant",
  "Scindia",
  "Waltair",
  "Maharanipeta",
  "Asilmetta"
];

// ---------------------------------------------------------------------------
// UTC → local datetime-local string
// Fixes: table shows UTC time, modal showed wrong local time via .slice(0,16)
// ---------------------------------------------------------------------------
const toLocalDateTimeString = (utcString) => {
  if (!utcString) return "";
  const date = new Date(utcString);
  if (isNaN(date)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// ---------------------------------------------------------------------------
// ErrorMessage
// ---------------------------------------------------------------------------
const ErrorMessage = ({ field, errors, submitted, isCreateMode }) => {
  if (!errors[field]) return null;

  const isFormatError =
    errors[field].includes("must be") ||
    errors[field].includes("cannot") ||
    errors[field].includes("seems") ||
    errors[field].includes("after") ||
    errors[field].includes("valid") ||
    errors[field].includes("Special characters") ||
    errors[field].includes("not allowed") ||
    errors[field].includes("same as") ||
    errors[field].includes("already") ||
    errors[field].includes("capital") ||
    errors[field].includes("exceed") ||
    errors[field].includes("digits") ||
    errors[field].includes("10-digit") ||
    errors[field].includes("all digits same") ||
    errors[field].includes("sequential") ||
    errors[field].includes("Please provide more specific location") ||
    errors[field].includes("must contain letters") ||
    errors[field].includes("Valid Vizag locations") ||
    errors[field].includes("cannot exceed") ||
    errors[field].includes("during this time") ||
    errors[field].includes("assigned");

  if (submitted || isFormatError) {
    return (
      <div className="mt-1 text-red-500 text-xs">
        <span>{errors[field]}</span>
      </div>
    );
  }
  return null;
};

// ---------------------------------------------------------------------------
// TextInput
// ---------------------------------------------------------------------------
const TextInput = React.memo(({
  label,
  name,
  required = false,
  placeholder,
  type = "text",
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  submitted,
  isCreateMode,
  inputRef,
  showIcon = false,
  icon: Icon = null,
  maxLength,
  showCount = false,
  suggestions = [],
  onSuggestionClick,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-black dark:text-white mb-1">
        {label} {(isCreateMode || required) && required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={false}
          placeholder={placeholder}
          maxLength={maxLength}
          className="h-[36px] w-full px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
          style={showIcon ? { paddingLeft: "2.5rem" } : {}}
          autoComplete="off"
        />
        {showIcon && Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B]" />
        )}

        {/* Location suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-300 dark:border-gray-700 max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSuggestionClick(suggestion);
                }}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      {showCount && maxLength && (
        <div className="mt-0.5 text-right text-xs text-gray-400 dark:text-gray-500">
          {value.length}/{maxLength}
        </div>
      )}
      <ErrorMessage
        field={name}
        errors={{ [name]: error }}
        submitted={submitted}
        isCreateMode={isCreateMode}
      />
    </div>
  );
});

// ---------------------------------------------------------------------------
// DateTimeField — Calendar icon added
// ---------------------------------------------------------------------------
// DateTimeField — Calendar icon on the right end
const DateTimeField = React.memo(({
  label,
  name,
  required = false,
  value,
  onChange,
  error,
  submitted,
  isCreateMode,
}) => {
  const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return null;
    const date = new Date(dateTimeStr);
    return isNaN(date) ? null : date;
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleDateChange = (date) => {
    const syntheticEvent = {
      target: { name: name, value: date ? formatDateTime(date) : "" }
    };
    onChange(syntheticEvent);
  };

  const formatDisplayValue = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    if (isNaN(date)) return "";
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const CustomInput = React.forwardRef(({ value, onClick, onBlur }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={formatDisplayValue(value) || ""}
        onClick={onClick}
        onBlur={onBlur}
        readOnly
        placeholder="Select date & time"
        className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] pointer-events-none" />
      <style>{`
        .react-datepicker-wrapper,
        .react-datepicker__input-container {
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  ));

  return (
    <div className="flex flex-col">
      <label className="text-black dark:text-white mb-1">
        {label} {(isCreateMode || required) && required && <span className="text-red-500">*</span>}
      </label>
      <DatePicker
        selected={parseDateTime(value)}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="h:mm aa"
        timeIntervals={15}
        dateFormat="MMM d, yyyy h:mm aa"
        timeCaption="Time"
        customInput={<CustomInput />}
        calendarClassName="dark:bg-black dark:border-[#3A3A3A]"
        dayClassName={(date) =>
          date.getDate() === new Date().getDate() ? "dark:text-[#0EFF7B]" : ""
        }
        popperClassName="z-50"
        popperPlacement="bottom-start"
        shouldCloseOnSelect
        isClearable={false}
        minDate={new Date(Date.now() - 60 * 60 * 1000)}
        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        locale="en-US"
      />
      <ErrorMessage
        field={name}
        errors={{ [name]: error }}
        submitted={submitted}
        isCreateMode={isCreateMode}
      />
    </div>
  );
});

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
const Dropdown = React.memo(({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  displayField,
  secondaryField,
  error,
  submitted,
  isCreateMode,
}) => {
  const getDisplayValue = (selectedValue) => {
    if (!selectedValue) return "";
    const option = options.find((o) => String(o.id) === String(selectedValue));
    if (!option) return selectedValue;

    if (name === "dispatch_id") {
      const idPart = option.dispatch_id || option.id;
      const namePart = option.dispatcher || option.crew || "";
      return namePart ? `${idPart} - ${namePart}` : idPart;
    }
    if (name === "unit_id") {
      const unitNumber = option.unit_number || option.unit_id || option.id;
      const vehicleName = option.vehicle_make || option.vehicle_model || "";
      return vehicleName ? `${unitNumber} - ${vehicleName}` : unitNumber;
    }
    if (name === "patient_id") {
      const idPart = option.patient_unique_id || option.id;
      const namePart = option.full_name || "";
      return namePart ? `${idPart} - ${namePart}` : idPart;
    }
    const primary = option[displayField] || option.id;
    const secondary = option[secondaryField] || "";
    return secondary ? `${primary} - ${secondary}` : primary;
  };

  return (
    <div className="flex flex-col">
      <label className="text-black dark:text-white mb-1">
        {label} {isCreateMode && <span className="text-red-500">*</span>}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
            <span className="truncate">
              {value ? getDisplayValue(value) : placeholder}
            </span>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
            {options.map((opt) => (
              <Listbox.Option
                key={opt.id}
                value={opt.id}
                className={({ active }) =>
                  `cursor-pointer py-2 px-3 text-sm ${
                    active
                      ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  }`
                }
              >
                <div>
                  {name === "dispatch_id" && (
                    <>
                      <div className="font-medium">{opt.dispatch_id || opt.id}</div>
                      <div className="text-xs opacity-70">
                        {opt.dispatcher || opt.crew || "No dispatcher name"}
                      </div>
                    </>
                  )}
                  {name === "unit_id" && (
                    <>
                      <div className="font-medium">{opt.unit_number || opt.unit_id}</div>
                      <div className="text-xs opacity-70">
                        {opt.vehicle_make || opt.vehicle_model || "No vehicle name"}
                      </div>
                    </>
                  )}
                  {name === "patient_id" && (
                    <>
                      <div className="font-medium">{opt.patient_unique_id || opt.id}</div>
                      <div className="text-xs opacity-70">
                        {opt.full_name || "No name provided"}
                      </div>
                    </>
                  )}
                  {!["dispatch_id", "unit_id", "patient_id"].includes(name) && (
                    <>
                      <div className="font-medium">{opt[displayField] || opt.id}</div>
                      {opt[secondaryField] && (
                        <div className="text-xs opacity-70">{opt[secondaryField]}</div>
                      )}
                    </>
                  )}
                </div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <ErrorMessage
        field={name}
        errors={{ [name]: error }}
        submitted={submitted}
        isCreateMode={isCreateMode}
      />
    </div>
  );
});

// ---------------------------------------------------------------------------
// Auto-capitalise first letter of each word
// ---------------------------------------------------------------------------
const capitalizeWords = (value) =>
  value.replace(/(^|\s)([a-z])/g, (_, space, char) => space + char.toUpperCase());

// ---------------------------------------------------------------------------
// Validate phone number
// ---------------------------------------------------------------------------
const validatePhoneNumber = (value) => {
  if (!value || !value.trim()) return "Phone number is required";
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length === 0) return "Phone number is required";
  if (digitsOnly.length < 10) return "Phone number must have exactly 10 digits";
  if (digitsOnly.length > 10) return "Phone number must have exactly 10 digits";
  if (/^(\d)\1{9}$/.test(digitsOnly)) return "Invalid phone number - cannot have all digits same";
  if (/^(0123456789|1234567890|2345678901|3456789012|4567890123|5678901234|6789012345|7890123456|8901234567|9012345678|9876543210)$/.test(digitsOnly))
    return "Invalid phone number - cannot be sequential";
  if (!/^[6-9]/.test(digitsOnly)) return "Phone number must start with 6, 7, 8, or 9";
  return "";
};

// ---------------------------------------------------------------------------
// Location validation
// ---------------------------------------------------------------------------
const validateLocation = (value, fieldName) => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  const trimmed = value.trim();
  const invalidChars = /[$*@#%^&!{}[\]<>\\]/;
  if (invalidChars.test(trimmed))
    return `Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\ are not allowed`;

  const isVizagLocation = vizagLocations.some(loc =>
    trimmed.toLowerCase().includes(loc.toLowerCase())
  );
  if (!isVizagLocation) {
    if (trimmed.length < 5) return `Please enter a more specific location (at least 5 characters)`;
    if (trimmed.length > 100) return `${fieldName} cannot exceed 100 characters`;
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return `Please provide more specific location (e.g., 'Main Road, Gajuwaka')`;
    if (!/[A-Za-z]/.test(trimmed)) return `${fieldName} must contain letters`;
  }
  return "";
};

// ---------------------------------------------------------------------------
// EditTripModal
// ---------------------------------------------------------------------------
const EditTripModal = ({
  isOpen,
  onClose,
  trip,
  onSave,
  units = [],
  dispatches = [],
  patients = [],
  existingTrips = [],
}) => {
  const isEdit = !!trip?.id;
  const isCreateMode = !isEdit;

  const [form, setForm] = useState({
    dispatch_id: "",
    unit_id: "",
    crew: "",
    patient_id: "",
    mileage: "",
    pickup_location: "",
    destination: "",
    status: "Standby",
    start_time: "",
    end_time: "",
    notes: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const crewRef = useRef(null);
  const mileageRef = useRef(null);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const notesRef = useRef(null);
  const phoneRef = useRef(null);

  const freshTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setSubmitted(false);
    setFocusedField(null);
    setPickupSuggestions([]);
    setDestinationSuggestions([]);

    if (trip) {
      setForm({
        dispatch_id: trip.dispatch?.id || trip.dispatch_id || "",
        unit_id: trip.unit?.id || trip.unit_id || "",
        crew: trip.crew || "",
        patient_id: trip.patient?.id || trip.patient_id || "",
        mileage: trip.mileage || "",
        pickup_location: trip.pickup_location || "",
        destination: trip.destination || "",
        status: trip.status || "Standby",
        start_time: trip.start_time ? toLocalDateTimeString(trip.start_time) : "",
        end_time: trip.end_time ? toLocalDateTimeString(trip.end_time) : "",
        notes: trip.notes || "",
        phone_number: trip.phone_number || "",
      });
    } else {
      setForm(prev => ({
        ...prev,
        unit_id: "",
        start_time: freshTime(),
        patient_id: "",
        status: "Standby",
        phone_number: "",
      }));
    }
  }, [isOpen, trip, units]);

  // ── sanitize ──────────────────────────────────────────────────────────────
  const sanitizeInput = (value) => value.replace(/[$*@#%^&!{}[\]<>\\|]/gi, "");

  // ── checkDispatcherOrUnitBusy ─────────────────────────────────────────────
  const checkDispatcherOrUnitBusy = useCallback(
    (currentForm) => {
      if (!currentForm.start_time) return { isBusy: false };

      const newStart = new Date(currentForm.start_time);
      const newEnd = currentForm.end_time ? new Date(currentForm.end_time) : null;
      const effectiveNewEnd = newEnd || new Date(newStart.getTime() + 2 * 60 * 60 * 1000);

      let dispatcherBusy = false;
      let unitBusy = false;
      let patientBusy = false;

      existingTrips.forEach((t) => {
        if (isEdit && String(t.id) === String(trip?.id)) return;

        const existStart = t.start_time ? new Date(t.start_time) : null;
        if (!existStart) return;

        const existEnd = t.end_time ? new Date(t.end_time) : null;
        const effectiveExistEnd = existEnd || new Date(existStart.getTime() + 2 * 60 * 60 * 1000);
        const hasOverlap = newStart < effectiveExistEnd && effectiveNewEnd > existStart;

        if (!hasOverlap) return;

        if (currentForm.dispatch_id) {
          const tripDispatchId = String(t.dispatch_id || t.dispatch?.id || "");
          if (tripDispatchId && tripDispatchId === String(currentForm.dispatch_id))
            dispatcherBusy = true;
        }
        if (currentForm.unit_id) {
          const tripUnitId = String(t.unit_id || t.unit?.id || "");
          if (tripUnitId && tripUnitId === String(currentForm.unit_id))
            unitBusy = true;
        }
        if (currentForm.patient_id) {
          const tripPatientId = String(t.patient_id || t.patient?.id || "");
          if (tripPatientId && tripPatientId === String(currentForm.patient_id))
            patientBusy = true;
        }
      });

      if (dispatcherBusy && unitBusy && patientBusy)
        return { isBusy: true, message: "Dispatcher, unit, and patient are all already assigned to another trip during this time.", dispatcherBusy: true, unitBusy: true, patientBusy: true };
      if (patientBusy && dispatcherBusy)
        return { isBusy: true, message: "This patient and dispatcher are already assigned to another trip during this time.", dispatcherBusy: true, patientBusy: true };
      if (patientBusy && unitBusy)
        return { isBusy: true, message: "This patient and unit are already assigned to another trip during this time.", unitBusy: true, patientBusy: true };
      if (dispatcherBusy && unitBusy)
        return { isBusy: true, message: "Both dispatcher and unit are already assigned to another trip during this time.", dispatcherBusy: true, unitBusy: true };
      if (dispatcherBusy)
        return { isBusy: true, message: "This dispatcher is already assigned to another trip during this time.", dispatcherBusy: true };
      if (unitBusy)
        return { isBusy: true, message: "This unit is already assigned to another trip during this time.", unitBusy: true };
      if (patientBusy)
        return { isBusy: true, message: "This patient is already assigned to another trip during this time.", patientBusy: true };

      return { isBusy: false };
    },
    [existingTrips, isEdit, trip]
  );

  // ── validateField ─────────────────────────────────────────────────────────
  const validateField = useCallback(
    (name, value, currentForm) => {
      const ctx = currentForm || form;

      switch (name) {
        case "dispatch_id": {
          if (!value) return "Dispatch is required";
          const bc = checkDispatcherOrUnitBusy({ ...ctx, dispatch_id: value });
          if (bc.isBusy && bc.dispatcherBusy) return bc.message;
          return "";
        }
        case "unit_id": {
          if (!value) return "Unit is required";
          const bc = checkDispatcherOrUnitBusy({ ...ctx, unit_id: value });
          if (bc.isBusy && bc.unitBusy) return bc.message;
          return "";
        }
        case "patient_id": {
          if (!value) return "Patient is required";
          const bc = checkDispatcherOrUnitBusy({ ...ctx, patient_id: value });
          if (bc.isBusy && bc.patientBusy) return bc.message;
          return "";
        }
        case "crew":
          if (!value.trim()) return "Crew is required";
          if (value.trim().length < 2) return "Crew must be at least 2 characters";
          if (value.trim().length > 50) return "Crew cannot exceed 50 characters";
          if (/[0-9]/.test(value)) return "Crew name should not contain numbers";
          if (/[$*@#%^&!{}[\]<>\\|]/.test(value)) return "Special characters are not allowed";
          return "";
        case "phone_number":
          return validatePhoneNumber(value);
        case "pickup_location":
          return validateLocation(value, "Pickup location");
        case "start_time": {
          if (!value) return "Start time is required";
          const startDate = new Date(value);
          if (startDate < new Date(Date.now() - 60 * 60 * 1000))
            return "Start time cannot be more than 1 hour in the past";
          const bc = checkDispatcherOrUnitBusy({ ...ctx, start_time: value });
          if (bc.isBusy) return bc.message;
          return "";
        }
        case "mileage":
          if (value && value.trim()) {
            const num = parseFloat(value);
            if (isNaN(num)) return "Mileage must be a valid number";
            if (num < 0) return "Mileage cannot be negative";
            if (num > 9999) return "Mileage seems too high";
          }
          return "";
        case "destination": {
          if (!value || !value.trim()) return "Destination is required";
          const destErr = validateLocation(value, "Destination");
          if (destErr) return destErr;
          if (ctx.pickup_location && value.trim().toLowerCase() === ctx.pickup_location.trim().toLowerCase())
            return "Destination cannot be the same as Pickup Location";
          return "";
        }
        case "end_time":
          if (value && ctx.start_time && new Date(value) <= new Date(ctx.start_time))
            return "End time must be after start time";
          return "";
        case "notes":
          if (value && value.trim() && /[$*@#%^&!{}[\]<>\\|]/.test(value))
            return "Special characters are not allowed";
          return "";
        default:
          return "";
      }
    },
    [form, checkDispatcherOrUnitBusy]
  );

  // ── handleChange ──────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let sanitizedValue = value;

      if (["crew", "notes"].includes(name)) sanitizedValue = sanitizeInput(value);

      if (["pickup_location", "destination"].includes(name)) {
        sanitizedValue = capitalizeWords(sanitizeInput(value));
        if (sanitizedValue.trim().length > 1) {
          const filtered = vizagLocations.filter(loc =>
            loc.toLowerCase().includes(sanitizedValue.toLowerCase())
          );
          if (name === "pickup_location") setPickupSuggestions(filtered.slice(0, 5));
          else setDestinationSuggestions(filtered.slice(0, 5));
        } else {
          if (name === "pickup_location") setPickupSuggestions([]);
          else setDestinationSuggestions([]);
        }
      }

      if (name === "phone_number") sanitizedValue = value.replace(/\D/g, "").slice(0, 10);

      const updatedForm = { ...form, [name]: sanitizedValue };
      setForm(updatedForm);

      const newErrors = { ...errors, [name]: validateField(name, sanitizedValue, updatedForm) };

      if (name === "pickup_location" && updatedForm.destination)
        newErrors.destination = validateField("destination", updatedForm.destination, updatedForm);
      if (name === "destination" && updatedForm.pickup_location)
        newErrors.pickup_location = validateField("pickup_location", updatedForm.pickup_location, updatedForm);

      if (["dispatch_id", "unit_id", "patient_id", "start_time", "end_time"].includes(name)) {
        if (updatedForm.dispatch_id)
          newErrors.dispatch_id = validateField("dispatch_id", updatedForm.dispatch_id, updatedForm);
        if (updatedForm.unit_id)
          newErrors.unit_id = validateField("unit_id", updatedForm.unit_id, updatedForm);
        if (updatedForm.patient_id)
          newErrors.patient_id = validateField("patient_id", updatedForm.patient_id, updatedForm);
      }

      setErrors(newErrors);
    },
    [validateField, form, errors]
  );

  const handleFocus = useCallback((fieldName) => setFocusedField(fieldName), []);

  const handleBlur = useCallback(
    (fieldName, value) => {
      setFocusedField(null);
      setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
      if (fieldName === "pickup_location") setPickupSuggestions([]);
      else if (fieldName === "destination") setDestinationSuggestions([]);
    },
    [validateField]
  );

  const handleSuggestionClick = (fieldName, suggestion) => {
    const sanitizedValue = capitalizeWords(suggestion);
    setForm(prev => ({ ...prev, [fieldName]: sanitizedValue }));
    if (fieldName === "pickup_location") setPickupSuggestions([]);
    else setDestinationSuggestions([]);
    setErrors(prev => ({ ...prev, [fieldName]: validateField(fieldName, sanitizedValue) }));
  };

  // ── validateForm ──────────────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key], form);
      if (error) { newErrors[key] = error; isValid = false; }
    });

    const bc = checkDispatcherOrUnitBusy(form);
    if (bc.isBusy) {
      if (bc.dispatcherBusy) newErrors.dispatch_id = bc.message;
      if (bc.unitBusy) newErrors.unit_id = bc.message;
      if (bc.patientBusy) newErrors.patient_id = bc.message;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form, validateField, checkDispatcherOrUnitBusy]);

  // ── handleSubmit ──────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      const fieldOrder = ["dispatch_id", "unit_id", "crew", "patient_id", "phone_number", "mileage", "pickup_location", "destination", "notes", "start_time", "end_time"];
      const firstErr = fieldOrder.find((k) => errors[k]);
      const refMap = { crew: crewRef, pickup_location: pickupRef, destination: destinationRef, notes: notesRef, start_time: startTimeRef, end_time: endTimeRef, phone_number: phoneRef, mileage: mileageRef };
      if (firstErr && refMap[firstErr]?.current) refMap[firstErr].current.focus();
      return;
    }

    const sanitizedForm = {
      ...form,
      crew: sanitizeInput(form.crew),
      pickup_location: sanitizeInput(form.pickup_location),
      destination: form.destination ? sanitizeInput(form.destination) : null,
      notes: form.notes ? sanitizeInput(form.notes) : null,
      phone_number: form.phone_number.trim(),
    };

    onSave({
      dispatch_id: sanitizedForm.dispatch_id ? Number(sanitizedForm.dispatch_id) : null,
      unit_id: sanitizedForm.unit_id ? Number(sanitizedForm.unit_id) : null,
      crew: sanitizedForm.crew.trim(),
      patient_id: sanitizedForm.patient_id ? Number(sanitizedForm.patient_id) : null,
      pickup_location: sanitizedForm.pickup_location.trim(),
      destination: sanitizedForm.destination ? sanitizedForm.destination.trim() : null,
      start_time: sanitizedForm.start_time || null,
      end_time: sanitizedForm.end_time || null,
      mileage: sanitizedForm.mileage ? sanitizedForm.mileage.trim() : null,
      status: sanitizedForm.status,
      notes: sanitizedForm.notes ? sanitizedForm.notes.trim() : null,
      phone_number: sanitizedForm.phone_number || null,
    });
    onClose();
  };

  if (!isOpen) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[960px] rounded-[19px] bg-gray-100 dark:bg-black p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-black dark:text-white">
              {isEdit ? "Edit Trip" : "Create New Trip"}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B22]"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-4 gap-x-8 gap-y-6 text-sm">
            {/* Row 1 */}
            <Dropdown
              label="Dispatch" name="dispatch_id" value={form.dispatch_id}
              onChange={(v) => {
                const updatedForm = { ...form, dispatch_id: v };
                setForm(updatedForm);
                setErrors((prev) => ({
                  ...prev,
                  dispatch_id: validateField("dispatch_id", v, updatedForm),
                  unit_id: updatedForm.unit_id ? validateField("unit_id", updatedForm.unit_id, updatedForm) : prev.unit_id,
                  patient_id: updatedForm.patient_id ? validateField("patient_id", updatedForm.patient_id, updatedForm) : prev.patient_id,
                }));
              }}
              options={dispatches} placeholder="Select Dispatch"
              displayField="dispatch_id" secondaryField="dispatcher_name"
              error={errors.dispatch_id} submitted={submitted} isCreateMode={isCreateMode}
            />

            <Dropdown
              label="Unit" name="unit_id" value={form.unit_id}
              onChange={(v) => {
                const updatedForm = { ...form, unit_id: v };
                setForm(updatedForm);
                setErrors((prev) => ({
                  ...prev,
                  unit_id: validateField("unit_id", v, updatedForm),
                  dispatch_id: updatedForm.dispatch_id ? validateField("dispatch_id", updatedForm.dispatch_id, updatedForm) : prev.dispatch_id,
                  patient_id: updatedForm.patient_id ? validateField("patient_id", updatedForm.patient_id, updatedForm) : prev.patient_id,
                }));
              }}
              options={units} placeholder="Select Unit"
              displayField="unit_number" secondaryField="vehicle_name"
              error={errors.unit_id} submitted={submitted} isCreateMode={isCreateMode}
            />

            <TextInput
              label="Crew" name="crew" required
              placeholder="EMT name (max 50 characters)"
              value={form.crew} onChange={handleChange}
              onFocus={() => handleFocus("crew")} onBlur={() => handleBlur("crew", form.crew)}
              error={errors.crew} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={crewRef} maxLength={50} showCount
            />

            <Dropdown
              label="Patient" name="patient_id" value={form.patient_id}
              onChange={(v) => {
                const updatedForm = { ...form, patient_id: v };
                setForm(updatedForm);
                setErrors((prev) => ({
                  ...prev,
                  patient_id: validateField("patient_id", v, updatedForm),
                  dispatch_id: updatedForm.dispatch_id ? validateField("dispatch_id", updatedForm.dispatch_id, updatedForm) : prev.dispatch_id,
                  unit_id: updatedForm.unit_id ? validateField("unit_id", updatedForm.unit_id, updatedForm) : prev.unit_id,
                }));
              }}
              options={patients} placeholder="Select Patient"
              displayField="patient_unique_id" secondaryField="full_name"
              error={errors.patient_id} submitted={submitted} isCreateMode={isCreateMode}
            />

            {/* Row 2 */}
            <TextInput
              label="Mileage (km)" name="mileage" type="number"
              placeholder="e.g. 15.2 (Optional)"
              value={form.mileage} onChange={handleChange}
              error={errors.mileage} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={mileageRef}
            />

            <TextInput
              label="Phone Number" name="phone_number" required
              placeholder="10-digit mobile number"
              value={form.phone_number} onChange={handleChange}
              onFocus={() => handleFocus("phone_number")} onBlur={() => handleBlur("phone_number", form.phone_number)}
              error={errors.phone_number} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={phoneRef} showIcon icon={Phone} maxLength={10}
            />

            <TextInput
              label="Pickup Location" name="pickup_location" required
              placeholder="Full address or landmark"
              value={form.pickup_location} onChange={handleChange}
              onFocus={() => handleFocus("pickup_location")} onBlur={() => handleBlur("pickup_location", form.pickup_location)}
              error={errors.pickup_location} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={pickupRef} showIcon icon={MapPin} maxLength={100} showCount
              suggestions={pickupSuggestions}
              onSuggestionClick={(s) => handleSuggestionClick("pickup_location", s)}
            />

            <TextInput
              label="Destination" name="destination" required
              placeholder="Hospital / Drop-off"
              value={form.destination} onChange={handleChange}
              onFocus={() => handleFocus("destination")} onBlur={() => handleBlur("destination", form.destination)}
              error={errors.destination} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={destinationRef} showIcon icon={MapPin} maxLength={100} showCount
              suggestions={destinationSuggestions}
              onSuggestionClick={(s) => handleSuggestionClick("destination", s)}
            />

            {/* Row 3 */}
            <TextInput
              label="Notes (Optional)" name="notes"
              placeholder="Any extra information"
              value={form.notes} onChange={handleChange}
              onFocus={() => handleFocus("notes")} onBlur={() => handleBlur("notes", form.notes)}
              error={errors.notes} submitted={submitted} isCreateMode={isCreateMode}
              inputRef={notesRef} maxLength={500} showCount
            />

            <DateTimeField
              label="Start Time" name="start_time" required
              value={form.start_time} onChange={handleChange}
              error={errors.start_time} submitted={submitted} isCreateMode={isCreateMode}
            />

            <DateTimeField
              label="End Time" name="end_time"
              value={form.end_time} onChange={handleChange}
              error={errors.end_time} submitted={submitted} isCreateMode={isCreateMode}
            />

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">Status</label>
              <Listbox value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <div className="relative">
                  <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
                    <span>{form.status}</span>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 w-full rounded-[12px] bg-gray-100 dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
                    {["Standby", "En Route", "Completed", "Cancelled"].map((s) => (
                      <Listbox.Option
                        key={s} value={s}
                        className={({ active }) =>
                          `cursor-pointer py-2 px-3 text-sm ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"}`
                        }
                      >
                        {s}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Actions */}
            <div className="col-span-4 flex justify-center gap-6 mt-4">
              <button
                type="button" onClick={onClose}
                className="w-[160px] h-[40px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent font-medium hover:bg-gray-50 dark:hover:bg-[#0EFF7B11] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[160px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
              >
                {isEdit ? "Save Changes" : "Create Trip"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;