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

      {/* You can add more patient cards here */}
    </div>
  );
};

export default PatientRecord;
