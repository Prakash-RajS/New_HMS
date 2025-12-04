import React, { useState, useEffect, useMemo } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import { successToast, errorToast } from "../../components/Toast.jsx";
import EditMedicineAllocationPopup from "./EditMedicineAllocationPopup";
import DeleteMedicinePopup from "./DeleteMedicinePopup";
import { useNavigate } from "react-router-dom";

export default function ViewPatientProfile() {
  const API_BASE = "http://localhost:8000";
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [medicineData, setMedicineData] = useState([
    {
      id: Date.now(),
      medicineName: "",
      dosage: "",
      quantity: "",
      frequency: "",
      duration: "",
      time: "",
    },
  ]);
  const [labTests, setLabTests] = useState([{ id: Date.now(), labTest: "" }]);
  const [medicineHistory, setMedicineHistory] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientID: "",
    department: "",
  });
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patientDbId, setPatientDbId] = useState(null);
  const [fullPatient, setFullPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  // New state for stock data
  const [stockData, setStockData] = useState([]);
  
  // New states for edit/delete functionality
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  // Fetch departments, patients, and stock on component mount
  useEffect(() => {
    fetchDepartments();
    fetchPatients();
    fetchStock();
  }, []);

  // Dynamic options from stock
  const medicineNames = useMemo(() => {
    return [...new Set(stockData.map(s => s.product_name).filter(Boolean))].sort();
  }, [stockData]);

  const dosageMap = useMemo(() => {
    const map = {};
    stockData.forEach(s => {
      if (s.product_name && s.dosage) {
        if (!map[s.product_name]) map[s.product_name] = new Set();
        map[s.product_name].add(s.dosage);
      }
    });
    Object.keys(map).forEach(k => {
      map[k] = [...map[k]].sort();
    });
    return map;
  }, [stockData]);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          patient.patient_unique_id
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments/`);
      const text = await res.text();
      if (!res.ok) {
        console.error("Departments raw response (non-OK):", text);
        throw new Error("Failed to fetch departments");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse departments JSON:", parseError);
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response from departments API");
      }
      console.log("Departments API Response:", data);
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch patients from backend
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/medicine_allocation/edit`);
      const text = await res.text();
      if (!res.ok) {
        console.error("Patients raw response (non-OK):", text);
        throw new Error("Failed to fetch patients");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse patients JSON:", parseError);
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response from patients API");
      }
      console.log("Patients API Response:", data);

      // Handle different response structures
      let patientsList = [];
      if (Array.isArray(data)) {
        patientsList = data;
      } else if (data.patients && Array.isArray(data.patients)) {
        patientsList = data.patients;
      } else if (data && typeof data === "object") {
        // If it's a single patient object, wrap it in array
        patientsList = [data];
      }

      setPatients(patientsList);
      setFilteredPatients(patientsList);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch stock data for dynamic dropdowns
  const fetchStock = async () => {
    try {
      const res = await fetch(`${API_BASE}/stock/list`);
      if (!res.ok) {
        throw new Error(`Failed to fetch stock: ${res.status}`);
      }
      const data = await res.json();
      setStockData(data);
      console.log("Stock data loaded:", data);
    } catch (error) {
      console.error("Error fetching stock:", error);
      errorToast("Failed to load stock data");
    }
  };

  // Fetch full patient details by patient_unique_id
  const fetchPatientFull = async (patientUniqueId) => {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientUniqueId}`);
      const text = await res.text();
      if (!res.ok) {
        console.error("Full patient raw response (non-OK):", text);
        throw new Error("Failed to fetch patient details");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse full patient JSON:", parseError);
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response from patient details API");
      }
      console.log("Full patient data:", data);
      setFullPatient(data);
      return data;
    } catch (error) {
      console.error("Error fetching patient details:", error);
      return null;
    }
  };

  // Fetch medicine allocation history by patient ID
  const fetchMedicineHistory = async (patientDbId) => {
    if (!patientDbId) return;

    try {
      const res = await fetch(
        `${API_BASE}/medicine_allocation/${patientDbId}/medicine-allocations/`
      );
      const text = await res.text();
      if (!res.ok) {
        if (res.status === 404) {
          setMedicineHistory([]);
          return;
        }
        console.error("Medicine history raw response (non-OK):", text);
        throw new Error("Failed to fetch medicine history");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse medicine history JSON:", parseError);
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response from medicine history API");
      }
      console.log("Medicine history:", data);
      setMedicineHistory(data || []);
    } catch (error) {
      console.error("Error fetching medicine history:", error);
      setMedicineHistory([]);
    }
  };

  // Handle patient selection
  const handlePatientSelect = async (patient) => {
  if (!patient) return;

  console.log("Selected patient:", patient);

  // CRITICAL: Store the actual Django PK (patient.id)
  setPatientDbId(patient.id); // This is the real primary key (1, 2, 3...)

  const departmentName =
    departments.find((d) => d.id === patient.department_id)?.name || "";

  setPatientInfo({
    patientName: patient.full_name,
    patientID: patient.patient_unique_id,
    department: departmentName,
  });

  // Fetch full details and history
  const fullPatientData = await fetchPatientFull(patient.patient_unique_id);
  await fetchMedicineHistory(patient.id);

  setSearchQuery("");
};

  // Handle dropdown selection for patient fields
  const handlePatientFieldChange = (field, value) => {
    console.log(`Field changed: ${field} = ${value}`);

    if (field === "patientName" && value) {
      const selectedPatient = patients.find((p) => p.full_name === value);
      if (selectedPatient) {
        handlePatientSelect(selectedPatient);
      }
    } else if (field === "patientID" && value) {
      const selectedPatient = patients.find(
        (p) => p.patient_unique_id === value
      );
      if (selectedPatient) {
        handlePatientSelect(selectedPatient);
      }
    } else if (field === "department" && value) {
      // Update department only
      setPatientInfo((prev) => ({
        ...prev,
        department: value,
      }));
    }
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;

    if (type === "medicine") {
      setMedicineData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], [name]: value };
        // If medicineName changed, clear dosage if not matching
        if (name === "medicineName" && newData[index].dosage && !dosageMap[value]?.includes(newData[index].dosage)) {
          newData[index].dosage = "";
        }
        return newData;
      });
    } else if (type === "labTest") {
      setLabTests((prev) => {
        const newTests = [...prev];
        newTests[index] = { ...newTests[index], [name]: value };
        return newTests;
      });
    }
  };

  const addMedicineEntry = () => {
    setMedicineData((prev) => [
      ...prev,
      {
        id: Date.now(),
        medicineName: "",
        dosage: "",
        quantity: "",
        frequency: "",
        duration: "",
        time: "",
      },
    ]);
  };

  const addLabTestEntry = () => {
    setLabTests((prev) => [...prev, { id: Date.now(), labTest: "" }]);
  };

  const removeMedicineEntry = (id) => {
    setMedicineData((prev) => prev.filter((entry) => entry.id !== id));
  };

  const removeLabTestEntry = (id) => {
    setLabTests((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientDbId) {
      errorToast("Please select a patient");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/medicine_allocation/${patientDbId}/allocations/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            medicines: medicineData.map((med) => ({
              medicine_name: med.medicineName,
              dosage: med.dosage,
              quantity: med.quantity,
              frequency: med.frequency,
              duration: med.duration,
              time: med.time,
            })),
            lab_test_types: labTests
              .map((test) => test.labTest)
              .filter((test) => test && test.trim() !== ""),
          }),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        console.error("Submit raw response (non-OK):", text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { detail: text };
        }
        throw new Error(errorData.detail || "Failed to allocate medicines");
      }

      const result = JSON.parse(text);
      const newHistoryEntries = result.medicines.map((med) => ({
        id: med.id,
        patient_name: med.patient_name,
        patient_id: med.patient_id,
        department: med.department,
        doctor: med.doctor,
        allocation_date: med.allocation_date,
        medicine_name: med.medicine_name,
        dosage: med.dosage,
        duration: med.duration,
        lab_test_type: med.lab_test_type,
      }));

      setMedicineHistory((prev) => [...newHistoryEntries, ...prev]);
      handleClear();
      successToast("Medicines allocated successfully!");
    } catch (error) {
      console.error("Error allocating medicines:", error);
      errorToast(`Failed to allocate medicines: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMedicineData([
      {
        id: Date.now(),
        medicineName: "",
        dosage: "",
        quantity: "",
        frequency: "",
        duration: "",
        time: "",
      },
    ]);
    setLabTests([{ id: Date.now(), labTest: "" }]);
  };

  // New functions for edit/delete operations
  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setIsEditPopupOpen(true);
  };

  const handleDeleteMedicine = (medicine) => {
    setDeletingMedicine(medicine);
    setIsDeletePopupOpen(true);
  };

  const handleUpdateMedicine = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/medicine_allocation/${patientDbId}/medicine-allocations/${editingMedicine.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            medicine_name: updatedData.medicineName,
            dosage: updatedData.dosage,
            quantity: updatedData.quantity,
            frequency: updatedData.frequency,
            duration: updatedData.duration,
            time: updatedData.time,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update medicine allocation");
      }

      // Refresh medicine history
      await fetchMedicineHistory(patientDbId);
      successToast("Medicine allocation updated successfully!");
    } catch (error) {
      console.error("Error updating medicine:", error);
      errorToast("Failed to update medicine allocation");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/medicine_allocation/${patientDbId}/medicine-allocations/${deletingMedicine.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete medicine allocation");
      }

      // Refresh medicine history
      await fetchMedicineHistory(patientDbId);
      successToast("Medicine allocation deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      errorToast("Failed to delete medicine allocation");
    } finally {
      setIsDeletePopupOpen(false);
      setDeletingMedicine(null);
    }
  };

  // Get unique values for dropdowns with proper data extraction
  const patientNames = patients
    .map((patient) => patient?.full_name)
    .filter((name) => name && name.trim() !== "")
    .filter((name, index, self) => self.indexOf(name) === index);
  const patientIDs = patients
    .map((patient) => patient?.patient_unique_id)
    .filter((id) => id && id.trim() !== "")
    .filter((id, index, self) => self.indexOf(id) === index);
  const departmentNames = departments
    .map((dept) => dept?.name)
    .filter((name) => name && name.trim() !== "")
    .filter((name, index, self) => self.indexOf(name) === index);

  // Individual Dropdown Components for better control
  const PatientNameDropdown = () => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-black dark:text-white">
        Patient Name
      </label>
      <Listbox
        value={patientInfo.patientName}
        onChange={(value) => handlePatientFieldChange("patientName", value)}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              className={`
                relative w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px]
                border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black
                text-black dark:text-white text-left text-sm leading-none
                shadow-[0_0_2.09px_#0EFF7B] outline-none
                transition-all duration-300 font-[Helvetica]
                ${open ? "border-[#0EFF7B] shadow-[0_0_4px_#0EFF7B]" : ""}
                ${!patientInfo.patientName ? "text-gray-500" : ""}
              `}
            >
              <span className="block truncate">
                {patientInfo.patientName || "Select patient name"}
              </span>

              <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                <ChevronDown
                  className={`h-4 w-4 text-[#0EFF7B] transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
              {patientNames.length > 0 ? (
                patientNames.map((name) => (
                  <Listbox.Option
                    key={name}
                    value={name}
                    className={({ active, selected }) =>
                      `
                        cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                        ${
                          active
                            ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                            : "text-black dark:text-white"
                        }
                        ${
                          selected
                            ? "bg-[#0EFF7B] bg-opacity-20 text-[#0EFF7B] font-medium"
                            : ""
                        }
                        hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                      `
                    }
                  >
                    {name}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 px-3 text-sm text-gray-500 text-center">
                  No patients found
                </div>
              )}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );

  const PatientIDDropdown = () => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-black dark:text-white">
        Patient ID
      </label>
      <Listbox
        value={patientInfo.patientID}
        onChange={(value) => handlePatientFieldChange("patientID", value)}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              className={`
                relative w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px]
                border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black
                text-black dark:text-white text-left text-sm leading-none
                shadow-[0_0_2.09px_#0EFF7B] outline-none
                transition-all duration-300 font-[Helvetica]
                ${open ? "border-[#0EFF7B] shadow-[0_0_4px_#0EFF7B]" : ""}
                ${!patientInfo.patientID ? "text-gray-500" : ""}
              `}
            >
              <span className="block truncate">
                {patientInfo.patientID || "Select patient ID"}
              </span>

              <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                <ChevronDown
                  className={`h-4 w-4 text-[#0EFF7B] transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
              {patientIDs.length > 0 ? (
                patientIDs.map((id) => (
                  <Listbox.Option
                    key={id}
                    value={id}
                    className={({ active, selected }) =>
                      `
                        cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                        ${
                          active
                            ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                            : "text-black dark:text-white"
                        }
                        ${
                          selected
                            ? "bg-[#0EFF7B] bg-opacity-20 text-[#0EFF7B] font-medium"
                            : ""
                        }
                        hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                      `
                    }
                  >
                    {id}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 px-3 text-sm text-gray-500 text-center">
                  No patient IDs found
                </div>
              )}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );

  const DepartmentDropdown = () => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-black dark:text-white">
        Department
      </label>
      <Listbox
        value={patientInfo.department}
        onChange={(value) => handlePatientFieldChange("department", value)}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              className={`
                relative w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px]
                border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black
                text-black dark:text-white text-left text-sm leading-none
                shadow-[0_0_2.09px_#0EFF7B] outline-none
                transition-all duration-300 font-[Helvetica]
                ${open ? "border-[#0EFF7B] shadow-[0_0_4px_#0EFF7B]" : ""}
                ${!patientInfo.department ? "text-gray-500" : ""}
              `}
            >
              <span className="block truncate">
                {patientInfo.department || "Select department"}
              </span>

              <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                <ChevronDown
                  className={`h-4 w-4 text-[#0EFF7B] transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
              {departmentNames.length > 0 ? (
                departmentNames.map((dept) => (
                  <Listbox.Option
                    key={dept}
                    value={dept}
                    className={({ active, selected }) =>
                      `
                        cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                        ${
                          active
                            ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                            : "text-black dark:text-white"
                        }
                        ${
                          selected
                            ? "bg-[#0EFF7B] bg-opacity-20 text-[#0EFF7B] font-medium"
                            : ""
                        }
                        hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                      `
                    }
                  >
                    {dept}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 px-3 text-sm text-gray-500 text-center">
                  No departments found
                </div>
              )}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );

  // Medicine Dropdown Component
  const MedicineDropdown = ({ label, name, value, options, index, medicineName }) => (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-black dark:text-white capitalize">
        {label}
      </label>
      <Listbox
        value={value}
        onChange={(selectedValue) => {
          const fakeEvent = { target: { name, value: selectedValue } };
          handleInputChange(fakeEvent, index, "medicine");
        }}
      >
        {({ open }) => (
          <>
            <Listbox.Button
              className={`
                relative w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px]
                border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black
                text-black dark:text-white text-left text-sm leading-none
                shadow-[0_0_2.09px_#0EFF7B] outline-none
                transition-all duration-300 font-[Helvetica]
                ${open ? "border-[#0EFF7B] shadow-[0_0_4px_#0EFF7B]" : ""}
                ${!value ? "text-gray-500" : ""}
              `}
            >
              <span className="block truncate">
                {value || `Select ${label.toLowerCase()}`}
              </span>

              <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                <ChevronDown
                  className={`h-4 w-4 text-[#0EFF7B] transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
              {options.length > 0 ? (
                options.map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    className={({ active, selected }) =>
                      `
                        cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                        ${
                          active
                            ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                            : "text-black dark:text-white"
                        }
                        ${
                          selected
                            ? "bg-[#0EFF7B] bg-opacity-20 text-[#0EFF7B] font-medium"
                            : ""
                        }
                        hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                      `
                    }
                  >
                    {option}
                  </Listbox.Option>
                ))
              ) : (
                <div className="py-2 px-3 text-sm text-gray-500 text-center">
                  No {label.toLowerCase()} available
                </div>
              )}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );

  return (
    <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-4 w-full max-w-[2500px] mx-auto flex flex-col relative font-[Helvetica]">
      {/* Gradient Background and Border */}
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>

      <div
        className="absolute inset-0 rounded-[10px] pointer-events-none"
        style={{
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          zIndex: 0,
        }}
      ></div>

      {/* Search Bar with Individual Dropdowns */}
      <div className="mb-6 mt-7 flex flex-row justify-end items-end gap-2 flex-wrap max-w-full relative">
        <div className="flex-1 min-w-[180px] max-w-[350px] lg:max-w-[400px] relative">
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">
            Search Patient
          </label>
          <input
            type="text"
            placeholder="Search patient name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredPatients.length > 0) {
                handlePatientSelect(filteredPatients[0]);
              }
            }}
            className="
              w-full
              h-[34px]
              p-[4.19px_16.75px]
              rounded
              border-[1.05px]
              border-[#0EFF7B1A]
              bg-[#0EFF7B1A]
              text-black dark:text-white
              placeholder:text-gray-500 dark:placeholder:text-white/70
              focus:outline-none
              focus:border-[#0EFF7B]
              transition-all
              font-[Helvetica]
            "
          />
          {searchQuery && filteredPatients.length > 0 && (
            <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="
                    cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                    text-black dark:text-white
                    hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                  "
                >
                  {patient.full_name} ({patient.patient_unique_id})
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="min-w-[120px] w-[160px] lg:w-[180px] relative">
            <PatientNameDropdown />
          </div>
          <div className="min-w-[120px] w-[160px] lg:w-[180px] relative">
            <PatientIDDropdown />
          </div>
        </div>
      </div>

      {/* View Patient Profile Information */}
      <div className="mb-8 p-4 sm:p-5 bg-white dark:bg-black flex flex-col lg:flex-row items-center justify-between text-black dark:text-white font-[Helvetica] max-w-full relative">
        {/* Your existing patient profile content */}
        <div className="flex flex-col items-center text-center w-full lg:w-[146px] mb-4 lg:mb-0">
          <div className="rounded-full w-[94px] h-[94px] mb-3 shadow-[#0EFF7B4D] border border-[#0EFF7B] overflow-hidden bg-gray-100">
  {fullPatient?.photo_url ? (
    <img
      src={fullPatient.photo_url}
      alt={fullPatient.full_name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling.style.display = 'flex';
      }}
    />
  ) : null}
  
  {/* Fallback SVG - only shows if no photo or image fails to load */}
  <div className={`w-full h-full flex items-center justify-center bg-gray-200 ${fullPatient?.photo_url ? 'hidden' : 'flex'}`}>
    <svg
      className="w-[60px] h-[60px] text-[#0EFF7B]"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
    </svg>
  </div>
</div>
          <span className="text-[#0EFF7B] text-[18px] font-semibold font-[Helvetica]">
            {fullPatient?.gender === "Female"
              ? "Mrs."
              : fullPatient?.gender === "Male"
              ? "Mr."
              : ""}{" "}
            {fullPatient?.full_name ||
              patientInfo.patientName ||
              "Select a patient"}
          </span>
          <span className="text-[14px] text-gray-500 dark:text-gray-400 font-[Helvetica]">
            ID:{" "}
            {fullPatient?.patient_unique_id || patientInfo.patientID || "N/A"}
          </span>
          <span className="text-[14px] text-gray-500 dark:text-gray-400 font-[Helvetica]">
            {fullPatient?.email_address || "N/A"}
          </span>
        </div>

        <div className="hidden lg:block h-[120px] w-[1.5px] bg-[#0EFF7B] mx-4"></div>

        <div className="flex-1 flex flex-col mt-4 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 text-[14px]">
            {[
              { label: "Gender", value: fullPatient?.gender || "N/A" },
              {
                label: "Age",
                value: fullPatient?.age ? `${fullPatient.age}` : "N/A",
              },
              {
                label: "Blood Group",
                value: fullPatient?.blood_group || "N/A",
              },
              {
                label: "Department",
                value:
                  departments.find((d) => d.id === fullPatient?.department_id)
                    ?.name ||
                  patientInfo.department ||
                  "N/A",
              },
              { label: "Bed Number", value: fullPatient?.room_number || "N/A" },
              {
                label: "Consultant type",
                value: fullPatient?.consultation_type || "N/A",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="w-[100px] sm:w-[110px] h-[18px] font-[Helvetica] text-[15px] leading-[100%] text-center text-[#0EFF7B]">
                  {item.label}
                </span>
                <div className="w-[100px] sm:w-[110px] h-[16px] font-[Helvetica] text-[13px] leading-[100%] text-center bg-white dark:bg-black text-black dark:text-white mt-1 px-2 py-1 rounded">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button
  onClick={() => {
    if (!patientDbId) {
      errorToast("Patient not selected properly");
      return;
    }
    navigate(`/patients/profile/${patientDbId}`);
  }}
  className="relative group flex items-center justify-between w-[220px] h-[38px] bg-[#0EFF7B1A] rounded-[4px] px-3 text-sm text-black dark:text-white hover:bg-[#0EFF7B] hover:text-white transition font-[Helvetica]"
>
  <span className="text-[15px] w-[calc(100%-34px)]">
    View more information
    
  </span>
  <div className="w-[18px] h-[18px] bg-[#0EFF7B] rounded-full flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-[10px] h-[10px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
    <span className="absolute top-[70px] left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    View more
              </span>
  </div>
</button>
          </div>
        </div>

        <div className="hidden lg:block h-[120px] w-[1.5px] bg-[#0EFF7B] mx-4"></div>

        <div className="text-[14px] flex justify-center gap-3 sm:gap-6 mt-4 lg:mt-0">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-black dark:text-white font-[Helvetica] text-[14px]">
                Blood Pressure
              </span>
              <span className="text-[#0EFF7B] font-semibold font-[Helvetica] text-[14px]">
                {fullPatient?.blood_pressure || "N/A"}{" "}
                <span className="text-black dark:text-white">mmHg</span>
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-black dark:text-white font-[Helvetica] text-[14px]">
                Heart Rate
              </span>
              <span className="text-[#0EFF7B] font-semibold font-[Helvetica] text-[14px]">
                {fullPatient?.heart_rate || "N/A"}{" "}
                <span className="text-black dark:text-white">bpm</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-black dark:text-white font-[Helvetica] text-[14px]">
              Temperature
            </span>
            <span className="text-[#0EFF7B] font-semibold font-[Helvetica] text-[14px]">
              {fullPatient?.body_temperature
                ? `${fullPatient.body_temperature}°F`
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Medicine Allocation Form */}
      <div className="mt-8 mb-4 rounded-xl p-4 w-full max-w-[100%] sm:max-w-[900px] lg:max-w-[1400px] mx-auto flex flex-col relative bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0000001F]">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-[#FFFFFF] font-[Helvetica]">
          Medicine Allocation
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Patient Info with Individual Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <PatientNameDropdown />
            <PatientIDDropdown />
            <DepartmentDropdown />
          </div>
          {/* Medicines List */}
          <div className="flex flex-col gap-5">
            {medicineData.map((med, index) => (
              <div
                key={med.id}
                className="border border-gray-600 rounded-lg p-4 bg-[#0EFF7B0A] relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-[#0EFF7B]">
                    Medicine #{index + 1}
                  </h4>
                  <div className="flex gap-2">
                    {index === medicineData.length - 1 && (
                      <button
                        type="button"
                        onClick={addMedicineEntry}
                        className="relative group text-green-500 hover:text-green-600 text-xl"
                      >
                        +
                        <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Add
              </span>
                      </button>
                    )}
                    {medicineData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineEntry(med.id)}
                        className="relative group text-red-500 hover:text-red-700 text-xl"
                      >
                        ×
                        <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Close
              </span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <MedicineDropdown
                    label="Medicine Name"
                    name="medicineName"
                    value={med.medicineName}
                    options={medicineNames}
                    index={index}
                  />
                  <MedicineDropdown
                    label="Dosage"
                    name="dosage"
                    value={med.dosage}
                    options={dosageMap[med.medicineName] || []}
                    index={index}
                    medicineName={med.medicineName}
                  />
                  <MedicineDropdown
                    label="Quantity"
                    name="quantity"
                    value={med.quantity}
                    options={["10", "20", "30", "50"]}
                    index={index}
                  />
                  <MedicineDropdown
                    label="Frequency"
                    name="frequency"
                    value={med.frequency}
                    options={["Morning", "Afternoon", "Evening", "Night"]}
                    index={index}
                  />
                  <MedicineDropdown
                    label="Duration"
                    name="duration"
                    value={med.duration}
                    options={["5 days", "10 days", "15 days", "30 days"]}
                    index={index}
                  />
                  <MedicineDropdown
                    label="Time"
                    name="time"
                    value={med.time}
                    options={["8:00 AM", "12:00 PM", "6:00 PM", "8:00 PM"]}
                    index={index}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Lab Tests and Form Actions */}
          <div className="mt-6">
            <h4 className="font-medium text-[#0EFF7B] mb-2">Lab Tests</h4>
            {labTests.map((test, index) => (
              <div key={test.id} className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                      Lab Test
                    </label>

                    <Listbox
                      value={test.labTest}
                      onChange={(selectedValue) => {
                        const fakeEvent = {
                          target: { name: "labTest", value: selectedValue },
                        };
                        handleInputChange(fakeEvent, index, "labTest");
                      }}
                    >
                      {({ open }) => (
                        <>
                          <Listbox.Button
                            className={`
                              relative w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px]
                              border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black
                              text-black dark:text-white text-left text-sm leading-none
                              shadow-[0_0_2.09px_#0EFF7B] outline-none
                              transition-all duration-300 font-[Helvetica]
                              ${open ? "border-[#0EFF7B] shadow-[0_0_4px_#0EFF7B]" : ""}
                              ${!test.labTest ? "text-gray-500" : ""}
                            `}
                          >
                            <span className="block truncate">
                              {test.labTest || "Select lab test"}
                            </span>

                            <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                              <ChevronDown
                                className={`h-4 w-4 text-[#0EFF7B] transition-transform duration-200 ${
                                  open ? "rotate-180" : ""
                                }`}
                              />
                            </span>
                          </Listbox.Button>

                          <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-[9999] border border-gray-300 dark:border-[#3C3C3C] scrollbar-hide focus:outline-none">
                            {["Blood Test", "Urine Test", "X-Ray", "MRI"].map(
                              (option) => (
                                <Listbox.Option
                                  key={option}
                                  value={option}
                                  className={({ active, selected }) =>
                                    `
                                      cursor-pointer select-none py-2 px-3 text-sm font-[Helvetica]
                                      ${
                                        active
                                          ? "bg-[#0EFF7B33] text-[#0EFF7B]"
                                          : "text-black dark:text-white"
                                      }
                                      ${
                                        selected
                                          ? "bg-[#0EFF7B] bg-opacity-20 text-[#0EFF7B] font-medium"
                                          : ""
                                      }
                                      hover:bg-[#0EFF7B33] hover:text-[#0EFF7B]
                                    `
                                  }
                                >
                                  {option}
                                </Listbox.Option>
                              )
                            )}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                </div>

                {/* + and × buttons */}
                {index === labTests.length - 1 && (
                  <button
                    type="button"
                    onClick={addLabTestEntry}
                    className="relative group text-green-500 mt-5 hover:text-green-600 text-xl"
                  >
                    +
                    <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Add
              </span>
                  </button>
                )}
                {labTests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLabTestEntry(test.id)}
                    className="relative group text-red-500 mt-5 hover:text-red-700 text-xl"
                  >
                    ×
                    <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Close
              </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading || !patientDbId}
              className="px-4 py-2 rounded bg-[#0EFF7B] text-black font-semibold hover:bg-[#05c860] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Allocating..." : "Allocate Medicine"}
            </button>
          </div>
        </form>
      </div>

      {/* Medicine Allocation History with Actions */}
      {/* Medicine Allocation History with Actions */}
<div className="mt-8 mb-4 rounded-xl p-4 w-full max-w-[100%] sm:max-w-[900px] lg:max-w-[1400px] mx-auto flex flex-col relative bg-white dark:bg-black text-black dark:text-white border border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0000001F]">
  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-[#FFFFFF] font-[Helvetica]">
    Medicine allocation history
  </h2>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px] border-collapse font-[Helvetica] text-[13px] sm:text-[14px]">
      <thead className="text-[#0EFF7B] font-[Helvetica] dark:bg-[#091810] border-b border-gray-300 dark:border-gray-700">
        <tr className="text-left text-[#0EFF7B] border border-gray-300 dark:border-[#3C3C3C] text-center">
          <th className="py-1.5 px-2 sm:px-3">Patient Name</th>
          <th className="py-1.5 px-2 sm:px-3">Patient ID</th>
          <th className="py-1.5 px-2 sm:px-3">Doctor</th>
          <th className="py-1.5 px-2 sm:px-3">Date</th>
          <th className="py-1.5 px-2 sm:px-3">Medicine</th>
          <th className="py-1.5 px-2 sm:px-3">Dosage</th>
          <th className="py-1.5 px-2 sm:px-3">Duration</th>
          <th className="py-1.5 px-2 sm:px-3">Lab Tests</th>
          <th className="py-1.5 px-2 sm:px-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {medicineHistory.map((item, index) => (
          <tr
            key={item.id || index}
            className="border border-gray-200 dark:border-gray-700 text-center text Black dark:text-[#FFFFFF] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] bg-white dark:bg-black"
          >
            <td className="py-1.5 px-2 sm:px-3">{item.patient_name}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.patient_id}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.doctor}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.allocation_date}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.medicine_name}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.dosage}</td>
            <td className="py-1.5 px-2 sm:px-3">{item.duration}</td>

            {/* LAB TESTS CELL – Shows actual test names */}
            <td className="py-1.5 px-2 sm:px-3">
              {item.lab_test_types ? (
                <span className="text-[#0EFF7B] font-medium">
                  {item.lab_test_types}
                </span>
              ) : (
                <span className="text-gray-500">No</span>
              )}
            </td>

            <td className="py-4 px-4 sm:px-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleEditMedicine(item)}
                  className="relative group text-blue-500 hover:text-blue-700 transition-colors"
                  title=""
                >
                  <Edit size={16} />
                  <span className="absolute bottom-5 left-1/4 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Edit
              </span>
                </button>
                <button
                  onClick={() => handleDeleteMedicine(item)}
                  className="relative group text-red-500 hover:text-red-700 transition-colors"
                  title=""
                >
                  <Trash2 size={16} /><span className="absolute bottom-5 left-1/4 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Delete
              </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {medicineHistory.length === 0 && (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No medicine allocation history found for this patient.
      </div>
    )}
  </div>
</div>

      {/* Edit Medicine Allocation Popup */}
      {isEditPopupOpen && editingMedicine && (
        <EditMedicineAllocationPopup
          onClose={() => {
            setIsEditPopupOpen(false);
            setEditingMedicine(null);
          }}
          medicineData={editingMedicine}
          onUpdate={handleUpdateMedicine}
        />
      )}

      {/* Delete Medicine Popup */}
      {isDeletePopupOpen && deletingMedicine && (
        <DeleteMedicinePopup
          onClose={() => {
            setIsDeletePopupOpen(false);
            setDeletingMedicine(null);
          }}
          onConfirm={handleConfirmDelete}
          medicineName={deletingMedicine.medicine_name}
        />
      )}
    </div>
  );
}