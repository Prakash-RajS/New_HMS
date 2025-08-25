//Viewpatientprofile.jsx


import { useState ,React} from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, FileText, Receipt, TestTube2 } from "lucide-react";

export default function ViewPatientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Diagnosis");
  return (


    <div className="mt-[60px] mb-4 bg-black text-white rounded-xl p-6 w-full">
      <button
        onClick={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
          } else {
            navigate("/patients"); // fallback
          }
        }}
        className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 mb-6"
      >
        ← Back
      </button>

      {/* Profile Card */}
      <div className="bg-[#0D0D0D] rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start text-white mb-8 w-[1053px] h-[262px]">

        {/* Avatar Section */}
        <div className="w-[146px] h-[187px] flex-shrink-0 flex flex-col gap-[4px] items-center pr-2 md:mr-[65px] ml-3 ">
          <div className="rounded-full bg-gray-700 flex items-center justify-center mb-3">
            {/* Placeholder for Profile Pic */}
            <svg
              className="w-[94px] h-[94px] text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
            </svg>
          </div>
          <span className="text-[#0EFF7B] text-[18px] font-medium">Mrs. Watson</span>
          <span className="text-[14px] text-[#A0A0A0]">ID: SAH257384</span>
          <span className="text-[14px] text-[#A0A0A0]">watson22@gmail.com</span>
          <button className="mt-1 text-blue-400 underline text-xs">Edit</button>
        </div>
        <div className="w-[1px] h-[187px] bg-[#A0A0A0] mr-6"></div>
        {/* Info Section */}
        <div className="w-[761px] h-[200px] md:ml-12 ml-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-6 md:mt-0">
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Gender</p>
            <p className="text-[14px] text-white">Female</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Age</p>
            <p className="text-[14px] text-white">28</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Blood Group</p>
            <p className="text-[14px] text-white">A+ve</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Phone number</p>
            <p className="text-[14px] text-white">+91 62742 xxxxx</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Status</p>
            <p className="text-[14px] text-white">Normal</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Department</p>
            <p className="text-[14px] text-white">Cardiology</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Admission date</p>
            <p className="text-[14px] text-white">20 July 2025</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Bed Number</p>
            <p className="text-[14px] text-white">RM 325</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Visiting Doctor</p>
            <p className="text-[14px] text-white">Dr. Sravan</p>
          </div>
          <div>
            <p className="text-[16px] text-[#A0A0A0] font-semibold">Consultation type</p>
            <p className="text-[14px] text-white">In-patient</p>
          </div>
        </div>
      </div>


      {/* Vitals Section */}
      <div className="mb-8">
        <h1 className="text-white text-xl font-semibold mb-4">Patient Current Vitals</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Blood Pressure */}
          <div className="w-[200px] h-[87px] bg-[#0D0D0D] rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-[#A0A0A0]">Blood Pressure</span>
            <span className="text-[18px] text-white font-bold">
              120/89 <span className="text-sm font-normal text-[#A0A0A0]">mmHg</span>
            </span>
          </div>

          {/* Heart Rate */}
          <div className="w-[200px] h-[87px] bg-[#0D0D0D] rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-[#A0A0A0]">Heart Rate</span>
            <span className="text-[18px] text-white font-bold">
              120 <span className="text-sm font-normal text-[#A0A0A0]">BPM</span>
            </span>
          </div>

          {/* Glucose */}
          <div className="w-[200px] h-[87px] bg-[#0D0D0D] rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-[#A0A0A0]">Glucose</span>
            <span className="text-[18px] text-white font-bold">
              97 <span className="text-sm font-normal text-[#A0A0A0]">mg/dl</span>
            </span>
          </div>

          {/* Cholesterol */}
          <div className="w-[200px] h-[87px] bg-[#0D0D0D] rounded-lg flex flex-col justify-center px-4 gap-[10px]">
            <span className="text-[16px] text-[#A0A0A0]">Cholesterol</span>
            <span className="text-[18px] text-white font-bold">
              85 <span className="text-sm font-normal text-[#A0A0A0]">mg/dl</span>
            </span>
          </div>
        </div>
      </div>


      <div className="bg-black rounded-lg shadow p-2 text-white">
  {/* Tabs */}
  <div className="grid grid-cols-4  gap-[64px] mb-6">
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
            ? "text-[#0EFF7B]  border-b-2 w-fit border-[#0EFF7B]"
            : "text-white"
        }`}
      >
        <Icon
          size={20}
          className={activeTab === name ? "text-[#0EFF7B]" : "text-white"}
        />
        {name}
      </button>
    ))}
  </div>

  {/* Content */}
  {activeTab === "Diagnosis" && (
    <div>
      <p className="text-[#A0A0A0] text-[16px] mb-4">
        Patients diagnosis information.
      </p>

      <div className="overflow-x-auto bg-black h-[277px]">
        <table className="min-w-full border-separate border-spacing-x-1">
          <thead>
            <tr className="text-left text-[16px] text-white border-b border-gray-700">
              <th className="py-3">Report Type</th>
              <th className="py-3">Date</th>
              <th className="py-3">Description</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-[16px] text-[#A0A0A0]">
            <tr>
              <td className="py-4">CT Scan</td>
              <td className="py-4">10 Apr 2025</td>
              <td className="py-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </td>
              <td className="py-4">10 Apr 2025</td>
            </tr>
            <tr>
              <td className="py-4">Blood Test</td>
              <td className="py-4">11 Jul 2025</td>
              <td className="py-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </td>
              <td className="py-4">11 Jul 2025</td>
            </tr>
            <tr>
              <td className="py-4">Blood Analysis</td>
              <td className="py-4">11 Jul 2025</td>
              <td className="py-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </td>
              <td className="py-4">11 Jul 2025</td>
            </tr>
            <tr>
              <td className="py-4">Vascular Sonography</td>
              <td className="py-4">10 Jul 2025</td>
              <td className="py-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </td>
              <td className="py-4">10 Jul 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )}

  {activeTab === "Prescription" && (
    <p className="text-[#A0A0A0] text-[16px]">Prescription data will show here.</p>
  )}

  {activeTab === "Invoice" && (
    <p className="text-[#A0A0A0] text-[16px]">Invoice details will show here.</p>
  )}

  {activeTab === "Test Reports" && (
    <p className="text-[#A0A0A0] text-[16px]">Test reports will show here.</p>
  )}
</div>
  
</div>
  );
};



