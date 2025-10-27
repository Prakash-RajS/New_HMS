import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function ViewPatientProfile() {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicineData, setMedicineData] = useState([
    {
      id: Date.now(),
      medicineName: "Amoxicillin",
      dosage: "500 mg",
      quantity: "20",
      frequency: "Morning",
      duration: "15 days",
      time: "8:00 AM",
    },
  ]);
  const [labTests, setLabTests] = useState([
    { id: Date.now(), labTest: "Blood test" },
  ]);
  const [medicineHistory, setMedicineHistory] = useState(() => {
    const savedHistory = localStorage.getItem("medicineHistory");
    return savedHistory
      ? JSON.parse(savedHistory)
      : [
          {
            patientName: "Watson",
            patientID: "SAH257384",
            department: "Cardiology",
            doctor: "Dr. Smith",
            date: "16-07-2025",
            medicine: "Amoxicillin",
            dosage: "500 mg",
            duration: "5 days",
          },
          {
            patientName: "Watson",
            patientID: "SAH257384",
            department: "Cardiology",
            doctor: "Dr. Smith",
            date: "26-05-2025",
            medicine: "Metformin",
            dosage: "10 mg",
            duration: "10 days",
          },
          {
            patientName: "Watson",
            patientID: "SAH257384",
            department: "Cardiology",
            doctor: "Dr. Smith",
            date: "04-04-2025",
            medicine: "Paracetamol",
            dosage: "100 mg",
            duration: "30 days",
          },
          {
            patientName: "Watson",
            patientID: "SAH257384",
            department: "Cardiology",
            doctor: "Dr. Smith",
            date: "01-03-2024",
            medicine: "Paracetamol",
            dosage: "100 mg",
            duration: "5 days",
          },
        ];
  });

  const [patientInfo, setPatientInfo] = useState({
    patientName: "Watson",
    patientID: "SAH257384",
    department: "Cardiology",
  });

  const patients = [
    { name: "Watson", id: "SAH257384" },
    { name: "Smith", id: "SAH123456" },
    { name: "Johnson", id: "SAH789012" },
  ];

  useEffect(() => {
    localStorage.setItem("medicineHistory", JSON.stringify(medicineHistory));
  }, [medicineHistory]);

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "medicine") {
      setMedicineData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], [name]: value };
        return newData;
      });
    } else if (type === "labTest") {
      setLabTests((prev) => {
        const newTests = [...prev];
        newTests[index] = { ...newTests[index], [name]: value };
        return newTests;
      });
    } else {
      setPatientInfo((prev) => {
        const updatedData = { ...prev, [name]: value };
        if (name === "patientName") {
          const patient = patients.find((p) => p.name === value);
          if (patient) updatedData.patientID = patient.id;
        } else if (name === "patientID") {
          const patient = patients.find((p) => p.id === value);
          if (patient) updatedData.patientName = patient.name;
        }
        return updatedData;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHistoryEntries = medicineData.map((med) => ({
      patientName: patientInfo.patientName,
      patientID: patientInfo.patientID,
      department: patientInfo.department,
      doctor: "Dr. Smith",
      date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      medicine: med.medicineName,
      dosage: med.dosage,
      duration: med.duration,
    }));

    setMedicineHistory((prev) => [...newHistoryEntries, ...prev]);
    handleClear();
  };

  const handleClear = () => {
    setPatientInfo({
      patientName: "Watson",
      patientID: "SAH257384",
      department: "Cardiology",
    });
    setMedicineData([
      {
        id: Date.now(),
        medicineName: "Amoxicillin",
        dosage: "500 mg",
        quantity: "20",
        frequency: "Morning",
        duration: "15 days",
        time: "8:00 AM",
      },
    ]);
    setLabTests([{ id: Date.now(), labTest: "Blood test" }]);
    setSearchQuery("");
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reusable Listbox Dropdown Component
  const Dropdown = ({ label, placeholder, value, onChange, options, name, index, type }) => (
    <div>
      <label className="block text-sm font-medium mb-1 text-black dark:text-white capitalize">
        {label}
      </label>
      <Listbox
        value={value}
        onChange={(val) => {
          const fakeEvent = { target: { name, value: val } };
          if (type === "medicine") handleInputChange(fakeEvent, index, "medicine");
          else if (type === "labTest") handleInputChange(fakeEvent, index, "labTest");
          else if (type === "patient") handleInputChange(fakeEvent, null, "patient");
        }}
      >
        <div className="relative mt-1 w-full">
          <Listbox.Button
            className="
              w-full h-[33.5px] px-3 pr-8 rounded-[8.38px] border-[1.05px] 
              border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black 
              text-black dark:text-white text-left text-sm 
              shadow-[0_0_2.09px_#0EFF7B] outline-none 
              focus:border-[#0EFF7B] focus:shadow-[0_0_4px_#0EFF7B] 
              transition-all duration-300 font-helvetica
            "
          >
            <span className="block truncate">{value || placeholder}</span>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className="
              absolute mt-1 w-full max-h-60 overflow-auto rounded-[8px] 
              bg-white dark:bg-black shadow-lg z-[100] border border-gray-300 dark:border-[#3C3C3C]
              scrollbar-hide
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active, selected }) =>
                  `
                    cursor-pointer select-none py-2 px-3 text-sm rounded-md font-helvetica
                    ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-black dark:text-white"}
                    ${selected ? "font-medium text-[#0EFF7B]" : ""}
                  `
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  return (
    <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
     bg-white dark:bg-transparent overflow-hidden relative"
    >
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
      {/* Gradient Border */}
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
      {/* Search Bar with Dropdowns */}
      <div className="mb-6 mt-7 flex flex-row justify-end items-center gap-2 flex-wrap max-w-full">
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
              border-[#0EFF7B1A] 
              bg-[#0EFF7B1A] 
              text-black dark:text-white 
              placeholder:text-gray-500 dark:placeholder:text-white/70 
              focus:outline-none 
              focus:border-[#0EFF7B]
              transition-all
              font-helvetica
            "
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="min-w-[120px] w-[160px] lg:w-[180px]">
            <Dropdown
              label=""
              placeholder="Select Patient"
              value={patientInfo.patientName}
              onChange={() => {}}
              options={filteredPatients.map(p => p.name)}
              name="patientName"
              type="patient"
            />
          </div>
          <div className="min-w-[120px] w-[160px] lg:w-[180px]">
            <Dropdown
              label=""
              placeholder="Select ID"
              value={patientInfo.patientID}
              onChange={() => {}}
              options={filteredPatients.map(p => p.id)}
              name="patientID"
              type="patient"
            />
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
              bg-[#0EFF7B] 
              text-black 
              font-medium 
              shadow-[0_0_4px_#0EFF7B]
              hover:bg-[#05c860]
              hover:text-white
              transition-all
              duration-300
              font-helvetica
              min-w-[40px]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* View Patient Profile Information */}
      <div className="mb-8 p-4 sm:p-5 bg-white dark:bg-black flex flex-col lg:flex-row items-center justify-between text-black dark:text-white font-helvetica max-w-full">
        <div className="flex flex-col items-center text-center w-full lg:w-[146px] mb-4 lg:mb-0">
          <div className="rounded-full w-[94px] h-[94px] flex items-center justify-center mb-3 shadow-[#0EFF7B4D] border border-[#0EFF7B]">
            <svg
              className="w-[60px] h-[60px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
          </div>
          <span className="text-[#0EFF7B] text-[18px] font-semibold font-helvetica">
            Mrs. Watson
          </span>
          <span className="text-[14px] text-gray-500 dark:text-gray-400 font-helvetica">
            ID: SAH257384
          </span>
          <span className="text-[14px] text-gray-500 dark:text-gray-400 font-helvetica">
            watson22@gmail.com
          </span>
        </div>
        <div className="hidden lg:block h-[120px] w-[1.5px] bg-[#0EFF7B] mx-4"></div>
        <div className="flex-1 flex flex-col mt-4 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 text-[14px]">
            {[
              { label: "Gender", value: "Female" },
              { label: "Age", value: "28" },
              { label: "Blood Group", value: "A+ve" },
              { label: "Department", value: "Cardiology" },
              { label: "Bed Number", value: "RM 325" },
              { label: "Consultant type", value: "In-patient" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="w-[100px] sm:w-[110px] h-[18px] font-helvetica text-[15px] leading-[100%] text-center text-[#0EFF7B]">
                  {item.label}
                </span>
                <div className="w-[100px] sm:w-[110px] h-[16px] font-helvetica text-[13px] leading-[100%] text-center bg-white dark:bg-black text-black dark:text-white mt-1 px-2 py-1 rounded">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <button className="flex items-center justify-between w-[220px] h-[38px] bg-[#0EFF7B1A] rounded-[4px] px-3 text-sm text-black dark:text-white hover:bg-[#0EFF7B] hover:text-white transition font-helvetica">
              <span className="text-[15px] w-[calc(100%-34px)]">
                View more information
              </span>
              <div className="w-[18px] h-[18px] bg-[#0EFF7B] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-[10px] h-[10px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="hidden lg:block h-[120px] w-[1.5px] bg-[#0EFF7B] mx-4"></div>
        <div className="text-[14px] flex justify-center gap-3 sm:gap-6 mt-4 lg:mt-0">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-black dark:text-white font-helvetica text-[14px]">
                Blood Pressure
              </span>
              <span className="text-[#0EFF7B] font-semibold font-helvetica text-[14px]">
                120/80 <span className="text-black dark:text-white">mmHg</span>
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-black dark:text-white font-helvetica text-[14px]">
                Heart Rate
              </span>
              <span className="text-[#0EFF7B] font-semibold font-helvetica text-[14px]">
                102 <span className="text-black dark:text-white">bpm</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-black dark:text-white font-helvetica text-[14px]">
              Temperature
            </span>
            <span className="text-[#0EFF7B] font-semibold font-helvetica text-[14px]">
              98.4°F
            </span>
          </div>
        </div>
      </div>

      {/* Medicine Allocation Form */}
      <div
        className="mt-8 mb-4 rounded-xl p-4 w-full max-w-[100%] sm:max-w-[900px] lg:max-w-[1200px] mx-auto flex flex-col relative overflow-visible bg-white dark:bg-black text-black dark:text-white z-10"
        style={{
          border: "1px solid #0EFF7B1A",
          backdropFilter: "blur(4px)",
          boxShadow: "0px 0px 4px 0px #0000001F",
        }}
      >
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden z-[-1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          }}
        ></div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-[#FFFFFF] font-helvetica">
          Medicine Allocation
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <Dropdown
              label="Patient Name"
              placeholder="Select patient"
              value={patientInfo.patientName}
              options={patients.map(p => p.name)}
              name="patientName"
              type="patient"
            />
            <Dropdown
              label="Patient ID"
              placeholder="Select ID"
              value={patientInfo.patientID}
              options={patients.map(p => p.id)}
              name="patientID"
              type="patient"
            />
            <Dropdown
              label="Department"
              placeholder="Select department"
              value={patientInfo.department}
              options={["Cardiology", "Neurology", "Orthopedics"]}
              name="department"
              type="patient"
            />
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
                        className="text-green-500 hover:text-green-600 text-xl"
                      >
                        +
                      </button>
                    )}
                    {medicineData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineEntry(med.id)}
                        className="text-red-500 hover:text-red-700 text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Medicine Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: "Medicine Name", name: "medicineName", options: ["Amoxicillin", "Paracetamol", "Cefixime", "Ibuprofen"] },
                    { label: "Dosage", name: "dosage", options: ["250 mg", "500 mg", "750 mg"] },
                    { label: "Quantity", name: "quantity", options: ["10", "20", "30", "50"] },
                    { label: "Frequency", name: "frequency", options: ["Morning", "Afternoon", "Evening", "Night"] },
                    { label: "Duration", name: "duration", options: ["5 days", "10 days", "15 days", "30 days"] },
                    { label: "Time", name: "time", options: ["8:00 AM", "12:00 PM", "6:00 PM", "8:00 PM"] },
                  ].map((field) => (
                    <Dropdown
                      key={field.name}
                      label={field.label}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      value={med[field.name]}
                      options={field.options}
                      name={field.name}
                      index={index}
                      type="medicine"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Lab Tests */}
          <div className="mt-6">
            <h4 className="font-medium text-[#0EFF7B] mb-2">Lab Tests</h4>
            {labTests.map((test, index) => (
              <div key={test.id} className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <Dropdown
                    label=""
                    placeholder="Select Lab Test"
                    value={test.labTest}
                    options={["Blood Test", "Urine Test", "X-Ray", "MRI"]}
                    name="labTest"
                    index={index}
                    type="labTest"
                  />
                </div>
                {index === labTests.length - 1 && (
                  <button
                    type="button"
                    onClick={addLabTestEntry}
                    className="text-green-500 hover:text-green-600 text-xl"
                  >
                    +
                  </button>
                )}
                {labTests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLabTestEntry(test.id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="mt-5 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0EFF7B] text-black font-semibold hover:bg-[#05c860]"
            >
              Allocate Medicine
            </button>
          </div>
        </form>
      </div>

      {/* Medicine Allocation History */}
      <div
        className="mt-8 mb-4 rounded-xl p-4 w-full max-w-[100%] sm:max-w-[900px] lg:max-w-[1200px] mx-auto flex flex-col relative overflow-visible bg-white dark:bg-black text-black dark:text-white"
        style={{
          border: "1px solid #0EFF7B1A",
          backdropFilter: "blur(4px)",
          boxShadow: "0px 0px 4px 0px #0000001F",
        }}
      >
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden z-[-1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          }}
        ></div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-[#FFFFFF] font-helvetica">
          Medicine allocation history
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse font-helvetica text-[13px] sm:text-[14px]">
            <thead className="text-[#0EFF7B] font-helvetica dark:bg-[#091810] border-b border-gray-300 dark:border-gray-700">
              <tr className="text-left text-[#0EFF7B] border border-gray-300 dark:border-[#3C3C3C] text-center">
                <th className="py-1.5 px-2 sm:px-3">Patient Name</th>
                <th className="py-1.5 px-2 sm:px-3">Patient ID</th>
                <th className="py-1.5 px-2 sm:px-3">Department</th>
                <th className="py-1.5 px-2 sm:px-3">Doctor</th>
                <th className="py-1.5 px-2 sm:px-3">Date</th>
                <th className="py-1.5 px-2 sm:px-3">Medicine</th>
                <th className="py-1.5 px-2 sm:px-3">Dosage</th>
                <th className="py-1.5 px-2 sm:px-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {medicineHistory.map((item, index) => (
                <tr
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 text-center text-black dark:text-[#FFFFFF] hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-black"
                >
                  <td className="py-1.5 px-2 sm:px-3">{item.patientName}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.patientID}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.department}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.doctor}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.date}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.medicine}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.dosage}</td>
                  <td className="py-1.5 px-2 sm:px-3">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}