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
import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown, CalendarClock, MapPin } from "lucide-react";
import { Listbox } from "@headlessui/react";

// Move ErrorMessage outside
const ErrorMessage = ({ field, errors, submitted, isCreateMode, form }) => {
  if (!isCreateMode || !errors[field]) return null;
  
  // Show format errors immediately, required errors only after submission
  const isFormatError = errors[field].includes("must be") || 
                       errors[field].includes("cannot") || 
                       errors[field].includes("seems") ||
                       errors[field].includes("after") ||
                       errors[field].includes("valid") ||
                       errors[field].includes("Special characters") ||
                       errors[field].includes("not allowed");
  
  if (isFormatError || submitted) {
    return (
      <div className="mt-1 text-red-500 text-xs">
        <span>{errors[field]}</span>
      </div>
    );
  }
  
  return null;
};

// Move TextInput outside
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
  icon: Icon = null
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-black dark:text-white mb-1">
        {label} {isCreateMode && required && <span className="text-red-500">*</span>}
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
          className="h-[36px] w-full px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
          style={showIcon ? { paddingLeft: '2.5rem' } : {}}
        />
        {showIcon && Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B]" />
        )}
      </div>
      <ErrorMessage 
        field={name} 
        errors={{[name]: error}} 
        submitted={submitted} 
        isCreateMode={isCreateMode}
        form={{[name]: value}}
      />
    </div>
  );
});

// Move DateTimeField outside
const DateTimeField = React.memo(({ 
  label, 
  name, 
  required = false,
  value,
  onChange,
  timeRef,
  error,
  submitted,
  isCreateMode
}) => {
  const openPicker = () => {
    if (timeRef.current) {
      // Try showPicker first (modern browsers)
      if (timeRef.current.showPicker) {
        timeRef.current.showPicker();
      } else {
        // Fallback: focus and click for older browsers
        timeRef.current.focus();
        timeRef.current.click();
      }
    }
  };
  
  return (
    <div className="flex flex-col relative">
      <label className="text-black dark:text-white mb-1">
        {label} {isCreateMode && required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={timeRef}
          type="datetime-local"
          name={name}
          value={value}
          onChange={onChange}
          required={false}
          className="w-full h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer pr-10"
        />
        <div 
          onClick={openPicker}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <CalendarClock className="w-4 h-4 text-[#0EFF7B]" />
        </div>
      </div>
      <ErrorMessage 
        field={name} 
        errors={{[name]: error}} 
        submitted={submitted} 
        isCreateMode={isCreateMode}
        form={{[name]: value}}
      />
    </div>
  );
});

// Move Dropdown outside
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
  isCreateMode
}) => {
  const getDisplayValue = (selectedValue) => {
    if (!selectedValue) return "";
    
    const option = options.find(o => String(o.id) === String(selectedValue));
    if (!option) return selectedValue;
    
    // For Dispatch: show dispatch_id - dispatcher_name
    if (name === "dispatch_id") {
      const idPart = option.dispatch_id || option.id;
      const namePart = option.dispatcher || option.crew || "";
      return namePart ? `${idPart} - ${namePart}` : idPart;
    }
    
    // For Unit: show unit_number - vehicle_name/vehicle_model
    if (name === "unit_id") {
      const unitNumber = option.unit_number || option.unit_id || option.id;
      const vehicleName = option.vehicle_make || option.vehicle_model || "";
      return vehicleName ? `${unitNumber} - ${vehicleName}` : unitNumber;
    }
    
    // For Patient: show patient_unique_id - full_name
    if (name === "patient_id") {
      const idPart = option.patient_unique_id || option.id;
      const namePart = option.full_name || "";
      return namePart ? `${idPart} - ${namePart}` : idPart;
    }
    
    // Default fallback
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
                  `cursor-pointer py-2 px-3 text-sm ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"}`
                }
              >
                <div>
                  {/* For Dispatch: show dispatch_id - dispatcher_name */}
                  {name === "dispatch_id" && (
                    <>
                      <div className="font-medium">{opt.dispatch_id || opt.id}</div>
                      <div className="text-xs opacity-70">
                        {opt.dispatcher || opt.crew || "No dispatcher name"}
                      </div>
                    </>
                  )}
                  
                  {/* For Unit: show unit_number - vehicle_name/vehicle_model */}
                  {name === "unit_id" && (
                    <>
                      <div className="font-medium">{opt.unit_number || opt.unit_id}</div>
                      <div className="text-xs opacity-70">
                        {opt.vehicle_make || opt.vehicle_model || "No vehicle name"}
                      </div>
                    </>
                  )}
                  
                  {/* For Patient: show patient_unique_id - full_name */}
                  {name === "patient_id" && (
                    <>
                      <div className="font-medium">{opt.patient_unique_id || opt.id}</div>
                      <div className="text-xs opacity-70">{opt.full_name || "No name provided"}</div>
                    </>
                  )}
                  
                  {/* Default for other dropdowns */}
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
        errors={{[name]: error}} 
        submitted={submitted} 
        isCreateMode={isCreateMode}
        form={{[name]: value}}
      />
    </div>
  );
});

