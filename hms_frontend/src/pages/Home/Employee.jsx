import React from "react";

const Employee = () => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Employee</h2>
      <p className="text-gray-400">
        This section manages employee details, including doctors, nurses, and staff.
      </p>
      <div className="mt-6 bg-[#1A1A1A] p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Employee Directory</h3>
        <ul className="text-gray-300">
          <li>👨‍⚕️ Dr. John Smith – Cardiologist</li>
          <li>👩‍⚕️ Dr. Priya Sharma – Surgeon</li>
          <li>👨‍⚕️ Nurse Ramesh – ICU</li>
          <li>👩‍⚕️ Staff Anjali – Reception</li>
        </ul>
      </div>
    </div>
  );
};

export default Employee;
