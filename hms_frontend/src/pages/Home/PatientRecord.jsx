import React from "react";

const PatientRecord = () => {
  return (
    <div className=" grid mt-5 p-4 grid-cols-1 pl-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Patient Record Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Patient Record</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Patients</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">12.4k</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 px-4 py-2 text-[#08994A] dark:text-[#0EFF7B] text-sm rounded-full border border-[#08994A66] dark:border-[#0EFF7B66] hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Surgery Record Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Surgery Record</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Patients</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">12.4k</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 px-4 py-2 text-[#08994A] dark:text-[#0EFF7B] text-sm rounded-full border border-[#08994A66] dark:border-[#0EFF7B66] hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Revenue Summary - Admissions Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Revenue Summary</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Admissions</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">12.4k</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 px-4 py-2 text-[#08994A] dark:text-[#0EFF7B] text-sm rounded-full border border-[#08994A66] dark:border-[#0EFF7B66] hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Revenue Summary - Priority Care Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Revenue Summary</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Priority Care</p>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">12.4k</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 px-4 py-2 text-[#08994A] dark:text-[#0EFF7B] text-sm rounded-full border border-[#08994A66] dark:border-[#0EFF7B66] hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Emergency Cases Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] col-span-1 hover:scale-105 transition-transform">
        <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Emergency Cases</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">42</span>
        </div>
        <button className="mt-4 px-4 py-2 text-[#08994A] dark:text-[#0EFF7B] text-sm rounded-full border border-[#08994A66] dark:border-[#0EFF7B66] hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33]">
          View details
        </button>
      </div>

      {/* Consultation Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] col-span-1 md:col-span-2 lg:col-span-2 hover:scale-105 transition-transform">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-black dark:text-white">Consultation</h3>
          <span className="text-sm text-[#08994A] dark:text-[#0EFF7B]">Today ↑</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#08994A] dark:text-[#0EFF7B]">3,570</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">+220</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average consultation per doctor</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">General Physician</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">Dermatology</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">Orthopedics</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">Pediatrics</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">Cardiology</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-[#08994A] dark:bg-[#0EFF7B] rounded-full mr-2"></span>
            <span className="text-black dark:text-white">Neurology</span>
          </li>
        </ul>
      </div>

      {/* Circular Progress Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#08994A] dark:border-[#3C3C3C] col-span-1 flex items-center justify-center hover:scale-105 transition-transform">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-300 dark:text-gray-700 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className="text-[#08994A] dark:text-[#0EFF7B] progress-ring__circle stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="calc(251.2 - (251.2 * 70) / 100)"
            ></circle>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-sm text-[#08994A] dark:text-[#0EFF7B]">Today ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord;