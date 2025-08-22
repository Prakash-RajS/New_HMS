//PatientProfile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientProfile() {
  const navigate = useNavigate();

  return (
    <div className="mt-[60px] h-[600px] mb-4 bg-black text-white rounded-xl p-6 w-full">
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Patient Profile</h1>

      <div className="bg-gray-900 rounded-lg p-4">
        <p>Name: John Doe</p>
        <p>Age: 45</p>
        <p>Condition: Diabetes</p>

        {/* View More Button */}
        <button
          onClick={() => navigate("/patients/profile/details")}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          View More →
        </button>
      </div>
    </div>
  );
}