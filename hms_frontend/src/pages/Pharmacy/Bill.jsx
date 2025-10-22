import React, { useState } from "react";
import { Search, Trash2, Plus } from "lucide-react";
import { Listbox } from "@headlessui/react";

const Bill = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    patientName: "Watson",
    patientID: "SA875784",
    paymentType: "Full Payment",
    paymentStatus: "Paid",
    paymentMode: "Cash",
  });
  const [filteredPatients, setFilteredPatients] = useState([
    { id: "SA875784", name: "Watson" },
    { id: "SA123456", name: "John Doe" },
    { id: "SA789012", name: "Jane Smith" },
  ]);
  const [billingItems, setBillingItems] = useState([
    { sNo: "1", itemCode: "TAB6789", name: "Glimipride", rackNo: "R8", shelfNo: "C2", quantity: "10", unitPrice: "1200.00", discount: "10%", tax: "10%", total: "1300.00" },
    { sNo: "2", itemCode: "SYR9876", name: "Progesterone", rackNo: "R6", shelfNo: "C1", quantity: "5", unitPrice: "1000.00", discount: "10%", tax: "10%", total: "1100.00" },
    { sNo: "3", itemCode: "AMP2342", name: "Amoxillin", rackNo: "R2", shelfNo: "C3", quantity: "6", unitPrice: "1500.00", discount: "10%", tax: "10%", total: "1650.00" },
    { sNo: "4", itemCode: "EYP7654", name: "Aspirin", rackNo: "R5", shelfNo: "C2", quantity: "3", unitPrice: "900.00", discount: "10%", tax: "10%", total: "990.00" },
    { sNo: "5", itemCode: "TAB6799", name: "Azithromycin-D", rackNo: "R4", shelfNo: "C1", quantity: "8", unitPrice: "700.00", discount: "10%", tax: "10%", total: "770.00" },
  ]);

  const paymentTypes = ["Full Payment", "Partial Payment", "Insurance", "Credit"];
  const paymentStatuses = ["Paid", "Pending", "Overdue", "Refunded"];
  const paymentModes = ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer", "Insurance Claim"];

  const handleInputChange = (value, field) => {
    setPatientInfo({ ...patientInfo, [field]: value });
  };

  const handleAddMedicine = () => {
    setBillingItems((prev) => [
      ...prev,
      {
        sNo: (prev.length + 1).toString(),
        itemCode: "",
        name: "",
        rackNo: "",
        shelfNo: "",
        quantity: "",
        unitPrice: "",
        discount: "",
        tax: "",
        total: "0.00"
      }
    ]);
  };

  const handleBillingChange = (index, field, value) => {
    setBillingItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      const disc = parseFloat(newItems[index].discount.replace("%", "")) || 0;
      const tax = parseFloat(newItems[index].tax.replace("%", "")) || 0;
      const baseTotal = qty * price;
      const discountAmount = (baseTotal * disc) / 100;
      const taxAmount = ((baseTotal - discountAmount) * tax) / 100;
      newItems[index].total = (baseTotal - discountAmount + taxAmount).toFixed(2);
      return newItems;
    });
    recalculateTotals();
  };

  const recalculateTotals = () => {
    const subTotal = billingItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const cgst = (subTotal * 5) / 100;
    const sgst = (subTotal * 5) / 100;
    const discountAmount = billingItems.reduce((sum, item) => {
      const disc = parseFloat(item.discount.replace("%", "")) || 0;
      return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) * disc) / 100;
    }, 0);
    const netAmount = subTotal + cgst + sgst - discountAmount;
    console.log({ subTotal, cgst, sgst, discountAmount, netAmount });
  };

  const handleRemoveItem = (index) => {
    setBillingItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      return newItems.map((item, i) => ({
        ...item,
        sNo: (i + 1).toString()
      }));
    });
    recalculateTotals();
  };

  const handleGenerateBill = () => {
    alert("Bill generated with net amount: 22410.00");
  };

  const handleCancel = () => {
    alert("Bill generation cancelled");
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
          Pharmacy Bill Generation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          This is the information only related to pharmacy department
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
                onChange={(value) => handleInputChange(value, "patientName")}
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
                onChange={(value) => handleInputChange(value, "patientID")}
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
              <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientName}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Patient ID</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value={patientInfo.patientID}
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Age</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="49"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Pharmacy Bill ID</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="THY675842"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Date</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="10-08-2025"
                readOnly
              />
            </div>
          </div>
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Billing Staff</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="Anitha"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Staff ID</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="ST47678"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Patient Type</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="Outpatient"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Address</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="New York, USA"
                readOnly
              />
            </div>
          </div>
          <div className="bg-[#F5F6F5] dark:bg-transparent border-[1.05px] border-[#0EFF7B] dark:border-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B40] dark:shadow-[0px_0px_4px_0px_#FFFFFF1F] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Doctor Name</label>
              <input
                type="text"
                className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-1 text-sm text-[#08994A] dark:text-white"
                value="Keerthana"
                readOnly
              />
              <label className="text-sm text-gray-600 dark:text-gray-300">Payment Type</label>
              <div className="relative">
                <Listbox
                  value={patientInfo.paymentType}
                  onChange={(value) => handleInputChange(value, "paymentType")}
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
                    {patientInfo.paymentType}
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
                    {paymentTypes.map((type) => (
                      <Listbox.Option
                        key={type}
                        value={type}
                        className="
                          cursor-pointer 
                          select-none 
                          p-2 
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
                    {patientInfo.paymentStatus}
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
                    {paymentStatuses.map((status) => (
                      <Listbox.Option
                        key={status}
                        value={status}
                        className="
                          cursor-pointer 
                          select-none 
                          p-2 
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
              <label className="text-sm text-gray-600 dark:text-gray-300">Payment Mode</label>
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
            </div>
          </div>
        </div>
        <div className="bg-[#F5F6F5] dark:bg-transparent border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-xl p-4">
          <h3 className="text-[#08994A] dark:text-[#0EFF7B] mb-3">Billing Information</h3>
          <table className="w-full text-sm text-left">
            <thead className="text-[#08994A] dark:text-[#0EFF7B] bg-gray-200 dark:bg-[#091810]">
              <tr>
                <th className="p-2">S.No</th>
                <th className="p-2">Item code</th>
                <th className="p-2">Name of drugs</th>
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
                      value={item.itemCode}
                      onChange={(e) => handleBillingChange(index, "itemCode", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleBillingChange(index, "name", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.rackNo}
                      onChange={(e) => handleBillingChange(index, "rackNo", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.shelfNo}
                      onChange={(e) => handleBillingChange(index, "shelfNo", e.target.value)}
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
                      value={item.discount}
                      onChange={(e) => handleBillingChange(index, "discount", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.tax}
                      onChange={(e) => handleBillingChange(index, "tax", e.target.value)}
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.total}
                      readOnly
                      className="bg-transparent border border-[#0EFF7B] dark:border-[#0EFF7B1A] p-1 rounded-md w-full text-[#08994A] dark:text-white"
                      style={{ border: "2px solid #0EFF7B1A", boxShadow: "0px 0px 2px 0px #0EFF7B" }}
                    />
                  </td>
                  <td className="p-2">
                    <Trash2 
                      className="w-5 h-5 text-red-500 dark:text-[#0EFF7B] cursor-pointer hover:text-red-600 dark:hover:text-red-600" 
                      onClick={() => handleRemoveItem(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 gap-3">
            <button
              onClick={handleAddMedicine}
              className="flex items-center justify-center border-b-[2px] border-[#0EFF7B] gap-2 w-[200px] h-[40px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] hover:scale-105 transition"
            >
              <Plus size={18} className="text-white" />
              Add
            </button>
          </div>
          <div className="mt-6 grid grid-cols-5 gap-3 text-sm text-gray-600 dark:text-gray-200">
            <div className="col-span-1"></div>
            <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>Sub total</span> <span>{billingItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>CGST (5%)</span> <span>{(billingItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>SGST (5%)</span> <span>{(billingItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-2 text-[#08994A] dark:text-white">
                <span>Discount amount</span> <span>{billingItems.reduce((sum, item) => {
                  const disc = parseFloat(item.discount.replace("%", "")) || 0;
                  return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) * disc) / 100;
                }, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="flex justify-between w-64 bg-[#F5F6F5] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md p-3 text-lg font-semibold text-[#08994A] dark:text-[#0EFF7B]">
              <span>Net Amount</span>
              <span>{(billingItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) * 1.1 - billingItems.reduce((sum, item) => {
                const disc = parseFloat(item.discount.replace("%", "")) || 0;
                return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) * disc) / 100;
              }, 0)).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-[#0EFF7B] dark:border-[#0EFF7B1A] rounded-md text-gray-600 dark:text-gray-300 hover:text-[#08994A] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateBill}
              className="
                flex items-center justify-center
                w-[200px] h-[40px] 
                gap-2
                rounded-[8px]
                border-b-[2px] border-[#0EFF7B]
                bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                text-white font-medium text-[14px]
                hover:scale-105 transition
              "
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;