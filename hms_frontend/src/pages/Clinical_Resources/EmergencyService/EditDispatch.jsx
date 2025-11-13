// EditDispatchModal.jsx
import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const EditDispatchModal = ({
  isOpen,
  onClose,
  dispatch, // null = Add, object = Edit
  onSave,
  units = [],
}) => {
  const isEdit = !!dispatch?.dispatch_id;

  const [form, setForm] = useState({
    dispatch_id: "",
    timestamp: new Date().toISOString().slice(0, 16),
    unit_id: "",
    dispatcher: "",
    call_type: "Emergency",
    location: "",
    status: "Standby",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (dispatch) {
        setForm({
          dispatch_id: dispatch.dispatch_id ?? "",
          timestamp: dispatch.timestamp
            ? dispatch.timestamp.slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          unit_id: dispatch.unit_id ?? "",
          dispatcher: dispatch.dispatcher ?? "",
          call_type: dispatch.call_type ?? "Emergency",
          location: dispatch.location ?? "",
          status: dispatch.status ?? "Standby",
        });
      } else {
        setForm({
          dispatch_id: "",
          timestamp: new Date().toISOString().slice(0, 16),
          unit_id: units[0]?.id || "",
          dispatcher: "",
          call_type: "Emergency",
          location: "",
          status: "Standby",
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
    try {
      const dataToSave = isEdit
        ? { ...form, dispatch_id: dispatch.dispatch_id }
        : form;

      onSave(dataToSave);

      successToast(
        isEdit
          ? `Dispatch "${form.dispatch_id}" updated successfully!`
          : "Dispatch created successfully!"
      );

      onClose();
    } catch (error) {
      errorToast(
        isEdit ? "Failed to update dispatch" : "Failed to create dispatch"
      );
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
                    ?.unit_number || value
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
              const label = isObject ? opt.unit_number || String(opt.id) : opt;
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
          className="w-[504px] h-[485px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
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
              {dispatch ? "Edit Dispatch" : "Add Dispatch"}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                          bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* FORM – includes buttons inside */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm h-full flex flex-col justify-between"
          >
            {/* Row 1 */}
            <div>
              <label className="text-black dark:text-white">Dispatch ID</label>
              <input
                required
                name="dispatch_id"
                value={form.dispatch_id}
                onChange={handleChange}
                placeholder="Enter ID"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">Timestamp</label>
              <input
                required
                type="datetime-local"
                name="timestamp"
                value={form.timestamp}
                onChange={handleChange}
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
              />
            </div>

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
              <label className="text-black dark:text-white">Dispatcher</label>
              <input
                required
                name="dispatcher"
                value={form.dispatcher}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            {/* Row 3 */}
            <Dropdown
              label="Call Type"
              value={form.call_type}
              onChange={(v) => setForm((p) => ({ ...p, call_type: v }))}
              options={["Emergency", "Non-Emergency"]}
              placeholder="Select Type"
            />
            <Dropdown
              label="Status"
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v }))}
              options={["Completed", "En Route", "Standby"]}
              placeholder="Select Status"
            />

            {/* Location – full width */}
            <div className="col-span-2">
              <label className="text-black dark:text-white">Location</label>
              <input
                required
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            {/* BUTTONS – INSIDE FORM */}
            <div className="col-span-2 flex justify-center gap-2 mt-4">
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
                className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B66]
                            bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                            shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px]
                            hover:scale-105 transition"
              >
                {dispatch ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDispatchModal;
