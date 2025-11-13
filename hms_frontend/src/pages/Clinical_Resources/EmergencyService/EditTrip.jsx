import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const EditTripModal = ({
  isOpen,
  onClose,
  trip, // null = Add, object = Edit
  onSave,
  units = [],
  dispatches = [],
}) => {
  const isEdit = !!trip?.trip_id;

  const [form, setForm] = useState({
    trip_id: "",
    dispatch_id: "",
    unit_id: "",
    crew: "",
    patient_id: "",
    pickup_location: "",
    destination: "",
    start_time: "",
    end_time: "",
    mileage: "",
    status: "Standby",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (trip) {
        setForm({
          trip_id: trip.trip_id ?? "",
          dispatch_id: trip.dispatch_id ?? "",
          unit_id: trip.unit_id ?? "",
          crew: trip.crew ?? "",
          patient_id: trip.patient_id ?? "",
          pickup_location: trip.pickup_location ?? "",
          destination: trip.destination ?? "",
          start_time: trip.start_time ? trip.start_time.slice(0, 16) : "",
          end_time: trip.end_time ? trip.end_time.slice(0, 16) : "",
          mileage: trip.mileage ?? "",
          status: trip.status ?? "Standby",
        });
      } else {
        setForm({
          trip_id: "",
          dispatch_id: "",
          unit_id: "",
          crew: "",
          patient_id: "",
          pickup_location: "",
          destination: "",
          start_time: "",
          end_time: "",
          mileage: "",
          status: "Standby",
        });
      }
    }
  }, [isOpen, trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const dataToSave = isEdit ? { ...form, trip_id: trip.trip_id } : form;

      onSave(dataToSave);

      successToast(
        isEdit
          ? `Trip "${form.trip_id}" updated successfully!`
          : "Trip created successfully!"
      );

      onClose();
    } catch (error) {
      errorToast(isEdit ? "Failed to update trip" : "Failed to create trip");
    }
  };

  if (!isOpen) return null;

  const Dropdown = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    isObject = false,
  }) => (
    <div>
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                        bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            {value
              ? isObject
                ? options.find((o) => String(o.id) === String(value))
                    ?.dispatch_id ||
                  options.find((o) => String(o.id) === String(value))
                    ?.unit_number ||
                  value
                : value
              : placeholder}
            <ChevronDown className="absolute inset-y-0 right-2 h-4 w-4 text-[#0EFF7B] pointer-events-none" />
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black
                        shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] left-[2px]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {options.map((opt) => {
              const label = isObject
                ? opt.dispatch_id || opt.unit_number || String(opt.id)
                : opt;
              const val = isObject ? opt.id : opt;
              return (
                <Listbox.Option
                  key={val}
                  value={val}
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
                  {label}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                    bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
                    dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
      >
        <div
          className="w-[504px] h-full rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {/* Inner gradient border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
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
          />

          {/* Header */}
          <div className="flex justify-between items-center pb-2 mb-3">
            <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
              {trip ? "Edit Trip" : "Add Trip"}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                          bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Form – Compact, No Scroll */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
          >
            {/* Row 1 */}
            <div>
              <label className="text-black dark:text-white">Trip ID</label>
              <input
                required
                name="trip_id"
                value={form.trip_id}
                onChange={handleChange}
                placeholder="Enter ID"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
            <Dropdown
              label="Dispatch"
              value={form.dispatch_id}
              onChange={(v) => setForm((p) => ({ ...p, dispatch_id: v }))}
              options={dispatches}
              placeholder="Select Dispatch"
              isObject={true}
            />

            {/* Row 2 */}
            <Dropdown
              label="Unit"
              value={form.unit_id}
              onChange={(v) => setForm((p) => ({ ...p, unit_id: v }))}
              options={units}
              placeholder="Select Unit"
              isObject={true}
            />
            <div>
              <label className="text-black dark:text-white">Crew</label>
              <input
                name="crew"
                value={form.crew}
                onChange={handleChange}
                placeholder="Enter crew"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            {/* Row 3 */}
            <div>
              <label className="text-black dark:text-white">Patient ID</label>
              <input
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                placeholder="Enter ID"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
            <Dropdown
              label="Status"
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v }))}
              options={["Completed", "En Route", "Standby"]}
              placeholder="Select Status"
            />

            {/* Full Width Fields */}
            <div className="col-span-2">
              <label className="text-black dark:text-white">
                Pickup Location
              </label>
              <input
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-black dark:text-white">Destination</label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Enter destination"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="text-black dark:text-white">Start Time</label>
              <input
                type="datetime-local"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">End Time</label>
              <input
                type="datetime-local"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

            {/* Mileage */}
            <div className="col-span-2">
              <label className="text-black dark:text-white">Mileage</label>
              <input
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                placeholder="Enter mileage"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#0EFF7B] dark:border-gray-600
                          text-gray-600 dark:text-white font-medium text-[14px] leading-[16px]
                          shadow-[0_2px_12px_0px_#00000040] bg-white dark:bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                          bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                          shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px]
                          hover:scale-105 transition"
            >
              {trip ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTripModal;
