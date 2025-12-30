// EditTrip.jsx - WITH VALIDATION (Format while typing, required after submission)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronDown, CalendarClock } from "lucide-react";
import { Listbox } from "@headlessui/react";

// Move ErrorMessage outside
const ErrorMessage = ({ field, errors, submitted, isCreateMode, form }) => {
  if (!isCreateMode || !errors[field]) return null;
  
  // Show format errors immediately, required errors only after submission
  const isFormatError = errors[field].includes("must be") || 
                       errors[field].includes("cannot") || 
                       errors[field].includes("seems") ||
                       errors[field].includes("after") ||
                       errors[field].includes("valid");
  
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
  error,
  submitted,
  isCreateMode,
  inputRef
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-black dark:text-white mb-1">
        {label} {isCreateMode && required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={false}
        placeholder={placeholder}
        className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
      />
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
  startTimeRef,
  endTimeRef,
  error,
  submitted,
  isCreateMode
}) => {
  const openPicker = (ref) => ref.current?.showPicker?.() || ref.current?.focus();
  
  return (
    <div className="flex flex-col">
      <label
        onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
        className="text-sm text-black dark:text-white mb-1 cursor-pointer select-none"
      >
        {label} {isCreateMode && required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={name === "start_time" ? startTimeRef : endTimeRef}
          type="datetime-local"
          name={name}
          value={value}
          onChange={onChange}
          required={false}
          className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
        />
        <CalendarClock
          onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer"
        />
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
  return (
    <div className="flex flex-col">
      <label className="text-sm text-black dark:text-white mb-1 select-none">
        {label} {isCreateMode && <span className="text-red-500">*</span>}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
            <span className="truncate">
              {value
                ? (() => {
                    const opt = options.find(o => String(o.id) === String(value));
                    return opt
                      ? `${opt[displayField] || opt.patient_unique_id} - ${opt[secondaryField] || opt.full_name || opt.unit_number}`
                      : value;
                  })()
                : placeholder}
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
                  <div className="font-medium">{opt[displayField] || opt.patient_unique_id}</div>
                  <div className="text-xs opacity-70">
                    {opt.full_name || opt.unit_number || opt.dispatch_id}
                  </div>
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
  
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const crewRef = useRef(null);
  const mileageRef = useRef(null);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const notesRef = useRef(null);

  const freshTime = () => new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!isOpen) return;
    
    setErrors({});
    setSubmitted(false);

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
      }));
    }
  }, [isOpen, trip, units]);

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
        return "";
        
      case "patient_id":
        if (!value) return "Patient is required";
        return "";
        
      case "pickup_location":
        if (!value.trim()) return "Pickup location is required";
        if (value.trim().length < 5) return "Pickup location must be at least 5 characters";
        return "";
        
      case "start_time":
        if (!value) return "Start time is required";
        if (new Date(value) < new Date()) {
          return "Start time cannot be in the past";
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
        if (value && value.trim() && value.trim().length < 3) {
          return "Destination must be at least 3 characters";
        }
        return "";
        
      case "end_time":
        if (value && form.start_time) {
          if (new Date(value) <= new Date(form.start_time)) {
            return "End time must be after start time";
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
    setForm(p => ({ ...p, [name]: value }));
    
    // Always validate format errors while typing (for create mode)
    if (isCreateMode) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
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
        const firstErrorField = Object.keys(errors).find(key => errors[key]);
        if (firstErrorField === 'crew' && crewRef.current) crewRef.current.focus();
        else if (firstErrorField === 'pickup_location' && pickupRef.current) pickupRef.current.focus();
        else if (firstErrorField === 'mileage' && mileageRef.current) mileageRef.current.focus();
        else if (firstErrorField === 'destination' && destinationRef.current) destinationRef.current.focus();
        else if (firstErrorField === 'notes' && notesRef.current) notesRef.current.focus();
        return;
      }
    } else {
      // For edit mode, use original validation
      if (!e.target.checkValidity()) {
        e.target.reportValidity();
        return;
      }
    }
    
    const payload = {
      dispatch_id: form.dispatch_id ? Number(form.dispatch_id) : null,
      unit_id: form.unit_id ? Number(form.unit_id) : null,
      crew: form.crew.trim(),
      patient_id: form.patient_id ? Number(form.patient_id) : null,
      pickup_location: form.pickup_location.trim(),
      destination: form.destination ? form.destination.trim() : null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      mileage: form.mileage ? form.mileage.trim() : null,
      status: form.status,
      notes: form.notes ? form.notes.trim() : null,
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
              label="Mileage"
              name="mileage"
              placeholder="e.g. 15.2 km (Optional)"
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
              placeholder="Full address"
              value={form.pickup_location}
              onChange={handleChange}
              error={errors.pickup_location}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={pickupRef}
            />

            <TextInput
              label="Destination"
              name="destination"
              placeholder="Hospital / Drop-off (Optional)"
              value={form.destination}
              onChange={handleChange}
              error={errors.destination}
              submitted={submitted}
              isCreateMode={isCreateMode}
              inputRef={destinationRef}
            />

            <TextInput
              label="Notes (Optional)"
              name="notes"
              placeholder="Any extra info"
              value={form.notes}
              onChange={handleChange}
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
              startTimeRef={startTimeRef}
              endTimeRef={endTimeRef}
              error={errors.start_time}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />
            
            <DateTimeField 
              label="End Time" 
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              startTimeRef={startTimeRef}
              endTimeRef={endTimeRef}
              error={errors.end_time}
              submitted={submitted}
              isCreateMode={isCreateMode}
            />

            <div className="col-span-3 flex justify-center gap-6 mt-10">
              <button
                type="button"
                onClick={onClose}
                className="w-[160px] h-[40px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent font-medium hover:bg-gray-50 dark:hover:bg-[#0EFF7B11]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[160px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium shadow-lg hover:scale-105 transition"
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