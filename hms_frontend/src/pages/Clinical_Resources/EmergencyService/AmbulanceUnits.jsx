// src/components/AmbulanceUnitsModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const AmbulanceUnitsModal = ({
  isOpen,
  onClose,
  unit, // null = Add, object = Edit
  onSave,
}) => {
  const isEdit = !!unit?.id; // true if editing

  const [form, setForm] = useState({
    unit_number: "",
    vehicle_make: "",
    vehicle_model: "",
    in_service: true,
    notes: "",
  });

  // Reset form when modal opens/closes or unit changes
  useEffect(() => {
    if (isOpen) {
      if (unit) {
        setForm({
          unit_number: unit.unit_number ?? "",
          vehicle_make: unit.vehicle_make ?? "",
          vehicle_model: unit.vehicle_model ?? "",
          in_service: unit.in_service ?? true,
          notes: unit.notes ?? "",
        });
      } else {
        setForm({
          unit_number: "",
          vehicle_make: "",
          vehicle_model: "",
          in_service: true,
          notes: "",
        });
      }
    }
  }, [isOpen, unit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Pass full data (add id only if editing)
      const dataToSave = isEdit ? { ...form, id: unit.id } : form;

      onSave(dataToSave);

      // Success toast
      successToast(
        isEdit
          ? `Ambulance "${form.unit_number}" updated successfully!`
          : `Ambulance "${form.unit_number}" added successfully!`
      );

      // Close modal
      onClose();
    } catch (error) {
      errorToast(
        isEdit ? "Failed to update ambulance" : "Failed to add ambulance"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
      <div
        className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
                    bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70"
      >
        <div
          className="w-[504px] h-[420px] rounded-[19px] bg-white dark:bg-[#000000] p-6 relative"
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
              {unit ? "Edit Unit" : "Add Unit"}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A]
                          bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
          >
            <div>
              <label className="text-black dark:text-white">Unit Number</label>
              <input
                required
                name="unit_number"
                value={form.unit_number}
                onChange={handleChange}
                placeholder="AMB-09"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">In Service</label>
              <div className="mt-1 flex items-center">
                <input
                  type="checkbox"
                  name="in_service"
                  checked={form.in_service}
                  onChange={handleChange}
                  className="appearance-none w-5 h-5 ml-3 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                />
                <span className="ml-2 text-sm">
                  {form.in_service ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-black dark:text-white">Make</label>
              <input
                name="vehicle_make"
                value={form.vehicle_make}
                onChange={handleChange}
                placeholder="Ford"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Model</label>
              <input
                name="vehicle_model"
                value={form.vehicle_model}
                onChange={handleChange}
                placeholder="Transit"
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-black dark:text-white">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any special notes..."
                className="w-full mt-1 px-3 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A]
                            bg-white dark:bg-transparent text-black dark:text-[#0EFF7B]
                            placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
              />
            </div>

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
                {unit ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceUnitsModal;
