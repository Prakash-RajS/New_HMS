//Viewpatientprofile.jsx

import React from "react";
import { useNavigate } from "react-router-dom";




export default function ViewPatientProfile() {
    const navigate = useNavigate();
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


            {/* Vitals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div className="bg-black text-white rounded-lg py-6 px-4 flex flex-col items-start">
                    <span className="text-sm mb-2">Blood Pressure</span>
                    <span className="text-xl font-bold">120/89 <span className="text-sm font-normal">mmHg</span></span>
                </div>
                <div className="bg-black text-white rounded-lg py-6 px-4 flex flex-col items-start">
                    <span className="text-sm mb-2">Heart rate</span>
                    <span className="text-xl font-bold">120 <span className="text-sm font-normal">BPM</span></span>
                </div>
                <div className="bg-black text-white rounded-lg py-6 px-4 flex flex-col items-start">
                    <span className="text-sm mb-2">Glucose</span>
                    <span className="text-xl font-bold">97 <span className="text-sm font-normal">mg/dl</span></span>
                </div>
                <div className="bg-black text-white rounded-lg py-6 px-4 flex flex-col items-start">
                    <span className="text-sm mb-2">Cholesterol</span>
                    <span className="text-xl font-bold">85 <span className="text-sm font-normal">mg/dl</span></span>
                </div>
            </div>

            {/* Diagnosis Section */}
            <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 00-1 1v1H5.5A1.5 1.5 0 004 5.5v11A1.5 1.5 0 005.5 18h9a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0014.5 4H12V3a1 1 0 00-1-1H9zm0 2h2v1H9V4zM5.5 6h9a.5.5 0 01.5.5V8H5V6.5a.5.5 0 01.5-.5zM5 9h10v8.5a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5V9z" />
                    </svg>
                    <h2 className="text-lg text-green-400 font-semibold">Diagnosis</h2>
                </div>
                <p className="text-gray-500 mb-4">Patients diagnosis information.</p>
                {/* Diagnosis Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-gray-600 text-left">
                                <th className="py-2">CT Scan</th>
                                <th className="py-2">10 Apr 2025</th>
                                <th className="py-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</th>
                                <th className="py-2">10 Apr 2025</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="py-2">Blood Test</td>
                                <td className="py-2">11 July 2025</td>
                                <td className="py-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</td>
                                <td className="py-2">11 July 2025</td>
                            </tr>
                            <tr className="border-t">
                                <td className="py-2">Blood Analysis</td>
                                <td className="py-2">11 July 2025</td>
                                <td className="py-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</td>
                                <td className="py-2">11 July 2025</td>
                            </tr>
                            <tr className="border-t">
                                <td className="py-2">Vascular Sonography</td>
                                <td className="py-2">10 July 2025</td>
                                <td className="py-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</td>
                                <td className="py-2">10 July 2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};



