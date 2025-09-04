//Viewpatientprofile.jsx
import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Receipt, TestTube2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ViewPatientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Diagnosis");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const diagnoses = [
    {
      reportType: "CT Scan",
      date: "10 Apr 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "10 Apr 2025",
    },
    {
      reportType: "Blood Test",
      date: "11 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "11 Jul 2025",
    },
    {
      reportType: "Blood Analysis",
      date: "11 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "11 Jul 2025",
    },
    {
      reportType: "Vascular Sonography",
      date: "10 Jul 2025",
      description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      status: "10 Jul 2025",
    },
  ];

  const totalPages = Math.ceil(diagnoses.length / itemsPerPage);
  const currentDiagnoses = diagnoses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-[60px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto">
      <button
        onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/patients");
          }
        }}
        className="px-6 py-2 bg-[#08994A] dark:bg-green-500 border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 rounded-lg text-white font-semibold mb-6"
      >
        ← Back
      </button>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-800 rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start text-black dark:text-white mb-8 w-[1053px] h-[262px]">
        {/* Avatar Section */}
        <div className="w-[146px] h-[187px] flex-shrink-0 flex flex-col gap-[4px] items-center pr-2 md:mr-[65px] ml-3">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-3">
            <svg
              className="w-[94px] h-[94px] text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
          </div>
          <span className="text-[#08994A] dark:text-[#0EFF7B] text-[18px] font-medium">Mrs. Watson</span>
          <span className="text-[14px] text-gray-600 dark:text-[#A0A0A0]">ID: SAH257384</span>
          <span className="text-[14px] text-gray-600 dark:text-[#A0A0A0]">watson22@gmail.com</span>
          <button className="mt-1 text-[#08994A] dark:text-blue-400 underline text-xs hover:text-green-800 dark:hover:text-blue-300">Edit</button>
        </div>
        <div className="w-[1px] h-[187px] bg-gray-300 dark:bg-[#A0A0A0] mr-6"></div>
        {/* Info Section */}
        <div className="w-[761px] h-[200px] md:ml-12 ml-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-6 md:mt-0">
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Gender</p>
            <p className="text-[14px] text-black dark:text-white">Female</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Age</p>
            <p className="text-[14px] text-black dark:text-white">28</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Blood Group</p>
            <p className="text-[14px] text-black dark:text-white">A+ve</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Phone number</p>
            <p className="text-[14px] text-black dark:text-white">+91 62742 xxxxx</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Status</p>
            <p className="text-[14px] text-black dark:text-white">Normal</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Department</p>
            <p className="text-[14px] text-black dark:text-white">Cardiology</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Admission date</p>
            <p className="text-[14px] text-black dark:text-white">20 July 2025</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Bed Number</p>
            <p className="text-[14px] text-black dark:text-white">RM 325</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Visiting Doctor</p>
            <p className="text-[14px] text-black dark:text-white">Dr. Sravan</p>
          </div>
          <div>
            <p className="text-[16px] text-gray-600 dark:text-[#A0A0A0] font-semibold">Consultation type</p>
            <p className="text-[14px] text-black dark:text-white">In-patient</p>
          </div>
        </div>
      </div>

      {/* Vitals Section */}
      <div className="mb-8">
        <h1 className="text-black dark:text-white text-xl font-semibold mb-4">Patient Current Vitals</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="w-[200px] h-[87px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-800 rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-gray-600 dark:text-[#A0A0A0]">Blood Pressure</span>
            <span className="text-[18px] text-black dark:text-white font-bold">
              120/89 <span className="text-sm font-normal text-gray-600 dark:text-[#A0A0A0]">mmHg</span>
            </span>
          </div>
          <div className="w-[200px] h-[87px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-800 rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-gray-600 dark:text-[#A0A0A0]">Heart Rate</span>
            <span className="text-[18px] text-black dark:text-white font-bold">
              120 <span className="text-sm font-normal text-gray-600 dark:text-[#A0A0A0]">BPM</span>
            </span>
          </div>
          <div className="w-[200px] h-[87px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-800 rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-gray-600 dark:text-[#A0A0A0]">Glucose</span>
            <span className="text-[18px] text-black dark:text-white font-bold">
              97 <span className="text-sm font-normal text-gray-600 dark:text-[#A0A0A0]">mg/dl</span>
            </span>
          </div>
          <div className="w-[200px] h-[87px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-gray-800 rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-gray-600 dark:text-[#A0A0A0]">Cholesterol</span>
            <span className="text-[18px] text-black dark:text-white font-bold">
              85 <span className="text-sm font-normal text-gray-600 dark:text-[#A0A0A0]">mg/dl</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-black border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-lg shadow p-2 text-black dark:text-white">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-[64px] mb-6">
          {[
            { name: "Diagnosis", icon: ClipboardList },
            { name: "Prescription", icon: FileText },
            { name: "Invoice", icon: Receipt },
            { name: "Test Reports", icon: TestTube2 },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex items-center gap-2 text-lg font-medium py-3 ${
                activeTab === name
                  ? "text-[#08994A] dark:text-[#0EFF7B] border-b-2 w-fit border-[#0EFF7B] dark:border-[#0EFF7B]"
                  : "text-black dark:text-white hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
              }`}
            >
              <Icon
                size={20}
                className={activeTab === name ? "text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
              />
              {name}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "Diagnosis" && (
          <div>
            <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px] mb-4">
              Patients diagnosis information.
            </p>
            <div className="overflow-x-auto bg-white dark:bg-black">
              <table className="min-w-full border-separate border-spacing-x-1">
                <thead>
                  <tr className="text-left text-[16px] text-[#08994A] dark:text-green-400 border-b border-gray-300 dark:border-gray-700">
                    <th className="py-3">Report Type</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[16px] text-gray-600 dark:text-[#A0A0A0]">
                  {currentDiagnoses.length > 0 ? (
                    currentDiagnoses.map((diagnosis, index) => (
                      <tr key={index}>
                        <td className="py-4">{diagnosis.reportType}</td>
                        <td className="py-4">{diagnosis.date}</td>
                        <td className="py-4">{diagnosis.description}</td>
                        <td className="py-4">{diagnosis.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-600 dark:text-gray-400 italic">
                        No diagnoses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
              <div className="text-sm text-black dark:text-white">
                Page {currentPage} of {totalPages} (
                {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, diagnoses.length)} from {diagnoses.length} Diagnoses)
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
          </div>
        )}

        {activeTab === "Prescription" && (
          <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px]">Prescription data will show here.</p>
        )}

        {activeTab === "Invoice" && (
          <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px]">Invoice details will show here.</p>
        )}

        {activeTab === "Test Reports" && (
          <p className="text-gray-600 dark:text-[#A0A0A0] text-[16px]">Test reports will show here.</p>
        )}
      </div>
    </div>
  );
};



