import React, { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    ChevronDown,
    Filter,
    Download,
    Link,
    CheckSquare,
    X,
    Calendar
} from "lucide-react";

const LabReport = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [filterGender, setFilterGender] = useState("All");
    const [filterDate, setFilterDate] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        status: "All",
        category: "All",
        department: "All",
        gender: "All",
        date: ""
    });
    const itemsPerPage = 5;

    const testOrders = [
        {
            id: "L12345",
            time: "12:30pm",
            patient: "John Smith",
            code: "SMH9875",
            department: "Pathology",
            type: "CBC (Blood Test)",
            status: "Pending",
            gender: "Male"
        },
        {
            id: "R98521",
            time: "12:30pm",
            patient: "Mary Davis",
            code: "SMH9875",
            department: "Radiology",
            type: "X-Ray",
            status: "Completed",
            gender: "Female"
        },
        {
            id: "L87952",
            time: "12:30pm",
            patient: "Alex Brown",
            code: "SMH9875",
            department: "Cardiology",
            type: "Lipid Profile",
            status: "Requires validation",
            gender: "Other"
        },
        {
            id: "R20891",
            time: "12:30pm",
            patient: "Emily Davis",
            code: "SMH9875",
            department: "Radiology",
            type: "Chest X-Ray",
            status: "Inprogress",
            gender: "Female"
        },
        {
            id: "R45078",
            time: "12:30pm",
            patient: "Sarah Williams",
            code: "SMH9875",
            department: "Neurology",
            type: "MRI Brain",
            status: "Pending",
            gender: "Female"
        },
        {
            id: "L56781",
            time: "12:30pm",
            patient: "David Miller",
            code: "SMH9875",
            department: "Gastroenterology",
            type: "LFT (Liver Function)",
            status: "Requires validation",
            gender: "Male"
        },
        {
            id: "R89067",
            time: "12:30pm",
            patient: "Jessica Brown",
            code: "SMH9875",
            department: "Cardiology",
            type: "ECG",
            status: "Completed",
            gender: "Female"
        },
    ];

    const statusColors = {
        Pending: "text-yellow-400",
        Completed: "text-green-400",
        "Requires validation": "text-orange-400",
        Inprogress: "text-blue-400",
    };

    // Open filter popup and set temporary filters
    const openFilterPopup = () => {
        setTempFilters({
            status: filterStatus,
            category: filterCategory,
            department: filterDepartment,
            gender: filterGender,
            date: filterDate
        });
        setShowFilterPopup(true);
    };

    // Apply filters from popup
    const applyFilters = () => {
        setFilterStatus(tempFilters.status);
        setFilterCategory(tempFilters.category);
        setFilterDepartment(tempFilters.department);
        setFilterGender(tempFilters.gender);
        setFilterDate(tempFilters.date);
        setCurrentPage(1);
        setShowFilterPopup(false);
    };

    // Clear all filters
    const clearFilters = () => {
        setTempFilters({
            status: "All",
            category: "All",
            department: "All",
            gender: "All",
            date: ""
        });
        setFilterStatus("All");
        setFilterCategory("All");
        setFilterDepartment("All");
        setFilterGender("All");
        setFilterDate("");
        setCurrentPage(1);
    };

    // Filter data based on search term and selected filters
    const filteredData = testOrders.filter((order) => {
        const matchesSearch = 
            order.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        const matchesCategory = filterCategory === "All" || order.department === filterCategory;
        const matchesDepartment = filterDepartment === "All" || order.department === filterDepartment;
        const matchesGender = filterGender === "All" || order.gender === filterGender;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesDepartment && matchesGender;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const displayedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    // Handle pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle checkbox selection
    const toggleSelectOrder = (id) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === displayedData.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(displayedData.map(order => order.id));
        }
    };

    // Get unique departments for category filter
    const departments = [...new Set(testOrders.map(order => order.department))];
    const statusOptions = ["All", "Pending", "Completed", "Requires validation", "Inprogress"];
    const genderOptions = ["All", "Male", "Female", "Other"];

    return (
        <div className="bg-black mt-[70px] text-white min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-semibold">Laboratory & Radiology</h1>
                <button
                    className="flex items-center justify-center w-[200px] h-[40px] gap-2 rounded-[20px] text-white font-medium shadow-md"
                    style={{
                        background: "linear-gradient(94.31deg, #14DC6F 17.81%, #09753A 73.63%)",
                        border: "1px solid #0EFF7B66",
                        boxShadow: "0px 2px 12px 0px #0EFF7B40",
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Create test order
                </button>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
                <button className="flex items-center gap-2 min-w-[220px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] text-sm">
                    <Download className="w-4 h-4" />
                    Fetch Previous Report
                </button>
                <button className="flex items-center gap-2 min-w-[166px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] text-sm">
                    <Link className="w-4 h-4" />
                    Integrate PACS
                </button>
                <button className="flex items-center gap-2 min-w-[205px] h-[33px] px-4 py-2 rounded-full bg-[#0EFF7B1A] text-sm">
                    <CheckSquare className="w-4 h-4" />
                    Test Type Validation
                </button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-semibold">Recent Test Orders</h1>
                {(filterStatus !== "All" || filterCategory !== "All" || filterDepartment !== "All" || filterGender !== "All" || filterDate !== "") && (
                    <button 
                        onClick={clearFilters}
                        className="text-sm text-[#0EFF7B] hover:underline flex items-center gap-1"
                    >
                        Clear all filters
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            {/* Search and Filters */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#0EFF7B]" />
                    <input
                        type="text"
                        placeholder="Search patient name or test type.."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-[#0EFF7B1A] pl-10 pr-4 py-2 rounded-[40px] border-[1px] border-[#0EFF7B1A] text-sm text-[#5CD592] focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm">
                        Page <span className="text-green-500">{currentPage}</span> of {totalPages} 
                        ({Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} Orders)
                    </span>
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                    >
                        &lt;
                    </button>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                    >
                        &gt;
                    </button>
                    
                    <div className="relative">
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none bg-[#0EFF7B1A] px-4 py-2 rounded-[20px] flex items-center text-sm pr-8 focus:outline-none text-[#5CD592]"
                        >
                            <option value="All">Categories</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 pointer-events-none text-[#0EFF7B]" />
                    </div>
                    
                    <button
                        onClick={openFilterPopup}
                        className="flex items-center gap-2 bg-[#0EFF7B1A] text-white px-4 py-2 rounded-full border-[1px] border-[#0EFF7B1A]"
                    >
                        <Filter size={18} className="text-[#0EFF7B]" /> 
                        Filters
                    </button>
                </div>
            </div>

            {/* Enhanced Filter Popup with Green Theme */}
            {showFilterPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-[#000000] border-2 border-[#0D0D0D] rounded-xl p-6 w-[700px]">
      <div className="flex justify-between items-center mb-6 border-b border-[#0EFF7B33] pb-3">
        <h3 className="text-lg font-semibold text-[#0EFF7B]">Filter Donor</h3>
        <button
          onClick={() => setShowFilterPopup(false)}
          className="text-[#0EFF7B] hover:text-white p-1 rounded-full hover:bg-[#0EFF7B33]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid layout 2x2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Status
          </label>
          <div className="relative">
            <select
              value={tempFilters.status}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, status: e.target.value })
              }
              className="w-full bg-black border-2 border-[#0D0D0D] rounded-lg p-3 text-sm text-white 
                         focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] appearance-none"
            >
              {statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                  className="bg-black text-white"
                >
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#0EFF7B]" />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Department
          </label>
          <div className="relative">
            <select
              value={tempFilters.department}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, department: e.target.value })
              }
              className="w-full bg-black border-2 border-[#0D0D0D] rounded-lg p-3 text-sm text-white 
                         focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] appearance-none"
            >
              <option value="All" className="bg-black text-white">
                All Departments
              </option>
              {departments.map((dept, index) => (
                <option
                  key={index}
                  value={dept}
                  className="bg-black text-white"
                >
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#0EFF7B]" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Gender
          </label>
          <div className="relative">
            <select
              value={tempFilters.gender}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, gender: e.target.value })
              }
              className="w-full bg-black border-2 border-[#0D0D0D] rounded-lg p-3 text-sm text-white
                         focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] appearance-none"
            >
              {genderOptions.map((gender) => (
                <option
                  key={gender}
                  value={gender}
                  className="bg-black text-white"
                >
                  {gender}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#0EFF7B]" />
          </div>
        </div>

        {/* Last Donation Date */}
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Last Donation Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={tempFilters.date}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, date: e.target.value })
              }
              className="w-full bg-black border-2 border-[#0D0D0D] rounded-lg p-3 text-sm text-white 
                         focus:outline-none focus:ring-1 focus:ring-[#0EFF7B] pr-10"
            />
            <Calendar className="absolute right-3 top-3.5 w-4 h-4 pointer-events-none text-[#0EFF7B]" />
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-4 ">
        <button
          onClick={() => {
            setTempFilters({
              status: "All",
              category: "All",
              department: "All",
              gender: "All",
              date: "",
            });
          }}
          className="px-5 py-2.5 text-sm rounded-lg text-white font-medium hover:bg-[#3A3A3A] border border-[#0D0D0D]"
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="px-5 py-2.5 text-sm rounded-lg bg-[#0EFF7B] text-black font-medium hover:bg-[#0cd968]"
        >
          Filter
        </button>
      </div>
    </div>
  </div>
)}


            {/* Table */}
            <div className="overflow-x-auto bg-black rounded-xl shadow-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-[#1E1E1E] h-[52px]">
                        <tr className="border-b border-gray-700 text-gray-400">
                            <th className="py-3 px-4 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.length === displayedData.length && displayedData.length > 0}
                                    onChange={toggleSelectAll}
                                    className="accent-green-500"
                                />
                            </th>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Patient Name</th>
                            <th className="py-3 px-4 text-left">Department</th>
                            <th className="py-3 px-4 text-left">Test Type</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedData.map((order, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-gray-800 hover:bg-gray-800/50"
                            >
                                <td className="py-3 px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => toggleSelectOrder(order.id)}
                                        className="accent-green-500"
                                    />
                                </td>
                                <td className="py-3 px-4">{order.id}</td>
                                <td className="py-3 px-4">
                                    {order.patient}{" "}
                                    <span className="text-gray-500 text-xs block">
                                        {order.code}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{order.department}</td>
                                <td className="py-3 px-4">{order.type}</td>
                                <td
                                    className={`py-3 px-4 font-medium ${statusColors[order.status]}`}
                                >
                                    {order.status}
                                </td>
                                <td className="py-3 px-4">
                                    <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* No results message */}
            {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No test orders found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default LabReport;