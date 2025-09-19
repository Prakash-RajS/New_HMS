import React, { useState } from "react";
import { X } from "lucide-react";

const AddBedGroupPopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bedGroupName: "",
    bedFrom: "",
    bedTo: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bedGroupName.trim()) newErrors.bedGroupName = "Bed group name is required";
    if (!formData.bedFrom) newErrors.bedFrom = "Starting bed number is required";
    if (!formData.bedTo) newErrors.bedTo = "Ending bed number is required";
    else if (parseInt(formData.bedFrom) >= parseInt(formData.bedTo)) {
      newErrors.bedTo = "Ending number must be greater than starting number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      if (onAdd) onAdd(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[420px] h-auto rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-md backdrop-blur-md relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="font-inter font-medium text-[16px] leading-[19px] text-black dark:text-[#0EFF7B]">
            Add Bed Group
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] 
            flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Bed Group Name */}
          <div>
            <label className="text-sm text-black dark:text-white">Bed Group Name</label>
            <input
              name="bedGroupName"
              value={formData.bedGroupName}
              onChange={(e) => setFormData({ ...formData, bedGroupName: e.target.value })}
              placeholder="e.g., ICU, Ward, General"
              className="w-full h-[33px] mt-1 px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.bedGroupName && <p className="text-red-500 text-xs mt-1">{errors.bedGroupName}</p>}
          </div>

          {/* Bed Numbers (From - To) */}
          <div>
            <label className="text-sm text-black dark:text-white">Bed No’s</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                name="bedFrom"
                value={formData.bedFrom}
                onChange={(e) => setFormData({ ...formData, bedFrom: e.target.value })}
                placeholder="From"
                className="w-1/2 h-[33px] px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
                bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
              <span className="text-gray-600 dark:text-gray-300">to</span>
              <input
                type="number"
                name="bedTo"
                value={formData.bedTo}
                onChange={(e) => setFormData({ ...formData, bedTo: e.target.value })}
                placeholder="To"
                className="w-1/2 h-[33px] px-3 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D] 
                bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
              />
            </div>
            {errors.bedFrom && <p className="text-red-500 text-xs mt-1">{errors.bedFrom}</p>}
            {errors.bedTo && <p className="text-red-500 text-xs mt-1">{errors.bedTo}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
            px-3 py-2 text-[#08994A] dark:text-white font-medium text-[14px] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="w-[104px] h-[33px] rounded-[20px] 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] 
            text-white dark:text-black font-medium text-[14px] hover:bg-[#0cd968] transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBedGroupPopup;
