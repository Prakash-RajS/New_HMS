import React, { useState } from "react";
import { Shield, Edit, Trash2, Search, ChevronLeft, ChevronRight, X, Printer, Download, ChevronDown } from "lucide-react";
import { Listbox } from "@headlessui/react";
import EditUserPopup from "./EditUserPopup.jsx";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  // ---------- User Data ----------
  const [allUsers, setAllUsers] = useState([
    {
      name: "Emma Walker",
      id: "DOC2501",
      email: "emma.walker@example.com",
      role: "Doctor",
      department: "IT",
      joinedOn: "07/12/2023",
    },
    {
      name: "Mason Clark",
      id: "ST2501",
      email: "mason.clark@example.com",
      role: "Staff",
      department: "HR",
      joinedOn: "08/01/2023",
    },
    {
      name: "Sophia Lewis",
      id: "RCP2501",
      email: "sophia.lewis@example.com",
      role: "Receptionist",
      department: "Finance",
      joinedOn: "06/22/2023",
    },
    {
      name: "Isabella Taylor",
      id: "ST2502",
      email: "isabella.taylor@example.com",
      role: "Staff",
      department: "IT",
      joinedOn: "07/15/2023",
    },
    {
      name: "Liam Johnson",
      id: "DOC2502",
      email: "liam.johnson@example.com",
      role: "Doctor",
      department: "Marketing",
      joinedOn: "05/10/2023",
    },
    {
      name: "Lucas Thompson",
      id: "RCP2502",
      email: "lucas.thompson@example.com",
      role: "Receptionist",
      department: "Sales",
      joinedOn: "08/25/2023",
    },
  ]);

  const [filters, setFilters] = useState({ user: "Select Name", role: "Select Role", department: "Select Department" });

  // ---------- Pagination Logic ----------
  const [userPage, setUserPage] = useState(1);
  const rowsPerPage = 5;

  const userOptions = ["Select Name", ...new Set(allUsers.map((u) => u.name))];
  const roleOptions = ["Select Role", "Doctor", "Staff", "Receptionist","Select Role", "Doctor", "Staff", "Receptionist","Select Role", "Doctor", "Staff", "Receptionist","Select Role", "Doctor", "Staff", "Receptionist"];
  const departmentOptions = ["Select Department", ...new Set(allUsers.map((u) => u.department))];

  const filteredUsers = allUsers.filter((u) => {
    if (filters.user !== "Select Name" && u.name !== filters.user) return false;
    if (filters.role !== "Select Role" && u.role !== filters.role) return false;
    if (filters.department !== "Select Department" && u.department !== filters.department) return false;
    if (
      userSearch &&
      !u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
      !u.email.toLowerCase().includes(userSearch.toLowerCase()) &&
      !u.role.toLowerCase().includes(userSearch.toLowerCase()) &&
      !u.department.toLowerCase().includes(userSearch.toLowerCase()) &&
      !u.joinedOn.includes(userSearch) &&
      !u.id.toLowerCase().includes(userSearch.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const users = sortedUsers.slice(
    (userPage - 1) * rowsPerPage,
    userPage * rowsPerPage
  );

  const totalUserPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // ---------- Handle Checkbox Selection for Users ----------
  const handleUserCheckboxChange = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((d) => d !== user)
        : [...prev, user]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length && users.length > 0
        ? []
        : users
    );
  };

  // ---------- Handle Delete Selected Users ----------
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length > 0) {
      setShowDeleteUserPopup(true);
    }
  };

  const confirmDeleteUsers = () => {
    setAllUsers((prev) =>
      prev.filter((user) => !selectedUsers.includes(user))
    );
    setSelectedUsers([]);
    setDeleteUser(null);
    setShowDeleteUserPopup(false);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePrint = () => {
    console.log("Print button clicked");
    // Placeholder for print logic
  };

  const handleExport = () => {
    console.log("Export button clicked");
    // Placeholder for export logic
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Doctor":
        return "text-green-600 dark:text-green-500";
      case "Staff":
        return "text-orange-600 dark:text-orange-500";
      case "Receptionist":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-black dark:text-white";
    }
  };

  const Dropdown = ({ label, placeholder, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium mb-2 text-black dark:text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-full">
          <Listbox.Button className="min-w-[321px] h-[40px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-black text-black dark:text-white text-left text-[14px] leading-[16px]">
            {value || placeholder}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3A3A3A]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]" : "text-black dark:text-white"}
                  ${selected ? "font-medium text-[#08994A] dark:text-[#0EFF7B]" : ""}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );

  return (
    
    <div
      className="mt-[80px]  mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[1400px] mx-auto flex flex-col  
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
      <div className="mt-[10px] bg-white dark:bg-black text-black dark:text-white rounded-xl p-6 w-full flex flex-col  dark:border-[#0D0D0D]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-[#0EFF7B]">User settings</h2>
          <button
            onClick={() => navigate("/security")}
            className="flex items-center gap-2 bg-[#08994A1A] dark:bg-[#0EFF7B1A] border-[1px] border-[#08994A4D] dark:border-[#0EFF7B4D] hover:bg-[#08994A] dark:hover:bg-[#0EFF7B1A] hover:text-white dark:hover:text-[#0EFF7B] px-4 py-2 rounded-full text-black dark:text-white font-medium transition"
          >
            <Shield size={18} className="text-[#08994A] dark:text-[#0EFF7B]" /> Security Settings
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">These settings help add or manage user</p>
      </div>

      <div className="flex flex-wrap p-6 gap-6">
        <Dropdown
          label="Select User"
          placeholder="Select Name"
          value={filters.user}
          onChange={(val) => setFilters({ ...filters, user: val })}
          options={userOptions}
        />
        <Dropdown
          label="Select Role"
          placeholder="Select Role"
          value={filters.role}
          onChange={(val) => setFilters({ ...filters, role: val })}
          options={roleOptions}
        />
        <Dropdown
          label="Select Department"
          placeholder="Select Department"
          value={filters.department}
          onChange={(val) => setFilters({ ...filters, department: val })}
          options={departmentOptions}
        />
      </div>

      {/* User Profile Section Heading */}
      <div className="w-full flex items-center justify-between p-6">
        <h2 className="text-black dark:text-white text-lg font-semibold">User profile</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-white dark:bg-[#0D0D0D] border-[1px] border-[#08994A4D] dark:border-[#0EFF7B4D] text-[#08994A] dark:text-[#0EFF7B] px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleExport}
            className="bg-white dark:bg-[#0D0D0D] border-[1px] border-[#08994A4D] dark:border-[#0EFF7B4D] text-[#08994A] dark:text-[#0EFF7B] px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#08994A1A] dark:hover:bg-[#0EFF7B1A] transition"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* User List Table */}
      <div className="bg-white dark:bg-transparent text-black dark:text-white rounded-xl p-6 mt-7 shadow-md border border-[#0EFF7B] dark:border-[#3C3C3C]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">User List</h3>
          <div className="flex gap-2 items-center">
            {showUserSearch && (
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white px-4 py-2 rounded-full border border-gray-300 dark:border-[#3C3C3C] focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-[#0EFF7B] placeholder-gray-600 dark:placeholder-gray-400"
              />
            )}
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
              onClick={() => setShowUserSearch(!showUserSearch)}
            >
              <Search size={18} className="text-[#08994A] dark:text-[#0EFF7B]" />
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
              onClick={handleDeleteSelectedUsers}
            >
              <Trash2 size={18} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400" />
            </div>
        </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left h-[52px] bg-white dark:bg-[#0EFF7B1A] text-gray-600 dark:text-gray-400 text-[16px] border-b border-gray-300 dark:border-[#3C3C3C]">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-gray-700 rounded-sm bg-white  dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-gray-700 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white checked:before:text-sm"
                />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("email")}>
                Email address {sortColumn === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("role")}>
                Role {sortColumn === "role" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("department")}>
                Department {sortColumn === "department" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("joinedOn")}>
                Joined on {sortColumn === "joinedOn" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={i}
                className="border-b h-[22px] border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-[#0EFF7B0D] transition"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u)}
                    onChange={() => handleUserCheckboxChange(u)}
                    className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-gray-700 rounded-sm bg-white  dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-gray-700 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white checked:before:text-sm"
                  />
                </td>
                <td className="p-3">
                  <div className="text-black dark:text-white">{u.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-[12px]">(ID: {u.id})</div>
                </td>
                <td className="p-3 text-black dark:text-white">{u.email}</td>
                <td className="p-3">
                  <span className={getRoleColor(u.role)}>{u.role}</span>
                </td>
                <td className="p-3 text-black dark:text-white">{u.department}</td>
                <td className="p-3 text-black dark:text-white">{u.joinedOn}</td>
                <td className="p-3 flex justify-end gap-2">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
                    onClick={() => {
                      setEditUser(u);
                      setShowEditUserPopup(true);
                    }}
                  >
                    <Edit size={18} className="text-[#08994A] dark:text-[#0EFF7B] hover:text-[#0cd968] dark:hover:text-[#0cd968]" />
                  </div>
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
                    onClick={() => {
                      setDeleteUser(u);
                      setShowDeleteUserPopup(true);
                    }}
                  >
                    <Trash2 size={18} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">{userPage}</span> of {totalUserPages} (
            {(userPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(userPage * rowsPerPage, filteredUsers.length)}{" "}
            from {filteredUsers.length} Users)
          </div>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => setUserPage(Math.max(1, userPage - 1))}
              disabled={userPage === 1}
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                userPage === 1
                  ? "bg-[#08994A1A] dark:bg-[#0EFF7B1A] border-[#08994A1A] dark:border-[#0EFF7B1A] text-gray-600 dark:text-gray-400 opacity-50"
                  : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A33] dark:border-[#0EFF7B33] text-black dark:text-black opacity-100"
              }`}
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setUserPage(Math.min(totalUserPages, userPage + 1))}
              disabled={userPage === totalUserPages}
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                userPage === totalUserPages
                  ? "bg-[#08994A1A] dark:bg-[#0EFF7B1A] border-[#08994A1A] dark:border-[#0EFF7B1A] text-gray-600 dark:text-gray-400 opacity-50"
                  : "bg-[#08994A] dark:bg-[#0EFF7B] border-[#08994A33] dark:border-[#0EFF7B33] text-black dark:text-black opacity-100"
              }`}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showDeleteUserPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="relative bg-white dark:bg-[#000000] rounded-[20px] p-6 w-[400px]">
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
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-[#0EFF7B33] pb-3">
          <h3 className="text-lg font-semibold text-[#08994A] dark:text-[#0EFF7B]">Delete User</h3>
          <button
            onClick={() => setShowDeleteUserPopup(false)}
            className="text-[#08994A] dark:text-[#0EFF7B] hover:text-[#0cd968] dark:hover:text-[#0cd968] p-1 rounded-full hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-black dark:text-white mb-6">
          Are you sure you want to delete {deleteUser ? deleteUser.name : selectedUsers.length} user(s)?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowDeleteUserPopup(false)}
            className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white px-4 py-2 rounded-[8px] font-semibold hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUsers}
            className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-[8px] font-semibold hover:bg-red-700 dark:hover:bg-red-800 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserSettings;