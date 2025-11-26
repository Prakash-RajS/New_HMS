// EditMedicineAllocationPopup.jsx
import React, { useState, useEffect, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";

const EditMedicineAllocationPopup = ({ onClose, medicineData, onUpdate }) => {
  const API_BASE = "http://localhost:8000";

  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    medicineName: medicineData?.medicine_name || "",
    dosage: medicineData?.dosage || "",
    quantity: medicineData?.quantity || "",
    frequency: medicineData?.frequency || "",
    duration: medicineData?.duration || "",
    time: medicineData?.time || "",
  });

  const [errors, setErrors] = useState({});

  // Fetch stock data once
  useEffect(() => {
    fetch(`${API_BASE}/medicine_allocation/available/`)
      .then((res) => res.json())
      .then((data) => {
        setStockData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stock:", err);
        setLoading(false);
      });
  }, []);

  // Dynamic options
  const medicineNames = useMemo(() => {
    const names = [...new Set(stockData.map((s) => s.product_name))].sort();
    return names;
  }, [stockData]);

  const availableDosages = useMemo(() => {
    if (!formData.medicineName) return [];
    return stockData
      .filter((s) => s.product_name === formData.medicineName && s.quantity > 0)
      .map((s) => s.dosage)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
  }, [formData.medicineName, stockData]);

  const maxAvailableQuantity = useMemo(() => {
    if (!formData.medicineName || !formData.dosage) return null;
    const item = stockData.find(
      (s) => s.product_name === formData.medicineName && s.dosage === formData.dosage
    );
    return item ? item.quantity : 0;
  }, [formData.medicineName, formData.dosage, stockData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.medicineName) newErrors.medicineName = "Medicine name is required";
    if (!formData.dosage) newErrors.dosage = "Dosage is required";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (maxAvailableQuantity !== null && formData.quantity > maxAvailableQuantity)
      newErrors.quantity = `Only ${maxAvailableQuantity} available in stock`;

    if (!formData.frequency) newErrors.frequency = "Frequency is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      onUpdate(formData);
      onClose();
    }
  };

  const frequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "As needed"];
  const durations = ["3 days", "5 days", "7 days", "10 days", "14 days", "30 days", "As directed"];
  const times = ["8:00 AM", "12:00 PM", "6:00 PM", "8:00 PM", "Before meals", "After meals", "At bedtime"];

  const Dropdown = ({ label, value, onChange, options, error, placeholder = "Select" }) => (
    <div>
      <label className="text-sm text-black dark:text-white font-helvetica">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className={`w-full h-[32px] px-3 pr-8 rounded-[8px] border ${
              error ? "border-red-500" : "border-gray-300 dark:border-[#3A3A3A]"
            } bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] focus:outline-none`}
          >
            <span className={value ? "" : "text-gray-500"}>
              {value || placeholder}
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A] no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {options.length > 0 ? (
              options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  value={option}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                      active
                        ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                        : "text-black dark:text-white"
                    } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                  }
                >
                  {option}
                </Listbox.Option>
              ))
            ) : (
              <div className="py-2 px-3 text-sm text-gray-500 text-center">
                {loading ? "Loading..." : "No options available"}
              </div>
            )}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-helvetica">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
        <div className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative font-helvetica">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-black dark:text-white font-medium text-[16px]">
              Edit Medicine Allocation
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B33] transition"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading stock data...</div>
          ) : (
            <>
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  label="Medicine Name"
                  value={formData.medicineName}
                  onChange={(val) => {
                    setFormData({ ...formData, medicineName: val, dosage: "" }); // Reset dosage
                  }}
                  options={medicineNames}
                  error={errors.medicineName}
                  placeholder="Select medicine"
                />

                <Dropdown
                  label="Dosage"
                  value={formData.dosage}
                  onChange={(val) => setFormData({ ...formData, dosage: val })}
                  options={availableDosages}
                  error={errors.dosage}
                  placeholder={formData.medicineName ? "Select dosage" : "First select medicine"}
                />

                <div>
                  <label className="text-sm text-black dark:text-white font-helvetica">
                    Quantity {maxAvailableQuantity !== null && `(Max: ${maxAvailableQuantity})`}
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={`w-full h-[32px] px-3 rounded-[8px] border ${
                      errors.quantity ? "border-red-500" : "border-gray-300 dark:border-[#3A3A3A]"
                    } bg-white dark:bg-transparent text-black dark:text-white text-[14px] focus:outline-none focus:border-[#0EFF7B]`}
                    min="1"
                    max={maxAvailableQuantity || undefined}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.quantity}</p>
                  )}
                </div>

                <Dropdown
                  label="Frequency"
                  value={formData.frequency}
                  onChange={(val) => setFormData({ ...formData, frequency: val })}
                  options={frequencies}
                  error={errors.frequency}
                />

                <Dropdown
                  label="Duration"
                  value={formData.duration}
                  onChange={(val) => setFormData({ ...formData, duration: val })}
                  options={durations}
                  error={errors.duration}
                />

                <Dropdown
                  label="Time"
                  value={formData.time}
                  onChange={(val) => setFormData({ ...formData, time: val })}
                  options={times}
                  error={errors.time}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={onClose}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] hover:bg-gray-100 dark:hover:bg-[#0EFF7B1A] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] border-b-2 border-[#0EFF7B] hover:scale-105 transition shadow-md"
                >
                  Update
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMedicineAllocationPopup;