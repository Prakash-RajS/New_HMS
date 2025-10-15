import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
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
  X,
} from "lucide-react";

const AmbulanceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("Dispatch Log");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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
    {
      tripId: "T-7755",
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
      tripId: "T-7756",
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
      tripId: "T-7757",
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
      tripId: "T-7758",
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
    {
      tripId: "T-7759",
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
      tripId: "T-7760",
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
      tripId: "T-7761",
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
      tripId: "T-7762",
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

  const filteredData = (activeTab === "Dispatch Log" ? dispatchData : tripData)
    .filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((item) => (filterStatus ? item.status === filterStatus : true));

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
    setIsFilterOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const applyFilter = (status) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterStatus("");
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      console.log(
        `Deleting ${activeTab === "Dispatch Log" ? "dispatch" : "trip"}: ${
          selectedItem?.id || selectedItem?.tripId
        }`
      );
    } else if (selectedRows.size > 0) {
      handleBulkDelete();
    }
    setIsDeleteOpen(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-600 dark:text-green-500";
    if (status === "En Route") return "text-blue-600 dark:text-blue-500";
    if (status === "Standby") return "text-yellow-600 dark:text-yellow-500";
    return "text-gray-600 dark:text-gray-400";
  };

  // Select All functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(sortedData.map((item) => item.id || item.tripId));
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Individual row selection
  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === sortedData.length);
  };

  // Check if a row is selected
  const isRowSelected = (id) => selectedRows.has(id);

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.size > 0) {
      console.log(
        `Deleting ${selectedRows.size} selected items:`,
        Array.from(selectedRows)
      );
      setSelectedRows(new Set());
      setSelectAll(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div
      className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative"
    >
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
      {/* Gradient Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px",
          padding: "2px",
          background:
            "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-4 relative z-10">
        <div>
          <h1 className="text-[20px] font-medium text-black dark:text-[#FFFFFF] flex items-center gap-2">
            Ambulance Management
          </h1>
          <p className="text-[14px] mt-2 text-gray-600 dark:text-gray-400">
            Manage ambulance dispatches, trips, and vehicle status in one place.
          </p>
        </div>
      </div>

      {/* Map + Notifications */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-6 relative z-10">
        {/* Left Column: Map + Stats */}
        <div className="w-full lg:flex-1">
          {/* Map */}
          <div className="w-full h-[284px] bg-white dark:bg-[#1E1E1E] rounded-xl mb-6 relative">
            <div className="absolute top-2 right-2 bg-white dark:bg-black px-2 py-1 rounded-md text-sm flex items-center gap-1 text-black dark:text-white border border-[#0EFF7B] dark:border-[#0D0D0D]">
              View live map{" "}
              <ChevronDown
                size={14}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </div>
            <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
              Map View (Integrate with Google Maps or Leaflet)
            </div>
          </div>

          {/* Stats */}
          <div className="w-full h-[91px] flex items-center justify-between rounded-lg px-6 py-[22px] bg-white dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0D0D0D]">
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-black dark:text-white text-sm">
                Total Vehicles
              </span>
              <span className="text-black dark:text-white text-base font-medium">
                250
              </span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500"></span>
                Ready to Dispatch
              </span>
              <span className="text-green-600 dark:text-green-500 text-base font-medium">
                7
              </span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500"></span>
                On Road (Trips)
              </span>
              <span className="text-orange-600 dark:text-orange-500 text-base font-medium">
                4
              </span>
            </div>
            <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500"></span>
                Out of Service
              </span>
              <span className="text-red-600 dark:text-red-500 text-base font-medium">
                1
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div className="w-full lg:w-[320px] h-[399px] bg-gray-100 dark:bg-[#0D0D0D] border border-[#0EFF7B1A] rounded-xl p-2 flex flex-col">
          <div className="flex flex-col bg-white dark:bg-[#000000] rounded-xl p-4 flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="dark:text-white text:black text-[15px] font-semibold flex items-center gap-2">
                <Bell size={16} className="text-[#0EFF7B]" />
                Notifications & Alerts
              </h3>
              <a
                href="#"
                className="text-[#0EFF7B] text-xs hover:text-[#08994A] transition-colors"
              >
                View all
              </a>
            </div>
            <p className="dark:text-gray-400 text:black text-xs mb-3">
              July 2025
            </p>
            <div className="flex-1 overflow-y-auto">
              <ul className="text-sm">
                {[
                  {
                    title: "David's vans",
                    time: "Today at 12:03",
                    message: "Out of hours usage detected",
                  },
                  {
                    title: "City Hospital",
                    time: "Yesterday at 17:45",
                    message: "New donor registered",
                  },
                  {
                    title: "Red Cross Center",
                    time: "July 8, 2025",
                    message: "Blood stock updated",
                  },
                ].map((notif, idx) => (
                  <li
                    key={idx}
                    className="py-3 flex justify-between items-start border-b border-[#3C3C3C] last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <p className="dark:text-white text:black font-medium">
                        {notif.title}
                      </p>
                      <p className="dark:text-gray-400 text:black text-xs">
                        {notif.time}
                      </p>
                      <p className="dark:text-gray-300 text:black text-xs flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-[#0EFF7B]" />
                        {notif.message}
                      </p>
                    </div>
                    <MapPin size={16} className="text-[#0EFF7B]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 relative z-10">
        {/* Heading */}
        <h1 className="text-[20px] font-medium text-black dark:text-white">
          Transport Management
        </h1>
        {/* Subheading */}
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-3">
          List of all stocks
        </p>

        {/* Tabs Buttons */}
        <div className="flex gap-3 text-sm">
          <button
            onClick={() => {
              setActiveTab("Dispatch Log");
              setSelectedRows(new Set());
              setSelectAll(false);
            }}
            className={`w-[140px] h-[34px] rounded-[4px] px-3 py-2 flex items-center justify-center text-sm font-medium transition-all ${
              activeTab === "Dispatch Log"
                ? "bg-[#025126] border-t border-r border-b-2 border-l border-[#025126] shadow-[0_0_20px_0_#0EFF7B40] text-white"
                : "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#1E1E1E]  text-black dark:text-gray-400"
            }`}
          >
            Dispatch Log
          </button>
          <button
            onClick={() => {
              setActiveTab("Trip Log");
              setSelectedRows(new Set());
              setSelectAll(false);
            }}
            className={`w-[140px] h-[34px] rounded-[4px] px-3 py-2 flex items-center justify-center text-sm font-medium transition-all ${
              activeTab === "Trip Log"
                ? "bg-[#025126] border-t border-r border-b-2 border-l border-[#025126] shadow-[0_0_20px_0_#0EFF7B40] text-white"
                : "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#1E1E1E]  text-black dark:text-gray-400"
            }`}
          >
            Trip Log
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4 bg-white dark:bg-transparent">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-black dark:text-white text-lg font-semibold">
            {activeTab}
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 flex-1 sm:flex-initial">
              <Search
                size={16}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
              <input
                type="text"
                placeholder="Search by ID, unit, dispatcher, etc."
                className="bg-transparent outline-none text-sm w-full text-black dark:text-white placeholder-[#5CD592] dark:placeholder-[#5CD592] focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleFilter}
              className="w-8 h-8 flex items-center justify-center rounded-[20px] border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] dark:border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B] transition"
            >
              <Filter size={18} className="text-[#0EFF7B]" />
            </button>

            <button
              onClick={() => {
                if (selectedRows.size > 0) {
                  setSelectedItem(null); // Clear selectedItem for bulk delete
                  setIsDeleteOpen(true);
                }
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-[20px] border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] dark:border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] transition ${
                selectedRows.size > 0
                  ? "text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  : "text-[#0EFF7B] dark:text-[#0EFF7B] hover:text-red-600 dark:hover:text-red-500"
              }`}
              disabled={selectedRows.size === 0}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {isFilterOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-helvetica">
    <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70">
      <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33]">
          <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
            Filter {activeTab}
          </h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2 text-black dark:text-white"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Status
          </label>
          <Listbox value={filterStatus} onChange={setFilterStatus}>
            <div className="relative mt-1 w-full">
              <Listbox.Button
                className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] focus:outline-none"
              >
                {filterStatus || "All Statuses"}
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-[#0EFF7B]" />
                </span>
              </Listbox.Button>
              <Listbox.Options
                className="absolute mt-1 w-full max-h-40 overflow-auto rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {["All Statuses", "Completed", "En Route", "Standby"].map(
                  (option, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={option === "All Statuses" ? "" : option}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 px-3 text-sm rounded-md ${
                          active
                            ? "bg-gray-100 dark:bg-[#0EFF7B1A] text-black dark:text-[#0EFF7B]"
                            : "text-black dark:text-white"
                        } ${selected ? "font-medium text-[#0EFF7B]" : ""}`
                      }
                    >
                      {option}
                    </Listbox.Option>
                  )
                )}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={clearFilter}
            className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] font-helvetica"
          >
            Reset
          </button>
          <button
            onClick={() => {
              applyFilter(filterStatus);
              setIsFilterOpen(false);
            }}
            className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium hover:scale-105 transition font-helvetica"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Delete Confirmation Popup */}
        {isDeleteOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 font-helvetica">
            <div className="rounded-[20px] p-[1px]">
              <div className="w-[400px] bg-white dark:bg-[#000000] rounded-[19px] p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
                {/* Gradient Border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "20px",
                    padding: "2px",
                    background:
                      "linear-gradient(to bottom right, rgba(14,255,123,0.7) 0%, rgba(30,30,30,0.7) 50%, rgba(14,255,123,0.7) 100%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                ></div>
                {/* Header */}
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-[#0EFF7B33] dark:border-[#0EFF7B33]">
                  <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">
                    Delete {activeTab}
                  </h3>
                  <button
                    onClick={() => setIsDeleteOpen(false)}
                    className="text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33] p-1 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Confirmation Text */}
                <p className="text-sm text-black dark:text-white mb-4">
                  {selectedItem
                    ? `Are you sure you want to delete ${
                        activeTab === "Dispatch Log" ? "dispatch" : "trip"
                      } with ID ${selectedItem?.id || selectedItem?.tripId}?`
                    : `Are you sure you want to delete ${
                        selectedRows.size
                      } selected ${
                        selectedRows.size === 1 ? "item" : "items"
                      }?`}
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsDeleteOpen(false)}
                    className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] text-black dark:text-white font-medium hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A] font-helvetica"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="w-[144px] h-[32px] rounded-[8px] bg-red-600 dark:bg-red-500 text-white font-medium hover:bg-red-700 dark:hover:bg-red-600 font-helvetica"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse min-w-[800px] font-helvetica">
            <thead className="bg-gray-200 dark:bg-[#091810] h-[52px] text-sm text-center border-b border-gray-300 dark:border-[#3C3C3C] text-[#0EFF7B]">
              <tr>
                {/* Select All Checkbox */}
                <th className="px-3 py-3 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                    />
                  </div>
                </th>

                {activeTab === "Dispatch Log" ? (
                  <>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      Dispatch ID{" "}
                      {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("time")}
                    >
                      Dispatched Time/Date{" "}
                      {sortColumn === "time" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("unit")}
                    >
                      Unit No{" "}
                      {sortColumn === "unit" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("dispatcher")}
                    >
                      Dispatcher{" "}
                      {sortColumn === "dispatcher" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      Call Type{" "}
                      {sortColumn === "type" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("location")}
                    >
                      Location Assigned{" "}
                      {sortColumn === "location" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortColumn === "status" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-3 py-3">Action</th>
                  </>
                ) : (
                  <>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("tripId")}
                    >
                      Trip ID{" "}
                      {sortColumn === "tripId" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("dispatchId")}
                    >
                      Dispatch ID{" "}
                      {sortColumn === "dispatchId" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("unit")}
                    >
                      Unit No{" "}
                      {sortColumn === "unit" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("crew")}
                    >
                      Crew{" "}
                      {sortColumn === "crew" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("patientId")}
                    >
                      Patient ID{" "}
                      {sortColumn === "patientId" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("pickupLocation")}
                    >
                      Pickup Location{" "}
                      {sortColumn === "pickupLocation" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("destination")}
                    >
                      Destination{" "}
                      {sortColumn === "destination" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("startTime")}
                    >
                      Start Time{" "}
                      {sortColumn === "startTime" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("endTime")}
                    >
                      End Time{" "}
                      {sortColumn === "endTime" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("mileage")}
                    >
                      Mileage{" "}
                      {sortColumn === "mileage" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-3 py-3 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortColumn === "status" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => {
                const rowId = row.id || row.tripId;
                return (
                  <tr
                    key={rowId}
                    className="text-center border-b border-gray-300 dark:border-[#3C3C3C] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D] h-[62px]"
                  >
                    {/* Checkbox for row selection */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isRowSelected(rowId)}
                          onChange={() => handleRowSelect(rowId)}
                          className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                        />
                      </div>
                    </td>

                    {activeTab === "Dispatch Log" ? (
                      <>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.id}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.time}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.unit}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.dispatcher}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.type}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.location}
                        </td>
                        <td
                          className={`px-3 py-3 font-medium ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </td>
                        <td className="px-3 py-3 flex justify-end gap-2">
                          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]">
                            <Phone
                              size={16}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-[#0EFF7B33] dark:hover:bg-[#0EFF7B33]">
                            <Edit
                              size={16}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <Trash2
                              size={16}
                              className="text-red-600 dark:text-red-500"
                            />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.tripId}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.dispatchId}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.unit}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.crew}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.patientId}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.pickupLocation}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.destination}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.startTime}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.endTime}
                        </td>
                        <td className="px-3 py-3 text-black dark:text-white">
                          {row.mileage}
                        </td>
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center h-full mt-4 bg-white dark:bg-transparent p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
          <div className="text-sm text-black dark:text-white">
            Page{" "}
            <span className="text-[#08994A] dark:text-[#0EFF7B]">
              {currentPage}
            </span>{" "}
            of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} from{" "}
            {filteredData.length} {activeTab === "Dispatch Log" ? "Dispatches" : "Trips"})
          </div>
          <div className="flex items-center gap-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                currentPage === 1
                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                  : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              }`}
            >
              <ChevronLeft
                size={12}
                className="text-[#08994A] dark:text-white"
              />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                currentPage === totalPages
                  ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                  : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
              }`}
            >
              <ChevronRight
                size={12}
                className="text-[#08994A] dark:text-white"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceManagement;