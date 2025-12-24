import React, { useState, useEffect } from "react";
import {
  Search,
  Pencil,
  Plus,
  Trash,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { Listbox, Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { successToast, errorToast } from "../../components/Toast.jsx";

// API Base URL configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BillingPreview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const originalPatients = [
    { id: "SAH027/384", name: "Joe Darrington" },
    { id: "SA123456", name: "John Doe" },
    { id: "SA789012", name: "Jane Smith" },
  ];
  const [patients, setPatients] = useState(originalPatients);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientID: "",
    ageGender: "",
    startDate: "",
    endDate: "",
    dateOfBirth: "",
    address: "",
    roomType: "",
    doctorName: "",
    department: "",
    billingStaff: "",
    billingStaffID: "",
    paymentMode: "",
    paymentType: "",
    paymentStatus: "",
    bedGroup: "",
    bedNumber: "",
  });
  const [staffInfo, setStaffInfo] = useState({ staffName: "", staffID: "" });
  const [fullPatient, setFullPatient] = useState(null);
  const [isInsurance, setIsInsurance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);
  const [billingItems, setBillingItems] = useState([
    {
      sNo: "01",
      description: "Room charge (3 days)",
      quantity: "5",
      unitPrice: "1500",
      amount: "7500",
    },
    {
      sNo: "02",
      description: "Doctor consultation fees",
      quantity: "1",
      unitPrice: "500",
      amount: "500",
    },
    {
      sNo: "03",
      description: "Operation theatre charges",
      quantity: "1",
      unitPrice: "1000",
      amount: "1000",
    },
    {
      sNo: "04",
      description: "Nurse and wardcare",
      quantity: "1",
      unitPrice: "2000",
      amount: "2000",
    },
    {
      sNo: "05",
      description: "Surgeon",
      quantity: "1",
      unitPrice: "10000",
      amount: "10000",
    },
    {
      sNo: "06",
      description: "Medicine and consumables",
      quantity: "2",
      unitPrice: "5000",
      amount: "10000",
    },
  ]);
  const [unitPriceErrors, setUnitPriceErrors] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});
  const [insurances, setInsurances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const emptyModal = {
    provider: "",
    policyNum: "",
    validFrom: "",
    validTo: "",
    policyCard: "",
  };
  const [modalData, setModalData] = useState(emptyModal);
  const [editingIndex, setEditingIndex] = useState(null);
  const paymentModes = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
    "Insurance Claim",
  ];
  const providers = [
    "Aetna",
    "Blue Cross Blue Shield",
    "Cigna",
    "UnitedHealthcare",
    "Kaiser Permanente",
  ];
  const paymentTypes = [
    "Full Payment",
    "Partial Payment",
    "Insurance",
    "Credit",
  ];
  const paymentStatuses = ["Paid", "Pending", "Overdue", "Refunded", "Unpaid"];

  useEffect(() => {
    fetchPatients();
    fetchStaffInfo();
  }, []);

  useEffect(() => {
    if (staffInfo.staffName) {
      setPatientInfo((prev) => ({
        ...prev,
        billingStaff: staffInfo.staffName,
        billingStaffID: staffInfo.staffID,
      }));
    }
  }, [staffInfo]);

  useEffect(() => {
    if (fullPatient) {
      const ageGender = `${fullPatient.age || ""}/${fullPatient.gender || ""}`;
      const startDate = fullPatient.admission_date || "";
      const endDate = fullPatient.discharge_date || "";
      const dob = fullPatient.date_of_birth || "";

      setPatientInfo((prev) => ({
        ...prev,
        patientName: fullPatient.full_name || prev.patientName,
        patientID: fullPatient.patient_unique_id || prev.patientID,
        ageGender: ageGender,
        startDate: startDate,
        endDate: endDate,
        dateOfBirth: dob,
        address: fullPatient.address || prev.address,
        roomType: fullPatient.room_number || prev.roomType,
        doctorName: fullPatient.staff__full_name || prev.doctorName,
        department: fullPatient.department__name || prev.department,
        bedGroup: fullPatient.bed_group || prev.bedGroup,
        bedNumber: fullPatient.bed_number || prev.bedNumber,
      }));

      if (fullPatient.patient_unique_id) {
        fetchInsurances(fullPatient.patient_unique_id);
        fetchBillingItems(fullPatient.patient_unique_id);
      }
    }
  }, [fullPatient]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredPatients(
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.id.toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      // First, try to get the list of patients
      let patientsData = [];

      try {
        const res = await axios.get(`${APIBASE}/patients/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Patients list API Response:", res.data);

        // Handle different response structures for list endpoint
        if (Array.isArray(res.data)) {
          patientsData = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          patientsData = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          patientsData = res.data.data;
        } else if (res.data && Array.isArray(res.data.patients)) {
          patientsData = res.data.patients;
        } else if (res.data && typeof res.data === "object") {
          // If single object, wrap in array
          patientsData = [res.data];
        }
      } catch (listError) {
        console.log("List endpoint failed, trying alternatives...");

        // If list endpoint fails, try to get some specific patients
        // or use the fallback data
        const testPatientIds = ["SAH027/384", "SA123456", "SA789012"];

        for (const patientId of testPatientIds) {
          try {
            const patientRes = await axios.get(
              `${APIBASE}/patients/${patientId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            patientsData.push(patientRes.data);
          } catch (patientError) {
            console.log(`Could not fetch patient ${patientId}`);
          }
        }
      }
      // If no patients found, use fallback
      if (patientsData.length === 0) {
        console.log("No patients found, using fallback data");
        setPatients(originalPatients);
        setFilteredPatients(originalPatients);
        return;
      }
      const mappedPatients = patientsData.map((p) => ({
        id: p.patient_unique_id || p.unique_id || p.id || "N/A",
        name: p.full_name || p.name || p.patient_name || "Unknown Patient",
      }));
      console.log("Mapped patients:", mappedPatients);
      setPatients(mappedPatients);
      setFilteredPatients(mappedPatients);

      // Removed auto-select of first patient to prevent preloading
    } catch (err) {
      console.error("Failed to load patients:", err);
      console.error("Error details:", err.response?.data);
      errorToast("Failed to load patients list. Using demo data.");
      // Fallback to hardcoded
      setPatients(originalPatients);
      setFilteredPatients(originalPatients);
    }
  };

  const fetchStaffInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${APIBASE}/api/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffInfo({
        staffName: res.data.full_name || "Unknown Staff",
        staffID: res.data.employee_id || "N/A",
      });
    } catch (err) {
      console.error("Failed to load staff info:", err);
      setStaffInfo({ staffName: "Unknown Staff", staffID: "N/A" });
    }
  };

  const fetchPatientDetails = async (uniqueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${APIBASE}/patients/${uniqueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Patient Details Response:", res.data);

      // Handle different response structures
      const patientData = res.data.data || res.data.patient || res.data;

      setFullPatient(patientData);
      successToast(
        `Patient ${
          patientData.full_name || patientData.name
        } details loaded successfully`
      );
    } catch (err) {
      console.error("Failed to load patient details:", err);
      console.error("Error details:", err.response?.data);
      errorToast("Failed to load patient details");
    }
  };

  const fetchInsurances = async (uniqueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${APIBASE}/patients/${uniqueId}/insurances`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let insuranceData = [];

      // Handle different response structures
      if (Array.isArray(res.data)) {
        insuranceData = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        insuranceData = res.data.results;
      } else if (res.data && Array.isArray(res.data.data)) {
        insuranceData = res.data.data;
      } else if (res.data && Array.isArray(res.data.insurances)) {
        insuranceData = res.data.insurances;
      } else {
        console.warn("Unexpected insurance API response structure:", res.data);
        return;
      }

      setInsurances(
        insuranceData.map((ins) => ({
          id: ins.id,
          provider: ins.provider,
          policyNum: ins.policy_number,
          validFrom: ins.valid_from,
          validTo: ins.valid_to,
          policyCard: ins.policy_card,
        }))
      );
    } catch (err) {
      console.error("Failed to load insurances:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchBillingItems = async (uniqueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${APIBASE}/patients/${uniqueId}/billing-items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let billingData = [];

      // Handle different response structures
      if (Array.isArray(res.data)) {
        billingData = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        billingData = res.data.results;
      } else if (res.data && Array.isArray(res.data.data)) {
        billingData = res.data.data;
      } else if (res.data && Array.isArray(res.data.items)) {
        billingData = res.data.items;
      } else {
        console.warn(
          "Unexpected billing items API response structure:",
          res.data
        );
        return;
      }

      if (billingData.length > 0) {
        setBillingItems(
          billingData.map((item, idx) => ({
            sNo: (idx + 1).toString().padStart(2, "0"),
            description: item.description,
            quantity: item.quantity.toString(),
            unitPrice: item.unit_price.toString(),
            amount: (item.quantity * item.unit_price).toFixed(2),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load billing items:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handlePatientNameChange = (value) => {
    const patient = filteredPatients.find((p) => p.name === value);
    if (patient) {
      setPatientInfo((prev) => ({
        ...prev,
        patientName: value,
        patientID: patient.id,
      }));
      fetchPatientDetails(patient.id);
      setSearchQuery("");
    }
  };

  const handlePatientIDChange = (value) => {
    const patient = filteredPatients.find((p) => p.id === value);
    if (patient) {
      setPatientInfo((prev) => ({
        ...prev,
        patientID: value,
        patientName: patient.name,
      }));
      fetchPatientDetails(value);
    }
  };

  const handleInputChange = (value, field) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handleAddService = () => {
    const newIndex = billingItems.length;
    setBillingItems((prev) => [
      ...prev,
      {
        sNo: (prev.length + 1).toString().padStart(2, "0"),
        description: "",
        quantity: "1",
        unitPrice: "",
        amount: "0.00",
      },
    ]);
    // Clear any existing errors for the new item
    setUnitPriceErrors((prev) => ({ ...prev, [newIndex]: "" }));
    setQuantityErrors((prev) => ({ ...prev, [newIndex]: "" }));
  };

  const handleBillingChange = (index, field, value) => {
    setBillingItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Validate unit price if it's being changed
      if (field === "unitPrice") {
        const unitPrice = parseFloat(value);
        if (unitPrice < 0) {
          setUnitPriceErrors((prevErrors) => ({
            ...prevErrors,
            [index]: "Unit price cannot be negative",
          }));
        } else {
          setUnitPriceErrors((prevErrors) => ({
            ...prevErrors,
            [index]: "",
          }));
        }
      }
      
      // Validate quantity if it's being changed
      if (field === "quantity") {
        const quantity = parseFloat(value);
        if (quantity < 0) {
          setQuantityErrors((prevErrors) => ({
            ...prevErrors,
            [index]: "Quantity cannot be negative",
          }));
        } else {
          setQuantityErrors((prevErrors) => ({
            ...prevErrors,
            [index]: "",
          }));
        }
      }
      
      // Recalculate amount if quantity or unitPrice changes
      if (field === "quantity" || field === "unitPrice") {
        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].unitPrice) || 0;
        newItems[index].amount = (qty * price).toFixed(2);
      }
      return newItems;
    });
  };

  const handleDeleteBilling = (index) => {
    setBillingItems((prev) => prev.filter((_, i) => i !== index));
    // Remove the errors for the deleted item
    setUnitPriceErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
    setQuantityErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleEditInsurance = (index) => {
    setModalData(insurances[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDeleteInsurance = async (index) => {
    const insId = insurances[index].id;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${APIBASE}/insurances/${insId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInsurances(patientInfo.patientID);
      successToast("Insurance deleted successfully");
    } catch (err) {
      console.error("Failed to delete insurance:", err);
      errorToast("Failed to delete insurance");
    }
  };

  const handleAddOrUpdateInsurance = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("provider", modalData.provider);
      formData.append("policy_number", modalData.policyNum);
      formData.append("valid_from", modalData.validFrom);
      formData.append("valid_to", modalData.validTo);
      if (modalData.policyCard instanceof File) {
        formData.append("policy_card", modalData.policyCard);
      }
      let res;
      if (editingIndex !== null) {
        const insId = insurances[editingIndex].id;
        res = await axios.put(`${APIBASE}/insurances/${insId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        successToast("Insurance updated successfully");
      } else {
        formData.append("patient_id", patientInfo.patientID);
        res = await axios.post(`${APIBASE}/insurances/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        successToast("Insurance added successfully");
      }
      fetchInsurances(patientInfo.patientID);
      setShowModal(false);
      setEditingIndex(null);
      setModalData(emptyModal);
    } catch (err) {
      console.error("Failed to add/update insurance:", err);
      errorToast("Failed to add/update insurance");
    }
  };

  const subtotal = billingItems
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    .toFixed(2);
  const taxRate = 0.18;
  const tax = (subtotal * taxRate).toFixed(2);
  const grand = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
  const formattedSubtotal = parseFloat(subtotal).toLocaleString();
  const formattedTax = parseFloat(tax).toLocaleString();
  const formattedGrand = parseFloat(grand).toLocaleString();

  const handleGenerateBill = async () => {
    // Check if there are any validation errors
    const hasUnitPriceErrors = Object.values(unitPriceErrors).some(error => error);
    const hasQuantityErrors = Object.values(quantityErrors).some(error => error);
    
    if (hasUnitPriceErrors || hasQuantityErrors) {
      errorToast("Please fix validation errors before generating the bill");
      return;
    }

    if (!patientInfo.patientID) {
      errorToast("Please select a patient first");
      return;
    }
    if (
      billingItems.length === 0 ||
      billingItems.some(
        (item) => !item.description || !item.quantity || !item.unitPrice
      )
    ) {
      errorToast("Please add valid billing items");
      return;
    }

    try {
      setGeneratingBill(true);

      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      // Robust date formatting function
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null;

        // Remove any time portion if present
        dateString = dateString.split("T")[0];

        // Try different date formats
        let date;

        // Try parsing as ISO string first
        date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }

        // Try MM/DD/YYYY format
        if (dateString.includes("/")) {
          const parts = dateString.split("/");
          if (parts.length === 3) {
            // Check if it's MM/DD/YYYY or DD/MM/YYYY
            if (
              parts[0].length === 2 &&
              parts[1].length === 2 &&
              parts[2].length === 4
            ) {
              const [month, day, year] = parts;
              date = new Date(`${year}-${month}-${day}`);
              if (!isNaN(date.getTime())) {
                return date.toISOString().split("T")[0];
              }
            }
          }
        }

        // Try DD-MM-YYYY format
        if (dateString.includes("-")) {
          const parts = dateString.split("-");
          if (parts.length === 3) {
            if (
              parts[0].length === 2 &&
              parts[1].length === 2 &&
              parts[2].length === 4
            ) {
              const [day, month, year] = parts;
              date = new Date(`${year}-${month}-${day}`);
              if (!isNaN(date.getTime())) {
                return date.toISOString().split("T")[0];
              }
            }
          }
        }

        console.warn(`Could not parse date: ${dateString}`);
        return null;
      };

      // Validate required dates
      const admissionDate = formatDateForBackend(patientInfo.startDate);
      if (!admissionDate) {
        errorToast(
          "Please provide a valid admission date in YYYY-MM-DD format"
        );
        setGeneratingBill(false);
        return;
      }

      const invoiceData = {
        date: today,
        patient_name: patientInfo.patientName,
        patient_id: patientInfo.patientID,
        department: patientInfo.department || "General Ward",
        payment_method: patientInfo.paymentMode || "Cash",
        status: patientInfo.paymentStatus || "Paid",
        admission_date: admissionDate,
        discharge_date: formatDateForBackend(patientInfo.endDate),
        doctor: patientInfo.doctorName || "N/A",
        phone: fullPatient?.phone_number || "N/A",
        email: fullPatient?.email || "patient@hospital.com",
        address: patientInfo.address || "",
        invoice_items: billingItems.map((item) => ({
          description: item.description,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unitPrice),
        })),
        tax_percent: 18.0,
        transaction_id: null,
        payment_date: today,
      };

      console.log(
        "Final invoice data being sent:",
        JSON.stringify(invoiceData, null, 2)
      );

      const res = await axios.post(
        `${APIBASE}/hospital-invoices/generate`,
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      // Open PDF in new tab
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      successToast(
        `Invoice PDF opened in new tab for ${patientInfo.patientName}`
      );

      // Auto refresh the page after a short delay to show toast
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Failed to generate invoice PDF:", err);

      if (err.response?.status === 422) {
        const validationErrors = err.response.data.detail;
        const dateErrors = validationErrors.filter(
          (error) =>
            error.loc.includes("admission_date") ||
            error.loc.includes("discharge_date")
        );

        if (dateErrors.length > 0) {
          errorToast(
            "Invalid date format. Please use YYYY-MM-DD format for dates."
          );
        } else {
          errorToast("Validation error. Please check all fields.");
        }
      } else {
        errorToast("Failed to generate invoice PDF");
      }
    } finally {
      setGeneratingBill(false);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto">
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[2500px] mx-auto flex flex-col overflow-hidden relative font-[Helvetica]">
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "10px",
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
        <h2 className="text-xl font-semibold mb-4 text-[#08994A] dark:text-[#0EFF7B]">
          Patient Bill Generation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          This is the information for generation of patient bill
        </p>

        {/* Search and Patient Selection */}
        <div className="mb-6 flex flex-row justify-end items-center gap-2 flex-wrap max-w-full">
          {/* Search Input with Dropdown Results */}
          <div className="flex-1 min-w-[180px] max-w-[350px] lg:max-w-[400px] relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patient name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full
                  h-[34px]
                  pl-10 pr-4
                  rounded
                  border-[1.05px]
                  border-[#0EFF7B] dark:border-[#0EFF7B1A]
                  bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A]
                  text-[#08994A] dark:text-white
                  placeholder-[#5CD592] dark:placeholder-[#5CD592]
                  focus:outline-none
                  focus:border-[#0EFF7B]
                  transition-all
                  font-helvetica
                "
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0EFF7B] pointer-events-none" />
            </div>
            {/* Dropdown Results */}
            {searchQuery.trim() && filteredPatients.length > 0 && (
              <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3C3C3C]">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      handlePatientNameChange(patient.name);
                      handlePatientIDChange(patient.id);
                      setSearchQuery(""); // Clear search after selection
                    }}
                    className="cursor-pointer px-3 py-1.5 text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126] border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* No results */}
            {searchQuery.trim() && filteredPatients.length === 0 && (
              <div className="absolute mt-1 w-full p-3 text-center bg-white dark:bg-black rounded-[8px] shadow-lg border border-[#0EFF7B] dark:border-[#3C3C3C] text-gray-500 text-sm z-50">
                No patients found
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative min-w-[120px] w-[160px] lg:w-[180px]">
              <Listbox
                value={patientInfo.patientName}
                onChange={handlePatientNameChange}
              >
                <Listbox.Button
                  className="
                    w-full
                    h-[33.5px]
                    rounded-[8.38px]
                    border-[1.05px]
                    border-[#0EFF7B] dark:border-[#3C3C3C]
                    bg-[#F5F6F5] dark:bg-black
                    text-[#08994A] dark:text-white
                    shadow-[0_0_2.09px_#0EFF7B]
                    outline-none
                    focus:border-[#0EFF7B]
                    focus:shadow-[0_0_4px_#0EFF7B]
                    transition-all
                    duration-300
                    px-3
                    pr-8
                    font-helvetica
                    text-sm
                    text-left
                    relative
                  "
                >
                  {patientInfo.patientName || "Select Patient"}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </Listbox.Button>
                <Listbox.Options
                  className="
                    absolute
                    z-10
                    mt-1
                    w-full
                    bg-white dark:bg-black
                    border border-[#0EFF7B] dark:border-[#3C3C3C]
                    rounded-md
                    shadow-lg
                    max-h-60
                    overflow-auto
                    text-sm
                    font-helvetica
                    top-[100%]
                    left-0
                  "
                >
                  {filteredPatients.map((patient) => (
                    <Listbox.Option
                      key={patient.id}
                      value={patient.name}
                      className="
                        cursor-pointer
                        select-none
                        p-2
                        text-[#08994A] dark:text-white
                        hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]
                      "
                    >
                      {patient.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
            <div className="relative min-w-[120px] w-[160px] lg:w-[180px]">
              <Listbox
                value={patientInfo.patientID}
                onChange={handlePatientIDChange}
              >
                <Listbox.Button
                  className="
                    w-full
                    h-[33.5px]
                    rounded-[8.38px]
                    border-[1.05px]
                    border-[#0EFF7B] dark:border-[#3C3C3C]
                    bg-[#F5F6F5] dark:bg-black
                    text-[#08994A] dark:text-white
                    shadow-[0_0_2.09px_#0EFF7B]
                    outline-none
                    focus:border-[#0EFF7B]
                    focus:shadow-[0_0_4px_#0EFF7B]
                    transition-all
                    duration-300
                    px-3
                    pr-8
                    font-helvetica
                    text-sm
                    text-left
                    relative
                  "
                >
                  {patientInfo.patientID || "Patient ID"}
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </Listbox.Button>
                <Listbox.Options
                  className="
                    absolute
                    z-10
                    mt-1
                    w-full
                    bg-white dark:bg-black
                    border border-[#0EFF7B] dark:border-[#3C3C3C]
                    rounded-md
                    shadow-lg
                    max-h-60
                    overflow-auto
                    text-sm
                    font-helvetica
                    top-[100%]
                    left-0
                  "
                >
                  {filteredPatients.map((patient) => (
                    <Listbox.Option
                      key={patient.id}
                      value={patient.id}
                      className="
                        cursor-pointer
                        select-none
                        p-2
                        text-[#08994A] dark:text-white
                        hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]
                      "
                    >
                      {patient.id}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>
        </div>
        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Patient Basic Info */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Patient ID
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientID}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Patient Name
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientName}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Age/Gender
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.ageGender}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Admission Start
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.startDate}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Admission End
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.endDate}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.dateOfBirth}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.address}
                readOnly
              />
            </div>
          </div>
          {/* Medical and Payment Info */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Room Type
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.roomType}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Doctor Name
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.doctorName}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Department
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.department}
                readOnly
              />

              <label className="text-sm text-gray-600 dark:text-gray-300">
                Payment mode
              </label>
              <div className="relative">
                <Listbox
                  value={patientInfo.paymentMode}
                  onChange={(value) => handleInputChange(value, "paymentMode")}
                >
                  <Listbox.Button
                    className="
                      w-full
                      h-[33.5px]
                      rounded-[8.38px]
                      border-[1.05px]
                      border-[#0EFF7B] dark:border-[#3C3C3C]
                      bg-[#F5F6F5] dark:bg-black
                      text-[#08994A] dark:text-white
                      shadow-[0_0_2.09px_#0EFF7B]
                      outline-none
                      focus:border-[#0EFF7B]
                      focus:shadow-[0_0_4px_#0EFF7B]
                      transition-all
                      duration-300
                      px-3
                      pr-8
                      font-helvetica
                      text-sm
                      text-left
                      relative
                    "
                  >
                    {patientInfo.paymentMode || "Select Mode"}
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options
                    className="
                      absolute
                      z-10
                      mt-1
                      w-full
                      bg-white dark:bg-black
                      border border-[#0EFF7B] dark:border-[#3C3C3C]
                      rounded-md
                      shadow-lg
                      max-h-60
                      overflow-auto
                      text-sm
                      font-helvetica
                      top-[100%]
                      left-0
                    "
                  >
                    {paymentModes.map((mode) => (
                      <Listbox.Option
                        key={mode}
                        value={mode}
                        className="
                          cursor-pointer
                          select-none
                          p-2
                          text-[#08994A] dark:text-white
                          hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]
                        "
                      >
                        {mode}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Payment Type
              </label>
              <div className="relative">
                <Listbox
                  value={patientInfo.paymentType}
                  onChange={(value) => handleInputChange(value, "paymentType")}
                >
                  <Listbox.Button
                    className="
                      w-full h-[33.5px] rounded-[8.38px]
                      border-[1.05px] border-[#0EFF7B] dark:border-[#3C3C3C]
                      bg-[#F5F6F5] dark:bg-black
                      text-[#08994A] dark:text-white
                      shadow-[0_0_2.09px_#0EFF7B]
                      outline-none
                      focus:border-[#0EFF7B] focus:shadow-[0_0_4px_#0EFF7B]
                      transition-all duration-300
                      px-3 pr-8 font-helvetica text-sm text-left relative
                    "
                  >
                    {patientInfo.paymentType || "Full Payment"}
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options
                    className="
                      absolute z-10 mt-1 w-full bg-white dark:bg-black
                      border border-[#0EFF7B] dark:border-[#3C3C3C]
                      rounded-md shadow-lg max-h-60 overflow-auto
                      text-sm font-helvetica top-[100%] left-0
                    "
                  >
                    {paymentTypes.map((type) => (
                      <Listbox.Option
                        key={type}
                        value={type}
                        className="
                          cursor-pointer select-none p-2
                          text-[#08994A] dark:text-white
                          hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]
                        "
                      >
                        {type}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Payment Status
              </label>
              <div className="relative">
                <Listbox
                  value={patientInfo.paymentStatus}
                  onChange={(value) =>
                    handleInputChange(value, "paymentStatus")
                  }
                >
                  <Listbox.Button
                    className="
                      w-full h-[33.5px] rounded-[8.38px]
                      border-[1.05px] border-[#0EFF7B] dark:border-[#3C3C3C]
                      bg-[#F5F6F5] dark:bg-black
                      text-[#08994A] dark:text-white
                      shadow-[0_0_2.09px_#0EFF7B]
                      outline-none
                      focus:border-[#0EFF7B] focus:shadow-[0_0_4px_#0EFF7B]
                      transition-all duration-300
                      px-3 pr-8 font-helvetica text-sm text-left relative
                    "
                  >
                    {patientInfo.paymentStatus || "Paid"}
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </Listbox.Button>
                  <Listbox.Options
                    className="
                      absolute z-10 mt-1 w-full bg-white dark:bg-black
                      border border-[#0EFF7B] dark:border-[#3C3C3C]
                      rounded-md shadow-lg max-h-60 overflow-auto
                      text-sm font-helvetica top-[100%] left-0
                    "
                  >
                    {paymentStatuses.map((status) => (
                      <Listbox.Option
                        key={status}
                        value={status}
                        className="
                          cursor-pointer select-none p-2
                          text-[#08994A] dark:text-white
                          hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]
                        "
                      >
                        {status}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>
          </div>
          {/* Staff and Insurance Info */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Billing Staff
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.billingStaff}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Billing Staff ID
              </label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.billingStaffID}
                readOnly
              />
            </div>
            {/* Insurance Section */}
            <div
              className="col-span-2 mt-4 p-2 rounded-[10px] flex flex-col gap-4"
              style={{
                border: "1.05px solid #3C3C3C",
                boxShadow: "0px 0px 2.09px 0px #0EFF7B",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Is this bill being processed with Insurance?
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Yes</span>
                    <Switch
                      checked={isInsurance}
                      onChange={setIsInsurance}
                      className={`${
                        isInsurance ? "bg-[#0EFF7B]" : "bg-gray-600"
                      } relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          isInsurance ? "translate-x-6" : "translate-x-1"
                        } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">No</span>
                    <Switch
                      checked={!isInsurance}
                      onChange={(checked) => setIsInsurance(!checked)}
                      className={`${
                        !isInsurance ? "bg-[#0EFF7B]" : "bg-gray-600"
                      } relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          !isInsurance ? "translate-x-6" : "translate-x-1"
                        } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                  {isInsurance && (
                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        setModalData(emptyModal);
                        setShowModal(true);
                      }}
                      className="text-[#0EFF7B] underline cursor-pointer text-sm whitespace-nowrap"
                      style={{ alignSelf: "center" }}
                    >
                      If yes, Add insurance
                    </button>
                  )}
                </div>
              </div>
              {isInsurance && insurances.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="text-[#08994A] dark:text-[#0EFF7B] bg-gray-200 dark:bg-[#091810]">
                      <tr>
                        <th className="p-2">Provider</th>
                        <th className="p-2">Policy Number</th>
                        <th className="p-2">Valid From</th>
                        <th className="p-2">Valid To</th>
                        <th className="p-2">Policy Card</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#08994A] dark:text-gray-300 bg-white dark:bg-black">
                      {insurances.map((ins, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                        >
                          <td className="p-2">{ins.provider}</td>
                          <td className="p-2">{ins.policyNum}</td>
                          <td className="p-2">{ins.validFrom}</td>
                          <td className="p-2">{ins.validTo}</td>
                          <td className="p-2">{ins.policyCard}</td>
                          <td className="p-2 flex gap-2">
                            <Pencil
                              className="w-5 h-5 text-[#0EFF7B] cursor-pointer"
                              onClick={() => handleEditInsurance(index)}
                            />
                            <Trash
                              className="w-5 h-5 text-red-500 cursor-pointer"
                              onClick={() => handleDeleteInsurance(index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Billing Items Section */}
        <div className="bg-[#F5F6F5] dark:bg-transparent border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-xl p-4">
          <h3 className="text-[#08994A] dark:text-[#0EFF7B] mb-3">
            Treatment & charges
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="text-[#08994A] dark:text-[#0EFF7B] bg-gray-200 dark:bg-[#091810]">
              <tr>
                <th className="p-2">S No</th>
                <th className="p-2">Description</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit price ($)</th>
                <th className="p-2">Amount ($)</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#08994A] dark:text-gray-300 bg-white dark:bg-black">
              {billingItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                >
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.sNo}
                      readOnly
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{
                        border: "2px solid #0EFF7B1A",
                        boxShadow: "0px 0px 2px 0px #0EFF7B",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleBillingChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{
                        border: "2px solid #0EFF7B1A",
                        boxShadow: "0px 0px 2px 0px #0EFF7B",
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleBillingChange(index, "quantity", e.target.value)
                        }
                        className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                        style={{
                          border: "2px solid #0EFF7B1A",
                          boxShadow: "0px 0px 2px 0px #0EFF7B",
                        }}
                      />
                      {quantityErrors[index] && (
                        <div className="text-red-500 dark:text-red-500 text-xs mt-1 ml-1">
                          {quantityErrors[index]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleBillingChange(index, "unitPrice", e.target.value)
                        }
                        className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                        style={{
                          border: "2px solid #0EFF7B1A",
                          boxShadow: "0px 0px 2px 0px #0EFF7B",
                        }}
                      />
                      {unitPriceErrors[index] && (
                        <div className="text-red-500 dark:text-red-500 text-xs mt-1 ml-1">
                          {unitPriceErrors[index]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.amount}
                      readOnly
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{
                        border: "2px solid #0EFF7B1A",
                        boxShadow: "0px 0px 2px 0px #0EFF7B",
                      }}
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <Trash
                      className="w-5 h-5 text-red-500 dark:text-[#0EFF7B] cursor-pointer"
                      onClick={() => handleDeleteBilling(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={handleAddService}
              className="flex items-center justify-center border-b-[2px] border-[#0EFF7B] gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition"
            >
              <Plus size={18} className="text-white" />
              Add new service
            </button>
          </div>

          {/* Total and Action Buttons */}
          <div className="flex justify-end items-center mt-6 pr-4 gap-4 w-full overflow-x-hidden no-scrollbar">
            <div
              className="flex items-center border border-[#0EFF7B] rounded-[8px] overflow-hidden min-w-[404.31px] max-w-[744.31px]"
              style={{
                height: "103px",
                backgroundColor: "#0B0B0B",
              }}
            >
              <div className="flex flex-col justify-center flex-1 pl-5 pr-6 py-3 text-sm font-medium text-white gap-2">
                <div className="flex justify-between w-full">
                  <span>Subtotal:</span>
                  <span className="text-[#FFB100] font-semibold">
                    ${formattedSubtotal}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Tax (18%):</span>
                  <span className="text-[#FFB100] font-semibold">
                    ${formattedTax}
                  </span>
                </div>
              </div>
              <div
                className="h-full w-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,255,123,0.1) 0%, #0EFF7B 50%, rgba(14,255,123,0.1) 100%)",
                }}
              ></div>
              <div className="flex flex-col justify-center px-6 py-3 bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-right h-full min-w-[120px]">
                <span className="text-white text-sm font-semibold">Grand</span>
                <span className="text-[#0EFF7B] text-lg font-bold">
                  ${formattedGrand}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-nowrap">
              <button
                className="text-white border border-[#0EFF7B] rounded-[10px] text-sm font-medium transition-transform hover:scale-105 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  width: "236px",
                  height: "50px",
                  paddingTop: "4px",
                  paddingRight: "12px",
                  paddingBottom: "4px",
                  paddingLeft: "12px",
                  gap: "4px",
                  background:
                    "linear-gradient(90deg, #025126 0%, #0D7F41 50%, #025126 100%)",
                }}
                disabled={generatingBill || 
                  Object.values(unitPriceErrors).some(error => error) || 
                  Object.values(quantityErrors).some(error => error)}
                onClick={handleGenerateBill}
              >
                {generatingBill ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </div>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Insurance Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
            <div
              className="w-[505px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 shadow-lg relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
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
              <div className="flex justify-between items-center pb-3 mb-4">
                <h3 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
                  {editingIndex !== null ? "Edit Insurance" : "Add Insurance"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingIndex(null);
                    setModalData(emptyModal);
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-black dark:text-white block mb-1">
                    Insurance Provider
                  </label>
                  <Listbox
                    value={modalData.provider}
                    onChange={(v) =>
                      setModalData({ ...modalData, provider: v })
                    }
                  >
                    <Listbox.Button className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] relative">
                      {modalData.provider || "Select Provider"}
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 9l6 6 6-6"
                        />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 min-w-[210px] bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-md shadow-lg max-h-60 overflow-auto text-sm">
                      {providers.map((prov) => (
                        <Listbox.Option
                          key={prov}
                          value={prov}
                          className="cursor-pointer select-none p-2 text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]"
                        >
                          {prov}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white block mb-1">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    value={modalData.policyNum}
                    onChange={(e) =>
                      setModalData({ ...modalData, policyNum: e.target.value })
                    }
                    placeholder="enter policy number"
                    className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white block mb-1">
                    Valid From
                  </label>
                  <div className="relative mt-1">
                    <DatePicker
                      selected={
                        modalData.validFrom
                          ? new Date(modalData.validFrom)
                          : null
                      }
                      onChange={(date) =>
                        setModalData({ ...modalData, validFrom: date })
                      }
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none w-4 h-4" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white block mb-1">
                    Valid To
                  </label>
                  <div className="relative mt-1">
                    <DatePicker
                      selected={
                        modalData.validTo ? new Date(modalData.validTo) : null
                      }
                      onChange={(date) =>
                        setModalData({ ...modalData, validTo: date })
                      }
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] pointer-events-none w-4 h-4" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Upload Policy Card
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        policyCard: e.target.files[0],
                      })
                    }
                    className="w-full mt-1 px-3 py-1 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
                      bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
                  />
                  {modalData.policyCard && (
                    <p className="text-xs mt-1 text-green-500 dark:text-[#0EFF7B]">
                      Selected:{" "}
                      {modalData.policyCard.name || modalData.policyCard}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingIndex(null);
                    setModalData(emptyModal);
                  }}
                  className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] text-gray-800 dark:text-white bg-white dark:bg-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateInsurance}
                  className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B]
                    bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                    text-white font-medium hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} className="text-white dark:text-white" />
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPreview;