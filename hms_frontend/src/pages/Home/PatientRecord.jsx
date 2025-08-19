import React from "react";

const PatientRecord = () => {
  return (
    <div className="grid grid-cols-1 pl-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Patient Record Card */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Patient Record</h3>
        <p className="text-sm text-gray-300">Total Patients</p>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">12.4k</span>
          <span className="text-xs text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 text-green-400 text-sm flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Surgery Record Card */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Surgery Record</h3>
        <p className="text-sm text-gray-300">Active Patients</p>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">12.4k</span>
          <span className="text-xs text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 text-green-400 text-sm flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Revenue Summary - Admissions Card */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
        <p className="text-sm text-gray-300">Admissions</p>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">12.4k</span>
          <span className="text-xs text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 text-green-400 text-sm flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Revenue Summary - Priority Care Card */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Revenue Summary</h3>
        <p className="text-sm text-gray-300">Priority Care</p>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">12.4k</span>
          <span className="text-xs text-gray-400 ml-2">+12 this week ↑</span>
        </div>
        <button className="mt-4 text-green-400 text-sm flex items-center">
          View details <span className="ml-1">This Week ↓</span>
        </button>
      </div>

      {/* Emergency Cases Card */}
      <div className="bg-gray-800 p-4 rounded-lg col-span-1">
        <h3 className="text-lg font-semibold mb-2">Emergency Cases</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">42</span>
        </div>
        <button className="mt-4 text-green-400 text-sm">View details</button>
      </div>

      {/* Consultation Card */}
      <div className="bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Consultation</h3>
          <span className="text-sm text-green-400">Today ↑</span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-400">3,570</span>
          <span className="text-xs text-gray-400 ml-2">+220</span>
        </div>
        <p className="text-sm text-gray-300">Average consultation per doctor</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            General Physician
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Dermatology
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Orthopedics
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Pediatrics
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Cardiology
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Neurology
          </li>
        </ul>
      </div>

      {/* Circular Progress Card */}
      <div className="bg-gray-800 p-4 rounded-lg col-span-1 flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-700 stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className="text-green-400 progress-ring__circle stroke-current"
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
            <span className="text-sm text-green-400">Today ↑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecord;
