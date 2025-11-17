// EditDispatchModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CalendarClock } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditDispatchModal = ({
  isOpen,
  onClose,
  dispatch,
  onSave,
  units = [],
}) => {
  const isEdit = !!dispatch?.id; // Use numeric id, not dispatch_id string

  const freshTimestamp = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const toLocalDateTimeValue = (v) => {
    if (!v) return freshTimestamp();
    const d = new Date(v);
    if (isNaN(d)) return freshTimestamp();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [form, setForm] = useState({
    unit_id: "",
    dispatcher: "",
    call_type: "Emergency",
    status: "Standby",
    location: "",
    timestamp: freshTimestamp(),
  });

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
          timestamp: toLocalDateTimeValue(dispatch.timestamp),
        });
      } else {
        setForm({
          unit_id: units[0]?.id || "",
          dispatcher: "",
          call_type: "Emergency",
          status: "Standby",
          location: "",
          timestamp: freshTimestamp(),
        });
      }
    }
  }, [isOpen, dispatch, units]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  const Dropdown = ({ label, value, onChange, options, placeholder, isObject = false }) => (
    <div>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px]">
            {value
              ? isObject
                ? options.find((o) => String(o.id) === String(value))?.unit_number || value
                : value
              : placeholder}
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0EFF7B]" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full max-h-40 overflow-y-auto rounded-[12px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
            {options.map((opt) => {
              const label = isObject ? opt.unit_number || opt.id : opt;
              const val = isObject ? opt.id : opt;
              return (
                <Listbox.Option
                  key={val}
                  value={val}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-2 text-sm rounded-md ${
                      active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"
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
    </div>
  );

  const openTimestampPicker = () => {
    timestampRef.current?.showPicker?.() || timestampRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow bg-gradient-to-r from-green-400/70 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[504px] h-auto rounded-[19px] bg-white dark:bg-black text-black dark:text-white p-6 relative">
          <div className="flex justify-between items-center pb-2 mb-3">
            <h3 className="font-medium text-[16px]">{isEdit ? "Edit Dispatch" : "Add Dispatch"}</h3>
            <button onClick={onClose} className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Dropdown label="Unit" value={form.unit_id} onChange={(v) => setForm(p => ({ ...p, unit_id: v }))} options={units} placeholder="Select Unit" isObject={true} />
            <div>
              <label>Dispatcher</label>
              <input required name="dispatcher" value={form.dispatcher} onChange={handleChange} placeholder="Enter name" className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]" />
            </div>
            <Dropdown label="Call Type" value={form.call_type} onChange={(v) => setForm(p => ({ ...p, call_type: v }))} options={["Emergency", "Non-Emergency", "Transfer"]} placeholder="Select Type" />
            <Dropdown label="Status" value={form.status} onChange={(v) => setForm(p => ({ ...p, status: v }))} options={["Standby", "En Route", "Completed", "Cancelled"]} placeholder="Select Status" />
            <div className="col-span-2">
              <label>Location</label>
              <input required name="location" value={form.location} onChange={handleChange} placeholder="Enter location" className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]" />
            </div>
            <div className="col-span-2">
              <label htmlFor="timestamp" className="block mb-1 cursor-pointer" onClick={openTimestampPicker}>Timestamp</label>
              <div className="relative">
                <input required ref={timestampRef} type="datetime-local" name="timestamp" value={form.timestamp} onChange={handleChange} className="w-full h-[33px] pr-7 pl-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] cursor-pointer" />
                <CalendarClock onClick={openTimestampPicker} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EFF7B] cursor-pointer" />
              </div>
            </div>
            <div className="col-span-2 flex justify-center gap-2 mt-6">
              <button type="button" onClick={onClose} className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] text-gray-700 dark:text-white bg-white dark:bg-transparent">Cancel</button>
              <button type="submit" className="w-[144px] h-[34px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white">{isEdit ? "Save" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDispatchModal;