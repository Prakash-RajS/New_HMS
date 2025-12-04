import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";

const API_BASE = "http://localhost:8000";

/* -------------------------------------------------
   Dropdown – EXACT SAME AS YOUR DESIGN
------------------------------------------------- */
const Dropdown = ({ label, value, onChange, options, error, disabled = false }) => (
  <div>
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative mt-1 w-[228px]">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                     bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
                     outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>

        <Listbox.Options
          className="absolute mt-1 w-full max-h-40 overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 
                     border border-gray-300 dark:border-[#3A3A3A] left-[2px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((opt, idx) => (
            <Listbox.Option
              key={idx}
              value={opt}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-[12px] 
                 ${active ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-[#0EFF7B]"}
                 ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
              }
            >
              {opt}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
    </Listbox>
  </div>
);

/* -------------------------------------------------
   AdmitPatientPopup – DESIGN 100% SAME, YOUR TOAST INTEGRATED
------------------------------------------------- */
const AdmitPatientPopup = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    patientId: "",
    bedGroup: "",
    bedNumber: "",
    admitDate: "",
  });
  const [errors, setErrors] = useState({});
  const [bedGroups, setBedGroups] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Load bed groups
  useEffect(() => {
    fetch(`${API_BASE}/bedgroups/all`)
      .then((r) => r.json())
      .then((groups) => {
        const names = groups.map((g) => g.bedGroup);
        setBedGroups(names);
        if (names.length > 0) {
          setFormData((prev) => ({ ...prev, bedGroup: names[0] }));
        }
      })
      .catch(() => {
        const msg = "Failed to load bed groups";
        setServerError(msg);
        errorToast(msg);
      });
  }, []);

  // Load free beds when group changes
  useEffect(() => {
    if (!formData.bedGroup) return;

    fetch(`${API_BASE}/bedgroups/all`)
      .then((r) => r.json())
      .then((groups) => {
        const group = groups.find((g) => g.bedGroup === formData.bedGroup);
        if (group) {
          const free = group.beds
            .filter((b) => !b.is_occupied)
            .map((b) => `Bed ${b.bed_number}`)
            .sort();
          setAvailableBeds(free);
          if (free.length > 0 && !formData.bedNumber) {
            setFormData((prev) => ({ ...prev, bedNumber: free[0] }));
          } else {
            setFormData((prev) => ({ ...prev, bedNumber: "" }));
          }
        }
      });
  }, [formData.bedGroup]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.patientId.trim()) newErrors.patientId = "Patient ID is required";
    if (!formData.bedGroup) newErrors.bedGroup = "Bed group is required";
    if (!formData.bedNumber) newErrors.bedNumber = "Select a free bed";
    if (!formData.admitDate) newErrors.admitDate = "Admit date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    const bedNumberNum = parseInt(formData.bedNumber.replace("Bed ", ""));

    try {
      const response = await fetch(`${API_BASE}/bedgroups/admit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          full_name: formData.name,
          patient_unique_id: formData.patientId,
          bed_group_name: formData.bedGroup,
          bed_number: bedNumberNum.toString(),
          admission_date: formData.admitDate,
        }),
      });

      let errorMessage = "Failed to admit patient.";

      if (!response.ok) {
        if (response.status === 400) {
          const err = await response.json();
          errorMessage = err.detail || "Invalid data.";
        } else if (response.status === 404) {
          errorMessage = "Patient or bed not found.";
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

      const result = await response.json();

      // SUCCESS TOAST
      successToast(`Patient "${formData.name}" admitted to ${formData.bedNumber}!`);

      // Notify parent to refresh
      if (onSuccess) onSuccess();

      // Close after delay
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      const networkError = "Network error. Please check your connection.";
      setServerError(networkError);
      errorToast(networkError);
      console.error("Admit Patient Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [m, d, y] = dateStr.split("/").map(Number);
    if (!m || !d || !y) return null;
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica]">
      <div
        className="w-[504px] h-auto rounded-[20px] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 relative"
        style={{
          boxShadow: "0px 0px 4px 0px rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background:
              "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
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
          <h3 className="font-inter font-medium text-[16px] leading-[19px]">
            Admit Patient
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] flex items-center justify-center hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Patient Name */}
          <div>
            <label className="text-sm">Patient Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                         bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
                         focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Patient ID */}
          <div>
            <label className="text-sm">Patient ID</label>
            <input
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              placeholder="Enter ID"
              className="w-[228px] h-[33px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                         bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400 outline-none
                         focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
            />
            {errors.patientId && <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>}
          </div>

          {/* Bed Group */}
          <Dropdown
            label="Bed Group"
            value={formData.bedGroup}
            onChange={(v) => setFormData({ ...formData, bedGroup: v, bedNumber: "" })}
            options={bedGroups}
            error={errors.bedGroup}
          />

          {/* Bed Number */}
          <Dropdown
            label="Bed Number"
            value={formData.bedNumber}
            onChange={(v) => setFormData({ ...formData, bedNumber: v })}
            options={availableBeds}
            error={errors.bedNumber}
            disabled={!availableBeds.length}
          />

          {/* Admit Date */}
          <div>
            <label className="text-sm">Admit Date</label>
            <div className="relative">
              <DatePicker
                selected={parseDate(formData.admitDate)}
                onChange={(date) => {
                  const formatted = date
                    ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                        date.getDate()
                      ).padStart(2, "0")}/${date.getFullYear()}`
                    : "";
                  setFormData({ ...formData, admitDate: formatted });
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="w-[228px] h-[33px] mt-1 px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                           bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none
                           focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] text-sm"
                wrapperClassName="w-full"
                popperClassName="z-50"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                customInput={
                  <input
                    style={{
                      paddingRight: "2.5rem",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  />
                }
              />
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <Calendar size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
              </div>
            </div>
            {errors.admitDate && <p className="text-red-500 text-xs mt-1">{errors.admitDate}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-[18px] mt-8">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] 
                       bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-medium text-[14px] leading-[16px] hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
          >
            Cancel
          </button>
          <button
            onClick={handleAdmit}
            disabled={loading}
            style={{
              background:
                "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
            className="w-[104px] h-[33px] rounded-[8px] border-b-[2px] border-[#0EFF7B66] text-white font-medium text-[14px] leading-[16px] hover:bg-[#0cd968] disabled:opacity-50"
          >
            {loading ? "Admitting..." : "Admit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatientPopup;