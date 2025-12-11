import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X, Calendar, ChevronDown } from "lucide-react";
import { successToast, errorToast } from "../../components/Toast";

const API_BASE =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : "http://localhost:8000";

/* -------------------------------------------------
   TypeAhead Dropdown Component
------------------------------------------------- */
const TypeAheadDropdown = ({
  label,
  value,
  onChange,
  options,
  error,
  disabled = false,
  placeholder = "Type to search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Filter options based on input value
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions(options.slice(0, 10)); // Show first 10 when empty
    } else {
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.value.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered.slice(0, 10)); // Limit to 10 results
    }
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (optionValue, optionLabel) => {
    setInputValue(optionLabel);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm text-black dark:text-white">{label}</label>
      <div className="relative mt-1 w-[228px]">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full h-[33px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                       bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
                       outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </div>
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(option.value, option.label)}
                  className={`cursor-pointer select-none py-2 px-3 text-sm rounded-[4px] 
                             hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] hover:text-[#08994A] dark:hover:text-[#0EFF7B]
                             ${
                               value === option.value
                                 ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B] font-medium"
                                 : "text-black dark:text-[#0EFF7B]"
                             }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

/* -------------------------------------------------
   AdmitPatientPopup – Updated with type-ahead dropdowns
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

  // Patient data
  const [allPatients, setAllPatients] = useState([]);
  const [patientNameOptions, setPatientNameOptions] = useState([]);
  const [patientIdOptions, setPatientIdOptions] = useState([]);

  // Load bed groups AND patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bed groups
        const groupsRes = await fetch(`${API_BASE}/bedgroups/all`);
        if (!groupsRes.ok) throw new Error("Failed to fetch bed groups");
        const groups = await groupsRes.json();

        const bedGroupOptions = groups.map((g) => ({
          value: g.bedGroup,
          label: g.bedGroup,
        }));
        setBedGroups(bedGroupOptions);
        if (bedGroupOptions.length > 0) {
          setFormData((prev) => ({
            ...prev,
            bedGroup: bedGroupOptions[0].value,
          }));
        }

        // Fetch patients - adjust endpoint based on your API
        const patientsRes = await fetch(`${API_BASE}/medicine_allocation/edit`);
        if (patientsRes.ok) {
          const patientsData = await patientsRes.json();

          // Check if response is array or has patients property
          let patientsList = [];
          if (Array.isArray(patientsData)) {
            patientsList = patientsData;
          } else if (patientsData.patients) {
            patientsList = patientsData.patients;
          }

          setAllPatients(patientsList);

          // Create name options (remove duplicates)
          const nameOptions = Array.from(
            new Map(
              patientsList
                .filter((p) => p.full_name)
                .map((p) => [
                  p.full_name,
                  {
                    value: p.full_name,
                    label: p.full_name,
                  },
                ])
            ).values()
          );

          // Create ID options (remove duplicates)
          const idOptions = Array.from(
            new Map(
              patientsList
                .filter((p) => p.patient_unique_id)
                .map((p) => [
                  p.patient_unique_id,
                  {
                    value: p.patient_unique_id,
                    label: p.patient_unique_id,
                  },
                ])
            ).values()
          );

          setPatientNameOptions(nameOptions);
          setPatientIdOptions(idOptions);
        }
      } catch (err) {
        const msg = "Failed to load data";
        setServerError(msg);
        errorToast(msg);
      }
    };

    fetchData();
  }, []);

  // Load free beds when group changes
  useEffect(() => {
    if (!formData.bedGroup) return;

    fetch(`${API_BASE}/bedgroups/all`)
      .then((r) => r.json())
      .then((groups) => {
        const group = groups.find((g) => g.bedGroup === formData.bedGroup);
        if (group) {
          const freeBeds = group.beds
            .filter((b) => !b.is_occupied)
            .map((b) => ({
              value: `Bed ${b.bed_number}`,
              label: `Bed ${b.bed_number}`,
            }))
            .sort(
              (a, b) =>
                parseInt(a.label.replace("Bed ", "")) -
                parseInt(b.label.replace("Bed ", ""))
            );

          setAvailableBeds(freeBeds);
          if (freeBeds.length > 0 && !formData.bedNumber) {
            setFormData((prev) => ({ ...prev, bedNumber: freeBeds[0].value }));
          } else {
            setFormData((prev) => ({ ...prev, bedNumber: "" }));
          }
        }
      });
  }, [formData.bedGroup]);

  // Handle patient name selection
  const handlePatientNameSelect = (name) => {
    // Find the patient by name
    const selectedPatient = allPatients.find((p) => p.full_name === name);

    setFormData((prev) => {
      const newData = { ...prev, name: name };

      // If we found a matching patient, auto-fill the ID
      if (selectedPatient && selectedPatient.patient_unique_id) {
        newData.patientId = selectedPatient.patient_unique_id;
      }

      return newData;
    });
  };

  // Handle patient ID selection
  const handlePatientIdSelect = (id) => {
    // Find the patient by ID
    const selectedPatient = allPatients.find((p) => p.patient_unique_id === id);

    setFormData((prev) => {
      const newData = { ...prev, patientId: id };

      // If we found a matching patient, auto-fill the name
      if (selectedPatient && selectedPatient.full_name) {
        newData.name = selectedPatient.full_name;
      }

      return newData;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.patientId.trim())
      newErrors.patientId = "Patient ID is required";
    if (!formData.bedGroup) newErrors.bedGroup = "Bed group is required";
    if (!formData.bedNumber) newErrors.bedNumber = "Select a free bed";
    if (!formData.admitDate) newErrors.admitDate = "Admit date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdmit = async () => {
    if (!validateForm()) {
      errorToast("Please fill all required fields correctly");
      return;
    }

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
      successToast(
        `Patient "${formData.name}" admitted to ${formData.bedNumber}!`
      );

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
    return date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
      ? date
      : null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 font-[Helvetica] z-50">
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

        {serverError && (
          <p className="text-red-500 text-sm mb-4">{serverError}</p>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Patient Name - TypeAhead Dropdown */}
          <div>
            <label className="text-sm">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <TypeAheadDropdown
              label=""
              value={formData.name}
              onChange={handlePatientNameSelect}
              options={patientNameOptions}
              error={errors.name}
              placeholder="Type patient name..."
            />
          </div>

          {/* Patient ID - TypeAhead Dropdown */}
          <div>
            <label className="text-sm">
              Patient ID <span className="text-red-500">*</span>
            </label>
            <TypeAheadDropdown
              label=""
              value={formData.patientId}
              onChange={handlePatientIdSelect}
              options={patientIdOptions}
              error={errors.patientId}
              placeholder="Type patient ID..."
            />
          </div>

          {/* Bed Group - TypeAhead Dropdown */}
          <div>
            <label className="text-sm text-black dark:text-white">
              Bed Group <span className="text-red-500">*</span>
            </label>
            <TypeAheadDropdown
              label=""
              value={formData.bedGroup}
              onChange={(v) =>
                setFormData({ ...formData, bedGroup: v, bedNumber: "" })
              }
              options={bedGroups}
              error={errors.bedGroup}
              placeholder="Type bed group..."
            />
          </div>

          {/* Bed Number - TypeAhead Dropdown */}
          <div>
            <label className="text-sm text-black dark:text-white">
              Bed Number <span className="text-red-500">*</span>
            </label>
            <TypeAheadDropdown
              label=""
              value={formData.bedNumber}
              onChange={(v) => setFormData({ ...formData, bedNumber: v })}
              options={availableBeds}
              error={errors.bedNumber}
              disabled={!availableBeds.length}
              placeholder={
                availableBeds.length
                  ? "Type bed number..."
                  : "No beds available"
              }
            />
          </div>

          {/* Admit Date */}
          <div>
            <label className="text-sm">
              Admit Date <span className="text-red-500">*</span>
            </label>
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
                <Calendar
                  size={18}
                  className="text-[#08994A] dark:text-[#0EFF7B]"
                />
              </div>
            </div>
            {errors.admitDate && (
              <p className="text-red-500 text-xs mt-1">{errors.admitDate}</p>
            )}
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
