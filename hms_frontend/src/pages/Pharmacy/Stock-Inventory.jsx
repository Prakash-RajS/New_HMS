import React, { useState, useEffect, useRef, useMemo } from "react";
import { Listbox } from "@headlessui/react";
import { successToast, errorToast } from "../../components/Toast";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Trash2,
  DollarSign,
  Filter,
  Package,
  AlertTriangle,
  XCircle,
  X,
  Edit2,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/stock";

const DeleteStockList = ({ onConfirm, onCancel, itemsToDelete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="rounded-[20px] p-[1px] backdrop-blur-md ">
        <div className="w-[400px] bg-white dark:bg-[#000000E5] rounded-[19px] p-5 relative">
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
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Confirm Deletion
              </h2>
              <button
                onClick={onCancel}
                className="w-6 h-6 rounded-full border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] flex items-center justify-center"
              >
                <X size={16} className="text-[#08994A] dark:text-white" />
              </button>
            </div>
            <p
              className="text-sm text-black dark:text-white mb-6"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Are you sure you want to delete {itemsToDelete.length} item(s)?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#3C3C3C] text-white font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] opacity-100 bg-black dark:bg-transparent dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="w-[144px] h-[32px] rounded-[8px] px-3 py-2 flex items-center justify-center
     bg-gradient-to-r from-[#FF4D4D] to-[#B30000]
     text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition shadow-[0_2px_12px_0px_#00000040]"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Today");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("Aug");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddStockPopup, setShowAddStockPopup] = useState(false);
  const [showEditStockPopup, setShowEditStockPopup] = useState(false);
  const [editStockId, setEditStockId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSingleDeletePopup, setShowSingleDeletePopup] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStock, setNewStock] = useState({
    product_name: "",
    dosage: "",
    category: "",
    batch_number: "",
    vendor: "",
    vendor_id: "",
    quantity: "",
    item_code: "",
    rack_no: "",
    shelf_no: "",
    unit_price: "",
    status: "IN STOCK",
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const categories = [
    "Local Anesthesia",
    "Antiseptics",
    "Antibiotics",
    "Anti-inflammatory",
    "Analgesics",
    "Steroid",
    "Antifungal",
  ];
  const itemsPerPage = 9;

  // === API Functions ===
  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stocks: ${response.status}`);
      }
      const data = await response.json();
      const transformedData = data.map((item) => ({
        id: item.id,
        name: item.product_name,
        dosage: item.dosage || "",
        category: item.category,
        batch: item.batch_number,
        vendor: item.vendor,
        vendorCode: item.vendor_id,
        stock: item.quantity,
        status: mapStatusToFrontend(item.status),
        item_code: item.item_code,
        rack_no: item.rack_no,
        shelf_no: item.shelf_no,
        unit_price: item.unit_price,
        raw: item,
      }));
      setInventoryData(transformedData);
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError(err.message);
      errorToast("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (stockData) => {
    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add stock");
      }
      successToast("Stock added successfully!");
      return await response.json();
    } catch (err) {
      console.error("Error adding stock:", err);
      errorToast(err.message || "Failed to add stock");
      throw err;
    }
  };

  const updateStock = async (stockId, stockData) => {
    try {
      const response = await fetch(`${API_BASE}/edit/${stockId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update stock");
      }
      successToast("Stock updated successfully!");
      return await response.json();
    } catch (err) {
      console.error("Error updating stock:", err);
      errorToast(err.message || "Failed to update stock");
      throw err;
    }
  };

  const deleteStock = async (stockId) => {
    try {
      const response = await fetch(`${API_BASE}/delete/${stockId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete stock: ${response.status}`);
      }
      successToast("Stock deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting stock:", err);
      errorToast(err.message || "Failed to delete stock");
      throw err;
    }
  };

  // Helper function to map backend status to frontend status
  const mapStatusToFrontend = (backendStatus) => {
    const statusMap = {
      available: "IN STOCK",
      low_stock: "LOW STOCK",
      out_of_stock: "OUT OF STOCK",
      "IN STOCK": "IN STOCK",
      "LOW STOCK": "LOW STOCK",
      "OUT OF STOCK": "OUT OF STOCK",
    };
    return statusMap[backendStatus] || "IN STOCK";
  };

  // Helper function to map frontend status to backend status
  const mapStatusToBackend = (frontendStatus) => {
    const statusMap = {
      "IN STOCK": "available",
      "LOW STOCK": "low_stock",
      "OUT OF STOCK": "out_of_stock",
    };
    return statusMap[frontendStatus] || "available";
  };

  // Fetch stocks on component mount
  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        !dropdownRefs.current[openDropdownId]?.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

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

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    setSelectAll(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === displayedData.length) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(displayedData.map((row) => row.id));
      setSelectAll(true);
    }
  };

  const handleDeleteSingle = async (id) => {
    try {
      await deleteStock(id);
      await fetchStocks();
      setShowSingleDeletePopup(false);
      setSingleDeleteId(null);
    } catch (err) {
      console.error("Error deleting stock:", err);
      setError("Failed to delete stock");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedRows.map((id) => deleteStock(id));
      await Promise.all(deletePromises);
      await fetchStocks();
      setSelectedRows([]);
      setSelectAll(false);
      setShowDeletePopup(false);
    } catch (err) {
      console.error("Error deleting selected stocks:", err);
      setError("Failed to delete some stocks");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const stockData = {
        product_name: newStock.product_name,
        dosage: newStock.dosage,
        category: newStock.category,
        batch_number: newStock.batch_number,
        vendor: newStock.vendor,
        quantity: parseInt(newStock.quantity) || 0,
        vendor_id: newStock.vendor_id,
        item_code: newStock.item_code,
        rack_no: newStock.rack_no,
        shelf_no: newStock.shelf_no,
        unit_price: parseFloat(newStock.unit_price) || 0,
        status: mapStatusToBackend(newStock.status),
      };
      await addStock(stockData);
      await fetchStocks(); // Refresh the list
      setShowAddStockPopup(false);
      setNewStock({
        product_name: "",
        dosage: "",
        category: "",
        batch_number: "",
        vendor: "",
        vendor_id: "",
        quantity: "",
        item_code: "",
        rack_no: "",
        shelf_no: "",
        unit_price: "",
        status: "IN STOCK",
      });
    } catch (err) {
      console.error("Error adding stock:", err);
      setError(err.message || "Failed to add stock");
    }
  };

  const handleEditStock = async (e) => {
    e.preventDefault();
    try {
      const stockData = {
        product_name: newStock.product_name,
        dosage: newStock.dosage,
        category: newStock.category,
        batch_number: newStock.batch_number,
        vendor: newStock.vendor,
        quantity: parseInt(newStock.quantity) || 0,
        vendor_id: newStock.vendor_id,
        item_code: newStock.item_code,
        rack_no: newStock.rack_no,
        shelf_no: newStock.shelf_no,
        unit_price: parseFloat(newStock.unit_price) || 0,
        status: mapStatusToBackend(newStock.status),
      };
      await updateStock(editStockId, stockData);
      await fetchStocks(); // Refresh the list
      setShowEditStockPopup(false);
      setNewStock({
        product_name: "",
        dosage: "",
        category: "",
        batch_number: "",
        vendor: "",
        vendor_id: "",
        quantity: "",
        item_code: "",
        rack_no: "",
        shelf_no: "",
        unit_price: "",
        status: "IN STOCK",
      });
      setEditStockId(null);
    } catch (err) {
      console.error("Error updating stock:", err);
      setError(err.message || "Failed to update stock");
    }
  };

  const openEditPopup = (item) => {
    console.log("Editing item:", item);
    setNewStock({
      product_name: item.name,
      dosage: item.dosage || "",
      category: item.category,
      batch_number: item.batch,
      vendor: item.vendor,
      vendor_id: item.vendorCode,
      quantity: item.stock.toString(),
      status: item.status, // Use frontend status directly
      item_code: item.item_code || "",
      rack_no: item.rack_no || "",
      shelf_no: item.shelf_no || "",
      unit_price: item.unit_price?.toString() || "0",
    });
    setEditStockId(item.id);
    setShowEditStockPopup(true);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Calculate statistics from actual data
  const statistics = useMemo(() => {
    const totalStocks = inventoryData.length;
    const outOfStock = inventoryData.filter(
      (item) => item.status === "OUT OF STOCK"
    ).length;
    const lowStock = inventoryData.filter(
      (item) => item.status === "LOW STOCK"
    ).length;
    // Calculate total value (simplified)
    const totalValue = inventoryData.reduce((sum, item) => {
      return sum + item.stock * (item.unit_price || 0);
    }, 0);
    return {
      totalValue: `$${totalValue.toLocaleString()}`,
      inventoryStock: totalStocks,
      outOfStock: outOfStock,
      lowStock: lowStock,
    };
  }, [inventoryData]);

  const years = ["2023", "2024", "2025", "2026"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const Dropdown = ({ label, value, onChange, options }) => (
    <div>
      <label
        className="text-sm text-black dark:text-white"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-[228px]">
          <Listbox.Button
            className="w-full h-[32px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
        bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            {value || "Select Option"}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-black dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full rounded-[8px] bg-white dark:bg-[#000000] shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-3 text-sm rounded-[4px] ${
                    active
                      ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                      : "text-black dark:text-white"
                  } ${
                    selected
                      ? "font-medium text-[#08994A] dark:text-[#0EFF7B]"
                      : ""
                  }`
                }
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  if (loading && inventoryData.length === 0) {
    return (
      <div className="mt-[80px] mb-4 flex items-center justify-center h-64">
        <div className="text-black dark:text-white text-lg">
          Loading stock data...
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-[8px] p-4 w-full max-w-[1400px] mx-auto flex flex-col
     bg-white dark:bg-transparent overflow-hidden relative"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div
        className="absolute inset-0 rounded-[8px] pointer-events-none dark:block hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,56,27,0.25) 16%, rgba(15,15,15,0.25) 48.97%)",
          zIndex: 0,
        }}
      ></div>
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
      <div className="flex justify-between items-center mb-6 mt-4 w-full">
        <div>
          <h1
            className="text-[20px] font-medium text-black dark:text-white"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Stock & Inventory
          </h1>
          <p
            className="text-[14px] mt-2 text-gray-600 dark:text-gray-400"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Manage stock items, track inventory levels, and monitor stock status
            in real-time.
          </p>
        </div>
        <button
          onClick={() => setShowAddStockPopup(true)}
          className="w-[200px] h-[40px] flex items-center justify-center
            bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)]
            border-b-[2px] border-[#0EFF7B]
            shadow-[0px_2px_12px_0px_#00000040]
            hover:opacity-90
            text-white font-semibold
            px-4 py-2 rounded-[8px]
            transition duration-300 ease-in-out"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          + Add Stock
        </button>
      </div>
      <div className="flex items-center justify-between w-full mb-6 text-sm">
        <div className="flex gap-4">
          {["Today", "Week", "Month", "Year"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-[#025126] text-white shadow-[0px_2px_12px_0px_#0EFF7B40]"
                  : "bg-gray-300 dark:bg-[#1E1E1E] text-black dark:text-gray-300 hover:bg-[#08994A]/30"
              }`}
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Year
            </span>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none bg-white dark:bg-[#0D0D0D] shadow-[0_0_4px_0_#0EFF7B] text-black dark:text-white border border-[#08994A] rounded-md px-4 py-1 pr-8 focus:outline-none"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-2 text-[#08994A] pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Month
            </span>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="appearance-none bg-white dark:bg-[#0D0D0D] shadow-[0_0_4px_0_#0EFF7B] text-black dark:text-white border border-[#08994A] rounded-md px-4 py-1 pr-8 focus:outline-none"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-2 text-[#08994A] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="bg-gray-100 dark:bg-[#0D0D0D] px-6 py-6 w-full h-[102px] rounded-2xl mb-6">
        <div className="grid grid-cols-4 gap-6 text-sm">
          {[
            {
              label: "Total Value",
              value: statistics.totalValue,
              icon: <DollarSign className="w-6 h-6 text-green-400" />,
              ring: "ring-green-600/60 bg-green-200/10 dark:bg-green-900/10",
            },
            {
              label: "Inventory Items",
              value: statistics.inventoryStock.toLocaleString(),
              icon: <Package className="w-6 h-6 text-amber-500" />,
              ring: "ring-amber-600/60 bg-amber-200/10 dark:bg-amber-900/10",
            },
            {
              label: "Out of Stock",
              value: statistics.outOfStock.toLocaleString(),
              icon: <AlertTriangle className="w-6 h-6 text-gray-400" />,
              ring: "ring-gray-600/60 bg-gray-200/10 dark:bg-gray-900/10",
            },
            {
              label: "Low Stock",
              value: statistics.lowStock.toLocaleString(),
              icon: <XCircle className="w-6 h-6 text-indigo-400" />,
              ring: "ring-indigo-600/60 bg-indigo-200/10 dark:bg-indigo-900/10",
            },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-[27px]">
              <div
                className={`flex items-center justify-center w-12 h-12 ml-6 rounded-full ring-2 ${stat.ring}`}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  className="font-normal text-[12px] leading-[100%] tracking-normal text-black dark:text-white mb-3"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  {stat.label}
                </p>
                <p
                  className="font-bold text-[16px] leading-[100%] tracking-normal text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap w-full gap-4 mb-6">
        <div className="flex-1 min-w-[280px] lg:min-w-[350px] h-[200px] rounded-lg border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] p-3 bg-white dark:bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
          <h3
            className="text-[#08994A] dark:text-[#0EFF7B] text-[14px] font-semibold mb-1"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            DEPARTMENT STOCKS
          </h3>
          <hr className="border-gray-300 dark:border-[#333] mb-6" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-5 mr-6">
              <div className="flex items-center gap-3">
                <span className="min-w-[14px] h-[14px] rounded-full bg-[#0EFF7B] inline-block"></span>
                <span
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Medical Dept
                </span>
                <span
                  className="text-gray-600 dark:text-[#A0A0A0] text-sm"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  60%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="min-w-[14px] h-[14px] rounded-full bg-[#0A7239] inline-block"></span>
                <span
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Surgical Dept
                </span>
                <span
                  className="text-gray-600 dark:text-[#A0A0A0] text-sm"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  30%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="min-w-[14px] h-[14px] rounded-full bg-[#D7FDE8] inline-block"></span>
                <span
                  className="text-sm text-black dark:text-white"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  Supportive &<br /> Diagnostic Dept
                </span>
                <span
                  className="text-gray-600 dark:text-[#A0A0A0] text-sm"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  10%
                </span>
              </div>
            </div>
            <svg viewBox="0 0 36 36" width="100" height="100">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="gray-200 dark:stroke-[#242424]"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#18FF96"
                strokeWidth="4"
                strokeDasharray="60 100"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#1AB873"
                strokeWidth="4"
                strokeDasharray="30 100"
                strokeDashoffset="60"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#C9FFE1"
                strokeWidth="4"
                strokeDasharray="10 100"
                strokeDashoffset="90"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-[250px] h-[200px] rounded-lg border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] p-3 bg-white dark:bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
          <h3 className="flex justify-between text-[15px] font-semibold mb-1">
            <span
              className="text-[#6E92FF] dark:text-[#6E92FF] text-[14px] uppercase flex items-center gap-1"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <span>○</span> UPCOMING STOCKS
            </span>
            <span
              className="text-[#08994A] dark:text-[#0EFF7B] text-[12px] cursor-pointer"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              View all (80)
            </span>
          </h3>
          <hr className="border-gray-300 dark:border-[#222] mb-6" />
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Ibuprofen
              </span>
              <div className="flex gap-x-2">
                <span
                  className="text-[#08994A] dark:text-[#0EFF7B]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  +145
                </span>
                <span
                  className="text-gray-600 dark:text-gray-400 text-xs"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  29 Aug 25
                </span>
              </div>
            </li>
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Amoxicillin
              </span>
              <div className="flex gap-x-2">
                <span
                  className="text-[#08994A] dark:text-[#0EFF7B]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  +120
                </span>
                <span
                  className="text-gray-600 dark:text-gray-400 text-xs"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  29 Aug 25
                </span>
              </div>
            </li>
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Disinfectant skin antiseptic
              </span>
              <div className="flex gap-x-2">
                <span
                  className="text-[#08994A] dark:text-[#0EFF7B]"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  +200
                </span>
                <span
                  className="text-gray-600 dark:text-gray-400 text-xs"
                  style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                  29 Aug 25
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-1 min-w-[280px] lg:min-w-[350px] h-[200px] rounded-lg border border-[#0EFF7B1A] dark:border-[#0EFF7B1A] p-3 bg-white dark:bg-black shadow-[0px_0px_2px_0px_#A0A0A040]">
          <h3 className="flex justify-between text-[15px] font-semibold mb-1">
            <span
              className="text-[#FF2424] dark:text-[#FF2424] text-[14px] uppercase flex items-center gap-1"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <span>○</span> EXPIRING STOCKS
            </span>
            <span
              className="text-[#08994A] dark:text-[#0EFF7B] text-[12px] cursor-pointer"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              View all (150)
            </span>
          </h3>
          <hr className="border-gray-300 dark:border-[#222] mb-4" />
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Mask 4-layered
              </span>
              <span
                className="text-gray-600 dark:text-gray-400 text-xs"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                30 available
              </span>
            </li>
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Disinfectant chlorhexidine bigluconate 0.05%
              </span>
              <span
                className="text-gray-600 dark:text-gray-400 text-xs"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                100 available
              </span>
            </li>
            <li className="flex justify-between">
              <span
                className="text-black dark:text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                Disinfectant skin antiseptic
              </span>
              <span
                className="text-gray-600 dark:text-gray-400 text-xs"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                150 available
              </span>
            </li>
          </ul>
        </div>
      </div>
      <h3
        className="w-full h-[22px] font-medium text-[18px] leading-[22px] tracking-normal text-black dark:text-white mb-1"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        Stock list
      </h3>
      <p
        className="text-[14px] leading-[18px] text-[#A0A0A0] mt-3 mb-4"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        List of all stock items ({inventoryData.length} total)
      </p>
      <div className="w-full bg-[#ffffff] dark:bg-[#0D0D0D] border border-[#0EFF7B] dark:border-[#3C3C3C] rounded-[12px] p-4 space-y-4">
        <div className="flex justify-between items-center w-full">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-[180px] h-[32px] flex justify-between items-center px-3 py-1.5 rounded-[20px] bg-white dark:bg-black shadow-[0_0_4px_0_#0EFF7B] border border-[#08994A] text-black dark:text-white text-[12px] font-medium"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {selectedCategory || "All"}{" "}
              <ChevronDown
                size={16}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full mt-2 left-0 w-[180px] bg-white dark:bg-[#000000] p-2 rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] shadow-[0_0_4px_0_#FFFFFF1F] z-10">
                <div className="max-h-36 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <ul className="text-black dark:text-white text-sm">
                    {["All", ...categories].map((cat) => (
                      <li
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E] rounded-[4px] cursor-pointer"
                        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group flex items-center gap-2 bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] rounded-[40px] px-3 py-2 min-w-[229px] max-w-md">
              <Search
                size={16}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Search
                  </span>
              <input
                type="text"
                placeholder="Search Product Name.."
                className="bg-transparent outline-none text-sm text-[#08994A] placeholder-[#5CD592] dark:text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterPopup(!showFilterPopup)}
                className="relative group bg-gray-100 dark:bg-[#0EFF7B1A] rounded-[20px] w-[32px] h-[32px] flex items-center justify-center text-[#08994A] dark:text-white hover:bg-[#0EFF7B1A]"
              >
                <Filter size={16} className="text-[#0EFF7B]" />
                <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Filter
                  </span>
              </button>
              {showFilterPopup && (
                <div className="absolute top-full mt-4 left-[-110px] w-[188px] gap-[12px] rounded-[20px] border border-[#0EFF7B] dark:border-[#1E1E1E] p-[18px_12px] bg-white dark:bg-[#000000E5] shadow-[0_0_4px_0_#FFFFFF1F] flex flex-col z-50">
                  <button
                    onClick={() => setFilterStatus("IN STOCK")}
                    className={`w-full h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-normal ${
                      filterStatus === "IN STOCK"
                        ? "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] text-[#08994A] dark:text-[#0EFF7B]"
                        : "bg-transparent text-[#08994A] dark:text-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E]"
                    }`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className="w-[8px] h-[8px] rounded-full bg-[#08994A] dark:bg-[#0EFF7B] inline-block mr-2"></span>
                    IN STOCK
                  </button>
                  <button
                    onClick={() => setFilterStatus("LOW STOCK")}
                    className={`w-full h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-normal ${
                      filterStatus === "LOW STOCK"
                        ? "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] text-[#FF930E] dark:text-[#FF930E]"
                        : "bg-transparent text-[#FF930E] dark:text-[#FF930E] hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E]"
                    }`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className="w-[8px] h-[8px] rounded-full bg-[#FF930E] inline-block mr-2"></span>
                    LOW STOCK
                  </button>
                  <button
                    onClick={() => setFilterStatus("OUT OF STOCK")}
                    className={`w-full h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-normal ${
                      filterStatus === "OUT OF STOCK"
                        ? "bg-[#0EFF7B1A] dark:bg-[#1E1E1E] text-[#FF2424] dark:text-[#FF2424]"
                        : "bg-transparent text-[#FF2424] dark:text-[#FF2424] hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E]"
                    }`}
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className="w-[8px] h-[8px] rounded-full bg-[#FF2424] inline-block mr-2"></span>
                    OUT OF STOCK
                  </button>
                  <div className="h-px bg-gray-300 dark:bg-[#3A3A3A] my-1"></div>
                  <button
                    onClick={() => {
                      setFilterStatus("All");
                      setShowFilterPopup(false);
                    }}
                    className="w-full h-[25px] flex items-center justify-start px-3 rounded text-[14px] text-left font-normal bg-transparent text-gray-600 dark:text-gray-400 hover:bg-[#0EFF7B1A] dark:hover:bg-[#1E1E1E] hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    <span className="w-[8px] h-[8px] rounded-full bg-gray-400 dark:bg-gray-600 inline-block mr-2"></span>
                    RESET
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                selectedRows.length > 0 && setShowDeletePopup(true)
              }
              disabled={selectedRows.length === 0}
              className={`
                relative group flex items-center justify-center
                w-[32px] h-[32px]
                rounded-[20px]
                bg-gray-100 dark:bg-[#0EFF7B1A]
                text-[#08994A] dark:text-white
                ${
                  selectedRows.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              <Trash2 size={16} className="text-[#0EFF7B]" />
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Delete  
                  </span>
            </button>
          </div>
        </div>
        <div className="overflow-x-hidden">
          <table className="w-full border-collapse rounded-[8px] min-w-[800px]">
            <thead className="border border-[#0EFF7B] dark:border-[#3C3C3C] bg-[#F5F6F5] dark:bg-[#091810] h-[52px] text-left text-sm text-[#08994A] dark:text-white">
              <tr className="h-[52px] bg-gray-100 dark:bg-[#091810] text-left text-[16px] text-[#0EFF7B] dark:text-[#0EFF7B] rounded-[8px] ">
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                    checked={
                      displayedData.length > 0 &&
                      selectedRows.length === displayedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                {[
                  { label: "Name", key: "name" },
                  { label: "Dosage", key: "dosage" },
                  { label: "Categories", key: "category" },
                  { label: "Batch number", key: "batch" },
                  { label: "Vendor", key: "vendor" },
                  { label: "Available stocks", key: "stock" },
                  { label: "Status", key: "status" },
                  { label: "Action", key: "action" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`px-3 py-3 font-medium ${
                      col.key !== "action" ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={
                      col.key !== "action"
                        ? () => handleSort(col.key)
                        : undefined
                    }
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    {col.key !== "action" ? (
                      <div className="flex items-center gap-1">
                        {col.label}
                        <div className="flex flex-col ml-1">
                          <svg
                            className={`w-3 h-3 ${
                              sortColumn === col.key && sortOrder === "asc"
                                ? "stroke-[#08994A] dark:stroke-[#0EFF7B]"
                                : "stroke-gray-500"
                            }`}
                            viewBox="0 0 20 20"
                            fill="none"
                            strokeWidth="2"
                          >
                            <path
                              d="M10 4 L16 10 L4 10 Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <svg
                            className={`w-3 h-3 ${
                              sortColumn === col.key && sortOrder === "desc"
                                ? "stroke-[#0EFF7B] dark:stroke-[#0EFF7B]"
                                : "stroke-gray-500"
                            }`}
                            viewBox="0 0 20 20"
                            fill="none"
                            strokeWidth="2"
                          >
                            <path
                              d="M10 16 L16 10 L4 10 Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm bg-white dark:bg-transparent">
              {sortedData.length > 0 ? (
                sortedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="w-full h-[62px] bg-white dark:bg-transparent px-[12px] py-[12px] border-b border-gray-300 dark:border-[#1E1E1E] relative hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B0D]"
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.name}
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.dosage}
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.category}
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.batch}
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.vendor}{" "}
                      <span className="text-gray-500 ml-1">
                        ({row.vendorCode})
                      </span>
                    </td>
                    <td
                      className="px-3 py-3 text-black dark:text-white"
                      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                    >
                      {row.stock}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      <span
                        className={`${
                          row.status === "IN STOCK"
                            ? "text-green-500"
                            : row.status === "LOW STOCK"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                      >
                        • {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 relative">
                      <button
                        className="text-gray-600 dark:text-gray-400 hover:text-[#08994A] dark:hover:text-[#0EFF7B]"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === row.id ? null : row.id
                          )
                        }
                      >
                        <MoreVertical size={16} />
                      </button>
                      <div
                        ref={(el) => (dropdownRefs.current[row.id] = el)}
                        className={`absolute right-0 bg-white dark:bg-[#000000E5] border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-[8px] shadow-[0_0_4px_0_#FFFFFF1F] w-[120px] py-1 z-50 ${
                          openDropdownId === row.id ? "block" : "hidden"
                        } ${
                          index >= sortedData.length - 3
                            ? "bottom-0 mb-8" // Show above for last few items
                            : "top-0 mt-8" // Show below for other items
                        }`}
                      >
                        <button
                          onClick={() => {
                            openEditPopup(row);
                            setOpenDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          <Edit2
                            size={14}
                            className="text-[#08994A] dark:text-[#0EFF7B]"
                          />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSingleDeleteId(row.id);
                            setShowSingleDeletePopup(true);
                            setOpenDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-black dark:text-white hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A]"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          <Trash2 size={14} className="text-red-500" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-[62px] bg-white dark:bg-black">
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-600 dark:text-gray-400 italic"
                    style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                  >
                    {loading ? "Loading..." : "No inventory found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            Page{" "}
            <span className="text-[#08994A] dark:text-[#0EFF7B]">
              {currentPage}
            </span>{" "}
            of {totalPages} ({(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length})
          </span>
          <button
            onClick={handlePrevPage}
            className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
              currentPage === 1
                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
            }`}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={12} className="text-[#08994A] dark:text-white" />
          </button>
          <button
            onClick={handleNextPage}
            className={`w-5 h-5 flex items-center justify-center rounded-full border border-[#0EFF7B] dark:border-[#0EFF7B33] ${
              currentPage === totalPages
                ? "bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] text-black dark:text-white opacity-50"
                : "bg-[#0EFF7B] dark:bg-[#0EFF7B] text-black dark:text-black opacity-100 hover:bg-[#0EFF7B1A] dark:hover:bg-[#0EFF7B1A] hover:text-[#08994A] dark:hover:text-white"
            }`}
            disabled={currentPage === totalPages}
          >
            <ChevronRight
              size={12}
              className="text-[#08994A] dark:text-white"
            />
          </button>
        </div>
      </div>

      {/* Add Stock Popup */}
      {showAddStockPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
      bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
      dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[780px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-black dark:text-white font-medium text-[18px] leading-[21px]">
                  Add New Stock
                </h2>
                <button
                  onClick={() => setShowAddStockPopup(false)}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B33] transition"
                >
                  <X size={18} className="text-black dark:text-white" />
                </button>
              </div>
              {/* 3×3 Grid Form */}
              <form onSubmit={handleAddStock}>
                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={newStock.product_name}
                      onChange={(e) => setNewStock({ ...newStock, product_name: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500mg, 10ml"
                      value={newStock.dosage}
                      onChange={(e) => setNewStock({ ...newStock, dosage: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Category
                    </label>
                    <Dropdown
                      value={newStock.category}
                      onChange={(val) => setNewStock({ ...newStock, category: val })}
                      options={categories}
                      placeholder="Select category"
                    />
                  </div>
                  {/* Batch Number */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Batch Number"
                      value={newStock.batch_number}
                      onChange={(e) => setNewStock({ ...newStock, batch_number: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Vendor
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Vendor"
                      value={newStock.vendor}
                      onChange={(e) => setNewStock({ ...newStock, vendor: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Vendor ID */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Vendor ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Vendor ID"
                      value={newStock.vendor_id}
                      onChange={(e) => setNewStock({ ...newStock, vendor_id: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Item Code */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Item Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Item Code"
                      value={newStock.item_code}
                      onChange={(e) => setNewStock({ ...newStock, item_code: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Rack No */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Rack No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Rack No"
                      value={newStock.rack_no}
                      onChange={(e) => setNewStock({ ...newStock, rack_no: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Shelf No */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Shelf No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Shelf Number"
                      value={newStock.shelf_no}
                      onChange={(e) => setNewStock({ ...newStock, shelf_no: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Unit Price */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Unit Price"
                      value={newStock.unit_price}
                      onChange={(e) => setNewStock({ ...newStock, unit_price: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      step="0.01"
                    />
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Status
                    </label>
                    <Dropdown
                      value={newStock.status}
                      onChange={(val) => setNewStock({ ...newStock, status: val })}
                      options={["IN STOCK", "LOW STOCK", "OUT OF STOCK"]}
                      placeholder="Select status"
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowAddStockPopup(false)}
                    className="w-[160px] h-[40px] rounded-[10px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[15px] hover:bg-gray-50 dark:hover:bg-[#0EFF7B22] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-[160px] h-[40px] rounded-[10px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[15px] hover:scale-105 transition shadow-lg"
                  >
                    Add Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stock Popup */}
      {showEditStockPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div
            className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F]
      bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70
      dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]"
          >
            <div
              className="w-[780px] rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-black dark:text-white font-medium text-[18px] leading-[21px]">
                  Edit Stock
                </h2>
                <button
                  onClick={() => {
                    setShowEditStockPopup(false);
                    setNewStock({
                      product_name: "",
                      dosage: "",
                      category: "",
                      batch_number: "",
                      vendor: "",
                      vendor_id: "",
                      quantity: "",
                      item_code: "",
                      rack_no: "",
                      shelf_no: "",
                      unit_price: "",
                      status: "IN STOCK",
                    });
                    setEditStockId(null);
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#0EFF7B33] transition"
                >
                  <X size={18} className="text-black dark:text-white" />
                </button>
              </div>
              {/* 3×3 Grid Form */}
              <form onSubmit={handleEditStock}>
                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={newStock.product_name}
                      onChange={(e) => setNewStock({ ...newStock, product_name: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500mg, 10ml"
                      value={newStock.dosage}
                      onChange={(e) => setNewStock({ ...newStock, dosage: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Category
                    </label>
                    <Dropdown
                      value={newStock.category}
                      onChange={(val) => setNewStock({ ...newStock, category: val })}
                      options={categories}
                      placeholder="Select category"
                    />
                  </div>
                  {/* Batch Number */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Batch Number"
                      value={newStock.batch_number}
                      onChange={(e) => setNewStock({ ...newStock, batch_number: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Vendor */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Vendor
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Vendor"
                      value={newStock.vendor}
                      onChange={(e) => setNewStock({ ...newStock, vendor: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Vendor ID */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Vendor ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Vendor ID"
                      value={newStock.vendor_id}
                      onChange={(e) => setNewStock({ ...newStock, vendor_id: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Item Code */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Item Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Item Code"
                      value={newStock.item_code}
                      onChange={(e) => setNewStock({ ...newStock, item_code: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      required
                    />
                  </div>
                  {/* Rack No */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Rack No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Rack No"
                      value={newStock.rack_no}
                      onChange={(e) => setNewStock({ ...newStock, rack_no: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Shelf No */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Shelf No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Shelf Number"
                      value={newStock.shelf_no}
                      onChange={(e) => setNewStock({ ...newStock, shelf_no: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                    />
                  </div>
                  {/* Unit Price */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Unit Price"
                      value={newStock.unit_price}
                      onChange={(e) => setNewStock({ ...newStock, unit_price: e.target.value })}
                      className="w-full h-[36px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] outline-none focus:border-[#0EFF7B] transition"
                      step="0.01"
                    />
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-1">
                      Status
                    </label>
                    <Dropdown
                      value={newStock.status}
                      onChange={(val) => setNewStock({ ...newStock, status: val })}
                      options={["IN STOCK", "LOW STOCK", "OUT OF STOCK"]}
                      placeholder="Select status"
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditStockPopup(false);
                      setNewStock({
                        product_name: "",
                        dosage: "",
                        category: "",
                        batch_number: "",
                        vendor: "",
                        vendor_id: "",
                        quantity: "",
                        item_code: "",
                        rack_no: "",
                        shelf_no: "",
                        unit_price: "",
                        status: "IN STOCK",
                      });
                      setEditStockId(null);
                    }}
                    className="w-[160px] h-[40px] rounded-[10px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[15px] hover:bg-gray-50 dark:hover:bg-[#0EFF7B22] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-[160px] h-[40px] rounded-[10px] bg-gradient-to-r from-[#14DC6F] to-[#09753A] text-white font-medium text-[15px] hover:scale-105 transition shadow-lg"
                  >
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popups */}
      {showSingleDeletePopup && (
        <DeleteStockList
          onConfirm={() => handleDeleteSingle(singleDeleteId)}
          onCancel={() => {
            setShowSingleDeletePopup(false);
            setSingleDeleteId(null);
          }}
          itemsToDelete={[singleDeleteId]}
        />
      )}
      {showDeletePopup && (
        <DeleteStockList
          onConfirm={handleDeleteSelected}
          onCancel={() => setShowDeletePopup(false)}
          itemsToDelete={selectedRows}
        />
      )}
    </div>
  );
};

export default StockInventory;