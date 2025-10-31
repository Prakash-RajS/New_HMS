import React, { useState, useEffect } from "react";
import { Search, Pencil, Plus, Trash, X, Calendar } from "lucide-react";
import { Listbox, Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BillingPreview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const originalPatients = [
    { id: "SAH027/384", name: "Joe Darrington" },
    { id: "SA123456", name: "John Doe" },
    { id: "SA789012", name: "Jane Smith" },
  ];
  const [filteredPatients, setFilteredPatients] = useState(originalPatients);
  const [patientInfo, setPatientInfo] = useState({
    patientName: "Joe Darrington",
    patientID: "SAH027/384",
    ageGender: "45/Male",
    startDate: "01-01-2024",
    endDate: "11-01-2024",
    dateOfBirth: "04-01-1980",
    address: "NewYork, USA",
    roomType: "General",
    doctorName: "Mrs. Keerthana",
    department: "Cardiology",
    billingStaff: "Anitha",
    billingStaffID: "BS001",
    paymentMode: "Cash",
    paymentType: "",
  paymentStatus: "",
    wardNumber: "101",
    bedNumber: "44",
  });
  const [isInsurance, setIsInsurance] = useState(false);
  const [billingItems, setBillingItems] = useState([
    { sNo: "01", description: "Room charge (3 days)", quantity: "5", unitPrice: "1500", amount: "7500" },
    { sNo: "02", description: "Doctor consultation fees", quantity: "1", unitPrice: "500", amount: "500" },
    { sNo: "03", description: "Operation theatre charges", quantity: "1", unitPrice: "1000", amount: "1000" },
    { sNo: "04", description: "Nurse and wardcare", quantity: "1", unitPrice: "2000", amount: "2000" },
    { sNo: "05", description: "Surgeon", quantity: "1", unitPrice: "10000", amount: "10000" },
    { sNo: "06", description: "Medicine and consumables", quantity: "2", unitPrice: "5000", amount: "10000" },
  ]);
  const [insurances, setInsurances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const emptyModal = { provider: "", policyNum: "", validFrom: "", validTo: "", policyCard: "" };
  const [modalData, setModalData] = useState(emptyModal);
  const [editingIndex, setEditingIndex] = useState(null);
  const paymentModes = ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer", "Insurance Claim"];
  const providers = ["Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Kaiser Permanente"];
  const paymentTypes = ["Full Payment", "Partial Payment", "Insurance", "Credit"];
  const paymentStatuses = ["Paid", "Pending", "Overdue", "Refunded"];
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredPatients(
      originalPatients.filter(
        (p) => p.name.toLowerCase().includes(lowerQuery) || p.id.toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery]);

  const handlePatientNameChange = (value) => {
    const patient = filteredPatients.find((p) => p.name === value);
    if (patient) {
      setPatientInfo((prev) => ({ ...prev, patientName: value, patientID: patient.id }));
    }
  };

  const handlePatientIDChange = (value) => {
    const patient = filteredPatients.find((p) => p.id === value);
    if (patient) {
      setPatientInfo((prev) => ({ ...prev, patientID: value, patientName: patient.name }));
    }
  };

  const handleInputChange = (value, field) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handleAddService = () => {
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
  };

  const handleBillingChange = (index, field, value) => {
    setBillingItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].amount = (qty * price).toFixed(2);
      return newItems;
    });
  };

  const handleDeleteBilling = (index) => {
    setBillingItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditInsurance = (index) => {
    setModalData(insurances[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDeleteInsurance = (index) => {
    setInsurances((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOrUpdateInsurance = () => {
    if (editingIndex !== null) {
      setInsurances((prev) =>
        prev.map((ins, i) => (i === editingIndex ? modalData : ins))
      );
    } else {
      setInsurances((prev) => [...prev, modalData]);
    }
    setShowModal(false);
    setEditingIndex(null);
    setModalData(emptyModal);
  };

  const subtotal = billingItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
  const taxRate = 0.18;
  const tax = (subtotal * taxRate).toFixed(2);
  const grand = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  const handleGenerateBill = () => {
    alert(`Bill generated with grand total: ${grand}`);
  };

  return (
    <div className="w-full max-w-screen-2xl mb-4 mx-auto">
      <div
        className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative"
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
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
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
        <div className="mb-6 flex flex-row justify-end items-center gap-2 flex-wrap max-w-full">
          <div className="flex-1 min-w-[180px] max-w-[350px] lg:max-w-[400px]">
            <input
              type="text"
              placeholder="Search patient name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full
                h-[34px]
                p-[4.19px_16.75px]
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
                  {patientInfo.patientName}
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
                  {patientInfo.patientID}
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
            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                h-[33.5px]
                px-3
                rounded-[8.38px]
                bg-[#F5F6F5] dark:bg-[#0EFF7B]
                text-[#08994A] dark:text-black
                font-medium
                shadow-[0_0_4px_#0EFF7B]
                hover:bg-[#0EFF7B1A] dark:hover:bg-[#05c860]
                hover:text-[#08994A] dark:hover:text-white
                transition-all
                duration-300
                font-helvetica
                min-w-[40px]
              "
            >
              <Search className="w-4 h-4 text-[#08994A] dark:text-black" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Patient ID</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientID}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Patient Name</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientName}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Age/Gender</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.ageGender}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Admission Start</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.startDate}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Admission End</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.endDate}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Date of Birth</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.dateOfBirth}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Address</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.address}
                readOnly
              />
            </div>
          </div>
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Room Type</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.roomType}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Doctor Name</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.doctorName}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Department</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.department}
                readOnly
              />
              
              <label className="text-sm text-gray-600 dark:text-gray-300">Payment mode</label>
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
              <label className="text-sm text-gray-600 dark:text-gray-300">Payment Type</label>
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
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
              <label className="text-sm text-gray-600 dark:text-gray-300">Payment Status</label>
<div className="relative">
  <Listbox
    value={patientInfo.paymentStatus}
    onChange={(value) => handleInputChange(value, "paymentStatus")}
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
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
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Billing Staff</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.billingStaff}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Billing Staff ID</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.billingStaffID}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Ward number</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.wardNumber}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Bed number</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.bedNumber}
                readOnly
              />
            </div>
            {/* INSURANCE SECTION WITH BORDER */}
