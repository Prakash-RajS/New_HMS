// src/components/Header.jsx (Updated)
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Moon, Sun, Bell, Mail, Settings, LogOut, User } from "lucide-react";
import { ThemeContext } from "./ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "./Toast.jsx";
import { searchMenu } from "./SearchMenu";
import { useWebSocket } from "../components/WebSocketContext";

const Header = ({ isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mailRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected } =
    useWebSocket();

  const navigate = useNavigate();
const [userProfile, setUserProfile] = useState({
    full_name: "Loading...",
    role: "User",
    profile_picture: null,
  });
  const initials = userProfile.full_name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  // Search results
  const searchResults = useMemo(() => searchMenu(searchQuery), [searchQuery]);
// const API_BASE_URL = "http://localhost:8000";
  const API_BASE_URL =
  window.location.hostname === "18.119.210.2"
    ? "http://18.119.210.2:8000"
    : window.location.hostname === "3.133.64.23"
    ? "http://3.133.64.23:8000"
    : "http://localhost:8000";
  // Sample email data (you can replace with real data)
  const mails = [
    {
      id: 1,
      sender: "System Admin",
      subject: "Welcome to Our Platform",
      preview: "Thank you for joining us...",
      time: "10m ago",
      read: false,
    },
    {
      id: 2,
      sender: "Support Team",
      subject: "Your Ticket #1234 Update",
      preview: "We've reviewed your request...",
      time: "2h ago",
      read: false,
    },
    {
      id: 3,
      sender: "HR Department",
      subject: "Monthly Meeting Schedule",
      preview: "Please find attached...",
      time: "1d ago",
      read: true,
    },
  ];

  // Toggle functions
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
    setIsMailOpen(false);
    setShowSearchResults(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
    setIsMailOpen(false);
    setShowSearchResults(false);
  };

  const toggleMail = () => {
    setIsMailOpen(!isMailOpen);
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
    setShowSearchResults(false);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.data.redirect_to) {
      navigate(notification.data.redirect_to);
    }

    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role");
      successToast("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      errorToast("Logout failed. Please try again.");
    }
  };

  // Close all dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(event.target)) {
        setIsMailOpen(false);
      }
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Enter key navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };
// Fetch logged-in user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/profile/me/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            successToast("Session expired. Please login again.");
            navigate("/");
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        const profilePic = data.profile_picture
          ? `${API_BASE_URL}${data.profile_picture.startsWith("/") ? "" : "/"}${data.profile_picture}`
          : null;

        setUserProfile({
          full_name: data.full_name || "User",
          role: data.designation || "Staff",
          profile_picture: profilePic,
        });

      } catch (err) {
        console.error("Error fetching user profile:", err);
        setUserProfile({
          full_name: "User",
          role: "Staff",
          profile_picture: null,
        });
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const getNotificationColor = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadMailsCount = mails.filter((m) => !m.read).length;

  return (
    <div className="w-full font-[Helvetica]">
      <header
        className="flex items-center justify-between p-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] gap-[20px] transition-all duration-300 ease-in-out"
        style={{
          width: `calc(100% - ${isCollapsed ? "120px" : "270px"})`,
          maxWidth: "2580px",
          position: "fixed",
          left: isCollapsed ? "100px" : "247px",
          zIndex: 40,
          transitionProperty: "width, left",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <div className="w-[394px]"></div>

        {/* GLOBAL SEARCH BAR */}
        <div className="relative w-[394px] h-[42px] mr-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                stroke="#08994A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 17.5L13.875 13.875"
                stroke="#08994A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            onKeyDown={handleSearchKeyDown}
            className="min-w-[393px] h-full rounded-[8px] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border-[1px] border-[#0EFF7B] dark:border-[#0EFF7B] pl-12 pr-4 py-1 
              text-black dark:text-white placeholder-[#00A048] dark:placeholder-[#00A048] 
              focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-emerald-500 transition-all"
          />

          {/* SEARCH RESULTS DROPDOWN */}
          {showSearchResults && (
            <div
              ref={searchDropdownRef}
              className="absolute left-0 right-0 top-full mt-2 w-full bg-white dark:bg-[#1E1E1E] border border-[#0EFF7B] rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {searchResults.length > 0 ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {searchResults.length} result
                    {searchResults.length > 1 ? "s" : ""}
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {searchResults.map((res, idx) => {
                      const Icon = res.icon;
                      const indent = res.depth * 16;
                      return (
                        <li
                          key={idx}
                          onClick={() => {
                            navigate(res.path);
                            setSearchQuery("");
                            setShowSearchResults(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#0EFF7B1A] dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          style={{ paddingLeft: `${indent + 12}px` }}
                        >
                          <Icon className="w-4 h-4 text-[#08994A] dark:text-emerald-500 flex-shrink-0" />
                          <span className="text-sm truncate">{res.label}</span>
                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            {res.path.replace(/^\/+/, "")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : searchQuery ? (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No menu items found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-[20px]">
          {/* WebSocket Status Indicator */}
          {/* <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Connected" : "Disconnected"}
          /> */}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative group p-2 rounded-[8px] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-[#08994A] dark:text-[#0EFF7B]" />
            ) : (
              <Moon size={20} className="text-[#08994A] dark:text-[#E4E4E7]" />
            )}
            <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Dark/Light
              </span>
          </button>

          {/* Security */}
          <button
            onClick={() => navigate("/security")}
            className="relative group p-2 rounded-[8px] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings
              size={20}
              className="text-[#08994A] dark:text-[#0EFF7B]"
            />
            <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Settings
              </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotification}
              className="relative group p-2 rounded-[8px] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative"
            >
              <Bell size={20} className="text-[#08994A] dark:text-[#0EFF7B]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    Notifications
              </span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-3 w-96 bg-white dark:bg-[#1E1E1E] border-[1px] border-[#0EFF7B] dark:border-[#0EFF7B] rounded-lg shadow-xl z-50 font-[Helvetica]">
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-[#1E1E1E] border-l border-t border-[#0EFF7B] dark:border-[#0EFF7B]"></div>
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Notifications
                  </h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#08994A] dark:text-emerald-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isConnected
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {isConnected ? "Live" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length > 0 ? (
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                            !notification.read
                              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-3 h-3 rounded-full mt-1.5 ${getNotificationColor(
                                notification.type
                              )}`}
                            ></div>
                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? "font-medium text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#08994A] rounded-full mt-1.5"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mail */}
          {/* <div className="relative" ref={mailRef}>
            <button
              onClick={toggleMail}
              className="p-2 rounded-[8px] bg-[#0EFF7B1A] dark:bg-[#1E1E1E] border border-[#0EFF7B] dark:border-[#0EFF7B] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative"
            >
              <Mail size={20} className="text-[#08994A] dark:text-[#0EFF7B]" />
              {unreadMailsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMailsCount}
                </span>
              )}
            </button>

            {isMailOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#1E1E1E] border-[1px] border-[#0EFF7B] dark:border-[#0EFF7B] rounded-lg shadow-xl z-50">
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-[#1E1E1E] border-l border-t border-[#0EFF7B] dark:border-[#0EFF7B]"></div>
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Messages
                  </h3>
                  {unreadMailsCount > 0 && (
                    <span className="bg-[#08994A] text-white text-xs px-2 py-1 rounded-full">
                      {unreadMailsCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-2">
                    {mails.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                          !m.read
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                            {m.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm font-medium ${
                                  !m.read
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {m.sender}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {m.time}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-semibold mt-1 ${
                                !m.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {m.subject}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              {m.preview}
                            </p>
                          </div>
                          {!m.read && (
                            <div className="w-2 h-2 bg-[#08994A] rounded-full mt-1.5"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div> */}

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative font-[Helvetica]" ref={dropdownRef}>
            <div
              className="relative group flex items-center gap-3 cursor-pointer group w-[163px] h-[32px] font-[Helvetica] "
              onClick={toggleDropdown}
            >
              <div className="relative w-8 h-8 min-w-8 min-h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#0EFF7B] to-[#08994A] dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center text-white font-medium shrink-0 border-2 border-white dark:border-gray-800">
                {userProfile.profile_picture ? (
                  <img
                    src={userProfile.profile_picture}
                    alt={userProfile.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span className={`flex items-center justify-center w-full h-full ${userProfile.profile_picture ? "hidden" : ""}`}>
                  {initials}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium whitespace-nowrap text-ellipsis group-hover:text-[#08994A] dark:group-hover:text-emerald-400 text-black dark:text-white transition-colors">
                  {userProfile.full_name}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {userProfile.role}
                </span>
              </div>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-gray-600 dark:text-gray-400 group-hover:text-[#08994A] dark:group-hover:text-emerald-400 transition-colors shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                    px-3 py-1 text-xs rounded-md shadow-md
                    bg-white dark:bg-black text-black dark:text-white opacity-0   group-hover:opacity-100
                    transition-all duration-150">
                    View Profile
              </span>
            </div>
            

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-gray-800 border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-lg shadow-xl z-50">
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-gray-800 border-l border-t border-[#0EFF7B] dark:border-[#1E1E1E]"></div>
                <div className="py-3">
                  <ul>
                    <li onClick={() => { setIsDropdownOpen(false); navigate("/profile"); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer transition-colors rounded mx-2">Profile</li>
                    <li onClick={() => { setIsDropdownOpen(false); navigate("/UserSettings"); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer transition-colors rounded mx-2">Settings</li>
                    <li onClick={() => { setIsDropdownOpen(false); handleLogout(); }} className="px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer transition-colors rounded mx-2">Logout</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
