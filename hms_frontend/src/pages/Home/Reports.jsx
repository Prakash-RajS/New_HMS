import React from "react";

const Reports = () => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <p className="text-gray-400">
        This section will display hospital reports such as monthly patient visits, revenue breakdowns, and other analytics.
      </p>
      <div className="mt-6 bg-[#1A1A1A] p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Sample Report</h3>
        <ul className="list-disc pl-6 text-gray-300">
          <li>Monthly Patient Admissions: 245</li>
          <li>Total Surgeries: 67</li>
          <li>Revenue Generated: ₹12,45,000</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;