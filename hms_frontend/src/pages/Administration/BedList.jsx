import React, { useState, useMemo, Fragment } from "react";
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Bed,
  Home,
  Building,
  Heart,
  Baby,
  Stethoscope,
  Edit,
  Trash2,
} from "lucide-react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DeleteAppointmentPopup from "./DeleteDepartmentPopup"; // ✅ import popup

const RoomManagement = () => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bedGroupFilter, setBedGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ rooms data with capacity, occupied, and unoccupied included
  const [roomsData, setRoomsData] = useState([
    { roomNo: "101", bedGroup: "ICU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 80, unoccupied: 70 },
    { roomNo: "102", bedGroup: "Ward", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 90, unoccupied: 60 },
    { roomNo: "103", bedGroup: "Cabin", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Not Available", capacity: 150, occupied: 100, unoccupied: 50 },
    { roomNo: "104", bedGroup: "Special ward", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 70, unoccupied: 80 },
    { roomNo: "105", bedGroup: "PACU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 85, unoccupied: 65 },
    { roomNo: "106", bedGroup: "PACU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 95, unoccupied: 55 },
    { roomNo: "107", bedGroup: "ICU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 75, unoccupied: 75 },
    { roomNo: "108", bedGroup: "NICU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Not Available", capacity: 150, occupied: 110, unoccupied: 40 },
    { roomNo: "109", bedGroup: "ICU", patient: "Abishek", patientId: "SMH07204", admit: "12/08/2025", discharge: "20/08/2025", status: "Available", capacity: 150, occupied: 88, unoccupied: 62 },
  ]);

  // ✅ state for delete popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 9;

  const bedGroupIcons = {
    ICU: <Heart size={18} className="text-red-500" />,
    Ward: <Home size={18} className="text-blue-500" />,
    Cabin: <Building size={18} className="text-green-500" />,
    "Special ward": <Building size={18} className="text-purple-500" />,
    PACU: <Stethoscope size={18} className="text-yellow-500" />,
    NICU: <Baby size={18} className="text-pink-500" />,
  };

  // === Filters ===
  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
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
      if (bedGroupFilter && room.bedGroup !== bedGroupFilter) return false;
      if (statusFilter && room.status !== statusFilter) return false;
      return true;
    });
  }, [roomsData, searchTerm, bedGroupFilter, statusFilter]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  // === Handlers ===
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

  const handleDeleteClick = (roomNo) => {
    setRoomToDelete(roomNo);     // mark which room we're deleting
    setShowDeletePopup(true);    // open popup
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      setRoomsData((prev) => prev.filter((r) => r.roomNo !== roomToDelete)); // remove room
      setSelectedRooms((prev) => prev.filter((r) => r !== roomToDelete));    // unselect if selected
    }
    setRoomToDelete(null);
    setShowDeletePopup(false);
  };

  const handleCancelDelete = () => {
    setRoomToDelete(null);
    setShowDeletePopup(false);
  };

  const handleBedListClick = () => {
    navigate("/Administration/BedList");
  };

  const handleRoomManagementClick = () => {
    navigate("/Administration/roommanagement");
  };

  const ActionMenu = () => {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="text-gray-400 hover:text-white">
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
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-black border border-gray-700 rounded-md shadow-lg focus:outline-none z-50">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${active ? "bg-gray-800" : ""} flex items-center px-4 py-2 text-sm w-full text-white gap-2`}
                >
                  <span className="text-blue-500">✏️</span> Mark as attention needed
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${active ? "bg-gray-800" : ""} flex items-center px-4 py-2 text-sm w-full text-white gap-2`}
                >
                  <span className="text-red-500">🗑️</span> Delete
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
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-black rounded-lg p-6 w-[400px] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <h3 className="text-white text-lg font-semibold mb-4">Filter</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Bed Group</label>
              <Listbox value={bedGroup} onChange={setBedGroup}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-[#0D0D0D] text-white border border-gray-700 rounded px-3 py-2 text-sm text-left">
                    {bedGroup || "Select bedgroup"}
                  </Listbox.Button>
                  <Listbox.Options className="mt-1 bg-black border border-gray-700 rounded shadow-lg z-50 absolute w-full text-sm">
                    {bedGroups.map((bg, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={bg}
                        className="px-3 py-2 hover:bg-gray-800 cursor-pointer"
                      >
                        {bg}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Status</label>
              <Listbox value={status} onChange={setStatus}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-[#0D0D0D] text-white border border-gray-700 rounded px-3 py-2 text-sm text-left">
                    {status || "Select status"}
                  </Listbox.Button>
                  <Listbox.Options className="mt-1 bg-black border border-gray-700 rounded shadow-lg z-50 absolute w-full text-sm">
                    {statuses.map((s, idx) => (
                      <Listbox.Option
                        key={idx}
                        value={s}
                        className="px-3 py-2 hover:bg-gray-800 cursor-pointer"
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
              className="px-4 py-2 border border-gray-700 rounded-full text-white hover:bg-gray-900"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-full bg-green-500 text-black hover:bg-green-600"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Check if we're on the bed-list route
  const isBedListRoute = location.pathname.includes("BedList");

  return (
    <div className="mt-[80px] min-h-[600px] max-h-auto mb-4 bg-black text-white rounded-xl p-0 w-full max-w-[1400px] mx-auto">
      <div className="mt-[80px] mb-4 bg-black text-white rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-semibold">Room Management</h2>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-black font-semibold">
            <Plus size={18} /> Add Bed Group
          </button>
        </div>

        <p className="text-gray-400 mb-7">You have total 7 types bed group.</p>

        {/* Filter + Search */}
        <div className="flex justify-between items-center mb-4">
          {/* Filter Dropdown */}
          <Listbox value={filterValue} onChange={setFilterValue}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border border-green-400 rounded-sm 
                bg-black checked:bg-green-500 checked:border-green-500 
                flex items-center justify-center 
                checked:before:content-['✔'] checked:before:text-white 
                checked:before:text-sm"
                checked={selectedRooms.length === currentRooms.length && currentRooms.length > 0}
                onChange={handleSelectAll}
              />
              {/* Dropdown */}
              <div className="relative">
                <Listbox.Button className="flex items-center justify-between px-4 h-[40px] rounded-full border border-[#3C3C3C] bg-transparent text-white min-w-[120px]">
                  {filterValue}
                  <ChevronDown className="h-4 w-4 text-green-400 ml-2" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-black shadow-lg z-50 border border-[#3A3A3A]">
                  {["All", "Bed group lists"].map((option, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={option}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 px-4 text-sm rounded-lg ${
                          selected
                            ? "bg-[#0EFF7B22] text-[#0EFF7B]"
                            : active
                            ? "bg-[#1A1A1A] text-white"
                            : "text-gray-300"
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
                onClick={isBedListRoute ? handleRoomManagementClick : handleBedListClick}
                className={`px-4 h-[40px] ml-4 rounded-full text-sm border ${
                  isBedListRoute
                    ? "text-white border-[#0EFF7B66]"
                    : "bg-[#0EFF7B22] text-green-400 border-green-400"
                }`}
                style={
                  isBedListRoute
                    ? {
                        background: "linear-gradient(94.31deg, #14DC6F 17.81%, #09753A 73.63%)",
                        border: "1px solid #0EFF7B66",
                      }
                    : {}
                }
              >
                Bed group lists
              </button>
            </div>
          </Listbox>

          {/* Search + Settings together */}
        </div>

        {/* Filter Popover */}
        <FilterPopover isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

        {/* Render different content based on route */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-1  overflow-hidden">
                <div style={{ minHeight: "600px", maxHeight: "800px", overflowY: "hidden" }}>
                  <table className="w-full  text-left text-sm mt-5 mb-5 border-collapse">
                    <thead className="bg-[#0D0D0D] border border-[#0EFF7B1A] text-white text-[15px] sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 w-[50px] h-[52px]">
                          <input
                            type="checkbox"
                            className="appearance-none w-5 h-5 border border-green-400 rounded-sm 
                            bg-black checked:bg-green-500 checked:border-green-500 
                            flex items-center justify-center 
                            checked:before:content-['✔'] checked:before:text-white 
                            checked:before:text-sm"
                            checked={selectedRooms.length === currentRooms.length && currentRooms.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 w-[80px]">Icon</th>
                        <th className="px-4 py-3">Bed Group</th>
                        <th className="px-4 py-3">Capacity</th>
                        <th className="px-4 py-3">Occupied RM</th>
                        <th className="px-4 py-3">Unoccupied RM</th>
                        <th className="px-4 py-3 w-[80px] text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {currentRooms.map((room, index) => {
                        const isLastFewRows = index >= currentRooms.length - 2;

                        return (
                          <tr key={room.roomNo} className="hover:bg-[#0EFF7B0D]">
                            <td className="px-4 py-3 h-[60px]">
                              <input
                                type="checkbox"
                                className="appearance-none w-5 h-5 border border-green-400 rounded-sm 
                                bg-black checked:bg-green-500 checked:border-green-500 
                                flex items-center justify-center 
                                checked:before:content-['✔'] checked:before:text-white 
                                checked:before:text-sm"
                                checked={selectedRooms.includes(room.roomNo)}
                                onChange={() => handleCheckboxChange(room.roomNo)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              {bedGroupIcons[room.bedGroup] || (
                                <Bed size={18} className="text-gray-400" />
                              )}
                            </td>
                            <td className="px-4 py-3">{room.bedGroup}</td>
                            <td className="px-4 py-3">{room.capacity}</td>
                            <td className="px-4 py-3">{room.occupied}</td>
                            <td className="px-4 py-3">{room.unoccupied}</td>
                            <td className="px-4 py-3 text-center relative">
                              <Menu as="div" className="relative inline-block text-left">
                                <Menu.Button className="text-gray-400 hover:text-white">
                                  <MoreHorizontal size={18} />
                                </Menu.Button>
                                <Transition as={Fragment}>
                                  <Menu.Items
                                    className={`absolute ${
                                      isLastFewRows ? "bottom-full mb-2" : "mt-2"
                                    } right-0 w-56 bg-black border border-gray-700 rounded-md shadow-lg z-50`}
                                  >
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active ? "bg-gray-800" : ""
                                          } flex items-center px-4 py-2 text-sm w-full text-white gap-2`}
                                        >
                                          <Edit className="w-5 h-5 text-blue-500" />
                                          Mark as attention needed
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => handleDeleteClick(room.roomNo)}
                                          className={`${
                                            active ? "bg-gray-800" : ""
                                          } flex items-center px-4 py-2 text-sm w-full text-white gap-2`}
                                        >
                                          <Trash2 className="w-5 h-5 text-red-500" />
                                          Delete
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            }
          />
        </Routes>
        {/* === Delete Confirmation Popup === */}
        {showDeletePopup && (
          <DeleteAppointmentPopup
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
        )}

        {/* Pagination - Only show for room management view */}
        {!isBedListRoute && (
          <div className="flex items-center h-full mt-4 bg-black p-4 rounded gap-x-4">
            {/* Info text */}
            <div className="text-sm text-white">
              Page {currentPage} of {totalPages} ({indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredRooms.length)} from{" "}
              {filteredRooms.length} Rooms)
            </div>

            {/* Controls */}
            <div className="flex items-center gap-x-2">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center rounded-full border
                  ${
                    currentPage === 1
                      ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                      : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
                  }`}
              >
                <ChevronLeft size={12} />
              </button>

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center rounded-full border
                  ${
                    currentPage === totalPages
                      ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                      : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
                  }`}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;