<div
  className="col-span-2 mt-4 p-2 rounded-[10px] flex flex-col gap-4"
  style={{
    border: "1.05px solid #3C3C3C",
    boxShadow: "0px 0px 2.09px 0px #0EFF7B",
  }}
>
  {/* Question + Toggles + Add Insurance Inline */}
  <div className="flex flex-wrap items-center justify-between gap-4">
    <span className="text-sm text-gray-600 dark:text-gray-300">
      Is this bill being processed with Insurance?
    </span>

    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      {/* Yes Toggle */}
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

      {/* No Toggle */}
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

      {/* Add Insurance Link - Only if Yes */}
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



  {/* Table below */}
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
        <div className="bg-[#F5F6F5] dark:bg-transparent border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-xl p-4">
          <h3 className="text-[#08994A] dark:text-[#0EFF7B] mb-3">Treatment & charges</h3>
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
                <tr key={index} className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]">
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.sNo}
                      readOnly
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleBillingChange(index, "description", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleBillingChange(index, "quantity", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleBillingChange(index, "unitPrice", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.amount}
                      readOnly
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    {/* <Pencil
                      className="w-5 h-5 text-[#0EFF7B] cursor-pointer"
                      onClick={() => {}}
                    /> */}
                    <Trash
                      className="w-5 h-5  text-red-500 dark:text-[#0EFF7B] cursor-pointer"
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
          <div className="flex justify-end items-center mt-6 pr-4 gap-4 w-full overflow-x-hidden no-scrollbar">
  {/* ==== LEFT TOTAL BOX ==== */}
  <div
    className="flex items-center border border-[#0EFF7B] rounded-[8px] overflow-hidden min-w-[404.31px] max-w-[744.31px]"
    style={{
      height: "103px",
      backgroundColor: "#0B0B0B",
    }}
  >
    {/* Left side (Subtotal + Tax) */}
    <div className="flex flex-col justify-center flex-1 pl-5 pr-6 py-3 text-sm font-medium text-white gap-2">
      <div className="flex justify-between w-full">
        <span>Subtotal:</span>
        <span className="text-[#FFB100] font-semibold">${"36,000"}</span>
      </div>
      <div className="flex justify-between w-full">
        <span>Tax (18%):</span>
        <span className="text-[#FFB100] font-semibold">${"1,500"}</span>
      </div>
    </div>

    {/* Divider Line */}
    <div
      className="h-full w-[2px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(14,255,123,0.1) 0%, #0EFF7B 50%, rgba(14,255,123,0.1) 100%)",
      }}
    ></div>

    {/* Right side (Grand Total) */}
    <div className="flex flex-col justify-center px-6 py-3 bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-right h-full min-w-[120px]">
      <span className="text-white text-sm font-semibold">Grand</span>
      <span className="text-[#0EFF7B] text-lg font-bold">${"37,500"}</span>
    </div>
  </div>

  {/* ==== BUTTON GROUP ==== */}
  <div className="flex items-center gap-3 flex-nowrap">
    {["Print", "Export PDF", "Generate"].map((label) => (
      <button
        key={label}
        className={`text-white border border-[#0EFF7B] rounded-[20px] text-sm font-medium transition-transform hover:scale-105 whitespace-nowrap`}
        style={{
          width: "136px",
          height: "40px",
          paddingTop: "4px",
          paddingRight: "12px",
          paddingBottom: "4px",
          paddingLeft: "12px",
          gap: "4px",
          background:
            label === "Generate"
              ? "linear-gradient(90deg, #025126 0%, #0D7F41 50%, #025126 100%)"
              : "transparent",
        }}
        onClick={label === "Generate" ? handleGenerateBill : undefined}
      >
        {label}
      </button>
    ))}
  </div>
</div>

        </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div
      className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
    >
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

        {/* Header */}
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

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Provider */}
          <div>
            <label className="text-sm text-black dark:text-white block mb-1">
              Insurance Provider
            </label>
            <Listbox
              value={modalData.provider}
              onChange={(v) => setModalData({ ...modalData, provider: v })}
            >
              <Listbox.Button
                className="w-full h-[33px] mt-1 px-3 rounded-[8px] border border-[#0EFF7B] dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] relative"
              >
                {modalData.provider || "Select Provider"}
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#08994A] dark:text-[#0EFF7B] pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
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

          {/* Policy Number */}
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

          {/* Valid From */}
          <div>
            <label className="text-sm text-black dark:text-white block mb-1">
              Valid From
            </label>
            <div className="relative mt-1">
              <DatePicker
                selected={modalData.validFrom ? new Date(modalData.validFrom) : null}
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

          {/* Valid To */}
          <div>
            <label className="text-sm text-black dark:text-white block mb-1">
              Valid To
            </label>
            <div className="relative mt-1">
              <DatePicker
                selected={modalData.validTo ? new Date(modalData.validTo) : null}
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

          {/* Upload */}
          {/* Upload Policy Card */}
{/* Upload Policy Card */}
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
      Selected: {modalData.policyCard.name}
    </p>
  )}
</div>

        </div>

        {/* Buttons */}
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
  <Plus
    size={16}
    className="text-white dark:text-white"
  />
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