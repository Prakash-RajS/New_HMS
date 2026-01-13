import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Settings,
  Printer,
  Download,
  CheckCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ChevronDown,
  Calendar,
  FileDown,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { successToast, errorToast } from "../../components/Toast.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// API Base URL configuration
//const API_BASE = "http://localhost:8000";

const Dropdown = ({ label, value, onChange, options, error }) => (
  <div>
    <label className="text-sm text-black dark:text-white">{label}</label>
    <Listbox value={value || "Select"} onChange={onChange}>
      <div className="relative mt-1 w-[228px]">
        <Listbox.Button
          className="w-full h-[33px] px-3 pr-8 rounded-full border border-[#0EFF7B] dark:border-[#0D0D0D]
          bg-gray-100 dark:bg-black text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]
          focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
        >
          {value || "Select"}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[12px] bg-gray-100 dark:bg-black
          shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A] no-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option.value || option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                ${
                  active
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                    : "text-black dark:text-white"
                }
                ${
                  selected
                    ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                    : ""
                }`
              }
            >
              {option.label || option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
    </Listbox>
  </div>
);

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBillsToday, setTotalBillsToday] = useState(0);
  const [insuranceClaims, setInsuranceClaims] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showExportPopup, setShowExportPopup] = useState(false);

  // Hospital states
  const [hospitalInvoiceData, setHospitalInvoiceData] = useState([]);
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState("");
  const [hospitalSelectAll, setHospitalSelectAll] = useState(false);
  const [selectedHospitalRows, setSelectedHospitalRows] = useState([]);
  const [hospitalCurrentPage, setHospitalCurrentPage] = useState(1);
  const [hospitalSortColumn, setHospitalSortColumn] = useState(null);
  const [hospitalSortOrder, setHospitalSortOrder] = useState("asc");
  const [showHospitalDeletePopup, setShowHospitalDeletePopup] = useState(false);
  const [showHospitalFilterPopup, setShowHospitalFilterPopup] = useState(false);
  const [hospitalFilterStatus, setHospitalFilterStatus] = useState("");
  const [hospitalFilterDepartment, setHospitalFilterDepartment] = useState("");
  const [hospitalFilterPaymentMethod, setHospitalFilterPaymentMethod] = useState("");
  const [hospitalFilterDate, setHospitalFilterDate] = useState("");
  const [showHospitalExportPopup, setShowHospitalExportPopup] = useState(false);
  const [hospitalLoading, setHospitalLoading] = useState(true);
  const [hospitalError, setHospitalError] = useState(null);

  const statusOptions = ["All", "Paid", "Unpaid"];
  const departmentOptions = [
    "All",
    "Cardiology",
    "Radiology",
    "Oncology",
    "Emergency",
    "Neurology",
    "Orthopedics",
    "Dermatology",
  ];
  const paymentMethodOptions = ["All", "Insurance", "Cash", "Credit Card", "None"];

  const handleExport = () => {
    setShowExportPopup(true);
  };

  const downloadExcel = async () => {
    try {
      const response = await fetch(`${API_BASE}/billing/export/excel`);
      if (!response.ok) throw new Error("Failed to download Excel");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoices.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      successToast("Excel file downloaded successfully");
      setShowExportPopup(false);
    } catch (err) {
      errorToast("Failed to download Excel file");
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(`${API_BASE}/billing/export/csv`);
      if (!response.ok) throw new Error("Failed to download CSV");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoices.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      successToast("CSV file downloaded successfully");
      setShowExportPopup(false);
    } catch (err) {
      errorToast("Failed to download CSV file");
    }
  };

  // Hospital export functions
  const handleHospitalExport = () => {
    setShowHospitalExportPopup(true);
  };

  const downloadHospitalExcel = async () => {
    try {
      const response = await fetch(`${API_BASE}/hospital-billing/export/excel`);
      if (!response.ok) throw new Error("Failed to download Excel");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hospital_invoices.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      successToast("Excel file downloaded successfully");
      setShowHospitalExportPopup(false);
    } catch (err) {
      errorToast("Failed to download Excel file");
    }
  };

  const downloadHospitalCSV = async () => {
    try {
      const response = await fetch(`${API_BASE}/hospital-billing/export/csv`);
      if (!response.ok) throw new Error("Failed to download CSV");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hospital_invoices.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      successToast("CSV file downloaded successfully");
      setShowHospitalExportPopup(false);
    } catch (err) {
      errorToast("Failed to download CSV file");
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/billing/`, { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        } 
      });
      console.log("Full Response Object:", res);
      console.log("Content-Type:", res.headers['content-type']);
      console.log("Raw res.data:", res.data);
      console.log("Type of res.data:", typeof res.data);

      let data = [];
      if (typeof res.data === 'string') {
        console.warn("res.data is a string, attempting to parse as JSON");
        try {
          const parsed = JSON.parse(res.data);
          if (Array.isArray(parsed)) {
            data = parsed;
          } else {
            console.error("Parsed data is not an array:", parsed);
            throw new Error("Invalid response format");
          }
        } catch (parseErr) {
          console.error("Failed to parse string as JSON:", parseErr);
          throw new Error("Response is not valid JSON");
        }
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else {
        console.error("Expected array, got:", typeof res.data, res.data);
        throw new Error("Invalid response format");
      }

      const mappedData = data.map((inv) => ({
        id: inv.invoice_id,
        date: inv.date,
        patientName: inv.patient_name,
        patientId: inv.patient_id,
        department: inv.department,
        amount: `$${inv.amount.toFixed(2)}`,
        paymentMethod: inv.payment_method || "-",
        status: inv.status,
      }));
      setInvoiceData(mappedData);

      const today = new Date().toISOString().split("T")[0];
      setTotalBillsToday(mappedData.filter((d) => d.date === today).length);
      setInsuranceClaims(mappedData.filter((d) => d.paymentMethod === "Insurance").length);
    } catch (err) {
      console.error("Error fetching invoices:", err.response?.data || err.message);
      setError(`Failed to fetch invoices: ${err.response?.data?.detail || err.message}. Check console for details. Ensure backend is running on ${API_BASE} and proxy is configured.`);
      setInvoiceData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalInvoices = async () => {
    try {
      setHospitalLoading(true);
      setHospitalError(null);
      const res = await axios.get(`${API_BASE}/hospital-billing/`, { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        } 
      });

      let data = [];
      if (typeof res.data === 'string') {
        console.warn("res.data is a string, attempting to parse as JSON");
        try {
          const parsed = JSON.parse(res.data);
          if (Array.isArray(parsed)) {
            data = parsed;
          } else {
            console.error("Parsed data is not an array:", parsed);
            throw new Error("Invalid response format");
          }
        } catch (parseErr) {
          console.error("Failed to parse string as JSON:", parseErr);
          throw new Error("Response is not valid JSON");
        }
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else {
        console.error("Expected array, got:", typeof res.data, res.data);
        throw new Error("Invalid response format");
      }

      const mappedData = data.map((inv) => ({
        id: inv.invoice_id,
        date: inv.date,
        patientName: inv.patient_name,
        patientId: inv.patient_id,
        department: inv.department,
        amount: `$${inv.amount.toFixed(2)}`,
        paymentMethod: inv.payment_method || "-",
        status: inv.status,
      }));
      setHospitalInvoiceData(mappedData);
    } catch (err) {
      console.error("Error fetching hospital invoices:", err.response?.data || err.message);
      setHospitalError(`Failed to fetch hospital invoices: ${err.response?.data?.detail || err.message}. Check console for details. Ensure backend is running on ${API_BASE} and proxy is configured.`);
      setHospitalInvoiceData([]);
    } finally {
      setHospitalLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchHospitalInvoices();
  }, []);

  const filteredData = invoiceData.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus && filterStatus !== "All" ? item.status === filterStatus : true;
    const matchesDepartment = filterDepartment && filterDepartment !== "All"
      ? item.department === filterDepartment
      : true;
    const matchesPaymentMethod = filterPaymentMethod && filterPaymentMethod !== "All"
      ? item.paymentMethod === (filterPaymentMethod === "None" ? "-" : filterPaymentMethod)
      : true;
    const matchesDate = filterDate ? item.date === filterDate : true;
    return matchesSearch && matchesStatus && matchesDepartment && matchesPaymentMethod && matchesDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (sortColumn === "amount") {
      const numA = parseFloat(valA.replace("$", ""));
      const numB = parseFloat(valB.replace("$", ""));
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const displayedData = sortedData.slice(indexOfFirst, indexOfLast);

  // Hospital filtered, sorted, paginated
  const filteredHospitalData = hospitalInvoiceData.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(hospitalSearchTerm.toLowerCase());
    const matchesStatus = hospitalFilterStatus && hospitalFilterStatus !== "All" ? item.status === hospitalFilterStatus : true;
    const matchesDepartment = hospitalFilterDepartment && hospitalFilterDepartment !== "All"
      ? item.department === hospitalFilterDepartment
      : true;
    const matchesPaymentMethod = hospitalFilterPaymentMethod && hospitalFilterPaymentMethod !== "All"
      ? item.paymentMethod === (hospitalFilterPaymentMethod === "None" ? "-" : hospitalFilterPaymentMethod)
      : true;
    const matchesDate = hospitalFilterDate ? item.date === hospitalFilterDate : true;
    return matchesSearch && matchesStatus && matchesDepartment && matchesPaymentMethod && matchesDate;
  });

  const sortedHospitalData = [...filteredHospitalData].sort((a, b) => {
    if (!hospitalSortColumn) return 0;
    const valA = a[hospitalSortColumn];
    const valB = b[hospitalSortColumn];
    if (hospitalSortColumn === "amount") {
      const numA = parseFloat(valA.replace("$", ""));
      const numB = parseFloat(valB.replace("$", ""));
      return hospitalSortOrder === "asc" ? numA - numB : numB - numA;
    }
    return hospitalSortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const hospitalItemsPerPage = 10;
  const hospitalTotalPages = Math.ceil(filteredHospitalData.length / hospitalItemsPerPage);
  const hospitalIndexOfFirst = (hospitalCurrentPage - 1) * hospitalItemsPerPage;
  const hospitalIndexOfLast = hospitalCurrentPage * hospitalItemsPerPage;
  const displayedHospitalData = sortedHospitalData.slice(hospitalIndexOfFirst, hospitalIndexOfLast);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleHospitalSort = (column) => {
    if (hospitalSortColumn === column) {
      setHospitalSortOrder(hospitalSortOrder === "asc" ? "desc" : "asc");
    } else {
      setHospitalSortColumn(column);
      setHospitalSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : displayedData.map((row) => row.id));
  };

  const handleHospitalSelectAll = () => {
    setHospitalSelectAll(!hospitalSelectAll);
    setSelectedHospitalRows(hospitalSelectAll ? [] : displayedHospitalData.map((row) => row.id));
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleHospitalRowSelect = (id) => {
    setSelectedHospitalRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleHospitalPrevPage = () => {
    setHospitalCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleHospitalNextPage = () => {
    setHospitalCurrentPage((prev) => Math.min(hospitalTotalPages, prev + 1));
  };

  const handleGenerateBill = () => {
    console.log("Generate Bill button clicked");
    navigate("/BillingPreview");
  };

  const handleViewInvoice = (invoiceId) => {
    window.open(`${API_BASE}/invoices/${invoiceId}.pdf`, "_blank");
  };

  const handleHospitalViewInvoice = (invoiceId) => {
    window.open(`${API_BASE}/invoices_generator/${invoiceId}.pdf`, "_blank");
  };

  const handlePDFDownload = async () => {
  if (selectedRows.length === 0) {
    errorToast("Please select at least one invoice to download.");
    return;
  }
  try {
    console.log("Downloading PDFs for IDs:", selectedRows);  // Log IDs
    const res = await axios.post(`${API_BASE}/billing/download-selected`, 
      { ids: selectedRows }, 
      { 
        responseType: "blob",
        headers: { "Content-Type": "application/json" }
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected_invoices.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    successToast(`Successfully downloaded ${selectedRows.length} invoice(s)`);
  } catch (err) {
    console.error("Error downloading PDFs:", err.response?.data || err.message);
    errorToast(err.response?.data?.detail || "Failed to download PDFs. Please check if the files exist on the server.");
  }
};

  const handleHospitalPDFDownload = async () => {
    if (selectedHospitalRows.length === 0) {
      errorToast("Please select at least one invoice to download.");
      return;
    }
    try {
      console.log("Downloading hospital PDFs for IDs:", selectedHospitalRows);
      const res = await axios.post(`${API_BASE}/hospital-billing/download-selected`, 
        { ids: selectedHospitalRows }, 
        { 
          responseType: "blob",
          headers: { "Content-Type": "application/json" }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "selected_hospital_invoices.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      successToast(`Successfully downloaded ${selectedHospitalRows.length} invoice(s)`);
    } catch (err) {
      console.error("Error downloading hospital PDFs:", err.response?.data || err.message);
      errorToast(err.response?.data?.detail || "Failed to download PDFs. Please check if the files exist on the server.");
    }
  };

  const handlePDFPrint = async () => {
    if (selectedRows.length === 0) {
      errorToast("Please select an invoice to print.");
      return;
    }
    if (selectedRows.length > 1) {
      errorToast("Please select only one invoice to print.");
      return;
    }

    const invoiceId = selectedRows[0];
    try {
      // First, try to get the PDF as blob
      const response = await fetch(`${API_BASE}/invoices/${invoiceId}.pdf`);
      if (!response.ok) {
        throw new Error('PDF not found');
      }
      
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      // Open print dialog directly
      const printWindow = window.open(pdfUrl, '_blank');
      
      // Wait for the PDF to load and then trigger print
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
          // Optional: close after print dialog appears
          // Note: We don't close immediately as user might cancel print
        }, 500);
      };
      
    } catch (err) {
      console.error("Error loading PDF for printing:", err);
      errorToast("Failed to load PDF for printing. The file might not exist.");
    }
  };

  const handleHospitalPDFPrint = async () => {
    if (selectedHospitalRows.length === 0) {
      errorToast("Please select an invoice to print.");
      return;
    }
    if (selectedHospitalRows.length > 1) {
      errorToast("Please select only one invoice to print.");
      return;
    }

    const invoiceId = selectedHospitalRows[0];
    try {
      const response = await fetch(`${API_BASE}/hospital-billing/pdf/${invoiceId}`);
      if (!response.ok) {
        throw new Error('PDF not found');
      }
      
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      const printWindow = window.open(pdfUrl, '_blank');
      
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
    } catch (err) {
      console.error("Error loading hospital PDF for printing:", err);
      errorToast("Failed to load PDF for printing. The file might not exist.");
    }
  };

  const handleFilter = () => {
    setShowFilterPopup(true);
  };

  const handleHospitalFilter = () => {
    setShowHospitalFilterPopup(true);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setShowDeletePopup(true);
    } else {
      errorToast("Please select at least one invoice to delete.");
    }
  };

  const handleHospitalDelete = () => {
    if (selectedHospitalRows.length > 0) {
      setShowHospitalDeletePopup(true);
    } else {
      errorToast("Please select at least one invoice to delete.");
    }
  };

  const confirmDelete = async () => {
    try {
      for (const id of selectedRows) {
        await axios.delete(`${API_BASE}/billing/${id}`, {
          headers: { "Accept": "application/json" }
        });
      }
      setSelectedRows([]);
      setSelectAll(false);
      setShowDeletePopup(false);
      fetchInvoices();
      successToast(`Successfully deleted ${selectedRows.length} invoice(s)`);
    } catch (err) {
      console.error("Error deleting invoices:", err);
      errorToast("Failed to delete some invoices.");
    }
  };

  const confirmHospitalDelete = async () => {
    try {
      for (const id of selectedHospitalRows) {
        await axios.delete(`${API_BASE}/hospital-billing/${id}`, {
          headers: { "Accept": "application/json" }
        });
      }
      setSelectedHospitalRows([]);
      setHospitalSelectAll(false);
      setShowHospitalDeletePopup(false);
      fetchHospitalInvoices();
      successToast(`Successfully deleted ${selectedHospitalRows.length} invoice(s)`);
    } catch (err) {
      console.error("Error deleting hospital invoices:", err);
      errorToast("Failed to delete some invoices.");
    }
  };

  const handleApplyFilter = () => {
    setShowFilterPopup(false);
    setCurrentPage(1);
    successToast("Filters applied successfully");
  };

  const handleHospitalApplyFilter = () => {
    setShowHospitalFilterPopup(false);
    setHospitalCurrentPage(1);
    successToast("Filters applied successfully");
  };

  const handleClearFilter = () => {
    setFilterStatus("All");
    setFilterDepartment("All");
    setFilterPaymentMethod("All");
    setFilterDate("");
    setShowFilterPopup(false);
    setCurrentPage(1);
    successToast("Filters cleared");
  };

  const handleHospitalClearFilter = () => {
    setHospitalFilterStatus("All");
    setHospitalFilterDepartment("All");
    setHospitalFilterPaymentMethod("All");
    setHospitalFilterDate("");
    setShowHospitalFilterPopup(false);
    setHospitalCurrentPage(1);
    successToast("Filters cleared");
  };

  const handleShare = (id) => {
    console.log(`Share button clicked for invoice ${id}`);
  };

  const getStatusColor = (status) => {
    if (status === "Paid") return "text-green-600 dark:text-green-500";
    if (status === "Unpaid") return "text-orange-600 dark:text-orange-500";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className="mb-4 bg-gray-100 dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[2500px] mx-auto flex flex-col bg-gray-100 dark:bg-transparent overflow-hidden relative font-[Helvetica]"
    >
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mt-4 mb-6">
        <h1 className="text-[20px] font-medium text-black dark:text-white">
          Billing Management
        </h1>
        <button
        
          onClick={handleGenerateBill}
          className="w-[200px] h-[40px] flex items-center justify-center bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)] border-b-[2px] border-[#0EFF7B] shadow-[0px_2px_12px_0px_#00000040] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-[8px] transition duration-300 ease-in-out"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          + Generate Bill
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex flex-col gap-8 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-[18px]  text-black dark:text-white">
                  Total Bills Generated Today
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[28px] font-bold">
                  {totalBillsToday}
                </span>
              </div>
            </div>
            <div className="flex flex-col rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-[18px] text-black dark:text-white">
                  Insurance Claims
                </span>
                <span className="text-[#08994A] dark:text-[#0EFF7B] text-[28px] font-bold">
                  {insuranceClaims}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-[280px] flex flex-col gap-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] p-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300 dark:border-[#3C3C3C]">
            <span className="text-[#6E92FF] dark:text-[#0EFF7B] text-sm font-semibold">
              VALIDATION & CONTROLS
            </span>
            <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3 mt-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> Payment method validation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-red-600 dark:text-red-500" /> No negative billing amounts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-gray-600 dark:text-gray-400" /> Duplicate bill prevention
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600 dark:text-green-500" /> Refund handling
            </li>
          </ul>
        </div>
      </div>
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
            <h2 className="text-black dark:text-white text-lg font-semibold">All Invoices</h2>
            {/* <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePDFPrint}
                className="bg-gray-100 dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
              >
                <Printer size={16} /> Print
              </button>
              <button
  onClick={handleExport}
  className="bg-gray-100 dark:bg-[#000000] border border-[#0EFF7B] dark:border-[#3C3C3C] shadow-[0px_0px_4px_0px_#0EFF7B] text-[#08994A] dark:text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
>
  <Download size={16} /> Export
</button>
            </div> */}
          </div>
      <div className="w-full bg-gray-100 dark:bg-transparent rounded-xl p-4 md:p-6 overflow-x-auto border border-[#0EFF7B] dark:border-[#3C3C3C]">
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded mb-4">
            <p>{error}</p>
            <button onClick={fetchInvoices} className="mt-2 text-sm underline">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="text-center p-4">Loading pharmacy invoices...</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <span className="text-black dark:text-white text-base font-medium">Pharmacy Invoices</span>
              <div className="flex items-center gap-2">
                <div className="relative group flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full w-full sm:w-auto">
                  <Search size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Search
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm text-black dark:text-white flex-1 min-w-[120px] placeholder-[#5CD592] dark:placeholder-[#5CD592] focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleFilter}
                >
                  <Filter size={16} className="text-[#0EFF7B] dark:text-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Filter
                  </span>
                </div>
                <div
                  className="relative group flex items-center justify-center bg-[#FF00001A] dark:bg-[#FF00001A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#FF000033] dark:hover:bg-[#FF000033]"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Delete
                  </span>
                </div>
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handlePDFPrint}
                >
                  <Printer size={16} className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Print
                  </span>
                </div>
                <div
                title=""
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handlePDFDownload}
                >
                  <Download size={16} className="text-green-600 dark:text-green-500 cursor-pointer hover:text-[#0cd968] dark:hover:text-[#0cd968] hover:text-green-700 dark:hover:text-green-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Download
                  </span>
                </div>
                <div
                title=""
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleExport}
                >
                  <FileDown size={16} className="text-purple-600 dark:text-purple-500 hover:text-purple-700 dark:hover:text-purple-400 cursor-pointer hover:text-[#0cd968] dark:hover:text-[#0cd968]" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Export
                  </span>
                </div>
              </div>
            </div>
            {invoiceData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No invoices found. Generate a new bill to get started.
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead className="bg-gray-200 dark:bg-[#091810] h-[52px] text-left text-sm text-[#0EFF7B] dark:text-[#0EFF7B]">
                      <tr>
                        <th className="px-3 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-gray-100 dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          />
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("id")}>
                          Invoice ID {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("patientName")}>
                          Patient Name {sortColumn === "patientName" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("department")}>
                          Department {sortColumn === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("amount")}>
                          Amount {sortColumn === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                          Payment Method {sortColumn === "paymentMethod" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                          Status {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {displayedData.map((row) => (
                        <tr
                          key={row.id}
                          className="h-[62px] bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                        >
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={selectAll || selectedRows.includes(row.id)}
                              onChange={() => handleRowSelect(row.id)}
                              className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-gray-100 dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                            />
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">
                            {row.id}
                            <br />
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{row.date}</span>
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">
                            {row.patientName}
                            <br />
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{row.patientId}</span>
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.department}</td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.amount}</td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.paymentMethod}</td>
                          <td className={`px-3 py-3 font-medium ${getStatusColor(row.status)}`}>
                            {row.status}
                          </td>
                          <td className="px-3 py-3">
                            <div
  className="relative group w-8 h-8 flex items-center justify-center rounded-full
             border border-[#08994A1A] dark:border-[#0EFF7B1A]
             bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
  onClick={() => handleViewInvoice(row.id)}
>
  <Eye
    size={16}
    className="text-[#08994A] dark:text-[#0EFF7B]
               hover:text-[#0cd968] dark:hover:text-[#0cd968]"
  />

  <span
    className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap
               px-3 py-1 text-xs rounded-md shadow-md
               bg-gray-100 dark:bg-black text-black dark:text-white
               opacity-0 group-hover:opacity-100
               transition-all duration-150"
  >
    View
  </span>
</div>


                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center h-full mt-4 bg-gray-100 dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
                  <div className="text-sm text-black dark:text-white">
                    Page{" "}
                    <span className="text-[#08994A] dark:text-[#0EFF7B]">{currentPage}</span>{" "}
                    of {totalPages} ({indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, filteredData.length)} from{" "}
                    {filteredData.length} Invoices)
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                        currentPage === 1
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                          : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                      }`}
                    >
                      <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                        currentPage === totalPages
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                          : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                      }`}
                    >
                      <ChevronRight size={12} className="text-[#08994A] dark:text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
    <div className="w-full bg-gray-100 dark:bg-transparent mt-7 rounded-xl p-4 md:p-6 overflow-x-auto border border-[#0EFF7B] dark:border-[#3C3C3C]">
        {hospitalError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded mb-4">
            <p>{hospitalError}</p>
            <button onClick={fetchHospitalInvoices} className="mt-2 text-sm underline">Retry</button>
          </div>
        )}
        {hospitalLoading ? (
          <div className="text-center p-4">Loading hospital invoices...</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <span className="text-black dark:text-white text-base font-medium">Hospital Invoices</span>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative group flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full w-full sm:w-auto">
                  <Search size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Search
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm text-black dark:text-white flex-1 min-w-[120px] placeholder-[#5CD592] dark:placeholder-[#5CD592] focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                    value={hospitalSearchTerm}
                    onChange={(e) => setHospitalSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter */}
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleHospitalFilter}
                >
                  <Filter size={16} className="text-[#0EFF7B] dark:text-[#0EFF7B] hover:text-[#08994A] dark:hover:text-[#0EFF7B]" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Filter
                  </span>
                </div>

                {/* Delete */}
                <div
                  className="relative group flex items-center justify-center bg-[#FF00001A] dark:bg-[#FF00001A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#FF000033] dark:hover:bg-[#FF000033]"
                  onClick={handleHospitalDelete}
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Delete
                  </span>
                </div>

                {/* Print */}
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleHospitalPDFPrint}
                >
                  <Printer size={16} className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400" /><span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Print
                  </span>
                </div>

                {/* Download PDF */}
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleHospitalPDFDownload}
                >
                  <Download size={16} className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Download
                  </span>
                </div>

                {/* Export CSV/Excel */}
                <div
                  className="relative group flex items-center justify-center bg-[#08994A1A] dark:bg-[#0EFF7B1A] px-3 py-2 rounded-full cursor-pointer hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]"
                  onClick={handleHospitalExport}
                >
                  <FileDown size={16} className="text-purple-600 dark:text-purple-500 hover:text-purple-700 dark:hover:text-purple-400" />
                  <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-gray-100 dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Export
                  </span>
                </div>
              </div>
            </div>

            {hospitalInvoiceData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No invoices found. Generate a new bill to get started.
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-lg">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead className="bg-gray-200 dark:bg-[#091810] h-[52px] text-left text-sm text-[#0EFF7B] dark:text-[#0EFF7B]">
                      <tr>
                        <th className="px-3 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={hospitalSelectAll}
                            onChange={handleHospitalSelectAll}
                            className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-gray-100 dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          />
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("id")}>
                          Invoice ID {hospitalSortColumn === "id" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("patientName")}>
                          Patient Name {hospitalSortColumn === "patientName" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("department")}>
                          Department {hospitalSortColumn === "department" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("amount")}>
                          Amount {hospitalSortColumn === "amount" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("paymentMethod")}>
                          Payment Method {hospitalSortColumn === "paymentMethod" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3 cursor-pointer" onClick={() => handleHospitalSort("status")}>
                          Status {hospitalSortColumn === "status" && (hospitalSortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {displayedHospitalData.map((row) => (
                        <tr
                          key={row.id}
                          className="h-[62px] bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                        >
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={hospitalSelectAll || selectedHospitalRows.includes(row.id)}
                              onChange={() => handleHospitalRowSelect(row.id)}
                              className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-gray-100 dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                            />
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">
                            {row.id}
                            <br />
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{row.date}</span>
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">
                            {row.patientName}
                            <br />
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{row.patientId}</span>
                          </td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.department}</td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.amount}</td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.paymentMethod}</td>
                          <td className={`px-3 py-3 font-medium ${getStatusColor(row.status)}`}>
                            {row.status}
                          </td>
                          <td className="px-3 py-3">
                            <div
  className="relative group w-8 h-8 flex items-center justify-center rounded-full
             border border-[#08994A1A] dark:border-[#0EFF7B1A]
             bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
  onClick={() => handleHospitalViewInvoice(row.id)}
>
  <Eye
    size={16}
    className="text-[#08994A] dark:text-[#0EFF7B]
               hover:text-[#0cd968] dark:hover:text-[#0cd968]"
  />

  <span
    className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap
               px-3 py-1 text-xs rounded-md shadow-md
               bg-gray-100 dark:bg-black text-black dark:text-white
               opacity-0 group-hover:opacity-100
               transition-all duration-150"
  >
    View
  </span>
</div>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center h-full mt-4 bg-gray-100 dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
                  <div className="text-sm text-black dark:text-white">
                    Page{" "}
                    <span className="text-[#08994A] dark:text-[#0EFF7B]">{hospitalCurrentPage}</span>{" "}
                    of {hospitalTotalPages} ({hospitalIndexOfFirst + 1} to{" "}
                    {Math.min(hospitalIndexOfLast, filteredHospitalData.length)} from{" "}
                    {filteredHospitalData.length} Invoices)
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={handleHospitalPrevPage}
                      disabled={hospitalCurrentPage === 1}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                        hospitalCurrentPage === 1
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                          : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                      }`}
                    >
                      <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
                    </button>
                    <button
                      onClick={handleHospitalNextPage}
                      disabled={hospitalCurrentPage === hospitalTotalPages}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                        hospitalCurrentPage === hospitalTotalPages
                          ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                          : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                      }`}
                    >
                      <ChevronRight size={12} className="text-[#08994A] dark:text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-gray-100 dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
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
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  {selectedRows.length === 1 ? "Delete Invoice" : "Delete Invoices"}
                </h3>
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {selectedRows.length === 1
                  ? `Are you sure you want to delete invoice ${
                      invoiceData.find((item) => item.id === selectedRows[0])?.id
                    }?`
                  : `Are you sure you want to delete ${selectedRows.length} invoice(s)?`}
                <br />
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHospitalDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px]">
            <div className="w-[400px] bg-gray-100 dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans">
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
                <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                  {selectedHospitalRows.length === 1 ? "Delete Invoice" : "Delete Invoices"}
                </h3>
                <button
                  onClick={() => setShowHospitalDeletePopup(false)}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                {selectedHospitalRows.length === 1
                  ? `Are you sure you want to delete invoice ${
                      hospitalInvoiceData.find((item) => item.id === selectedHospitalRows[0])?.id
                    }?`
                  : `Are you sure you want to delete ${selectedHospitalRows.length} invoice(s)?`}
                <br />
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowHospitalDeletePopup(false)}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmHospitalDelete}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
            bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
            dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[505px] rounded-[19px] bg-gray-100 dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <h2
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter Invoices
                </h2>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Dropdown
                  label="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={statusOptions}
                />
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Invoice Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-3.5 text-black dark:text-[#0EFF7B] pointer-events-none"
                    />
                  </div>
                </div>
                <Dropdown
                  label="Department"
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  options={departmentOptions}
                />
                <Dropdown
                  label="Payment Method"
                  value={filterPaymentMethod}
                  onChange={setFilterPaymentMethod}
                  options={paymentMethodOptions}
                />
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleClearFilter}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilter}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHospitalFilterPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
            bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
            dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[505px] rounded-[19px] bg-gray-100 dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <h2
                  className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Filter Hospital Invoices
                </h2>
                <button
                  onClick={() => setShowHospitalFilterPopup(false)}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-gray-100 dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Dropdown
                  label="Status"
                  value={hospitalFilterStatus}
                  onChange={setHospitalFilterStatus}
                  options={statusOptions}
                />
                <div>
                  <label
                    className="text-sm text-black dark:text-white"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    Invoice Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={hospitalFilterDate}
                      onChange={(e) => setHospitalFilterDate(e.target.value)}
                      className="w-[228px] h-[32px] mt-1 px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-3.5 text-black dark:text-[#0EFF7B] pointer-events-none"
                    />
                  </div>
                </div>
                <Dropdown
                  label="Department"
                  value={hospitalFilterDepartment}
                  onChange={setHospitalFilterDepartment}
                  options={departmentOptions}
                />
                <Dropdown
                  label="Payment Method"
                  value={hospitalFilterPaymentMethod}
                  onChange={setHospitalFilterPaymentMethod}
                  options={paymentMethodOptions}
                />
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleHospitalClearFilter}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-gray-100 dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleHospitalApplyFilter}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="rounded-[20px] p-[1px]">
      <div className="w-[420px] bg-gray-100 dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans relative">
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
            Export Invoices
          </h3>
          <button
            onClick={() => setShowExportPopup(false)}
            className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
          Choose your preferred format to export all invoices.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={downloadExcel}
            className="h-[100px] rounded-[12px] border-2 border-[#0EFF7B] dark:border-[#0EFF7B80] bg-gradient-to-br from-[#08994A10] to-transparent hover:from-[#08994A20] transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 bg-[#0EFF7B20] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={24} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <span className="font-medium text-black dark:text-white">Excel (.xlsx)</span>
          </button>

          <button
            onClick={downloadCSV}
            className="h-[100px] rounded-[12px] border-2 border-[#0EFF7B] dark:border-[#0EFF7B80] bg-gradient-to-br from-[#08994A10] to-transparent hover:from-[#08994A20] transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 bg-[#0EFF7B20] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={24} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <span className="font-medium text-black dark:text-white">CSV (.csv)</span>
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowExportPopup(false)}
            className="px-6 py-2 text-sm border border-gray-300 dark:border-[#3A3A3A] rounded-[8px] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showHospitalExportPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="rounded-[20px] p-[1px]">
      <div className="w-[420px] bg-gray-100 dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md font-sans relative">
        {/* Gradient Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "20px",
            padding: "2px",
            background: "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
            Export Hospital Invoices
          </h3>
          <button
            onClick={() => setShowHospitalExportPopup(false)}
            className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
          Choose your preferred format to export all hospital invoices.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={downloadHospitalExcel}
            className="h-[100px] rounded-[12px] border-2 border-[#0EFF7B] dark:border-[#0EFF7B80] bg-gradient-to-br from-[#08994A10] to-transparent hover:from-[#08994A20] transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 bg-[#0EFF7B20] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={24} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <span className="font-medium text-black dark:text-white">Excel (.xlsx)</span>
          </button>

          <button
            onClick={downloadHospitalCSV}
            className="h-[100px] rounded-[12px] border-2 border-[#0EFF7B] dark:border-[#0EFF7B80] bg-gradient-to-br from-[#08994A10] to-transparent hover:from-[#08994A20] transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 bg-[#0EFF7B20] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download size={24} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <span className="font-medium text-black dark:text-white">CSV (.csv)</span>
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowHospitalExportPopup(false)}
            className="px-6 py-2 text-sm border border-gray-300 dark:border-[#3A3A3A] rounded-[8px] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B33] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BillingManagement;