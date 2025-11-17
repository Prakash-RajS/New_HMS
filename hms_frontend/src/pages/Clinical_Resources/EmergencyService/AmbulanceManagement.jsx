// src/components/AmbulanceManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  Plus,
} from "lucide-react";
import EditDispatchModal from "./EditDispatch";
import EditTripModal from "./EditTrip";
import AmbulanceUnitsModal from "./AmbulanceUnits";
import { successToast, errorToast } from "../../../components/Toast.jsx";

const API_BASE = "http://localhost:8000/ambulance";

const AmbulanceManagement = () => {
  // ── STATE ─────────────────────────────────────
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

  // Data
  const [dispatchData, setDispatchData] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    onRoad: 0,
    outOfService: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [editDispatchOpen, setEditDispatchOpen] = useState(false);
  const [editTripOpen, setEditTripOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [patientList, setPatientList] = useState([]);

  const itemsPerPage = 10;

  // ── FETCH DATA ─────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dispatchRes, tripRes, unitRes, patientRes] = await Promise.all([
        fetch(`${API_BASE}/dispatch`),
        fetch(`${API_BASE}/trips`),
        fetch(`${API_BASE}/units`),
        fetch(`${API_BASE}/patients`),
      ]);

      if (!dispatchRes.ok || !tripRes.ok || !unitRes.ok || !patientRes.ok)
        throw new Error("Failed to fetch data");

      const dispatches = await dispatchRes.json();
      const trips = await tripRes.json();
      const allUnits = await unitRes.json();
      const patients = await patientRes.json();

      setPatientList(patients);
      setDispatchData(dispatches);
      setTripData(trips);
      setUnitData(allUnits);
      setUnits(allUnits);

      // Stats
      const total = allUnits.length;
      const ready = allUnits.filter((u) => u.in_service).length;
      const onRoad = trips.filter((t) => t.status === "En Route").length;
      const outOfService = total - ready;

      setStats({ total, ready, onRoad, outOfService });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── FILTER / PAGINATION / SORT ─────────────────
  const currentData =
    activeTab === "Dispatch Log"
      ? dispatchData
      : activeTab === "Trip Log"
      ? tripData
      : unitData;

  const filteredData = currentData
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
    if (typeof valA === "string")
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  // ── HANDLERS ───────────────────────────────────
  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

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

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const ids = selectedItem ? [selectedItem.id] : Array.from(selectedRows);
    const count = ids.length;
    const endpointMap = {
      "Dispatch Log": "dispatch",
      "Trip Log": "trips",
      "Ambulance Units": "units",
    };
    const endpoint = endpointMap[activeTab] || "units";
    const itemType =
      activeTab === "Dispatch Log"
        ? "dispatch"
        : activeTab === "Trip Log"
        ? "trip"
        : "unit";

    try {
      const responses = await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE}/${endpoint}/${id}`, { method: "DELETE" })
        )
      );

      const failed = responses.some((res) => !res.ok);
      if (failed) throw new Error("Some items could not be deleted");

      await fetchData();
      setSelectedRows(new Set());
      setSelectAll(false);

      successToast(
        count === 1
          ? `${
              itemType.charAt(0).toUpperCase() + itemType.slice(1)
            } deleted successfully!`
          : `${count} ${itemType}s deleted successfully!`
      );
    } catch (error) {
      errorToast(error.message || "Failed to delete item(s)");
    } finally {
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "text-green-600 dark:text-green-500";
    if (status === "En Route") return "text-blue-600 dark:text-blue-500";
    if (status === "Standby") return "text-yellow-600 dark:text-yellow-500";
    return "text-gray-600 dark:text-gray-400";
  };

  // Selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(sortedData.map((i) => i.id));
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id) => {
    const copy = new Set(selectedRows);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedRows(copy);
    setSelectAll(copy.size === sortedData.length);
  };

  const isRowSelected = (id) => selectedRows.has(id);

  // ── CREATE / EDIT HANDLERS ─────────────────────
  const handleOpenEditDispatch = (dispatch = null) => {
    setEditingDispatch(dispatch);
    setEditDispatchOpen(true);
  };

  const handleOpenEditTrip = (trip = null) => {
    setEditingTrip(trip);
    setEditTripOpen(true);
  };

  const handleOpenEditUnit = (unit = null) => {
    setEditingUnit(unit);
    setEditUnitOpen(true);
  };

  const saveDispatch = async (payload) => {
    const method = editingDispatch ? "PUT" : "POST";
    const url = editingDispatch
      ? `${API_BASE}/dispatch/${editingDispatch.id}`
      : `${API_BASE}/dispatch`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to save dispatch");
      }
      await fetchData();
      setEditDispatchOpen(false);
      setEditingDispatch(null);
      successToast(editingDispatch ? "Dispatch updated!" : "Dispatch created!");
    } catch (e) {
      errorToast(e.message || "Operation failed");
    }
  };

  const saveTrip = async (payload) => {
    const method = editingTrip ? "PUT" : "POST";
    const url = editingTrip
      ? `${API_BASE}/trips/${editingTrip.id}`
      : `${API_BASE}/trips`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchData();
      setEditTripOpen(false);
      setEditingTrip(null);
      successToast(
        editingTrip
          ? "Trip updated successfully!"
          : "Trip created successfully!"
      );
    } catch (e) {
      errorToast(
        editingTrip ? "Failed to update trip!" : "Failed to create trip!"
      );
    }
  };

  const saveUnit = async (payload) => {
    const method = editingUnit ? "PUT" : "POST";
    const url = editingUnit
      ? `${API_BASE}/units/${editingUnit.id}`
      : `${API_BASE}/units`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchData();
      setEditUnitOpen(false);
      setEditingUnit(null);
      successToast(
        editingUnit
          ? "Unit updated successfully!"
          : "Unit created successfully!"
      );
    } catch (e) {
      errorToast(
        editingUnit ? "Failed to update unit!" : "Failed to create unit!"
      );
    }
  };

  // ── RENDER ─────────────────────────────────────
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col overflow-hidden relative">
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
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-4 relative z-10">
        <div>
          <h1 className="text-[20px] font-medium flex items-center gap-2">
            Ambulance Management
          </h1>
          <p className="text-[14px] mt-2 text-gray-600 dark:text-gray-400">
            Manage ambulance dispatches, trips, and vehicle status in one place.
          </p>
        </div>
      </div>

      {/* Map + Stats + Notifications */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-6 relative z-10">
        {/* Map + Stats */}
        <div className="w-full lg:flex-1">
          <div className="w-full h-[284px] bg-white dark:bg-[#1E1E1E] rounded-xl mb-6 flex items-center justify-center text-gray-600 dark:text-gray-400">
            Map View (Google Maps/Leaflet)
          </div>
          <div className="w-full h-[91px] flex items-center justify-between rounded-lg px-6 py-[22px] bg-white dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0D0D0D]">
            {[
              { label: "Total Vehicles", value: stats.total },
              { label: "Ready", value: stats.ready, color: "green" },
              { label: "On Road", value: stats.onRoad, color: "orange" },
              {
                label: "Out of Service",
                value: stats.outOfService,
                color: "red",
              },
            ].map((s, index) => (
              <React.Fragment key={index}>
                <div className="flex-1 text-center">
                  <span className="text-sm">{s.label}</span>
                  <span
                    className={`block text-base font-medium ${
                      s.color
                        ? `text-${s.color}-600 dark:text-${s.color}-500`
                        : ""
                    }`}
                  >
                    {s.value}
                  </span>
                </div>
                {index < 3 && (
                  <div className="w-px h-10 bg-gray-300 dark:bg-[#3C3C3C]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="w-full lg:w-[320px] h-[399px] bg-gray-100 dark:bg-[#0D0D0D] border border-[#0EFF7B1A] rounded-xl p-2 flex flex-col">
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[15px] font-semibold flex items-center gap-2">
                Notifications
              </h3>
              <a href="#" className="text-[#0EFF7B] text-xs">
                View all
              </a>
            </div>
            <p className="text-xs mb-3">July 2025</p>
            <ul className="text-sm overflow-y-auto flex-1">
              <li className="py-3 border-b border-[#3C3C3C]">
                <p className="font-medium">David's vans</p>
                <p className="text-xs text-gray-400">Today at 12:03</p>
                <p className="text-xs flex items-center gap-1 mt-1">
                  Out of hours usage
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 relative z-10">
        <h1 className="text-[20px] font-medium">Transport Management</h1>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-3">
          List of all {activeTab.toLowerCase()}
        </p>
        <div className="flex gap-3">
          {["Dispatch Log", "Trip Log", "Ambulance Units"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedRows(new Set());
                setSelectAll(false);
                setCurrentPage(1);
              }}
              className={`w-[160px] h-[34px] rounded-[4px] px-3 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#025126] border-t border-r border-b-2 border-l border-[#025126] shadow-[0_0_20px_0_#0EFF7B40] text-white"
                  : "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#1E1E1E] text-black dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header + Controls */}
      <div className="relative z-10 border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4 bg-white dark:bg-transparent">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-lg font-semibold">{activeTab}</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 flex-1 sm:flex-initial">
              <Search
                size={16}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => selectedRows.size > 0 && setIsDeleteOpen(true)}
              disabled={selectedRows.size === 0}
              className={`w-8 h-8 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] flex items-center justify-center transition ${
                selectedRows.size > 0
                  ? "text-red-600 hover:bg-red-100"
                  : "text-[#0EFF7B]"
              }`}
            >
              <Trash2 size={18} />
            </button>

            {activeTab === "Ambulance Units" ? (
              <button
                onClick={() => handleOpenEditUnit()}
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#025126] text-white hover:scale-105 transition"
              >
                Add Unit
              </button>
            ) : activeTab === "Dispatch Log" ? (
              <button
                onClick={() => handleOpenEditDispatch()}
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#025126] text-white hover:scale-105 transition"
              >
                Add Dispatch
              </button>
            ) : (
              <button
                onClick={() => handleOpenEditTrip()}
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#025126] text-white hover:scale-105 transition"
              >
                Add Trip
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-200 dark:bg-[#091810] h-[52px] text-sm text-center border-b border-gray-300 dark:border-[#3C3C3C] text-[#0EFF7B]">
              <tr>
                <th className="px-3 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                  />
                </th>
                {activeTab === "Ambulance Units" ? (
                  <>
                    {[
                      { key: "unit_number", label: "Unit" },
                      { key: "vehicle_make", label: "Make" },
                      { key: "vehicle_model", label: "Model" },
                      { key: "in_service", label: "Status" },
                      { key: "notes", label: "Notes" },
                    ].map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className="cursor-pointer"
                      >
                        {c.label}{" "}
                        {sortColumn === c.key &&
                          (sortOrder === "asc" ? "Up" : "Down")}
                      </th>
                    ))}
                    <th>Action</th>
                  </>
                ) : activeTab === "Dispatch Log" ? (
                  <>
                    {[
                      { key: "dispatch_id", label: "Dispatch ID" },
                      { key: "timestamp", label: "Time" },
                      { key: "unit.unit_number", label: "Unit" },
                      { key: "dispatcher", label: "Dispatcher" },
                      { key: "call_type", label: "Type" },
                      { key: "location", label: "Location" },
                      { key: "status", label: "Status" },
                    ].map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className="cursor-pointer"
                      >
                        {c.label}{" "}
                        {sortColumn === c.key &&
                          (sortOrder === "asc" ? "Up" : "Down")}
                      </th>
                    ))}
                    <th>Action</th>
                  </>
                ) : (
                  // Trip Log
                  <>
                    {[
                      { key: "trip_id", label: "Trip ID" },
                      { key: "dispatch.dispatch_id", label: "Dispatch" },
                      { key: "unit.unit_number", label: "Unit" },
                      { key: "crew", label: "Crew" },
                      { key: "patient_id", label: "Patient" },
                      { key: "pickup_location", label: "Pickup" },
                      { key: "destination", label: "Dest" },
                      { key: "start_time", label: "Start" },
                      { key: "end_time", label: "End" },
                      { key: "mileage", label: "Mileage" },
                      { key: "status", label: "Status" },
                    ].map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className="cursor-pointer"
                      >
                        {c.label}{" "}
                        {sortColumn === c.key &&
                          (sortOrder === "asc" ? "Up" : "Down")}
                      </th>
                    ))}
                    <th>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === "Ambulance Units"
                ? sortedData.map((row) => {
                    const id = row.id;
                    return (
                      <tr
                        key={id}
                        className="text-center border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] h-[50px]"
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isRowSelected(id)}
                            onChange={() => handleRowSelect(id)}
                            className="appearance-none w-5 h-5 ml-3 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          />
                        </td>
                        <td>{row.unit_number}</td>
                        <td>{row.vehicle_make || "-"}</td>
                        <td>{row.vehicle_model || "-"}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              row.in_service
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {row.in_service ? "Ready" : "Out"}
                          </span>
                        </td>
                        <td className="text-center">{row.notes || "-"}</td>
                        <td className="px-3 py-3 flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditUnit(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Edit
                              size={14}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Trash2
                              size={14}
                              className="text-red-600 dark:text-red-500"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : activeTab === "Dispatch Log"
                ? sortedData.map((row) => {
                    const id = row.id;
                    const unitNumber = row.unit?.unit_number || "-";
                    return (
                      <tr
                        key={id}
                        className="text-center border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] h-[50px]"
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isRowSelected(id)}
                            onChange={() => handleRowSelect(id)}
                            className="appearance-none w-5 h-5 ml-3 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          />
                        </td>
                        <td>{row.dispatch_id}</td>
                        <td>{new Date(row.timestamp).toLocaleString()}</td>
                        <td>{unitNumber}</td>
                        <td>{row.dispatcher}</td>
                        <td>{row.call_type}</td>
                        <td>{row.location}</td>
                        <td className={getStatusColor(row.status)}>
                          {row.status}
                        </td>
                        <td className="px-3 py-3 flex justify-end gap-2">
                          <button className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]">
                            <Phone
                              size={14}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button
                            onClick={() => handleOpenEditDispatch(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Edit
                              size={14}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Trash2
                              size={14}
                              className="text-red-600 dark:text-red-500"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : // Trip Log - Now with Action Column
                  sortedData.map((row) => {
                    const id = row.id;
                    const unitNumber = row.unit?.unit_number || "-";
                    return (
                      <tr
                        key={id}
                        className="text-center border-b border-gray-300 dark:border-gray-800 hover:bg-[#0EFF7B1A] h-[50px]"
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isRowSelected(id)}
                            onChange={() => handleRowSelect(id)}
                            className="appearance-none w-5 h-5 ml-3 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          />
                        </td>
                        <td>{row.trip_id}</td>
                        <td>{row.dispatch?.dispatch_id || "-"}</td>
                        <td>{unitNumber}</td>
                        <td>{row.crew || "-"}</td>
                        <td>
                          {row.patient ? (
                            <div className="text-center text-xs">
                              <div className="font-medium">
                                {row.patient.patient_unique_id}
                              </div>
                              <div className="text-gray-500">
                                {row.patient.full_name}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{row.pickup_location || "-"}</td>
                        <td>{row.destination || "-"}</td>
                        <td>
                          {row.start_time
                            ? new Date(row.start_time).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>
                          {row.end_time
                            ? new Date(row.end_time).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>{row.mileage || "-"}</td>
                        <td className={getStatusColor(row.status)}>
                          {row.status}
                        </td>
                        <td className="px-3 py-3 flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditTrip(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Edit
                              size={14}
                              className="text-[#08994A] dark:text-[#0EFF7B]"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] hover:bg-[#0EFF7B33]"
                          >
                            <Trash2
                              size={14}
                              className="text-red-600 dark:text-red-500"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center h-full mt-4 bg-white dark:bg-transparent p-4 rounded gap-x-4">
          <div className="text-sm text-black dark:text-white">
            Page{" "}
            <span className="text-[#08994A] dark:text-[#0EFF7B]">
              {currentPage}
            </span>{" "}
            of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} from{" "}
            {filteredData.length}{" "}
            {activeTab === "Dispatch Log"
              ? "Dispatches"
              : activeTab === "Trip Log"
              ? "Trips"
              : "Units"}
            )
          </div>
          <div className="flex items-center gap-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
                currentPage === 1
                  ? "bg-[#0EFF7B1A] opacity-50"
                  : "bg-[#0EFF7B] hover:bg-[#0EFF7B1A]"
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
                  ? "bg-[#0EFF7B1A] opacity-50"
                  : "bg-[#0EFF7B] hover:bg-[#0EFF7B1A]"
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

      {/* MODALS */}
      <EditDispatchModal
        isOpen={editDispatchOpen}
        onClose={() => {
          setEditDispatchOpen(false);
          setEditingDispatch(null);
        }}
        dispatch={editingDispatch}
        onSave={saveDispatch}
        units={units}
      />

      <EditTripModal
        isOpen={editTripOpen}
        onClose={() => {
          setEditTripOpen(false);
          setEditingTrip(null);
        }}
        trip={editingTrip}
        onSave={saveTrip}
        units={units}
        dispatches={dispatchData}
        patients={patientList}
      />

      <AmbulanceUnitsModal
        isOpen={editUnitOpen}
        onClose={() => {
          setEditUnitOpen(false);
          setEditingUnit(null);
        }}
        unit={editingUnit}
        onSave={saveUnit}
      />

      {/* Delete Confirmation */}
    {isDeleteOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] 
      ">

      <div className="w-[400px] bg-white dark:bg-[#000000E5] rounded-[19px] p-6 relative">

        {/* Border Glow */}
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

        <div className="relative z-10">

          {/* TITLE + CLOSE BUTTON */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-black dark:text-white font-medium text-[16px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {selectedItem
                ? "Confirm Deletion"
                : "Confirm Bulk Deletion"}
            </h2>

            <button
              onClick={() => setIsDeleteOpen(false)}
              className="w-6 h-6 rounded-full border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] 
                bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#08994A] dark:text-white"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* MESSAGE */}
          <p
            className="text-sm text-black dark:text-white mb-6 text-center"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            {selectedItem ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#08994A] dark:text-[#0EFF7B]">
                  {selectedItem.trip_id ||
                    selectedItem.dispatch_id ||
                    selectedItem.unit_number}
                </span>
                ?<br />
                This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#08994A] dark:text-[#0EFF7B]">
                  {selectedRows.size} selected items
                </span>
                ?<br />
                This action cannot be undone.
              </>
            )}
          </p>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4">
            {/* Cancel */}
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#3C3C3C] 
                text-white font-medium text-[14px] shadow-[0_2px_12px_0px_#00000040] 
                bg-black dark:bg-transparent hover:bg-gray-800 dark:hover:bg-[#3A3A3A] transition"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Cancel
            </button>

            {/* Delete */}
            <button
              onClick={confirmDelete}
              className="w-[144px] h-[32px] rounded-[8px] px-3 py-2 flex items-center justify-center 
                bg-gradient-to-r from-[#FF4D4D] to-[#B30000] 
                text-white font-medium text-[14px] hover:scale-105 transition 
                shadow-[0_2px_12px_0px_#00000040]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Delete {selectedItem ? "" : `(${selectedRows.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AmbulanceManagement;
