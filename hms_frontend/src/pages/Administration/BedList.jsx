import React, { useState, useMemo, Fragment } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DeleteAppointmentPopup from "./DeleteRoomListPopup";
import AddBedGroupPopup from "./AddBedGroupPopup";
import EditBedGroupPopup from "./EditBedGroupPopup";

const BedList = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bedGroupFilter, setBedGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 9;

  const [roomsData, setRoomsData] = useState([
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 80,
      unoccupied: 70,
      status: "Available",
      bedRange: "80 - 100",
    },
    {
      bedGroup: "Ward",
      capacity: 150,
      occupied: 90,
      unoccupied: 60,
      status: "Available",
      bedRange: "80 - 100",
    },
    {
      bedGroup: "Cabin",
      capacity: 150,
      occupied: 100,
      unoccupied: 50,
      status: "Not Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "Special ward",
      capacity: 150,
      occupied: 70,
      unoccupied: 80,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "PACU",
      capacity: 150,
      occupied: 85,
      unoccupied: 65,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "PACU",
      capacity: 150,
      occupied: 95,
      unoccupied: 55,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 75,
      unoccupied: 75,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "NICU",
      capacity: 150,
      occupied: 110,
      unoccupied: 40,
      status: "Not Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 88,
      unoccupied: 62,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "NICU",
      capacity: 150,
      occupied: 110,
      unoccupied: 40,
      status: "Not Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 88,
      unoccupied: 62,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "NICU",
      capacity: 150,
      occupied: 110,
      unoccupied: 40,
      status: "Not Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 88,
      unoccupied: 62,
      status: "Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "NICU",
      capacity: 150,
      occupied: 110,
      unoccupied: 40,
      status: "Not Available",
      bedRange: "1 - 150",
    },
    {
      bedGroup: "ICU",
      capacity: 150,
      occupied: 88,
      unoccupied: 62,
      status: "Available",
      bedRange: "1 - 150",
    },
  ]);

  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      if (
        searchTerm &&
        !room.bedGroup.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (
        filterValue &&
        filterValue !== "All" &&
        room.bedGroup !== filterValue
      ) {
        return false;
      }
      if (
        bedGroupFilter &&
        bedGroupFilter !== "All" &&
        room.bedGroup !== bedGroupFilter
      ) {
        return false;
      }
      if (statusFilter && room.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [roomsData, searchTerm, filterValue, bedGroupFilter, statusFilter]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  const handleCheckboxChange = (index) => {
    if (selectedRooms.includes(index)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== index));
    } else {
      setSelectedRooms([...selectedRooms, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === currentRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(currentRooms.map((_, index) => index));
    }
  };

  const handleDeleteClick = (index) => {
    setRoomToDelete(index);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete !== null) {
      setRoomsData((prev) => prev.filter((_, i) => i !== roomToDelete));
      setSelectedRooms((prev) => prev.filter((r) => r !== roomToDelete));
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

  const getRoomRange = (occupied) => {
    const start = Math.floor(occupied / 20) * 20;
    const end = start + 20;
    return `${start} to ${end}`;
  };
  const handleUpdateBedGroup = (index, updatedData) => {
    const { bedGroupName, bedFrom, bedTo } = updatedData;
    const capacity = parseInt(bedTo) - parseInt(bedFrom) + 1;
    setRoomsData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        bedGroup: bedGroupName,
        capacity,
        bedRange: `${bedFrom} - ${bedTo}`,
        unoccupied: capacity - newData[index].occupied,
      };
      return newData;
    });
  };

  const handleAddBedGroup = (newGroup) => {
    const { bedGroupName, bedFrom, bedTo } = newGroup;
    const capacity = parseInt(bedTo) - parseInt(bedFrom) + 1;
    const newEntry = {
      bedGroup: bedGroupName,
      capacity,
      occupied: 0,
      unoccupied: capacity,
      status: "Available",
      bedRange: `${bedFrom} - ${bedTo}`, // <-- store the actual range
    };
    setRoomsData((prev) => [...prev, newEntry]);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[504px] h-auto rounded-[20px]  bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md">
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
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-white"
          >
            <X size={20} />
          </button>

          <h3 className="text-black dark:text-white text-lg font-semibold mb-4">
            Filter
          </h3>

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
              <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">
                Status
              </label>
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

  const isBedListRoute = location.pathname.includes("BedList");

  return (
    <div className="h-auto max-h-auto mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl w-full max-w-[1400px] mx-auto dark:border-[#1E1E1E]">
      <div
        className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-6 w-full max-w-[1400px] mx-auto flex flex-col  
     bg-white dark:bg-transparent overflow-hidden relative"
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
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Room Management
          </h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center gap-2 bg-[#08994A] dark:bg-green-500 border-b-[2px] border-[#0EFF7B] dark:border-[#0EFF7B] hover:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-green-600 px-4 py-2 rounded-[8px] text-white dark:text-white font-semibold"
            style={{
              background:
                "linear-gradient(92.18deg, #025126 3.26%, #0D7F41 50.54%, #025126 97.83%)",
            }}
          >
            <Plus size={18} className="text-white dark:text-white" /> Add Bed
            Group
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-7">
          You have total 7 types bed group.
        </p>

        {/* Filter + Search */}
        <div className="flex justify-between items-center mb-4">
          <Listbox value={filterValue} onChange={setFilterValue}>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-green-400 rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-white checked:before:text-sm"
                checked={
                  selectedRooms.length === currentRooms.length &&
                  currentRooms.length > 0
                }
                onChange={handleSelectAll}
              />
              <div className="relative">
                <Listbox.Button className="flex items-center justify-between px-4 h-[40px] rounded-[8px] border border-[#0EFF7B] dark:border-[#3C3C3C] bg-white dark:bg-[#1E1E1E] text-[#08994A] dark:text-white min-w-[120px]">
                  {filterValue}
                  <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-green-400 ml-2" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-white dark:bg-black shadow-lg z-50 border border-[#0EFF7B] dark:border-[#3A3A3A]">
                  {[
                    "All",
                    "ICU",
                    "Ward",
                    "Cabin",
                    "PACU",
                    "Special ward",
                    "NICU",
                  ].map((option, idx) => (
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
              <button
                onClick={
                  isBedListRoute
                    ? handleRoomManagementClick
                    : handleBedListClick
                }
                className={`flex items-center gap-2 px-4 h-[40px]  rounded-[8px] text-sm border border-[#0EFF7B] dark:border-green-400 text-[#08994A] dark:text-white transition ${
                  isBedListRoute
                    ? "text-[#08994A] dark:text-white border-[#0EFF7B66] bg-[#0EFF7B1A] dark:bg-[#025126] dark:shadow-[0px_0px_20px_0px_#0EFF7B40]"
                    : "text-white border-[#0EFF7B66] bg-[#0EFF7B1A] dark:bg-[#025126] dark:shadow-[0px_0px_20px_0px_#0EFF7B40]"
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5  rounded-[4px]">
                  <FileText size={18} className="text-[#0EFF7B]" />
                </span>
                Bed group lists
              </button>
            </div>
          </Listbox>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#0EFF7B] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] rounded-[8px] px-3 py-1 w-[315px] h-[42px] relative">
              <Search
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
              <input
                type="text"
                placeholder="Search Bed Group Names"
                className="bg-transparent text-[#08994A] dark:text-[#0EFF7B] placeholder-[#0EFF7B] w-full outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-[#1E1E1E] text-[#08994A] dark:text-[#0EFF7B] px-4 py-2 rounded-[8px] border border-[#0EFF7B] dark:border-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] relative"
            >
              <Filter
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />{" "}
              Filter
            </button>
          </div>
        </div>

        {/* Filter Popover */}
        <FilterPopover
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        {/* Table */}
        <Routes>
          <Route
            index
            element={
              <div className="flex-1 overflow-hidden">
                <div
                  style={{
                    height: "auto",
                  }}
                >
                  <table className="w-full text-left text-sm mt-5 mb-3 border-collapse">
                    <thead className="bg-[#F5F6F5] dark:bg-[#091810] border border-[#0EFF7B] dark:border-[#3C3C3C] text-[#08994A] dark:text-white text-[15px] sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 w-[50px] h-[52px]">
                          <input
                            type="checkbox"
                            className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-green-400 rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-white checked:before:text-sm"
                            checked={
                              selectedRooms.length === currentRooms.length &&
                              currentRooms.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3">Bed Group</th>
                        <th className="px-4 py-3">Bed No's</th>
                        <th className="px-4 py-3">Capacity</th>
                        <th className="px-4 py-3">Occupied Bed</th>
                        <th className="px-4 py-3">Unoccupied Bed</th>
                        <th className="px-4 py-3 w-[80px] text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-3 bg-white dark:bg-black">
                      {currentRooms.length > 0 ? (
                        currentRooms.map((room, index) => {
                          const isLastFewRows =
                            index >= currentRooms.length - 2;
                          return (
                            <tr
                              key={index}
                              className="border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                            >
                              <td className="px-4 py-3 h-[60px] ">
                                <input
                                  type="checkbox"
                                  className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-green-400 rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-white checked:before:text-sm"
                                  checked={selectedRooms.includes(index)}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                              <td className="px-4 py-3 text-black dark:text-white">
                                {room.bedGroup}
                              </td>
                              <td className="px-4 py-3 text-black dark:text-white">
                                {getRoomRange(room.occupied)}
                              </td>
                              <td className="px-4 py-3 text-black dark:text-white">
                                {room.capacity}
                              </td>
                              <td className="px-4 py-3 text-black dark:text-white">
                                {room.occupied}
                              </td>
                              <td className="px-4 py-3 text-black dark:text-white">
                                {room.unoccupied}
                              </td>
                              <td className="px-4 py-3 text-center relative">
                                <Menu
                                  as="div"
                                  className="relative inline-block text-left"
                                >
                                  <Menu.Button className="text-gray-600  dark:text-gray-400 hover:text-[#08994A] dark:hover:text-white">
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
                                    <Menu.Items
                                      className={`absolute ${
                                        isLastFewRows
                                          ? "bottom-full mb-2"
                                          : "mt-2"
                                      } right-0 w-36 bg-white dark:bg-black border border-[#0EFF7B] dark:border-gray-700 rounded-md shadow-lg z-50`}
                                    >
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => {
                                              setEditingRoomIndex(index);
                                              setShowEditPopup(true);
                                            }}
                                            className={`${
                                              active
                                                ? "bg-[#0EFF7B1A] dark:bg-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                                                : ""
                                            } flex items-center px-4 py-2 text-sm w-full text-black dark:text-white gap-2`}
                                          >
                                            <Edit className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                            Edit
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() =>
                                              handleDeleteClick(index)
                                            }
                                            className={`${
                                              active
                                                ? "bg-[#0EFF7B1A] dark:bg-gray-800 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                                                : ""
                                            } flex items-center px-4 py-2 text-sm w-full text-black dark:text-white gap-2`}
                                          >
                                            <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
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
                        })
                      ) : (
                        <tr className="h-[60px] bg-white dark:bg-black">
                          <td
                            colSpan="7"
                            className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                          >
                            No rooms found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <DeleteAppointmentPopup
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
        )}
        {showAddPopup && (
          <AddBedGroupPopup
            onClose={() => setShowAddPopup(false)}
            onAdd={handleAddBedGroup}
          />
        )}
        {showEditPopup && editingRoomIndex !== null && (
          <EditBedGroupPopup
            onClose={() => setShowEditPopup(false)}
            onUpdate={(updatedRoom) =>
              handleUpdateBedGroup(editingRoomIndex, updatedRoom)
            }
            data={{
              bedGroupName: roomsData[editingRoomIndex].bedGroup,
              bedFrom: roomsData[editingRoomIndex].bedRange.split(" - ")[0],
              bedTo: roomsData[editingRoomIndex].bedRange.split(" - ")[1],
            }}
          />
        )}
        {/* Pagination */}
        {isBedListRoute && (
          <div className="flex items-center h-full  bg-white dark:bg-black p-4 rounded gap-x-4 dark:border-[#1E1E1E]">
            <div className="text-sm text-black dark:text-white">
              Page{" "}
              <span className="text-[#08994A] dark:text-[#0EFF7B]">
                {currentPage}
              </span>{" "}
              of {totalPages} ({indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredRooms.length)} from{" "}
              {filteredRooms.length} Rooms)
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
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
        )}
      </div>
    </div>
  );
};

export default BedList;
