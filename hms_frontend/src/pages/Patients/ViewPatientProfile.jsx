import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import BP from "../../assets/BP.png";
import HR from "../../assets/HR.png";
import GL from "../../assets/GL.png";
import CL from "../../assets/CL.png";
import {
  ClipboardList,
  FileText,
  Receipt,
  TestTube2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ViewPatientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Diagnosis");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPrescriptionPage, setCurrentPrescriptionPage] = useState(1);

  const itemsPerPage = 10;

  // Diagnosis Data
  const diagnoses = [
    {
      reportType: "CT Scan",
      date: "10 Apr 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "Completed",
    },
    {
      reportType: "Blood Test",
      date: "11 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "Pending",
    },
    {
      reportType: "Blood Analysis",
      date: "11 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "Cancelled",
    },
    {
      reportType: "Vascular Sonography",
      date: "10 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "Completed",
    },
  ];

  const totalDiagnosisPages = Math.ceil(diagnoses.length / itemsPerPage);
  const currentDiagnoses = diagnoses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Prescription Data
  const prescriptions = [
    {
      date: "12 Apr 2025",
      prescription: "Paracetamol 500mg",
      dosage: "1 Tablet",
      timing: "Morning & Night",
      status: "Completed",
    },
    {
      date: "13 Apr 2025",
      prescription: "Amoxicillin 250mg",
      dosage: "2 Capsules",
      timing: "After Lunch",
      status: "Pending",
    },
    {
      date: "14 Apr 2025",
      prescription: "Vitamin D3",
      dosage: "1 Capsule",
      timing: "Morning",
      status: "Cancelled",
    },
  ];

  const testReports = [
    {
      dateTime: "2025-04-10 09:45 AM",
      month: "April",
      testType: "Blood Sugar Test",
      department: "Pathology",
      status: "Completed",
    },
    {
      dateTime: "2025-05-15 11:20 AM",
      month: "May",
      testType: "X-Ray",
      department: "Radiology",
      status: "Pending",
    },
    {
      dateTime: "2025-06-20 10:15 AM",
      month: "June",
      testType: "MRI Scan",
      department: "Radiology",
      status: "Cancelled",
    },
  ];

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTests = testReports.filter(
    (t) =>
      (selectedMonth === "All" || t.month === selectedMonth) &&
      (selectedDepartment === "All" || t.department === selectedDepartment) &&
      (selectedStatus === "All" || t.status === selectedStatus)
  );
  const [currentTestPage, setCurrentTestPage] = useState(1);
  const totalTestPages = Math.ceil(filteredTests.length / itemsPerPage);
  const currentTests = filteredTests.slice(
    (currentTestPage - 1) * itemsPerPage,
    currentTestPage * itemsPerPage
  );

  const totalPrescriptionPages = Math.ceil(prescriptions.length / itemsPerPage);
  const currentPrescriptions = prescriptions.slice(
    (currentPrescriptionPage - 1) * itemsPerPage,
    currentPrescriptionPage * itemsPerPage
  );

  return (
    <div
      className="mt-[60px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-6 w-full max-w-[1400px] mx-auto"
      style={{ fontFamily: "Helvetica, sans-serif" }}
    >
      {/* Back Button */}
      <button
        onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/patients");
          }
        }}
        className="w-[92px] h-[40px] rounded-[8px] py-2 px-3 border-b border-[#0EFF7B] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition mb-6"
      >
        ← Back
      </button>
      {/* Profile Card */}
      <div
        className="relative mb-8 w-[1097px] h-[255px] flex flex-col md:flex-row items-center md:items-start text-black dark:text-white rounded-[12px] p-[24px] md:px-[45px] shadow-[0_0_4px_0_#FFFFFF1F] bg-white dark:bg-[#0D0D0D] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 56, 27, 0.25) 0%, rgba(15, 15, 15, 0.25) 48.97%)",
          border: "1px solid",
          borderImageSource:
            "linear-gradient(132.3deg, rgba(14, 255, 123, 0.7) 0%, rgba(30, 30, 30, 0.7) 49.68%, rgba(14, 255, 123, 0.7) 99.36%)",
          borderImageSlice: 1,
          backdropFilter: "blur(4px)",
        }}
      >
        {" "}
        {/* Avatar Section */}{" "}
        <div className="w-[146px] h-[187px] flex-shrink-0 flex flex-col gap-[4px] items-center pr-2 md:mr-[65px] ml-3">
          {" "}
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-3">
            {" "}
            <svg
              className="w-[94px] h-[94px] text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {" "}
              <circle cx="12" cy="8" r="4" />{" "}
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />{" "}
            </svg>{" "}
          </div>{" "}
          <span className="text-[#08994A] dark:text-[##0EFF7B] text-[18px] font-medium">
            {" "}
            Mrs. Watson{" "}
          </span>{" "}
          <span className="text-[14px] text-gray-600 dark:text-[#A0A0A0]">
            {" "}
            ID: SAH257384{" "}
          </span>{" "}
          <span className="text-[14px] text-gray-600 dark:text-[#A0A0A0]">
            {" "}
            watson22@gmail.com{" "}
          </span>{" "}
          <button className="mt-1 text-[#08994A] dark:text-blue-400 underline text-xs hover:text-green-800 dark:hover:text-blue-300">
            {" "}
            Edit{" "}
          </button>{" "}
        </div>{" "}
        <div className="w-[1px] h-[187px] bg-gray-300 dark:bg-[#A0A0A0] mr-6"></div>{" "}
        {/* Info Section */}{" "}
        <div className="w-[761px] h-[200px] md:ml-12 ml-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-6 md:mt-0">
          {" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              Gender
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">Female</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">Age</p>{" "}
            <p className="text-[14px] text-black dark:text-white">28</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Blood Group{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">A+ve</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Phone number{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              {" "}
              +91 62742 xxxxx{" "}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              Status
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">Normal</p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Department{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              Cardiology
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Admission date{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              {" "}
              20 July 2025{" "}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Bed Number{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              RM 325
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Visiting Doctor{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              Dr. Sravan
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-[16px] text-[#0EFF7B] font-semibold">
              {" "}
              Consultation type{" "}
            </p>{" "}
            <p className="text-[14px] text-black dark:text-white">
              In-patient
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* Vitals Section */}{" "}
      <div className="mb-8">
        {" "}
        <h1 className="text-black dark:text-white text-xl font-semibold mb-4">
          {" "}
          Patient Current Vitals{" "}
        </h1>{" "}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {" "}
          {/* Blood Pressure */}{" "}
          <div
            className="w-[225px] h-[88px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#0EFF7B66] rounded-[8px] flex items-center justify-between px-4 gap-3"
            style={{
              backgroundColor: "rgba(14, 255, 123, 0.02)",
              fontFamily: "Helvetica, sans-serif",
            }}
          >
            {" "}
            <img
              src={BP}
              alt="Blood Pressure Icon"
              className="w-[45px] h-[45px] object-contain"
            />{" "}
            <div className="flex flex-col justify-center items-end space-y-1.5">
              {" "}
              <span className="text-[18px] text-white font-medium">
                {" "}
                Blood Pressure{" "}
              </span>{" "}
              <span className="text-[22px] text-[#0EFF7B] font-bold leading-none relative">
                {" "}
                120/89{" "}
                <span className="text-[18px] text-white font-normal ml-1 relative -top-1">
                  {" "}
                  mmHg{" "}
                </span>{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Heart Rate */}{" "}
          <div
            className="w-[225px] h-[88px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#0EFF7B66] rounded-[8px] flex items-center justify-between px-4 gap-3"
            style={{
              backgroundColor: "rgba(14, 255, 123, 0.02)",
              fontFamily: "Helvetica, sans-serif",
            }}
          >
            {" "}
            <img
              src={HR}
              alt="Heart Rate Icon"
              className="w-[45px] h-[45px] object-contain"
            />{" "}
            <div className="flex flex-col justify-center items-end space-y-1.5">
              {" "}
              <span className="text-[18px] text-white font-medium">
                {" "}
                Heart Rate{" "}
              </span>{" "}
              <span className="text-[28px] text-[#0EFF7B] font-bold leading-none relative">
                {" "}
                120{" "}
                <span className="text-[18px] text-white font-normal ml-1 relative -top-1">
                  {" "}
                  BPM{" "}
                </span>{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Glucose */}{" "}
          <div
            className="w-[225px] h-[88px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#0EFF7B66] rounded-[8px] flex items-center justify-between px-4 gap-3"
            style={{
              backgroundColor: "rgba(14, 255, 123, 0.02)",
              fontFamily: "Helvetica, sans-serif",
            }}
          >
            {" "}
            <img
              src={GL}
              alt="Glucose Icon"
              className="w-[45px] h-[45px] object-contain"
            />{" "}
            <div className="flex flex-col justify-center items-end space-y-1.5">
              {" "}
              <span className="text-[18px] text-white font-medium">
                {" "}
                Glucose{" "}
              </span>{" "}
              <span className="text-[28px] text-[#0EFF7B] font-bold leading-none relative">
                {" "}
                97{" "}
                <span className="text-[18px] text-white font-normal ml-1 relative -top-1">
                  {" "}
                  mg/dl{" "}
                </span>{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Cholesterol */}{" "}
          <div
            className="w-[225px] h-[88px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#0EFF7B66] rounded-[8px] flex items-center justify-between px-4 gap-3"
            style={{
              backgroundColor: "rgba(14, 255, 123, 0.02)",
              fontFamily: "Helvetica, sans-serif",
            }}
          >
            {" "}
            <img
              src={CL}
              alt="Cholesterol Icon"
              className="w-[45px] h-[45px] object-contain"
            />{" "}
            <div className="flex flex-col justify-center items-end space-y-1.5">
              {" "}
              <span className="text-[18px] text-white font-medium">
                {" "}
                Cholesterol{" "}
              </span>{" "}
              <span className="text-[28px] text-[#0EFF7B] font-bold leading-none relative">
                {" "}
                85{" "}
                <span className="text-[18px] text-white font-normal ml-1 relative -top-1">
                  {" "}
                  mg/dl{" "}
                </span>{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* Tabs Section */}
      <div
        className="border rounded-lg shadow p-4 text-black dark:text-white"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 56, 27, 0.25) 0%, rgba(15, 15, 15, 0.25) 48.97%)",
          border: "1px solid",
          borderImageSource:
            "linear-gradient(132.3deg, rgba(14, 255, 123, 0.7) 0%, rgba(30, 30, 30, 0.7) 49.68%, rgba(14, 255, 123, 0.7) 99.36%)",
          borderImageSlice: 1,
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Tabs */}
        <div className="w-full overflow-x-auto h-[50px] flex items-center justify-center mb-8 px-2 relative z-10">
          <div
            className="flex justify-between gap-[111px] min-w-[1040px] mx-auto"
            style={{ maxWidth: "1040px" }}
          >
            {[
              { name: "Diagnosis", icon: ClipboardList },
              { name: "Prescription", icon: FileText },
              { name: "Invoice", icon: Receipt },
              { name: "Test Reports", icon: TestTube2 },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`relative w-[180px] h-[40px] flex items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-all border-b-[1px] gradient-border
                ${
                  activeTab === name
                    ? "bg-[#08994A] text-white"
                    : "text-gray-800 hover:text-green-600 dark:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={`${
                    activeTab === name
                      ? "text-white"
                      : "text-gray-700 dark:text-white"
                  }`}
                />
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnosis Tab */}
        {activeTab === "Diagnosis" && (
          <div className="overflow-x-auto rounded-xl p-4 mb-4 bg-transparent">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px] mb-4">
              Patient’s diagnosis information.
            </p>
            <table className="min-w-full border-separate border-spacing-x-1 bg-transparent">
              <thead>
                <tr className="text-left text-[16px] text-[#08994A] dark:text-[#0EFF7B] border-b border-gray-300 dark:border-gray-700">
                  <th className="py-3">Report Type</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-[16px] text-black dark:text-white">
                {currentDiagnoses.map((diagnosis, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-4">{diagnosis.reportType}</td>
                    <td className="py-4">{diagnosis.date}</td>
                    <td className="py-4">{diagnosis.description}</td>
                    <td className="py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${
                          diagnosis.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : diagnosis.status === "Pending"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : diagnosis.status === "Cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {diagnosis.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center mt-4 gap-x-4">
              <div className="text-sm text-black dark:text-white">
                Page {currentPage} of {totalDiagnosisPages}
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-full border border-[#0EFF7B]"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(totalDiagnosisPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === totalDiagnosisPages}
                  className="p-1 rounded-full border border-[#0EFF7B]"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prescription Tab */}
        {activeTab === "Prescription" && (
          <div className="overflow-x-auto rounded-xl p-4 mb-4 bg-transparent">
            <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px] mb-4">
              Patient’s prescription details.
            </p>
            <table className="min-w-full border-separate border-spacing-x-1 bg-transparent">
              <thead>
                <tr className="text-left text-[16px] text-[#08994A] dark:text-[#0EFF7B] border-b border-gray-300 dark:border-gray-700">
                  <th className="py-3">Date</th>
                  <th className="py-3">Prescription</th>
                  <th className="py-3">Dosage</th>
                  <th className="py-3">Timing</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody className="text-[16px] text-black dark:text-white">
                {currentPrescriptions.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-4">{item.date}</td>
                    <td className="py-4">{item.prescription}</td>
                    <td className="py-4">{item.dosage}</td>
                    <td className="py-4">{item.timing}</td>
                    <td className="py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                        ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : item.status === "Pending"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : item.status === "Cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center mt-4 gap-x-4">
              <div className="text-sm text-black dark:text-white">
                Page {currentPrescriptionPage} of {totalPrescriptionPages}
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() =>
                    setCurrentPrescriptionPage(
                      Math.max(1, currentPrescriptionPage - 1)
                    )
                  }
                  disabled={currentPrescriptionPage === 1}
                  className="p-1 rounded-full border border-[#0EFF7B]"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPrescriptionPage(
                      Math.min(
                        totalPrescriptionPages,
                        currentPrescriptionPage + 1
                      )
                    )
                  }
                  disabled={currentPrescriptionPage === totalPrescriptionPages}
                  className="p-1 rounded-full border border-[#0EFF7B]"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder Tabs */}
        {activeTab === "Invoice" && (
          <div className="overflow-x-auto rounded-xl p-4 mb-4 bg-transparent">
            {/* Top Section: Patient & Doctor Info */}
            <div className="mt-4 text-black dark:text-white">
              <p>Invoice Number</p>
              <p>#123456</p>
            </div>
            <div className="flex flex-col lg:flex-row justify-between mb-6 gap-6">
              {/* Left Column: Patient Info */}
              <div className="flex-1 border-l-2 border-[#0EFF7B] pl-4">
                <p className="text-[#0EFF7B] font-semibold mb-2">
                  PATIENT INFORMATION
                </p>
                <p className="text-black dark:text-white">Harry Wilson</p>
                <p className="text-black dark:text-white">
                  11 Rosewood Drive, New York, NY 45568
                </p>
                <p className="text-black dark:text-white">(555) 595-5999</p>
              </div>
              <div className="mt-4 text-gray-700 dark:text-gray-300 lg:mt-0 lg:mx-6">
                <p>Date issued: MM/DD/YYYY</p>
                <p>Age/gender: 45/Male</p>
                <p>Admission: MM/DD/YYYY</p>
              </div>
              {/* Right Column: Doctor Info & Meta */}
              <div className="flex-1 border-l-2 border-[#0EFF7B] pl-4">
                <p className="text-[#0EFF7B] font-semibold mb-2">
                  DOCTOR INFORMATION
                </p>
                <p className="text-black dark:text-white">Dr. Alanah</p>
                <p className="text-black dark:text-white">Cardiologist</p>
                <p className="text-black dark:text-white">Stacklycare, USA</p>

                {/* Invoice Meta */}
              </div>
            </div>

            {/* Invoice Table */}
            <table className="min-w-full border-separate border-spacing-x-1 bg-transparent text-black dark:text-white">
              <thead>
                <tr className="text-left text-[#0EFF7B] border-b border-gray-300 dark:border-gray-700">
                  <th className="py-3">Serial No.</th>
                  <th className="py-3">Service / Item</th>
                  <th className="py-3">Qty</th>
                  <th className="py-3">Unit price</th>
                  <th className="py-3">Tax</th>
                  <th className="py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    sn: 1,
                    item: "Consultation",
                    qty: "-",
                    price: "-",
                    tax: "120.00",
                    total: "1500.00",
                  },
                  {
                    sn: 2,
                    item: "Blood test (CBC)",
                    qty: 3,
                    price: "1500",
                    tax: "80.00",
                    total: "4500.00",
                  },
                  {
                    sn: 3,
                    item: "X-ray chest",
                    qty: "-",
                    price: "-",
                    tax: "50.00",
                    total: "3500.00",
                  },
                  {
                    sn: 4,
                    item: "Medicines",
                    qty: 8,
                    price: "1000",
                    tax: "450.00",
                    total: "8000.00",
                  },
                  {
                    sn: 5,
                    item: "Room charges (5 days)",
                    qty: 5,
                    price: "2500",
                    tax: "450.00",
                    total: "12500.00",
                  },
                ].map((row) => (
                  <tr
                    key={row.sn}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-3">{row.sn}.</td>
                    <td className="py-3">{row.item}</td>
                    <td className="py-3">{row.qty}</td>
                    <td className="py-3">{row.price}</td>
                    <td className="py-3">{row.tax}</td>
                    <td className="py-3">{row.total}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr>
                  <td colSpan="5" className="text-right font-semibold py-3">
                    Total
                  </td>
                  <td className="py-3 font-semibold">30000.00</td>
                </tr>
              </tbody>
            </table>

            {/* Grand Total */}
            <div className="mt-4 flex justify-end">
              <div className="bg-[#0EFF7B] text-black dark:text-white px-6 py-3 rounded-lg font-semibold">
                Grand total: 41500.00
              </div>
            </div>
          </div>
        )}

        {activeTab === "Test Reports" && (
          <div className="overflow-x-auto rounded-xl p-4 mb-4 bg-transparent">
            {/* Filters + Text */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              {/* Left side: Text */}
              <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px]">
                Patients test report information.
              </p>

              {/* Right side: Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-0">
                {[
                  {
                    label: "Month",
                    value: selectedMonth,
                    setValue: setSelectedMonth,
                    options: ["All", "April", "May", "June"],
                  },
                  {
                    label: "Department",
                    value: selectedDepartment,
                    setValue: setSelectedDepartment,
                    options: ["All", "Pathology", "Radiology"],
                  },
                  {
                    label: "Status",
                    value: selectedStatus,
                    setValue: setSelectedStatus,
                    options: ["All", "Completed", "Pending", "Cancelled"],
                  },
                ].map(({ label, value, setValue, options }) => (
                  <div key={label} className="relative">
                    <select
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="appearance-none w-[140px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126]
                border border-[#0EFF7B] text-white text-sm rounded-lg px-4 py-2.5 pr-8
                focus:outline-none focus:ring-2 focus:ring-[#0EFF7B] hover:shadow-[0_0_8px_#0EFF7B]
                dark:bg-gradient-to-r dark:from-[#002414] dark:via-[#003D24] dark:to-[#002414]"
                    >
                      {options.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className="bg-white dark:bg-black text-black dark:text-white"
                        >
                          {opt === "All" ? `All ${label}s` : opt}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-3 w-4 h-4 text-[#0EFF7B] pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <table className="min-w-full border-separate border-spacing-x-1 bg-transparent">
              <thead>
                <tr className="text-left text-[16px] text-[#08994A] dark:text-[#0EFF7B] border-b border-gray-300 dark:border-gray-700">
                  <th className="py-3">Date & Time</th>
                  <th className="py-3">Month</th>
                  <th className="py-3">Test Type</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-[16px] text-black dark:text-white">
                {currentTests.length > 0 ? (
                  currentTests.map((report, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-4">{report.dateTime}</td>
                      <td className="py-4">{report.month}</td>
                      <td className="py-4">{report.testType}</td>
                      <td className="py-4">{report.department}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                    ${
                      report.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : report.status === "Pending"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                    >
                      No test reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
