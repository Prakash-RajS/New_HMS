// src/pages/pharmacy/Bill.jsx

// src/pages/pharmacy/Bill.jsx
import React, { useState, useEffect } from "react";
import { Search, Trash2, Plus, Calendar } from "lucide-react";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { successToast, errorToast } from "../../components/Toast";

const Bill = () => {
  const API_BASE = "http://localhost:8000";
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientID: "",
    paymentType: "Full Payment",
    paymentStatus: "Paid",
    paymentMode: "Cash",
  });
  const [staffInfo, setStaffInfo] = useState({ staffName: "", staffID: "" });
  const [fullPatient, setFullPatient] = useState(null);
  const [billingItems, setBillingItems] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingBill, setGeneratingBill] = useState(false);

  const paymentTypes = [
    "Full Payment",
    "Partial Payment",
    "Insurance",
    "Credit",
  ];
  const paymentStatuses = ["Paid", "Pending", "Overdue", "Refunded"];
  const paymentModes = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
    "Insurance Claim",
  ];

  // Fetch patients & logged-in staff
  useEffect(() => {
    fetchPatients();
    fetchStaffInfo();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.patient_unique_id
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/medicine_allocation/edit`);
      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (res.data.patients) list = res.data.patients;
      setPatients(list);
    } catch (err) {
      console.error("Failed to load patients:", err);
      errorToast("Failed to load patients");
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
      const res = await axios.get(`${API_BASE}/patients/${uniqueId}`);
      setFullPatient(res.data);
    } catch (err) {
      console.error("Failed to load patient details:", err);
    }
  };

  const fetchBillingItems = async (patientId, fromDate = "", toDate = "") => {
    if (!patientId) return;
    setLoading(true);
    try {
      // Build URL with date filters
      let url = `${API_BASE}/pharmacy-billing/${patientId}/`;
      const params = new URLSearchParams();

      if (fromDate) params.append("date_from", fromDate);
      if (toDate) params.append("date_to", toDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url);

      // Filter out any lab reports and only show medicine allocations
      const medicineItems = (res.data.items || [])
        .filter(
          (item) => item.medicine_name || item.name_of_drug // Only include medicine items
        )
        .map((item, i) => ({
          sNo: (i + 1).toString(),
          itemCode: item.item_code || "N/A",
          name: item.medicine_name || item.name_of_drug || "",
          rackNo: item.rack_no || "",
          shelfNo: item.shelf_no || "",
          quantity: item.quantity ? String(item.quantity) : "0",
          unitPrice: item.unit_price ? String(item.unit_price) : "0.00",
          discount: "0%",
          tax: "10%",
          total:
            item.unit_price && item.quantity
              ? (item.unit_price * item.quantity).toFixed(2)
              : "0.00",
          doctorName: item.doctor_name || "N/A",
          allocationDate: item.allocation_date || "",
        }));

      setBillingItems(medicineItems);

      // Show info toast if no items found but request was successful
      if (medicineItems.length === 0) {
        if (fromDate || toDate) {
          errorToast(
            "No medicine allocations found for the selected date range"
          );
        } else {
          errorToast("No medicine allocations found for this patient");
        }
      }
    } catch (err) {
      console.error("Error loading medicines:", err);
      setBillingItems([]);

      if (err.response?.status === 404) {
        if (fromDate || toDate) {
          errorToast(
            "No medicine allocations found for the selected date range"
          );
        } else {
          errorToast("No medicine allocations found for this patient");
        }
      } else if (err.response?.status === 500) {
        errorToast("Server error. Please try again later.");
      } else {
        errorToast("Failed to load medicine allocations");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient) => {
    setPatientInfo({
      patientName: patient.full_name || "",
      patientID: patient.patient_unique_id || "",
      paymentType: "Full Payment",
      paymentStatus: "Paid",
      paymentMode: "Cash",
    });
    setSelectedPatientId(patient.id);
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    await fetchPatientDetails(patient.patient_unique_id);
    await fetchBillingItems(patient.id);
  };

  const handleInputChange = (value, field) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setDateFrom(value);
    } else if (type === "to") {
      setDateTo(value);
    }

    // If patient is selected, refetch data with new date filters
    if (selectedPatientId) {
      const newFromDate = type === "from" ? value : dateFrom;
      const newToDate = type === "to" ? value : dateTo;
      fetchBillingItems(selectedPatientId, newFromDate, newToDate);
    }
  };

  const handleApplyDateFilter = () => {
    if (selectedPatientId) {
      fetchBillingItems(selectedPatientId, dateFrom, dateTo);
    } else {
      errorToast("Please select a patient first");
    }
  };

  const handleClearDates = () => {
    setDateFrom("");
    setDateTo("");
    if (selectedPatientId) {
      fetchBillingItems(selectedPatientId); // Fetch without date filters
    }
  };

  const handleAddMedicine = () => {
    const newItem = {
      sNo: (billingItems.length + 1).toString(),
      itemCode: "",
      name: "",
      rackNo: "",
      shelfNo: "",
      quantity: "",
      unitPrice: "",
      discount: "0%",
      tax: "10%",
      total: "0.00",
      doctorName: "",
      allocationDate: new Date().toISOString().split("T")[0],
    };

    setBillingItems((prev) => [...prev, newItem]);
  };

  const handleBillingChange = (index, field, value) => {
    setBillingItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      const qty = parseFloat(updated[index].quantity) || 0;
      const price = parseFloat(updated[index].unitPrice) || 0;
      const disc = parseFloat(updated[index].discount.replace("%", "")) || 0;
      const tax = parseFloat(updated[index].tax.replace("%", "")) || 10;
      const base = qty * price;
      const afterDisc = base - (base * disc) / 100;
      const total = (afterDisc + (afterDisc * tax) / 100).toFixed(2);
      updated[index].total = total;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setBillingItems((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, sNo: (i + 1).toString() }))
    );
  };

  const calculateTotals = () => {
    const subTotal = billingItems.reduce(
      (sum, item) => sum + parseFloat(item.total || 0),
      0
    );
    const cgst = subTotal * 0.05;
    const sgst = subTotal * 0.05;
    const discountAmt = billingItems.reduce((sum, item) => {
      const disc = parseFloat(item.discount.replace("%", "")) || 0;
      const base =
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
      return sum + (base * disc) / 100;
    }, 0);
    const net = subTotal + cgst + sgst - discountAmt;
    return {
      subTotal: subTotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      discountAmt: discountAmt.toFixed(2),
      net: net.toFixed(2),
    };
  };

  const generateBill = async () => {
    if (!selectedPatientId || !fullPatient) {
      errorToast("Please select a patient first.");
      return;
    }

    const itemsToSend = billingItems.map((item, index) => ({
      sl_no: index + 1,
      item_code: item.itemCode || "N/A",
      drug_name: item.name || "",
      rack_no: item.rackNo || "",
      shelf_no: item.shelfNo || "",
      quantity: parseInt(item.quantity) || 0,
      unit_price: parseFloat(item.unitPrice) || 0,
      discount_pct: parseFloat(item.discount.replace("%", "")) || 0,
      tax_pct: parseFloat(item.tax.replace("%", "")) || 10,
    }));

    if (itemsToSend.length === 0) {
      errorToast("No items to generate bill.");
      return;
    }

    const totals = calculateTotals();

    const invoiceData = {
      patient_name: patientInfo.patientName,
      patient_id: patientInfo.patientID,
      age: parseInt(fullPatient?.age) || 0,
      doctor_name: mainDoctor || "N/A",
      billing_staff: staffInfo.staffName,
      staff_id: staffInfo.staffID,
      patient_type: "Outpatient",
      address_text: fullPatient?.address || "",
      payment_type: patientInfo.paymentType,
      payment_status: patientInfo.paymentStatus,
      payment_mode: patientInfo.paymentMode,
      bill_date: new Date().toISOString().split("T")[0],
      discount_amount: parseFloat(totals.discountAmt) || 0,
      cgst_percent: 5,
      sgst_percent: 5,
      items: itemsToSend,
    };

    setGeneratingBill(true);
    try {
      // First, check stock availability
      const stockCheckResponse = await axios.get(
        `${API_BASE}/pharmacy-billing/check-stock-availability/${selectedPatientId}/`,
        {
          params: {
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
          },
        }
      );

      if (!stockCheckResponse.data.all_medicines_available) {
        const unavailableItems = stockCheckResponse.data.stock_check.filter(
          (item) => !item.sufficient_stock
        );

        const errorMessage = unavailableItems
          .map(
            (item) =>
              `${item.medicine_name}: Need ${item.quantity_needed}, Available ${item.quantity_available}`
          )
          .join("\n");

        errorToast(`Insufficient stock:\n${errorMessage}`);
        setGeneratingBill(false);
        return;
      }

      // FIXED: Use the PHARMACY endpoint instead of general billing endpoint
      const response = await axios.post(
        `${API_BASE}/pharmacy/create-invoice`, // CHANGED THIS LINE
        invoiceData,
        {
          responseType: "blob",
        }
      );

      // Create blob and open in new tab
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      successToast(`Bill generated successfully! Stock quantities updated.`);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error generating bill:", err);

      // Better error handling
      if (err.response?.status === 422) {
        // Parse the error response if it's JSON
        if (err.response.data instanceof Blob) {
          const errorText = await err.response.data.text();
          try {
            const errorData = JSON.parse(errorText);
            errorToast(
              `Validation error: ${JSON.stringify(
                errorData.detail || errorData
              )}`
            );
          } catch {
            errorToast("Validation error: Unprocessable content");
          }
        } else {
          errorToast(
            `Validation error: ${
              err.response.data.detail || "Invalid data format"
            }`
          );
        }
      } else if (err.response?.status === 400) {
        errorToast(`Stock issue: ${err.response.data.detail}`);
      } else if (err.response?.status === 500) {
        errorToast("Server error. Please try again later.");
      } else {
        errorToast("Failed to generate bill. Please try again.");
      }
    } finally {
      setGeneratingBill(false);
    }
  };

  const handleCancel = () => {
    setPatientInfo({
      patientName: "",
      patientID: "",
      paymentType: "Full Payment",
      paymentStatus: "Paid",
      paymentMode: "Cash",
    });
    setSelectedPatientId(null);
    setFullPatient(null);
    setBillingItems([]);
    setDateFrom("");
    setDateTo("");
    successToast("Bill generation cancelled");
  };

  const totals = calculateTotals();
  const mainDoctor = billingItems.length > 0 ? billingItems[0].doctorName : "";

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto">
      <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative">
        {/* Gradient overlays */}
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
          Pharmacy Bill Generation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          This is the information only related to pharmacy department
        </p>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-3 w-full">
          {/* ---------- ROW 1: Search + Patient Name + Patient ID ---------- */}
          <div className="flex flex-row flex-wrap items-center gap-2 w-full justify-end">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] max-w-[350px] lg:max-w-[400px] relative">
              <input
                type="text"
                placeholder="Search patient name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[34px] p-[4.19px_16.75px] rounded border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-[#08994A] dark:text-white placeholder-[#5CD592] dark:placeholder-[#5CD592] focus:outline-none transition-all font-helvetica"
              />

              {searchQuery && filteredPatients.length > 0 && (
                <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-10 border border-[#0EFF7B] dark:border-[#3C3C3C]">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className="cursor-pointer p-2 text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]"
                    >
                      {patient.full_name} ({patient.patient_unique_id})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Name Listbox */}
            <div className="relative min-w-[140px] w-[160px] lg:w-[180px]">
              <Listbox
                value={patientInfo.patientName}
                onChange={(v) =>
                  patients.find((p) => p.full_name === v) &&
                  handlePatientSelect(patients.find((p) => p.full_name === v))
                }
              >
                <Listbox.Button className="w-full h-[33.5px] rounded-[8.38px] border-[1.05px] border-[#0EFF7B] dark:border-[#3C3C3C] bg-[#F5F6F5] dark:bg-black text-[#08994A] dark:text-white px-3 pr-8 text-sm font-helvetica text-left relative">
                  {patientInfo.patientName || "Select Name"}
                </Listbox.Button>

                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-md shadow-lg max-h-60 overflow-auto text-sm font-helvetica">
                  {patients.map((p) => (
                    <Listbox.Option
                      key={p.id}
                      value={p.full_name}
                      className="cursor-pointer p-2 hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]"
                    >
                      {p.full_name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            {/* Patient ID Listbox */}
            <div className="relative min-w-[140px] w-[160px] lg:w-[180px]">
              <Listbox
                value={patientInfo.patientID}
                onChange={(v) =>
                  patients.find((p) => p.patient_unique_id === v) &&
                  handlePatientSelect(
                    patients.find((p) => p.patient_unique_id === v)
                  )
                }
              >
                <Listbox.Button className="w-full h-[33.5px] rounded-[8.38px] border-[1.05px] border-[#0EFF7B] dark:border-[#3C3C3C] bg-[#F5F6F5] dark:bg-black text-[#08994A] dark:text-white px-3 pr-8 text-sm font-helvetica text-left relative">
                  {patientInfo.patientID || "Select ID"}
                </Listbox.Button>

                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-md shadow-lg max-h-60 overflow-auto text-sm font-helvetica">
                  {patients.map((p) => (
                    <Listbox.Option
                      key={p.id}
                      value={p.patient_unique_id}
                      className="cursor-pointer p-2 hover:bg-[#0EFF7B1A] dark:hover:bg-[#025126]"
                    >
                      {p.patient_unique_id}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          </div>

          {/* ---------- ROW 2: Date From + Date To + Buttons ---------- */}
          <div className="flex flex-row flex-wrap items-center gap-3 w-full justify-end">
            {/* From Date */}
            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => document.getElementById("dateFrom").showPicker()}
            >
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateChange("from", e.target.value)}
                className="h-[33.5px] bg-transparent rounded-[8.38px] border-[1.05px] border-[#0EFF7B] px-2 text-sm text-[#08994A] dark:text-white cursor-pointer"
              />
            </label>

            {/* To Date */}
            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => document.getElementById("dateTo").showPicker()}
            >
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => handleDateChange("to", e.target.value)}
                className="h-[33.5px] bg-transparent rounded-[8.38px] border-[1.05px] border-[#0EFF7B] px-2 text-sm text-[#08994A] dark:text-white cursor-pointer"
              />
            </label>

            {/* Clear Button */}
            <button
              onClick={handleClearDates}
              className="h-[33.5px] px-3 rounded-[8.38px] bg-[#F5F6F5] dark:bg-[#0EFF7B] text-[#08994A] dark:text-black shadow-[0_0_4px_#0EFF7B] transition-all min-w-[100px]"
            >
              Clear Dates
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Left Panel */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={patientInfo.patientName}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Patient ID
              </label>
              <input
                type="text"
                value={patientInfo.patientID}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Age
              </label>
              <input
                type="text"
                value={fullPatient?.age || ""}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Date
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString("en-GB")}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
            </div>
          </div>
          {/* Middle Panel */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Billing Staff
              </label>
              <input
                type="text"
                value={staffInfo.staffName}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Staff ID
              </label>
              <input
                type="text"
                value={staffInfo.staffID}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Patient Type
              </label>
              <input
                type="text"
                value="Outpatient"
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                value={fullPatient?.address || ""}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
              />
            </div>
          </div>
          {/* Right Panel */}
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Doctor Name
              </label>
              <input
                type="text"
                value={mainDoctor}
                readOnly
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
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
                    {patientInfo.paymentMode}
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
        </div>
        {/* Billing Table */}
        <div className="bg-[#F5F6F5] dark:bg-transparent border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-xl p-4">
          <h3 className="text-[#08994A] dark:text-[#0EFF7B] mb-3">
            Billing Information
          </h3>
          {loading ? (
            <p>Loading medicines...</p>
          ) : billingItems.length === 0 ? (
            dateFrom || dateTo ? (
              <p>No medicines allocated for the selected date range.</p>
            ) : (
              <p>No medicines allocated to this patient.</p>
            )
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[#08994A] dark:text-[#0EFF7B] bg-gray-200 dark:bg-[#091810]">
                <tr>
                  <th className="p-2">S.No</th>
                  <th className="p-2">Item code</th>
                  <th className="p-2">Name of drugs</th>
                  <th className="p-2">Allocation Date</th>
                  <th className="p-2">Rack no</th>
                  <th className="p-2">Shelf no</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Unit price</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Remove</th>
                </tr>
              </thead>
              <tbody className="text-[#08994A] dark:text-gray-300 bg-white dark:bg-black">
                {billingItems.map((item, i) => (
                  <tr
                    key={i}
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
                        value={item.itemCode}
                        onChange={(e) =>
                          handleBillingChange(i, "itemCode", e.target.value)
                        }
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
                        value={item.name}
                        onChange={(e) =>
                          handleBillingChange(i, "name", e.target.value)
                        }
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
                        value={item.allocationDate}
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
                        value={item.rackNo}
                        onChange={(e) =>
                          handleBillingChange(i, "rackNo", e.target.value)
                        }
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
                        value={item.shelfNo}
                        onChange={(e) =>
                          handleBillingChange(i, "shelfNo", e.target.value)
                        }
                        className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                        style={{
                          border: "2px solid #0EFF7B1A",
                          boxShadow: "0px 0px 2px 0px #0EFF7B",
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleBillingChange(i, "quantity", e.target.value)
                        }
                        className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                        style={{
                          border: "2px solid #0EFF7B1A",
                          boxShadow: "0px 0px 2px 0px #0EFF7B",
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleBillingChange(i, "unitPrice", e.target.value)
                        }
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
                        value={item.discount}
                        onChange={(e) =>
                          handleBillingChange(i, "discount", e.target.value)
                        }
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
                        value={item.tax}
                        onChange={(e) =>
                          handleBillingChange(i, "tax", e.target.value)
                        }
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
                        value={item.total}
                        readOnly
                        className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                        style={{
                          border: "2px solid #0EFF7B1A",
                          boxShadow: "0px 0px 2px 0px #0EFF7B",
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Trash2
                        className="w-5 h-5 text-red-500 dark:text-[#0EFF7B] cursor-pointer hover:text-red-600 dark:hover:text-red-600"
                        onClick={() => handleRemoveItem(i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Add Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddMedicine}
              className="flex items-center justify-center border-b-[2px] border-[#0EFF7B] gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition"
            >
              <Plus size={18} className="text-white" /> Add
            </button>
          </div>
          {/* Totals */}
          <div className="mt-6 grid grid-cols-5 gap-3 text-sm text-gray-600 dark:text-gray-200">
            <div className="col-span-1"></div>
            <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>Sub total</span> <span>{totals.subTotal}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>CGST (5%)</span> <span>{totals.cgst}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>SGST (5%)</span> <span>{totals.sgst}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>Discount amount</span> <span>{totals.discountAmt}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="flex justify-between w-64 bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-3 text-lg font-semibold text-[#08994A] dark:text-[#0EFF7B]">
              <span>Net Amount</span>
              <span>{totals.net}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md text-gray-600 dark:text-gray-300 hover:text-[#08994A] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={generateBill}
              disabled={generatingBill || billingItems.length === 0}
              className="flex items-center justify-center w-[200px] h-[40px] gap-2 rounded-[8px] border-b-[2px] border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingBill ? "Generating..." : "Generate Bill"}
            </button>
          </div>
        </div>
        {/* Rest of your component remains exactly the same... */}
        {/* Only the date filtering logic has changed */}
      </div>
    </div>
  );
};

export default Bill;
