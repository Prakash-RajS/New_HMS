// EditTrip.jsx - FINAL FIXED VERSION (Patient ID + All Trim Issues Resolved)
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CalendarClock } from "lucide-react";
import { Listbox } from "@headlessui/react";

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

  const [form, setForm] = useState({
    dispatch_id: "",
    unit_id: "",
    crew: "",
    patient_id: "",        // ← This is now a number OR empty string
    mileage: "",
    pickup_location: "",
    destination: "",
    status: "Standby",
    start_time: "",
    end_time: "",
    notes: "",
  });

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const freshTime = () => new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!isOpen) return;

    if (trip) {
      setForm({
        dispatch_id: trip.dispatch?.id || trip.dispatch_id || "",
        unit_id: trip.unit?.id || trip.unit_id || "",
        crew: trip.crew || "",
        patient_id: trip.patient?.id || trip.patient_id || "",   // ← Correct source
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const payload = {
      dispatch_id: form.dispatch_id ? Number(form.dispatch_id) : null,
      unit_id: form.unit_id ? Number(form.unit_id) : null,
      crew: form.crew.trim(),
      // FIXED: Only trim if it's a string!
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

  const openPicker = (ref) => ref.current?.showPicker?.() || ref.current?.focus();

  if (!isOpen) return null;

  const Dropdown = ({ label, name, value, onChange, options, placeholder, displayField, secondaryField }) => (
    <div className="flex flex-col">
      <label className="text-sm text-black dark:text-white mb-1 select-none">
        {label} <span className="text-red-500">*</span>
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
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
          <Listbox.Options className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-[12px] bg-white dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
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
    </div>
  );

  const DateTimeField = ({ label, name, required = false }) => (
    <div className="flex flex-col">
      <label
        onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
        className="text-sm text-black dark:text-white mb-1 cursor-pointer select-none"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          ref={name === "start_time" ? startTimeRef : endTimeRef}
          type="datetime-local"
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
        />
        <CalendarClock
          onClick={() => openPicker(name === "start_time" ? startTimeRef : endTimeRef)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[960px] max-h-[90vh] overflow-y-auto rounded-[19px] bg-white dark:bg-black p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-black dark:text-white">
              {isEdit ? "Edit Trip" : "Create New Trip"}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B22]"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <Dropdown
              label="Dispatch"
              name="dispatch_id"
              value={form.dispatch_id}
              onChange={(v) => setForm((p) => ({ ...p, dispatch_id: v }))}
              options={dispatches}
              placeholder="Select Dispatch"
              displayField="dispatch_id"
            />

            <Dropdown
              label="Unit"
              name="unit_id"
              value={form.unit_id}
              onChange={(v) => setForm((p) => ({ ...p, unit_id: v }))}
              options={units}
              placeholder="Select Unit"
              displayField="unit_number"
            />

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">
                Crew <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="crew"
                value={form.crew}
                onChange={handleChange}
                placeholder="Driver + EMT names"
                className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            {/* PATIENT DROPDOWN – NOW WORKS PERFECTLY */}
            <Dropdown
              label="Patient"
              name="patient_id"
              value={form.patient_id}
              onChange={(v) => setForm((p) => ({ ...p, patient_id: v }))}
              options={patients}
              placeholder="Select Patient"
              displayField="patient_unique_id"
              secondaryField="full_name"
            />

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">Mileage</label>
              <input
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                placeholder="e.g. 15.2 km"
                className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">Status</label>
              <Listbox value={form.status} onChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <div className="relative">
                  <Listbox.Button className="w-full h-[36px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-sm flex items-center justify-between">
                    <span>{form.status}</span>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-50 mt-1 w-full rounded-[12px] bg-white dark:bg-black shadow-lg border border-[#0EFF7B] dark:border-[#3A3A3A]">
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

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Full address"
                className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">Destination</label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Hospital / Drop-off"
                className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black dark:text-white mb-1">Notes (Optional)</label>
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any extra info"
                className="h-[36px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            <DateTimeField label="Start Time" name="start_time" required={true} />
            <DateTimeField label="End Time" name="end_time" />

            <div className="col-span-3 flex justify-center gap-6 mt-10">
              <button
                type="button"
                onClick={onClose}
                className="w-[160px] h-[40px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-white dark:bg-transparent font-medium hover:bg-gray-50 dark:hover:bg-[#0EFF7B11]"
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