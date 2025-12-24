import React, { useState, useEffect } from "react";
import {
  Shield,
  Edit,
  Trash2,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import EditUserPopup from "./EditUserPopup.jsx";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { successToast, errorToast } from "../../components/Toast";

const API_BASE =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000"
    : "http://localhost:8000";

// InputField Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required = false,
  error,
  autoCapitalize = false
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Auto-capitalize first letter for name fields
    if (autoCapitalize && newValue && name.includes('name')) {
      // Capitalize first letter of each word
      newValue = newValue.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div>
      <label className="text-sm text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-[228px] h-[30px] mt-[2px] px-3 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-500">{error}</p>}
    </div>
  );
};

// Modified Dropdown to support 'required' prop
const Dropdown = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  className,
  required = false,
  error
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-black dark:text-white">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1 w-full">
        <Listbox.Button
          className={`w-[225px] h-[30px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-black text-[#08994A] dark:text-[#0EFF7B] text-left text-[14px] leading-[16px] ${className}`}
        >
          {value || placeholder}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="absolute mt-1 w-[225px] max-h-[180px] overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3C3C3C]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active, selected }) =>
                `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                ${
                  active || selected
                    ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                    : "text-[#08994A] dark:text-[#0EFF7B]"
                }`
              }
            >
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
    {error && <p className="mt-1 text-xs text-red-500 dark:text-red-500">{error}</p>}
  </div>
);

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
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "Select Role",
    staffId: "Select Staff ID",
  });

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
    role: "",
    staffId: "",
  });

  // Password validation state
  const [passwordMeetsRequirements, setPasswordMeetsRequirements] = useState(false);

  // Dropdown Options from Backend
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffMap, setStaffMap] = useState({});

  // Users from Backend
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const rowsPerPage = 5;

  // Filters
  const [filters, setFilters] = useState({
    user: "Select Name",
    role: "Select Role",
    department: "Select Department",
  });

  // Separate state for filter options that don't change when filters are applied
  const [userFilterOptions, setUserFilterOptions] = useState(["Select Name"]);
  const [roleFilterOptions, setRoleFilterOptions] = useState(["Select Role"]);
  const [departmentFilterOptions, setDepartmentFilterOptions] = useState(["Select Department"]);

  // User permissions
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([
    "Select Role",
    "Doctor",
    "Staff",
    "Receptionist",
    "Nurse"
  ]);
  const [canManageUsers, setCanManageUsers] = useState(false);

  // Get auth token and user info
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getCurrentUserRole = () => {
    return (
      localStorage.getItem("role") || sessionStorage.getItem("role") || ""
    );
  };

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 2) return "Username must be at least 2 characters";
    if (username.length > 50) return "Username cannot exceed 50 characters";
    if (!/^[A-Za-z\s]+$/.test(username)) return "Username can only contain letters and spaces";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  // Check if password meets ALL requirements
  const checkPasswordRequirements = (password) => {
    if (!password) return false;
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  };

  // Fetch Filter Options & Users on Mount
  useEffect(() => {
    checkUserPermissions();
    fetchFilterOptions();
    fetchUsers();
  }, []);

  // ADD THIS - Re-fetch users when filters change - RESET PAGE TO 1
  useEffect(() => {
    setUserPage(1); // Reset to first page when filters/search change
    fetchUsers();
  }, [filters, userSearch]);

  // Re-fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters, userSearch]);

  const checkUserPermissions = () => {
    const role = getCurrentUserRole();
    setCurrentUserRole(role);

    const canManage =
      role.toLowerCase() === "admin" || role.toLowerCase() === "superuser";
    setCanManageUsers(canManage);
    if (canManage) {
      setAvailableRoles([
        "Select Role",
        "Doctor",
        "Staff",
        "Receptionist",
        "Nurse",
        "Admin",
      ]);
    } else {
      setAvailableRoles(["Select Role", "Doctor", "Staff", "Receptionist","Nurse"]);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = getAuthToken();
      
      // Fetch all data in parallel
      const [staffRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/staff/all/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const staffList = await staffRes.json();
      const usersData = await usersRes.json();

      // Set staff options for Add User popup
      const staffIds = staffList.map(staff => staff.employee_id);
      setStaffOptions(["Select Staff ID", ...staffIds]);

      // Create staff map for staff information
      const map = {};
      staffList.forEach((s) => {
        map[s.employee_id] = {
          department: s.department,
          joinedOn: s.date_of_joining
            ? new Date(s.date_of_joining).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })
            : "",
          full_name: s.full_name,
          email: s.email,
        };
      });
      setStaffMap(map);

      // Set filter options from ALL users (not filtered)
      if (usersData && usersData.length > 0) {
        // Get unique user names
        const allUserNames = [...new Set(usersData.map((u) => u.name).filter(Boolean))];
        setUserFilterOptions(["Select Name", ...allUserNames]);

        // Get unique roles - Use availableRoles as base, then add any other roles found in data
        const allRolesFromData = [...new Set(usersData.map((u) => u.role).filter(Boolean))];
        const combinedRoles = [...new Set([...availableRoles, ...allRolesFromData])];
        setRoleFilterOptions(combinedRoles);

        // Get unique departments
        const allDepartments = [...new Set(usersData.map((u) => u.department).filter(Boolean))];
        setDepartmentFilterOptions(["Select Department", ...allDepartments]);
      }
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      
      // Only append if not the default "Select..." value
      if (filters.user !== "Select Name") params.append("name", filters.user);
      if (filters.role !== "Select Role") params.append("role", filters.role);
      if (filters.department !== "Select Department") 
        params.append("department", filters.department);
      if (userSearch) params.append("search", userSearch);

      const url = `${API_BASE}/users/`;
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await fetch(fullUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          errorToast("Authentication failed. Please login again.");
          return;
        }
        throw new Error("Failed to load users");
      }

      const data = await res.json();
      setAllUsers(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load users");
      errorToast(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // REMOVED: Auto-fill effect when Staff ID is selected

  // Filter & Sort Users
  const filteredUsers = allUsers.filter((u) => {
    if (filters.user !== "Select Name" && u.name !== filters.user) return false;
    if (filters.role !== "Select Role" && u.role !== filters.role) return false;
    if (
      filters.department !== "Select Department" &&
      u.department !== filters.department
    )
      return false;
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn] || "";
    const valB = b[sortColumn] || "";
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const users = sortedUsers.slice(
    (userPage - 1) * rowsPerPage,
    userPage * rowsPerPage
  );
  const totalUserPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Checkbox Selection
  const handleUserCheckboxChange = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((d) => d !== user) : [...prev, user]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length && users.length > 0 ? [] : users
    );
  };

  // Delete Selected
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length > 0 && canManageUsers) {
      setShowDeleteUserPopup(true);
    } else if (!canManageUsers) {
      errorToast("You don't have permission to delete users.");
    }
  };

  const confirmDeleteUsers = async () => {
    try {
      const token = getAuthToken();
      for (const user of selectedUsers) {
        const response = await fetch(`${API_BASE}/users/${user.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 403) throw new Error("Permission denied.");
          if (response.status === 401)
            throw new Error("Authentication failed.");
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to delete ${user.name}`);
        }
      }
      await fetchUsers();
      setSelectedUsers([]);
      setShowDeleteUserPopup(false);
      successToast("Selected users deleted successfully.");
    } catch (err) {
      errorToast(err.message || "Failed to delete users");
    }
  };

  // Delete single user
  const confirmDeleteUserUser = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/users/${deleteUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Permission denied.");
        if (response.status === 401) throw new Error("Authentication failed.");
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to delete ${deleteUser.name}`
        );
      }

      await fetchUsers();
      setShowDeleteUserPopup(false);
      setDeleteUser(null);
      successToast("User deleted successfully.");
    } catch (err) {
      errorToast(err.message || "Failed to delete user");
    }
  };

  // Update handleInputChange for username field
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setNewUser(prev => ({ ...prev, username: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors.username) {
      setValidationErrors(prev => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewUser(prev => ({ ...prev, password: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: "" }));
    }
    
    // Check if password meets ALL requirements
    const meetsRequirements = checkPasswordRequirements(value);
    setPasswordMeetsRequirements(meetsRequirements);
  };

  // Function to reset the add user form
  const resetAddUserForm = () => {
    setNewUser({
      username: "",
      password: "",
      role: "Select Role",
      staffId: "Select Staff ID",
    });
    setValidationErrors({
      username: "",
      password: "",
      role: "",
      staffId: "",
    });
    setPasswordMeetsRequirements(false);
    setShowPassword(false);
  };

  // Add User
  const handleAddUser = async () => {
    if (!canManageUsers) {
      errorToast("You don't have permission to add users.");
      return;
    }

    // Validate all fields
    const usernameError = validateUsername(newUser.username);
    const passwordError = validatePassword(newUser.password);
    const roleError = newUser.role === "Select Role" ? "Role is required" : "";
    const staffIdError = newUser.staffId === "Select Staff ID" ? "Staff ID is required" : "";

    const errors = {
      username: usernameError,
      password: passwordError,
      role: roleError,
      staffId: staffIdError,
    };

    setValidationErrors(errors);

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== "");
    
    if (hasErrors) {
      errorToast("Please fix all validation errors before saving.");
      return;
    }

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("username", newUser.username);
      formData.append("password", newUser.password);
      formData.append("staff_id", newUser.staffId);
      formData.append("role", newUser.role);

      const res = await fetch(`${API_BASE}/users/create_user`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Permission denied.");
        if (res.status === 401) throw new Error("Authentication failed.");
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create user");
      }

      setShowAddUserPopup(false);
      resetAddUserForm();
      await fetchUsers();
      successToast("User created successfully!");
    } catch (err) {
      errorToast(err.message || "Failed to add user");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Doctor":
        return "text-green-600 dark:text-green-500";
      case "Staff":
        return "text-orange-600 dark:text-orange-500";
      case "Receptionist":
        return "text-red-600 dark:text-red-500";
      case "Admin":
        return "text-blue-600 dark:text-blue-500";
      default:
        return "text-black dark:text-white";
    }
  };

  return (
    <div className="mt-[80px] mb-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] rounded-xl p-4 w-full max-w-[2500px] font-[Helvetica] mx-auto flex flex-col bg-white dark:bg-transparent overflow-hidden relative">
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

      {/* Header */}
      <div className="mt-[10px] bg-white dark:bg-black text-black dark:text-white rounded-xl p-6 w-full flex flex-col dark:border-[#0D0D0D]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-[#0EFF7B]">
            User settings
          </h2>
          {canManageUsers ? (
            <button
              onClick={() => {
                resetAddUserForm();
                setShowAddUserPopup(true);
              }}
              className="w-[160px] h-[40px] flex items-center justify-center bg-[linear-gradient(92.18deg,#025126_3.26%,#0D7F41_50.54%,#025126_97.83%)] border-b-[2px] border-[#0EFF7B] shadow-[0px_2px_12px_0px_#00000040] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-[8px] transition duration-300 ease-in-out gap-2"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <span className="text-[22px] font-bold">+</span>
              <span>Add User</span>
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Read-only access (Admin only)
            </div>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {canManageUsers
            ? "These settings help add or manage users"
            : "View user information (Admin users can manage users)"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap p-6 gap-6 items-end">
        <Dropdown
          label="Select User"
          placeholder="Select Name"
          value={filters.user}
          onChange={(val) => setFilters({ ...filters, user: val })}
          options={userFilterOptions}
        />
        <Dropdown
          label="Select Role"
          placeholder="Select Role"
          value={filters.role}
          onChange={(val) => setFilters({ ...filters, role: val })}
          options={roleFilterOptions}
        />
        <Dropdown
          label="Select Department"
          placeholder="Select Department"
          value={filters.department}
          onChange={(val) => setFilters({ ...filters, department: val })}
          options={departmentFilterOptions}
        />
      </div>

      {/* User List Table */}
      <div className="bg-white dark:bg-transparent text-black dark:text-white rounded-xl p-6 mt-7 shadow-md border border-[#0EFF7B] dark:border-[#3C3C3C]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            User List
          </h3>
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
              className="relative group w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
              onClick={() => setShowUserSearch(!showUserSearch)}
            >
              <Search
                size={18}
                className="text-[#08994A] dark:text-[#0EFF7B]"
              />
              <span
                className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150"
              >
                Search
              </span>
            </div>
            {canManageUsers && (
              <div
                className="relative group w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
                onClick={handleDeleteSelectedUsers}
              >
                <Trash2
                  size={18}
                  className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                />
                <span
                  className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150"
                >
                  Delete
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left h-[52px] bg-white dark:bg-[#0EFF7B1A] text-gray-600 dark:text-gray-400 text-[16px] border-b border-gray-300 dark:border-[#3C3C3C]">
                  {canManageUsers && (
                    <th className="p-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                          checked={
                            selectedUsers.length === users.length &&
                            users.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </label>
                    </th>
                  )}
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("username")}
                  >
                    Username{" "}
                    {sortColumn === "username" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortColumn === "email" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("role")}
                  >
                    Role{" "}
                    {sortColumn === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("department")}
                  >
                    Department{" "}
                    {sortColumn === "department" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort("joinedOn")}
                  >
                    Joined on{" "}
                    {sortColumn === "joinedOn" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {canManageUsers && (
                    <th className="p-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={i}
                    className="border-b h-[22px] text-[15px] border-gray-300 dark:border-[#3C3C3C] bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-[#0EFF7B0D] transition"
                  >
                    {canManageUsers && (
                      <td className="p-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="appearance-none w-5 h-5 border border-[#0EFF7B] dark:border-white rounded-sm bg-white dark:bg-black checked:bg-[#08994A] dark:checked:bg-green-500 checked:border-[#0EFF7B] dark:checked:border-green-500 flex items-center justify-center checked:before:content-['✔'] checked:before:text-white dark:checked:before:text-black checked:before:text-sm"
                            checked={selectedUsers.includes(u)}
                            onChange={() => handleUserCheckboxChange(u)}
                          />
                        </label>
                      </td>
                    )}
                    <td className="p-3 ">
                      <div className="text-black dark:text-white">{u.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-[12px]">
                        (ID: {u.id})
                      </div>
                    </td>
                    <td className="p-3 text-black   dark:text-white">
                      {u.username}
                    </td>
                    <td className="p-3 text-black dark:text-white">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <span className={getRoleColor(u.role)}>{u.role}</span>
                    </td>
                    <td className="p-3 text-black dark:text-white">
                      {u.department}
                    </td>
                    <td className="p-3 text-black dark:text-white">
                      {u.joinedOn}
                    </td>
                    {canManageUsers && (
                      <td className="p-3 flex justify-end gap-2">
                        <div
                          className="relative group w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
                          onClick={() => {
                            setEditUser(u);
                            setShowEditUserPopup(true);
                          }}
                        >
                          <Edit
                            size={18}
                            className="text-[#08994A] dark:text-[#0EFF7B] hover:text-[#0cd968] dark:hover:text-[#0cd968]"
                          />
                          <span
                            className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                            px-3 py-1 text-xs rounded-md shadow-md
                            bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                            transition-all duration-150"
                          >
                            Edit
                          </span>
                        </div>
                        <div
                          className="relative group w-8 h-8 flex items-center justify-center rounded-full border border-[#08994A1A] dark:border-[#0EFF7B1A] bg-[#08994A1A] dark:bg-[#0EFF7B1A] cursor-pointer"
                          onClick={() => {
                            setDeleteUser(u);
                            setShowDeleteUserPopup(true);
                          }}
                        >
                          <Trash2
                            size={18}
                            className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          />
                          <span
                            className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                            px-3 py-1 text-xs rounded-md shadow-md
                            bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                            transition-all duration-150"
                          >
                            Delete
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No users found.{" "}
                {canManageUsers && "Click 'Add User' to create new users."}
              </div>
            )}

            <div className="flex items-center mt-4 bg-white dark:bg-transparent rounded gap-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page{" "}
                <span className="text-[#08994A] dark:text-[#0EFF7B] font-semibold">
                  {userPage}
                </span>{" "}
                of {totalUserPages} ({(userPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(userPage * rowsPerPage, filteredUsers.length)} from{" "}
                {filteredUsers.length} Users)
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
                  onClick={() =>
                    setUserPage(Math.min(totalUserPages, userPage + 1))
                  }
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
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-[#000000] rounded-[20px] p-6 w-[400px]">
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
              <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-[#0EFF7B33] pb-3">
                <h3 className="text-lg font-semibold text-[#08994A] dark:text-[#0EFF7B]">
                  {deleteUser ? "Delete User" : "Delete Users"}
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteUserPopup(false);
                    setDeleteUser(null);
                  }}
                  className="text-[#08994A] dark:text-[#0EFF7B] hover:text-[#0cd968] dark:hover:text-[#0cd968] p-1 rounded-full hover:bg-[#08994A33] dark:hover:bg-[#0EFF7B33] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-black dark:text-white mb-6">
                {deleteUser
                  ? `Are you sure you want to delete user "${deleteUser.name}"? This will only delete the user account, not the staff record.`
                  : `Are you sure you want to delete ${selectedUsers.length} user(s)? This will only delete user accounts, not staff records.`}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteUserPopup(false);
                    setDeleteUser(null);
                  }}
                  className="bg-white dark:bg-[#1E1E1E] text-black dark:text-white px-4 py-2 rounded-[8px] font-semibold hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    deleteUser ? confirmDeleteUserUser : confirmDeleteUsers
                  }
                  className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-[8px] font-semibold hover:bg-red-700 dark:hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Popup */}
      {showAddUserPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="rounded-[20px] p-[1px] backdrop-blur-md shadow-[0px_0px_4px_0px_#FFFFFF1F] bg-gradient-to-r from-green-400/70 via-gray-300/30 to-green-400/70 dark:bg-[linear-gradient(132.3deg,rgba(14,255,123,0.7)_0%,rgba(30,30,30,0.7)_49.68%,rgba(14,255,123,0.7)_99.36%)]">
            <div
              className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-5 relative"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              <div className="flex justify-between items-center pb-2 mb-3">
                <h2 className="text-black dark:text-white font-medium text-[16px] leading-[19px]">
                  Add New User
                </h2>
                <button
                  onClick={() => {
                    setShowAddUserPopup(false);
                    resetAddUserForm();
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
                >
                  <X size={16} className="text-black dark:text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Username"
                  name="username"
                  value={newUser.username}
                  onChange={handleUsernameChange}
                  placeholder="Enter username"
                  required={true}
                  error={validationErrors.username}
                  autoCapitalize={true}
                />
                <div>
  <label className="text-sm text-black dark:text-white">
    Password <span className="text-red-500 ml-1">*</span>
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={newUser.password}
      onChange={handlePasswordChange}
      placeholder="Enter password"
      className="w-[228px] h-[30px] mt-[2px] px-3 pr-10 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] placeholder-gray-400 dark:placeholder-gray-500 outline-none"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
    >
      {showPassword ? (
        <EyeOff size={16} />
      ) : (
        <Eye size={16} />
      )}
    </button>
  </div>
  {validationErrors.password && (
    <p className="mt-1 text-xs text-red-500 dark:text-red-500">
      {validationErrors.password}
    </p>
  )}
  {/* Only show success message when password meets ALL requirements */}
  {passwordMeetsRequirements && !validationErrors.password && (
    <p className="mt-1 text-xs text-green-500 dark:text-green-400">
      ✓ Password meets requirements
    </p>
  )}
  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
    Must contain: 8+ chars, uppercase, number, special char
  </div>
</div>
                <div>
                  <label className="text-sm text-black dark:text-white">
                    Role <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Listbox value={newUser.role} onChange={(val) => {
                    setNewUser({ ...newUser, role: val });
                    if (validationErrors.role) {
                      setValidationErrors(prev => ({ ...prev, role: "" }));
                    }
                  }}>
                    <div className="relative mt-1 w-full">
                      <Listbox.Button
                        className="w-[228px] h-[30px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
                      >
                        {newUser.role}
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options
                        className="absolute mt-1 w-[228px] max-h-[180px] overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3C3C3C]"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {availableRoles.map((option, idx) => (
                          <Listbox.Option
                            key={idx}
                            value={option}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                              ${
                                active || selected
                                  ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                  : "text-[#08994A] dark:text-[#0EFF7B]"
                              }`
                            }
                          >
                            {option}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  {validationErrors.role && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-500">
                      {validationErrors.role}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black dark:text-white">
                    Staff ID <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Listbox value={newUser.staffId} onChange={(val) => {
                    setNewUser({ ...newUser, staffId: val });
                    if (validationErrors.staffId) {
                      setValidationErrors(prev => ({ ...prev, staffId: "" }));
                    }
                  }}>
                    <div className="relative mt-1 w-full">
                      <Listbox.Button
                        className="w-[228px] h-[30px] px-3 pr-8 rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-[#0EFF7B] text-left text-[14px] leading-[16px]"
                      >
                        {newUser.staffId}
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-[#08994A] dark:text-[#0EFF7B]" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options
                        className="absolute mt-1 w-[228px] max-h-[180px] overflow-auto scrollbar-hide rounded-[8px] bg-white dark:bg-black shadow-lg z-50 border border-gray-300 dark:border-[#3C3C3C]"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {staffOptions.map((option, idx) => (
                          <Listbox.Option
                            key={idx}
                            value={option}
                            className={({ active, selected }) =>
                              `cursor-pointer select-none py-2 px-2 text-sm rounded-md
                              ${
                                active || selected
                                  ? "bg-[#08994A33] dark:bg-[#0EFF7B33] text-[#08994A] dark:text-[#0EFF7B]"
                                  : "text-[#08994A] dark:text-[#0EFF7B]"
                              }`
                            }
                          >
                            {option}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  {validationErrors.staffId && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-500">
                      {validationErrors.staffId}
                    </p>
                  )}
                </div>
              </div>
              {/* Show staff information only (not autofill) */}
              {newUser.staffId &&
                newUser.staffId !== "Select Staff ID" &&
                staffMap[newUser.staffId] && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-md">
                    <h4 className="text-sm font-medium text-black dark:text-white mb-2">
                      Selected Staff Information:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <span className="ml-2 text-black dark:text-white">
                          {staffMap[newUser.staffId]?.full_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Department:
                        </span>
                        <span className="ml-2 text-black dark:text-white">
                          {staffMap[newUser.staffId]?.department}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Joined On:
                        </span>
                        <span className="ml-2 text-black dark:text-white">
                          {staffMap[newUser.staffId]?.joinedOn}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Email:
                        </span>
                        <span className="ml-2 text-black dark:text-white">
                          {staffMap[newUser.staffId]?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={() => {
                    setShowAddUserPopup(false);
                    resetAddUserForm();
                  }}
                  className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#025126] via-[#0D7F41] to-[#025126] text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Popup */}
      {showEditUserPopup && editUser && (
        <EditUserPopup
          user={editUser}
          onClose={() => {
            setShowEditUserPopup(false);
            setEditUser(null);
          }}
          onSave={async (updatedUser) => {
            try {
              const token = getAuthToken();
              const formData = new FormData();

              if (updatedUser.username)
                formData.append("username", updatedUser.username);
              if (updatedUser.role) formData.append("role", updatedUser.role);
              if (updatedUser.newPassword)
                formData.append("new_password", updatedUser.newPassword);
              if (updatedUser.confirmPassword)
                formData.append(
                  "confirm_password",
                  updatedUser.confirmPassword
                );

              const res = await fetch(`${API_BASE}/users/${updatedUser.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              });

              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to update user");
              }

              await fetchUsers();
              setShowEditUserPopup(false);
              setEditUser(null);
              successToast("User updated successfully!");
            } catch (err) {
              errorToast(err.message || "Failed to update user");
            }
          }}
        />
      )}
    </div>
  );
};

export default UserSettings;