import React, { useState, useEffect } from "react";
import {
  Search,
  Pencil,
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
  const [billingItems, setBillingItems] = useState([]);
  const [treatmentCharges, setTreatmentCharges] = useState([]);
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

      let patientsData = [];

      try {
        const res = await axios.get(`${API_BASE}/patients/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          patientsData = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          patientsData = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          patientsData = res.data.data;
        } else if (res.data && Array.isArray(res.data.patients)) {
          patientsData = res.data.patients;
        } else if (res.data && typeof res.data === "object") {
          patientsData = [res.data];
        }
      } catch (listError) {
        console.log("List endpoint failed, trying alternatives...");

        const testPatientIds = ["SAH027/384", "SA123456", "SA789012"];

        for (const patientId of testPatientIds) {
          try {
            const patientRes = await axios.get(
              `${API_BASE}/patients/${patientId}`,
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
      
      if (patientsData.length === 0) {
        setPatients(originalPatients);
        setFilteredPatients(originalPatients);
        return;
      }
      
      const mappedPatients = patientsData.map((p) => ({
        id: p.patient_unique_id || p.unique_id || p.id || "N/A",
        name: p.full_name || p.name || p.patient_name || "Unknown Patient",
      }));
      
      setPatients(mappedPatients);
      setFilteredPatients(mappedPatients);

    } catch (err) {
      console.error("Failed to load patients:", err);
      errorToast("Failed to load patients list. Using demo data.");
      setPatients(originalPatients);
      setFilteredPatients(originalPatients);
    }
  };

  const fetchStaffInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/profile/me/`, {
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
      
      const res = await axios.get(`${API_BASE}/patients/${uniqueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const patientData = res.data.data || res.data.patient || res.data;

      setFullPatient(patientData);
      
      await fetchTreatmentCharges(uniqueId);

      successToast(
        `Patient ${
          patientData.full_name || patientData.name
        } details loaded successfully`
      );
    } catch (err) {
      console.error("Failed to load patient details:", err);
      errorToast("Failed to load patient details");
    }
  };

  const fetchTreatmentCharges = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/hospital-billing/patient/${patientId}/treatment-charges`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.charges && res.data.charges.length > 0) {
        setTreatmentCharges(res.data.charges);
        
        const treatmentChargesItems = res.data.charges.map((charge, idx) => ({
          chargeId: charge.id,
          sNo: (idx + 1).toString().padStart(2, "0"),
          description: charge.description,
          quantity: charge.quantity.toString(),
          unitPrice: charge.unit_price.toString(),
          amount: charge.amount.toString(),
          isFromTreatmentCharge: true,
        }));
        
        setBillingItems(treatmentChargesItems);
        
        successToast(
          `Loaded ${res.data.charges.length} pending treatment charges`
        );
      } else {
        setTreatmentCharges([]);
        setBillingItems([]);
        
        successToast("No pending treatment charges found");
      }
    } catch (err) {
      console.error("Failed to load treatment charges:", err);
      
      if (err.response?.status === 404) {
        setTreatmentCharges([]);
        setBillingItems([]);
        
        successToast("No pending treatment charges found");
      } else {
        errorToast("Failed to load treatment charges");
      }
    }
  };

  const fetchInsurances = async (uniqueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/patients/${uniqueId}/insurances`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let insuranceData = [];

      if (Array.isArray(res.data)) {
        insuranceData = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        insuranceData = res.data.results;
      } else if (res.data && Array.isArray(res.data.data)) {
        insuranceData = res.data.data;
      } else if (res.data && Array.isArray(res.data.insurances)) {
        insuranceData = res.data.insurances;
      } else {
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

  const handleDeleteInsurance = async (index) => {
    const insId = insurances[index].id;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/insurances/${insId}`, {
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
        res = await axios.put(`${API_BASE}/insurances/${insId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        successToast("Insurance updated successfully");
      } else {
        formData.append("patient_id", patientInfo.patientID);
        res = await axios.post(`${API_BASE}/insurances/`, formData, {
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

  const handleMarkInvoiceAsPaid = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/hospital-billing/invoice/${invoiceId}/mark-paid`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      successToast(
        `Invoice ${invoiceId} marked as Paid. ${res.data.treatment_charges_updated} treatment charges updated to BILLED.`
      );
      
      if (patientInfo.patientID) {
        await fetchTreatmentCharges(patientInfo.patientID);
      }
      
      return res.data;
    } catch (err) {
      console.error("Failed to mark invoice as paid:", err);
      errorToast("Failed to update invoice status");
      throw err;
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

    // Robust date formatting function from second function
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

    // Validate required dates - improved from second function
    const admissionDate = formatDateForBackend(patientInfo.startDate);
    if (!admissionDate) {
      errorToast(
        "Please provide a valid admission date in YYYY-MM-DD format"
      );
      setGeneratingBill(false);
      return;
    }

    // Build payload with improvements from first function
    const invoiceData = {
      date: today,
      patient_name: patientInfo.patientName,
      patient_id: patientInfo.patientID,
      department: patientInfo.department || "General Ward",
      payment_method: patientInfo.paymentMode || "Cash",
      status: patientInfo.paymentStatus || "Pending", // Changed from second function's "Paid" default
      admission_date: admissionDate,
      discharge_date: formatDateForBackend(patientInfo.endDate),
      doctor: patientInfo.doctorName || "N/A",
      phone: fullPatient?.phone_number || "N/A",
      email: fullPatient?.email || null, // Changed from hardcoded email
      address: patientInfo.address || "",
      invoice_items: billingItems.map((item) => ({
        description: item.description,
        quantity: parseInt(item.quantity) || 1,
        unit_price: parseFloat(item.unitPrice) || 0,
      })),
      tax_percent: 18.0,
      transaction_id: null,
      payment_date: patientInfo.paymentStatus === "Paid" ? today : null, // Conditional payment date
    };

    // Include treatment_charge_ids if available (from first function)
    const treatmentChargeIds = billingItems
      .filter(item => item.chargeId && item.isFromTreatmentCharge)
      .map(item => item.chargeId);
    
    if (treatmentChargeIds.length > 0) {
      invoiceData.treatment_charge_ids = treatmentChargeIds;
    }

    console.log("Sending invoice data:", JSON.stringify(invoiceData, null, 2));

    const res = await axios.post(
      `${API_BASE}/hospital-billing/generate-invoice`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    // ✅ Open PDF
    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
    successToast("Invoice generated successfully");

    // Try to extract invoice ID from response (from first function)
    try {
      const text = await new Response(res.data).text();
      if (text && text.trim().startsWith('{')) {
        const jsonResponse = JSON.parse(text);
        
        if (jsonResponse.success && jsonResponse.invoice_id) {
          const invoiceId = jsonResponse.invoice_id;
          
          // If status is "Paid", mark invoice as paid (from first function)
          if (patientInfo.paymentStatus === "Paid") {
            try {
              const paidResult = await handleMarkInvoiceAsPaid(invoiceId);
              successToast(
                `Invoice marked as Paid. ${paidResult.treatment_charges_updated} treatment charges updated to BILLED.`
              );
            } catch (paidError) {
              console.error("Failed to mark as paid:", paidError);
              errorToast("Invoice created but failed to update payment status");
            }
          }
        }
      }
    } catch (parseError) {
      console.log("PDF generated successfully, moving to reset");
    }

    // Reset form after successful generation (enhanced from first function)
    setTimeout(() => {
      setPatientInfo({
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
        billingStaff: staffInfo.staffName,
        billingStaffID: staffInfo.staffID,
        paymentMode: "",
        paymentType: "",
        paymentStatus: "",
        bedGroup: "",
        bedNumber: "",
      });
      setBillingItems([]);
      setTreatmentCharges([]);
      setFullPatient(null);
      successToast("Form reset. Ready for next patient.");
      
      // Auto refresh the page (from second function)
      window.location.reload();
    }, 2000);

  } catch (err) {
    console.error("Failed to generate invoice:", err);
    
    // Enhanced error handling from first function
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      
      if (err.response.status === 422) {
        const validationErrors = err.response.data.detail;
        // Check if it's a date validation error (from second function)
        const isDateError = Array.isArray(validationErrors) && 
          validationErrors.some(error => 
            error.loc?.includes("admission_date") || 
            error.loc?.includes("discharge_date")
          );
        
        if (isDateError) {
          errorToast("Invalid date format. Please use YYYY-MM-DD format for dates.");
        } else if (err.response.data?.detail) {
          errorToast(err.response.data.detail);
        } else {
          errorToast("Validation error. Please check all required fields.");
        }
      } else {
        errorToast(`Server error: ${err.response.status}`);
      }
    } else if (err.request) {
      console.error("Request data:", err.request);
      errorToast("No response from server. Please check your connection.");
    } else {
      errorToast("Failed to generate invoice. Please try again.");
    }
  } finally {
    setGeneratingBill(false);
  }
};

  // Function to render proper table messages
  const renderBillingTableContent = () => {
    if (!patientInfo.patientID) {
      return (
        <tr>
          <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
            Please select a patient to view treatment charges
          </td>
        </tr>
      );
    }
    
    if (billingItems.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
            No treatment charges found for this patient
          </td>
        </tr>
      );
    }
    
    return billingItems.map((item, index) => (
      <tr
        key={index}
        className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
      >
        <td className="p-2">
          <input
            type="text"
            value={item.sNo}
            readOnly
            className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white cursor-not-allowed"
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
            readOnly
            className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white cursor-not-allowed"
            style={{
              border: "2px solid #0EFF7B1A",
              boxShadow: "0px 0px 2px 0px #0EFF7B",
            }}
          />
        </td>
        <td className="p-2">
          <input
            type="text"
            value={item.quantity}
            readOnly
            className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white cursor-not-allowed"
            style={{
              border: "2px solid #0EFF7B1A",
              boxShadow: "0px 0px 2px 0px #0EFF7B",
            }}
          />
        </td>
        <td className="p-2">
          <input
            type="text"
            value={item.unitPrice}
            readOnly
            className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white cursor-not-allowed"
            style={{
              border: "2px solid #0EFF7B1A",
              boxShadow: "0px 0px 2px 0px #0EFF7B",
            }}
          />
        </td>
        <td className="p-2">
          <input
            type="text"
            value={item.amount}
            readOnly
            className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white cursor-not-allowed"
            style={{
              border: "2px solid #0EFF7B1A",
              boxShadow: "0px 0px 2px 0px #0EFF7B",
            }}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto">
      <div className="mt-[80px] mb-4 bg-gray-100 dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[2500px] mx-auto flex flex-col overflow-hidden relative font-[Helvetica]">
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
            {searchQuery.trim() && filteredPatients.length > 0 && (
              <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-gray-100 dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3C3C3C]">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      handlePatientNameChange(patient.name);
                      handlePatientIDChange(patient.id);
                      setSearchQuery("");
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
            {searchQuery.trim() && filteredPatients.length === 0 && (
              <div className="absolute mt-1 w-full p-3 text-center bg-gray-100 dark:bg-black rounded-[8px] shadow-lg border border-[#0EFF7B] dark:border-[#3C3C3C] text-gray-500 text-sm z-50">
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
                    bg-gray-100 dark:bg-black
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
                    bg-gray-100 dark:bg-black
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
                      bg-gray-100 dark:bg-black
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
                      absolute z-10 mt-1 w-full bg-gray-100 dark:bg-black
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
                    {patientInfo.paymentStatus || "Pending"}
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
                      absolute z-10 mt-1 w-full bg-gray-100 dark:bg-black
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
                        } inline-block h-3 w-3 transform rounded-full bg-gray-100 transition`}
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
                        } inline-block h-3 w-3 transform rounded-full bg-gray-100 transition`}
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
                    <tbody className="text-[#08994A] dark:text-gray-300 bg-gray-100 dark:bg-black">
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#08994A] dark:text-[#0EFF7B]">
              Treatment & charges
            </h3>
            {treatmentCharges.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {treatmentCharges.length} pending treatment charges loaded
              </div>
            )}
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[#08994A] dark:text-[#0EFF7B] bg-gray-200 dark:bg-[#091810]">
              <tr>
                <th className="p-2">S No</th>
                <th className="p-2">Description</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit price ($)</th>
                <th className="p-2">Amount ($)</th>
                {/* Action column removed */}
              </tr>
            </thead>
            <tbody className="text-[#08994A] dark:text-gray-300 bg-gray-100 dark:bg-black">
              {renderBillingTableContent()}
            </tbody>
          </table>
          
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
              {/* Optional: Connection test button for debugging */}
              {/* <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const testRes = await axios.get(`${API_BASE}/hospital-billing/`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Connection test successful:", testRes.data);
                    successToast("Connected to server successfully");
                  } catch (err) {
                    console.error("Connection test failed:", err);
                    errorToast("Cannot connect to server");
                  }
                }}
                className="text-sm px-3 py-1 border border-gray-300 rounded"
              >
                Test Connection
              </button> */}
              
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
                disabled={generatingBill}
                onClick={handleGenerateBill}
              >
                {generatingBill ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Invoice...
                  </div>
                ) : (
                  "Generate Invoice"
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
              className="w-[505px] rounded-[19px] bg-gray-100 dark:bg-[#000000] text-black dark:text-white p-6 shadow-lg relative"
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
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
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
                    <Listbox.Button className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] relative">
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
                    <Listbox.Options className="absolute z-10 mt-1 min-w-[210px] bg-gray-100 dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-md shadow-lg max-h-60 overflow-auto text-sm">
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
                    className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
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
                      maxDate={new Date()}
                      className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
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
                      minDate={new Date()}
                      className="w-full h-[33px] px-3 pr-10 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
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
                      bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none cursor-pointer"
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
                  className="w-[144px] h-[34px] rounded-[8px] border border-[#0EFF7B] text-gray-800 dark:text-white bg-gray-100 dark:bg-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrUpdateInsurance}
                  className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b-[2px] border-[#0EFF7B]
                    bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                    text-white font-medium hover:scale-105 transition flex items-center justify-center gap-2"
                >
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