const EditTripModal = ({
  isOpen,
  onClose,
  trip,
  onSave,
  units = [],
  dispatches = [],
  patients = [],
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
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const crewRef = useRef(null);
  const mileageRef = useRef(null);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const notesRef = useRef(null);

  const freshTime = () => {
    const now = new Date();
    // Add 5 minutes to current time to avoid past validation error
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  // Valid Vizag locations for suggestions
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

  useEffect(() => {
    if (!isOpen) return;
    
    setErrors({});
    setSubmitted(false);
    setFocusedField(null);

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
        start_time: trip.start_time ? trip.start_time.slice(0, 16) : "",
        end_time: trip.end_time ? trip.end_time.slice(0, 16) : "",
        notes: trip.notes || "",
      });
    } else {
      setForm(prev => ({
        ...prev,
        unit_id: units[0]?.id?.toString() || "",
        start_time: freshTime(),
        patient_id: "",
        status: "Standby",
      }));
    }
  }, [isOpen, trip, units]);

  // Sanitize input to remove special characters
  const sanitizeInput = (value) => {
    // Remove special characters except spaces, commas, periods, apostrophes, and hyphens
    return value.replace(/[$*@#%^&!{}[\]<>\\|]/gi, '');
  };

  // Validation rules - useCallback
  const validateField = useCallback((name, value) => {
    if (!isCreateMode) return "";
    
    switch (name) {
      case "dispatch_id":
        if (!value) return "Dispatch is required";
        return "";
        
      case "unit_id":
        if (!value) return "Unit is required";
        return "";
        
      case "crew":
        if (!value.trim()) return "Crew is required";
        if (value.trim().length < 2) return "Crew must be at least 2 characters";
        // Check for invalid characters in crew
        const invalidCrewChars = /[$*@#%^&!{}[\]<>\\|]/;
        if (invalidCrewChars.test(value)) {
          return "Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\, | are not allowed";
        }
        return "";
        
      case "patient_id":
        if (!value) return "Patient is required";
        return "";
        
      case "pickup_location":
        if (!value.trim()) return "Pickup location is required";
        if (value.trim().length < 5) return "Pickup location must be at least 5 characters";
        // Check for invalid characters
        const invalidPickupChars = /[$*@#%^&!{}[\]<>\\|]/;
        if (invalidPickupChars.test(value)) {
          return "Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\, | are not allowed";
        }
        return "";
        
      case "start_time":
        if (!value) return "Start time is required";
        const startDate = new Date(value);
        const now = new Date();
        // Allow times up to 1 hour in the past for practical reasons
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        if (startDate < oneHourAgo) {
          return "Start time cannot be more than 1 hour in the past";
        }
        return "";
        
      case "mileage":
        if (value && value.trim()) {
          const num = parseFloat(value);
          if (isNaN(num)) return "Mileage must be a valid number";
          if (num < 0) return "Mileage cannot be negative";
          if (num > 9999) return "Mileage seems too high";
        }
        return "";
        
      case "destination":
        if (value && value.trim()) {
          if (value.trim().length < 3) {
            return "Destination must be at least 3 characters";
          }
          // Check for invalid characters
          const invalidDestChars = /[$*@#%^&!{}[\]<>\\|]/;
          if (invalidDestChars.test(value)) {
            return "Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\, | are not allowed";
          }
        }
        return "";
        
      case "end_time":
        if (value && form.start_time) {
          const startDate = new Date(form.start_time);
          const endDate = new Date(value);
          if (endDate <= startDate) {
            return "End time must be after start time";
          }
        }
        return "";
        
      case "notes":
        if (value && value.trim()) {
          const invalidNoteChars = /[$*@#%^&!{}[\]<>\\|]/;
          if (invalidNoteChars.test(value)) {
            return "Special characters $, *, @, #, %, ^, &, !, {, }, [, ], <, >, \\, | are not allowed";
          }
        }
        return "";
        
      default:
        return "";
    }
  }, [isCreateMode, form.start_time]);

  // Handle change - useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize text inputs (except mileage which needs numbers)
    if (['crew', 'pickup_location', 'destination', 'notes'].includes(name)) {
      sanitizedValue = sanitizeInput(value);
    }
    
    setForm(p => ({ ...p, [name]: sanitizedValue }));
    
    // Always validate format errors while typing (for create mode)
    if (isCreateMode) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [isCreateMode, validateField]);

  // Handle focus/blur
  const handleFocus = useCallback((fieldName) => {
    setFocusedField(fieldName);
  }, []);

  const handleBlur = useCallback((fieldName, value) => {
    setFocusedField(null);
    // Validate on blur for better UX
    if (isCreateMode) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [isCreateMode, validateField]);

  // Validate entire form
  const validateForm = useCallback(() => {
    if (!isCreateMode) return true;
    
    const newErrors = {};
    let isValid = true;
    
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [isCreateMode, form, validateField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isCreateMode) {
      setSubmitted(true);
      if (!validateForm()) {
        // Focus on first error field
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField === 'crew' && crewRef.current) crewRef.current.focus();
        else if (firstErrorField === 'pickup_location' && pickupRef.current) pickupRef.current.focus();
        else if (firstErrorField === 'destination' && destinationRef.current) destinationRef.current.focus();
        else if (firstErrorField === 'notes' && notesRef.current) notesRef.current.focus();
        else if (firstErrorField === 'start_time' && startTimeRef.current) {
          startTimeRef.current.focus();
          startTimeRef.current.click();
        }
        else if (firstErrorField === 'end_time' && endTimeRef.current) {
          endTimeRef.current.focus();
          endTimeRef.current.click();
        }
        return;
      }
    }
    
    // Sanitize all text fields before submission
    const sanitizedForm = {
      ...form,
      crew: sanitizeInput(form.crew),
      pickup_location: sanitizeInput(form.pickup_location),
      destination: form.destination ? sanitizeInput(form.destination) : null,
      notes: form.notes ? sanitizeInput(form.notes) : null,
    };
    
    const payload = {
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
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[960px] max-h-[90vh] overflow-y-auto rounded-[19px] bg-gray-100 dark:bg-black p-8">
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

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <Dropdown
              label="Dispatch"
              name="dispatch_id"
              value={form.dispatch_id}
              onChange={(v) => {
                setForm(p => ({ ...p, dispatch_id: v }));
                if (isCreateMode) {
                  const error = validateField('dispatch_id', v);
                  setErrors(prev => ({ ...prev, dispatch_id: error }));
                }
              }}
              options={dispatches}
              placeholder="Select Dispatch"
              displayField="dispatch_id"
              secondaryField="dispatcher_name"
              error={errors.dispatch_id}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />

            <Dropdown
              label="Unit"
              name="unit_id"
              value={form.unit_id}
              onChange={(v) => {
                setForm(p => ({ ...p, unit_id: v }));
                if (isCreateMode) {
                  const error = validateField('unit_id', v);
                  setErrors(prev => ({ ...prev, unit_id: error }));
                }
              }}
              options={units}
              placeholder="Select Unit"
              displayField="unit_number"
              secondaryField="vehicle_name"
              error={errors.unit_id}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />

            <TextInput
              label="Crew"
              name="crew"
              required={true}
              placeholder="Driver + EMT names"
              value={form.crew}
              onChange={handleChange}
              onFocus={() => handleFocus('crew')}
              onBlur={() => handleBlur('crew', form.crew)}
              error={errors.crew}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={crewRef}
            />

            <Dropdown
              label="Patient"
              name="patient_id"
              value={form.patient_id}
              onChange={(v) => {
                setForm(p => ({ ...p, patient_id: v }));
                if (isCreateMode) {
                  const error = validateField('patient_id', v);
                  setErrors(prev => ({ ...prev, patient_id: error }));
                }
              }}
              options={patients}
              placeholder="Select Patient"
              displayField="patient_unique_id"
              secondaryField="full_name"
              error={errors.patient_id}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />

            <TextInput
              label="Mileage (km)"
              name="mileage"
              type="number"
              step="0.1"
              min="0"
              max="9999"
              placeholder="e.g. 15.2 (Optional)"
              value={form.mileage}
              onChange={handleChange}
              error={errors.mileage}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={mileageRef}
            />

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
                        key={s}
                        value={s}
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

            <TextInput
              label="Pickup Location"
              name="pickup_location"
              required={true}
              placeholder="Full address or landmark"
              value={form.pickup_location}
              onChange={handleChange}
              onFocus={() => handleFocus('pickup_location')}
              onBlur={() => handleBlur('pickup_location', form.pickup_location)}
              error={errors.pickup_location}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={pickupRef}
              showIcon={true}
              icon={MapPin}
            />

            <TextInput
              label="Destination"
              name="destination"
              placeholder="Hospital / Drop-off (Optional)"
              value={form.destination}
              onChange={handleChange}
              onFocus={() => handleFocus('destination')}
              onBlur={() => handleBlur('destination', form.destination)}
              error={errors.destination}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={destinationRef}
              showIcon={true}
              icon={MapPin}
            />

            <TextInput
              label="Notes (Optional)"
              name="notes"
              placeholder="Any extra information"
              value={form.notes}
              onChange={handleChange}
              onFocus={() => handleFocus('notes')}
              onBlur={() => handleBlur('notes', form.notes)}
              error={errors.notes}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={notesRef}
            />

            <DateTimeField 
              label="Start Time" 
              name="start_time" 
              required={true}
              value={form.start_time}
              onChange={handleChange}
              timeRef={startTimeRef}
              error={errors.start_time}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />
            
            <DateTimeField 
              label="End Time" 
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              timeRef={endTimeRef}
              error={errors.end_time}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />

            <div className="col-span-3 mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                <strong>Note:</strong> Special characters ($, *, @, #, %, ^, &, !, &#123;, &#125;, [, ], &lt;, &gt;, \, |) are not allowed in text fields.
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Valid Vizag locations include: Gajuwaka, NAD Kotha Road, Dwaraka Nagar, Seethammadhara, hospitals, and major landmarks.
              </p>
            </div>

            <div className="col-span-3 flex justify-center gap-6 mt-6">
              <button
                type="button"
                onClick={onClose}
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