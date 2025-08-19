import React from "react";

const Statistics = () => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <p className="text-gray-400">
        Here you can visualize hospital statistics with charts and graphs.
      </p>
      <div className="mt-6 bg-[#1A1A1A] p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Sample Statistics</h3>
        <p className="text-gray-300">Occupancy Rate: 82%</p>
        <p className="text-gray-300">Doctor-to-Patient Ratio: 1:18</p>
        <p className="text-gray-300">Average Surgery Success Rate: 96%</p>
      </div>
    </div>
  );
};

export default Statistics;
