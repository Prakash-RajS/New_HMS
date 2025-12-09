import React, { useState } from "react";
import { X } from "lucide-react";
import { successToast, errorToast } from "../../components/Toast";

const AddBedGroupPopup = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bedGroupName: "",
    bedFrom: "",
    bedTo: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track if form was submitted

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bedGroupName.trim()) {
      newErrors.bedGroupName = "Bed group name is required";
    }
    
    if (!formData.bedFrom) {
      newErrors.bedFrom = "Starting bed number is required";
    }
    
    if (!formData.bedTo) {
      newErrors.bedTo = "Ending bed number is required";
    } else if (parseInt(formData.bedFrom) >= parseInt(formData.bedTo)) {
      newErrors.bedTo = "Ending number must be greater than starting number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const API =
    window.location.hostname === "18.119.210.2"
      ? "http://18.119.210.2:8000"
      : "http://localhost:8000";

  const handleAdd = async () => {
    setSubmitted(true); // Mark form as submitted
    
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    const capacity = parseInt(formData.bedTo) - parseInt(formData.bedFrom) + 1;
    const payload = {
      bedGroup: formData.bedGroupName.trim(),
      capacity: capacity,
    };

    try {
      const response = await fetch(`${API}/bedgroups/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create bed group.";

        if (response.status === 400) {
          const err = await response.json();
          errorMessage = err.detail || "Bed group already exists.";
        } else {
          try {
            const err = await response.json();
            errorMessage = err.detail || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
        }

        setServerError(errorMessage);
        errorToast(errorMessage);
        setLoading(false);
        return;
      }

      const newGroup = await response.json();
      successToast(`"${newGroup.bedGroup}" created successfully!`);
      
      if (onAdd) onAdd(newGroup);
      
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      const networkError = "Network error. Please check your connection.";
      setServerError(networkError);
      errorToast(networkError);
      console.error("Create BedGroup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-[Helvetica]">
      <div className="w-[420px] h-auto rounded-[20px]  
      bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-md backdrop-blur-md relative">
        {/* Gradient Border */}
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
        ></div>

        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="font-inter font-medium text-[16px] leading-[19px] text-black dark:text-white">
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
            <label className="text-sm text-black dark:text-white">
              Bed Group Name <span className="text-red-500">*</span>
            </label>
            <input
              name="bedGroupName"
              value={formData.bedGroupName}
              onChange={handleInputChange}
              placeholder="e.g., ICU, Ward, General"
              className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
              bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
              outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {submitted && errors.bedGroupName && (
              <p className="text-red-500 text-xs mt-1">{errors.bedGroupName}</p>
            )}
          </div>

          {/* Bed Numbers (From - To) */}
          <div>
            <label className="text-sm text-black dark:text-white">
              Bed No's <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1/2">
                <input
                  type="number"
                  name="bedFrom"
                  value={formData.bedFrom}
                  onChange={handleInputChange}
                  placeholder="From"
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
                  bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                  outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
                {submitted && errors.bedFrom && (
                  <p className="text-red-500 text-xs mt-1">{errors.bedFrom}</p>
                )}
              </div>
              <span className="text-gray-600 dark:text-gray-300">to</span>
              <div className="w-1/2">
                <input
                  type="number"
                  name="bedTo"
                  value={formData.bedTo}
                  onChange={handleInputChange}
                  placeholder="To"
                  className="w-full h-[33px] px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
                  bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] placeholder-gray-500 
                  outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                />
                {submitted && errors.bedTo && (
                  <p className="text-red-500 text-xs mt-1">{errors.bedTo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Server error display */}
          {serverError && <p className="text-red-500 text-xs">{serverError}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-[104px] h-[33px] rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] 
            px-3 py-2 text-[#08994A] dark:text-white font-medium text-[14px] 
            hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-[104px] h-[33px] rounded-[8px] 
            bg-gradient-to-r from-[#14DC6F] to-[#09753A] dark:from-[#14DC6F] dark:to-[#09753A] 
            text-white dark:text-black font-medium text-[14px] hover:bg-[#0cd968] transition border-b-[2px] border-[#0EFF7B66] dark:border-[#0EFF7B66]"
            style={{
              background: "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBedGroupPopup;