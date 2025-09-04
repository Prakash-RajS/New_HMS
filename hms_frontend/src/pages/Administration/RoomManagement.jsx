import React, { useState, useMemo, Fragment } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Settings,
  X,
} from "lucide-react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Import the BedList component (you'll need to create this)
// import BedList from "./BedList";

const RoomManagement = () => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bedGroupFilter, setBedGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeView, setActiveView] = useState("room-management"); // "room-management" or "bed-list"

  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 9;

  const roomsData = [
    {
      roomNo: "101",
      bedGroup: "ICU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "102",
      bedGroup: "Ward",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "103",
      bedGroup: "Cabin",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Not Available",
    },
    {
      roomNo: "104",
      bedGroup: "Special ward",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "105",
      bedGroup: "PACU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "106",
      bedGroup: "PACU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "107",
      bedGroup: "ICU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
    {
      roomNo: "108",
      bedGroup: "NICU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Not Available",
    },
    {
      roomNo: "109",
      bedGroup: "ICU",
      patient: "Abishek",
      patientId: "SMH07204",
      admit: "12/08/2025",
      discharge: "20/08/2025",
      status: "Available",
    },
  ];

  const statusColors = {
    Available: "text-[#FF930E]",
    "Not Available": "text-gray-600 dark:text-gray-400",
  };

  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      // Search filter
      if (
        searchTerm &&
        !(
          room.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Bed group filter
      if (bedGroupFilter && room.bedGroup !== bedGroupFilter) {
        return false;
      }

      // Status filter
      if (statusFilter && room.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [roomsData, searchTerm, bedGroupFilter, statusFilter]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  const handleCheckboxChange = (roomNo) => {
    if (selectedRooms.includes(roomNo)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomNo));
    } else {
      setSelectedRooms([...selectedRooms, roomNo]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === currentRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(currentRooms.map((r) => r.roomNo));
    }
  };

  const handleBedListClick = () => {
    setActiveView("bed-list");
    navigate("/Administration/BedList");
  };

  const handleRoomManagementClick = () => {
    setActiveView("room-management");
    navigate("/Administration/roommanagement");
  };

  const ActionMenu = () => {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-white">
          <MoreHorizontal size={18} />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-[#0EFF7B] dark:border-gray-700 rounded-md shadow-lg focus:outline-none z-50">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#0EFF7B1A] dark:bg-gray-800" : ""
                  } flex items-center px-4 py-2 text-sm w-full text-black dark:text-white gap-2`}
                >
                  <span className="text-blue-500 dark:text-blue-400">✏️</span> Mark as attention
                  needed
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#0EFF7B1A] dark:bg-gray-800" : ""
                  } flex items-center px-4 py-2 text-sm w-full text-black dark:text-white gap-2`}
                >
                  <span className="text-red-500 dark:text-red-400">🗑️</span> Delete
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  const FilterPopover = ({ isOpen, onClose }) => {
    const [bedGroup, setBedGroup] = useState(bedGroupFilter);
    const [status, setStatus] = useState(statusFilter);

    const bedGroups = ["ICU", "Ward", "Cabin", "PACU", "Special ward", "NICU"];
    const statuses = ["Available", "Not Available"];

    const handleApply = () => {
      setBedGroupFilter(bedGroup);
      setStatusFilter(status);
      onClose();
    };

    const handleClear = () => {
      setBedGroup("");
      setStatus("");
      setBedGroupFilter("");
      setStatusFilter("");
    };

    if (!isOpen) return null;

    return (
      <div className="h-[845px] fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-black rounded-lg p-6 w-[400px] relative border border-[#0EFF7B] dark:border-[#1E1E1E]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-white"
          >
            <X size={20} />
          </button>

          <h3 className="text-black dark:text-white text-lg font-semibold mb-4">Filter</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">
                Bed Group
              </label>
              <Listbox value={bedGroup} onChange={setBedGroup}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-[#F5F6F5] dark:bg-[#0D0D0D] text-[#08994A] dark:text-white border border-[#0EFF7B] dark:border-gray-700 rounded px-3 py-2 text-sm text-left">
                    {bedGroup || "Select bedgroup"}
                  </Listbox.Button>
                  <Listbox.Options className="mt-1 bg-white dark:bg-black border border-[#0EFF7B] dark:border-gray-700 rounded shadow-lg z-50 absolute w-full text-sm">
                    {bedGroups.map((bg, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={bg}
                        className="px-3 py-2 hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 cursor-pointer text-black dark:text-white"
                      >
                        {bg}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">Status</label>
              <Listbox value={status} onChange={setStatus}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-[#F5F6F5] dark:bg-[#0D0D0D] text-[#08994A] dark:text-white border border-[#0EFF7B] dark:border-gray-700 rounded px-3 py-2 text-sm text-left">
                    {status || "Select status"}
                  </Listbox.Button>
                  <Listbox.Options className="mt-1 bg-white dark:bg-black border border-[#0EFF7B] dark:border-gray-700 rounded shadow-lg z-50 absolute w-full text-sm">
                    {statuses.map((s, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={s}
                        className="px-3 py-2 hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 cursor-pointer text-black dark:text-white"
                      >
                        {s}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-[#0EFF7B] dark:border-gray-700 rounded-full text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-gray-900"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-full bg-[#08994A] dark:bg-green-500 text-white dark:text-black hover:bg-[#0EFF7B1A] dark:hover:bg-green-600"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Check if we're on the bed-list route
  const isBedListRoute = location.pathname.includes("bed-list");

  return (
    <div className="mt-[60px] h-100% mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl w-full max-w-[1400px] mx-auto dark:border-[#1E1E1E]">
      <div className="mt-[60px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white">Room Management</h2>
          <button className="flex items-center gap-2 bg-[#08994A] dark:bg-green-500 border border-[#0EFF7B] dark:border-[#1E1E1E] hover:text-green-800 hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 px-4 py-2 rounded-full text-white dark:text-black font-semibold">
                      <Plus size={18} className="text-green-800 dark:text-black" /> Add Bed Group
                    </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-2">You have total 7 types bed group.</p>

        {/* Filter + Search */}
        <div className="flex justify-between items-center mb-4">
          {/* Filter Dropdown */}
          <Listbox value={filterValue} onChange={setFilterValue}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                checked={
                  currentRooms.length > 0 &&
                  selectedRooms.length === currentRooms.length
                }
                onChange={handleSelectAll}
              />
              {/* Dropdown */}
              <div className="relative">
                <Listbox.Button className="flex items-center justify-between px-4 h-[40px] rounded-full border border-[#0EFF7B] dark:border-[#3C3C3C] bg-white dark:bg-transparent text-[#08994A] dark:text-white min-w-[120px]">
                  {filterValue}
                  <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-green-400 ml-2" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                  {["All", "Bed group lists"].map((option, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={option}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 px-4 text-sm rounded-lg ${
                          selected
                            ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B22] text-[#08994A] dark:text-[#0EFF7B]"
                            : active
                            ? "bg-[#0EFF7B1A] dark:bg-[#1A1A1A] text-[#08994A] dark:text-white"
                            : "text-black dark:text-gray-300"
                        }`
                      }
                    >
                      {option}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>

              {/* Chip button for "Bed group lists" */}
              <button 
                onClick={handleBedListClick}
                className={`px-4 h-[40px] rounded-full text-sm border border-[#0EFF7B] dark:border-green-400 text-[#08994A] dark:text-green-400 ${
                  isBedListRoute 
                    ? "text-white border-[#0EFF7B66] bg-gradient-to-r from-[#0EFF7B] to-[#08994A] dark:from-[#14DC6F] dark:to-[#09753A]"
                    : "bg-[#0EFF7B1A] dark:bg-[#0EFF7B22]"
                }`}
              >
                Bed group lists
              </button>
            </div>
          </Listbox>

          {/* Search + Settings together */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#0EFF7B] dark:border-gray-700 rounded-full px-3 py-1 w-[300px]">
              <Search size={18} className="text-[#08994A] dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search room no or patient name or ID"
                className="bg-transparent text-[#08994A] dark:text-white w-full outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-white px-4 py-2 rounded-full border border-[#0EFF7B] dark:border-gray-700 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
            >
              <Filter size={18} className="text-[#08994A] dark:text-white" /> Filter
            </button>

            <button className="flex items-center gap-2 bg-white dark:bg-[#0D0D0D] text-[#08994A] dark:text-white px-4 py-2 rounded-full border border-[#0EFF7B] dark:border-gray-700 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]">
              <Settings size={18} className="text-[#08994A] dark:text-white" />
            </button>
          </div>
        </div>

        {/* Filter Popover */}
        <FilterPopover
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        {/* Render different content based on route */}
        <Routes>
          <Route path="/" element={
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                {/* === Table Head === */}
                <thead
                  className="px-[20px] rounded-[60px] border border-[#0EFF7B] dark:border-[#0EFF7B1A] bg-[#F5F6F5] dark:bg-[#0D0D0D] opacity-100 font-inter font-normal text-[16px] leading-[100%] tracking-[0%] text-[#08994A] dark:text-white"
                >
                  <tr>
                    <th className="py-3 px-2">
                      {/* Select All Checkbox */}
                      <input
                        type="checkbox"
                        className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                        checked={
                          currentRooms.length > 0 &&
                          selectedRooms.length === currentRooms.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Room no</th>
                    <th>Bed Group</th>
                    <th>Patients</th>
                    <th>Admit</th>
                    <th>Discharge</th>
                    <th>Status</th>
                    <th className="text-center">...</th>
                  </tr>
                </thead>

                {/* === Table Body === */}
                <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-3 bg-white dark:bg-black">
                  {currentRooms.length > 0 ? (
                    currentRooms.map((room) => (
                      <tr key={room.roomNo} className="border-b border-gray-300 dark:border-gray-800">
                        {/* Narrow checkbox cell */}
                        <td className="px-2 py-3">
                          <input
                            type="checkbox"
                            className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                            checked={selectedRooms.includes(room.roomNo)}
                            onChange={() => handleCheckboxChange(room.roomNo)}
                          />
                        </td>

                        {/* Other table cells inherit standard padding */}
                        <td className="text-black dark:text-white">{room.roomNo}</td>
                        <td className="text-black dark:text-white">{room.bedGroup}</td>
                        <td className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#08994A] dark:bg-green-600 flex items-center justify-center text-sm font-bold text-white dark:text-black">
                            {room.patient.charAt(0)}
                          </div>
                          <div>
                            <p className="text-black dark:text-white text-sm font-medium">
                              {room.patient}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              {room.patientId}
                            </p>
                          </div>
                        </td>
                        <td className="text-black dark:text-white">{room.admit}</td>
                        <td className="text-black dark:text-white">{room.discharge}</td>
                        <td className={`${statusColors[room.status]}`}>
                          {room.status}
                        </td>
                        <td className="text-center">
                          <ActionMenu />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="w-[1089px] h-[72px] bg-white dark:bg-black flex items-center justify-center">
                      <td
                        colSpan="8"
                        className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                      >
                        No rooms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          } />
          <Route path="bed-list" element={
            <div>
              {/* This is where the BedList component would be rendered */}
              <div className="text-center py-10 text-black dark:text-white">
                <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Bed List View</h3>
                <p className="text-gray-600 dark:text-gray-400">This is the Bed List page content.</p>
                <button 
                  onClick={handleRoomManagementClick}
                  className="mt-4 px-4 py-2 bg-[#08994A] dark:bg-green-500 text-white dark:text-black rounded-full hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 border border-[#0EFF7B] dark:border-[#1E1E1E]"
                >
                  Back to Room Management
                </button>
              </div>
            </div>
          } />
        </Routes>

        {/* Pagination - Only show for room management view */}
        {!isBedListRoute && (
          <div className="flex items-center h-full mt-4 bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
            {/* Info text */}
            <div className="text-sm text-black dark:text-white">
              Page <span className="text-[#08994A] dark:text-[#0EFF7B]">{currentPage}</span> of {totalPages} ({indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredRooms.length)} from{" "}
              {filteredRooms.length} Rooms)
            </div>

            {/* Controls */}
            <div className="flex items-center gap-x-2">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                  currentPage === 1
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                    : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                }`}
              >
                <ChevronLeft size={12} className="text-[#08994A] dark:text-black" />
              </button>

              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                  currentPage === totalPages
                    ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                    : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
                }`}
              >
                <ChevronRight size={12} className="text-[#08994A] dark:text-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;