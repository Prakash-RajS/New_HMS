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
  const roleOptions = ["Select Role", "Doctor", "Staff", "Receptionist"];
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

  const users = filteredUsers.slice(
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
    setShowDeleteUserPopup(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Doctor":
        return "text-green-500";
      case "Staff":
        return "text-orange-500";
      case "Receptionist":
        return "text-red-500";
      default:
        return "text-white";
    }
  };

  const Dropdown = ({ label, placeholder, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1 w-full">
          <Listbox.Button className="min-w-[291px] h-[40px] px-3 pr-8 rounded-full border border-[#3A3A3A] bg-transparent text-[#ffffff] text-left text-[14px] leading-[16px]">
            {value || placeholder}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-[#0EFF7B]" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-full rounded-[12px] bg-black shadow-lg z-50 border border-[#3A3A3A]">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                value={option}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-2 text-sm rounded-md 
                  ${active ? "bg-[#0EFF7B33] text-[#0EFF7B]" : "text-white"}
                  ${selected ? "font-medium text-[#0EFF7B]" : ""}`
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
    <div className="w-full mb-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mt-[60px] bg-black text-white rounded-xl p-6 w-full flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User settings</h2>
          <button
            onClick={() => navigate("/security")}
            className="flex items-center gap-2 bg-[#0EFF7B1A] border-[1px] border-[#0EFF7B4D] hover:bg-green-600 px-4 py-2 rounded-full text-white font-medium"
          >
            <Shield size={18} className="text-white" /> Security Settings
          </button>
        </div>
        <p className="text-gray-400">These settings help add or manage user</p>
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
        <h2 className="text-white text-lg font-semibold">User profile</h2>
        <div className="flex gap-2">
          <button className="bg-[#0D0D0D] border-[1px] border-[#0EFF7B4D] text-green-500 px-4 py-2 rounded-full flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button className="bg-[#0D0D0D] border-[1px] border-[#0EFF7B4D] text-green-500 px-4 py-2 rounded-full flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* User List Table */}
      <div className="bg-[#0D0D0D] text-white rounded-xl p-6 mt-7 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">User List</h3>
          <div className="flex gap-2 items-center">
            {showUserSearch && (
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-[#1E1E1E] text-white px-4 py-2 rounded-full border border-[#3C3C3C] focus:outline-none focus:border-[#0EFF7B]"
              />
            )}
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A]"
              onClick={() => setShowUserSearch(!showUserSearch)}
            >
              <Search size={18} className="cursor-pointer text-white" />
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] cursor-pointer"
              onClick={handleDeleteSelectedUsers}
            >
              <Trash2 size={18} className="text-white" />
            </div>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left h-[52px] bg-[#1E1E1E] text-[#FFFFFF] text-[16px] border-b border-[#3C3C3C]">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={() =>
                    setSelectedUsers(
                      selectedUsers.length === users.length ? [] : users
                    )
                  }
                  className="w-5 h-5 bg-black border border-[#A0A0A0] rounded appearance-none checked:bg-[#0EFF7B] relative checked:after:absolute checked:after:top-0 checked:after:left-1 checked:after:content-['\2713'] checked:after:text-white checked:after:text-sm"
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Email address</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Joined on</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={i}
                className="border-b h-[62px] border-[#3C3C3C] hover:bg-[#000000CC] transition"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u)}
                    onChange={() => handleUserCheckboxChange(u)}
                    className="w-5 h-5 bg-black border border-[#A0A0A0] rounded appearance-none checked:bg-[#0EFF7B] relative checked:after:absolute checked:after:top-0 checked:after:left-1 checked:after:content-['\2713'] checked:after:text-white checked:after:text-sm"
                  />
                </td>
                <td className="p-3">
                  <div>{u.name}</div>
                  <div className="text-[#A0A0A0]  text-[12px]"> (ID: {u.id})</div>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={getRoleColor(u.role)}>{u.role}</span>
                </td>
                <td className="p-3">{u.department}</td>
                <td className="p-3">{u.joinedOn}</td>
                <td className="p-3 flex justify-end gap-2">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] cursor-pointer"
                    onClick={() => {
                      setEditUser(u);
                      setShowEditUserPopup(true);
                    }}
                  >
                    <Edit size={18} className="text-white" />
                  </div>
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] cursor-pointer"
                    onClick={() => {
                      setDeleteUser(u);
                      setShowDeleteUserPopup(true);
                    }}
                  >
                    <Trash2 size={18} className="text-white" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center mt-4 bg-[#0D0D0D] rounded gap-x-4">
          <div className="text-sm text-white">
            Page <span className="text-[#0EFF7B] font-semibold">{userPage}</span> of {totalUserPages} (
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
                  ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                  : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
              }`}
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setUserPage(Math.min(totalUserPages, userPage + 1))}
              disabled={userPage === totalUserPages}
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                userPage === totalUserPages
                  ? "bg-[#0EFF7B1A] border-[#0EFF7B1A] shadow-[0_0_4px_0_#0EFF7B1A] text-white opacity-50"
                  : "bg-[#0EFF7B] border-[#0EFF7B33] shadow-[0_0_4px_0_#0EFF7B33] text-black opacity-100"
              }`}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showEditUserPopup && (
        <EditUserPopup data={editUser} onClose={() => setShowEditUserPopup(false)} />
      )}
      {showDeleteUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#000000] border-2 border-[#0D0D0D] rounded-xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4 border-b border-[#0EFF7B33] pb-3">
              <h3 className="text-lg font-semibold text-[#0EFF7B]">Delete User</h3>
              <button
                onClick={() => setShowDeleteUserPopup(false)}
                className="text-[#0EFF7B] hover:text-white p-1 rounded-full hover:bg-[#0EFF7B33]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white mb-6">
              Are you sure you want to delete {deleteUser ? deleteUser.name : selectedUsers.length} user(s)?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteUserPopup(false)}
                className="bg-[#1E1E1E] text-white px-4 py-2 rounded-full font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteUser) {
                    setAllUsers((prev) => prev.filter((user) => user !== deleteUser));
                  } else {
                    setAllUsers((prev) => prev.filter((user) => !selectedUsers.includes(user)));
                    setSelectedUsers([]);
                  }
                  setShowDeleteUserPopup(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;