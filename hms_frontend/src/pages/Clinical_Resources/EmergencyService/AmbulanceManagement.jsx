import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  MapPin,
  Phone,
  Edit,
  Clock,
  Filter,
  Trash2,
} from "lucide-react";

const AmbulanceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("Dispatch Log");

  const dispatchData = [
    {
      id: "D-10241",
      time: "08:05 AM 09/01/2025",
      unit: "AMB-09",
      dispatcher: "R. Lewis",
      type: "Emergency",
      location: "45 Elm St.",
      status: "Completed",
    },
    {
      id: "D-10242",
      time: "09:10 AM 09/01/2025",
      unit: "AMB-08",
      dispatcher: "J. Smith",
      type: "Non-Emergency",
      location: "City ER",
      status: "En Route",
    },
    {
      id: "D-10243",
      time: "09:25 AM 09/01/2025",
      unit: "AMB-07",
      dispatcher: "K. Brown",
      type: "Emergency",
      location: "98 Pine Ave.",
      status: "Standby",
    },
    {
      id: "D-10244",
      time: "09:45 AM 09/01/2025",
      unit: "AMB-06",
      dispatcher: "L. Davis",
      type: "Emergency",
      location: "210 Oak Blvd.",
      status: "Completed",
    },
  ];

  const tripData = [
    {
      tripId: "T-7751",
      dispatchId: "D-10241",
      unit: "AMB-09",
      crew: "Paramedic Lewis, EMT Clark",
      patientId: "P-45120",
      pickupLocation: "45 Elm St.",
      destination: "General Hospital",
      startTime: "10:05 AM",
      endTime: "10:30 AM",
      mileage: "7 min",
      status: "Completed",
    },
    {
      tripId: "T-7752",
      dispatchId: "D-10242",
      unit: "AMB-08",
      crew: "Paramedic Lewis, EMT Clark",
      patientId: "P-45120",
      pickupLocation: "City ER",
      destination: "General Hospital",
      startTime: "09:45 AM",
      endTime: "9:55 AM",
      mileage: "10 min",
      status: "Completed",
    },
    {
      tripId: "T-7753",
      dispatchId: "D-10243",
      unit: "AMB-07",
      crew: "Paramedic Lewis, EMT Clark",
      patientId: "P-45120",
      pickupLocation: "98 Pine Ave.",
      destination: "City ER",
      startTime: "09:25 AM",
      endTime: "-",
      mileage: "-",
      status: "En Route",
    },
    {
      tripId: "T-7754",
      dispatchId: "D-10244",
      unit: "AMB-06",
      crew: "Paramedic Lewis, EMT Clark",
      patientId: "P-45120",
      pickupLocation: "210 Oak Blvd.",
      destination: "General Hospital",
      startTime: "09:15 AM",
      endTime: "-",
      mileage: "-",
      status: "Standby",
    },
  ];

  const itemsPerPage = 10;

  const filteredData = (
    activeTab === "Dispatch Log" ? dispatchData : tripData
  ).filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortedData = [...displayedData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
    // Placeholder for filter popup or logic
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
    // Placeholder for delete popup or logic
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-600 dark:text-green-500";
    if (status === "En Route") return "text-blue-600 dark:text-blue-500";
    if (status === "Standby") return "text-yellow-600 dark:text-yellow-500";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="w-full flex-1 mt-[80px] bg-white dark:bg-black text-black dark:text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-black dark:text-[#0EFF7B]">
            Ambulance Management
          </h1>
          <p className="text-[14px] mt-2 text-gray-600 dark:text-gray-400">
            Manage ambulance dispatches, trips, and vehicle status in one place.
          </p>
        </div>
      </div>

      {/* Map + Notifications */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Column: Map + Stats */}
        <div className="w-full lg:flex-1">
          {/* Map */}
          <div className="w-full h-[284px] bg-white dark:bg-[#1E1E1E] rounded-xl mb-6 relative">
            <div className="absolute top-2 right-2 bg-white dark:bg-black px-2 py-1 rounded-md text-sm flex items-center gap-1 text-black dark:text-white border border-[#0EFF7B] dark:border-[#0D0D0D]">
              View live map <ChevronDown size={14} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
              Map View (Integrate with Google Maps or Leaflet)
            </div>
          </div>

          {/* Stats */}
          <div className="w-full h-[91px] flex items-center justify-between rounded-lg px-6 py-[22px] bg-white dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#0D0D0D]">
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-black dark:text-white text-sm">Total Vehicles</span>
              <span className="text-black dark:text-white text-base font-medium">250</span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500"></span>
                Ready to Dispatch
              </span>
              <span className="text-green-600 dark:text-green-500 text-base font-medium">7</span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500"></span>
                On Road (Trips)
              </span>
              <span className="text-orange-600 dark:text-orange-500 text-base font-medium">4</span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500"></span>
                Out of Service
              </span>
              <span className="text-red-600 dark:text-red-500 text-base font-medium">1</span>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div className="w-full lg:w-[320px] h-[399px] bg-white dark:bg-[#0D0D0D] rounded-xl p-4 flex flex-col border border-[#0EFF7B] dark:border-[#0D0D0D]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-black dark:text-white text-[15px] font-semibold flex items-center gap-2">
              <Bell size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
              Notifications & Alerts
            </h3>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 text-xs hover:text-[#08994A] dark:hover:text-white transition-colors"
            >
              View all
            </a>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">July 2025</p>
          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-gray-300 dark:divide-gray-700 text-sm">
              <li className="py-3">
                <p className="text-black dark:text-white font-medium">David’s vans</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Today at 12:03</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-[#08994A] dark:text-[#0EFF7B]" />
                  Out of hours usage detected
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-4 text-sm border-b border-gray-300 dark:border-[#1E1E1E]">
        <button
          onClick={() => setActiveTab("Dispatch Log")}
          className={`pb-2 hover:text-black dark:hover:text-white ${
            activeTab === "Dispatch Log"
              ? "text-black dark:text-white border-b-2 border-[#08994A] dark:border-[#0EFF7B]"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Dispatch Log
        </button>
        <button
          onClick={() => setActiveTab("Trip Log")}
          className={`pb-2 hover:text-black dark:hover:text-white ${
            activeTab === "Trip Log"
              ? "text-black dark:text-white border-b-2 border-[#08994A] dark:border-[#0EFF7B]"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Trip Log
        </button>
      </div>

      {/* Table */}
      <div className="w-full bg-white dark:bg-[#0D0D0D] rounded-xl p-6 overflow-x-auto border border-[#0EFF7B] dark:border-[#0D0D0D]">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-black dark:text-white text-lg font-semibold">{activeTab}</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 flex-1 sm:flex-initial">
              <Search size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
              <input
                type="text"
                placeholder="Search by ID, unit, dispatcher, etc."
                className="bg-transparent outline-none text-sm w-full text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleFilter}
              className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] transition"
            >
              <Filter size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-white dark:bg-[#1E1E1E] h-[52px] text-left text-sm text-black dark:text-white">
              <tr>
                {activeTab === "Dispatch Log" ? (
                  <>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("id")}>
                      Dispatch ID {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("time")}>
                      Dispatched Time/Date {sortColumn === "time" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("unit")}>
                      Unit No {sortColumn === "unit" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("dispatcher")}>
                      Dispatcher {sortColumn === "dispatcher" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("type")}>
                      Call Type {sortColumn === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("location")}>
                      Location Assigned {sortColumn === "location" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                      Status {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("tripId")}>
                      Trip ID {sortColumn === "tripId" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("dispatchId")}>
                      Dispatch ID {sortColumn === "dispatchId" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("unit")}>
                      Unit No {sortColumn === "unit" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("crew")}>
                      Crew {sortColumn === "crew" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("patientId")}>
                      Patient ID {sortColumn === "patientId" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("pickupLocation")}>
                      Pickup Location {sortColumn === "pickupLocation" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("destination")}>
                      Destination {sortColumn === "destination" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("startTime")}>
                      Start Time {sortColumn === "startTime" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("endTime")}>
                      End Time {sortColumn === "endTime" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("mileage")}>
                      Mileage {sortColumn === "mileage" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                      Status {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-sm">
              {sortedData.map((row) => (
                <tr
                  key={row.id || row.tripId}
                  className="h-[62px] bg-white dark:bg-black border-b border-gray-300 dark:border-[#1E1E1E] hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                >
                  {activeTab === "Dispatch Log" ? (
                    <>
                      <td className="px-3 py-3 text-black dark:text-white">{row.id}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.time}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.unit}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.dispatcher}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.type}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.location}</td>
                      <td
                        className={`px-3 py-3 font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </td>
                      <td className="px-3 py-3 flex gap-3">
                        <button className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400">
                          <Phone size={16} />
                        </button>
                        <button className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400">
                          <Edit size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 text-black dark:text-white">{row.tripId}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.dispatchId}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.unit}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.crew}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.patientId}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.pickupLocation}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.destination}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.startTime}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.endTime}</td>
                      <td className="px-3 py-3 text-black dark:text-white">{row.mileage}</td>
                      <td
                        className={`px-3 py-3 font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-left items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Page <span className="text-[#08994A] dark:text-[#0EFF7B]">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={handlePrevPage}
            className="bg-white dark:bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] disabled:opacity-40 transition"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextPage}
            className="bg-white dark:bg-[#1E1E1E] rounded-full w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] disabled:opacity-40 transition"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceManagement;
