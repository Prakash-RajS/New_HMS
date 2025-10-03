// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Moon, Sun } from "lucide-react";
// import { ThemeContext } from "./ThemeContext.jsx";
// import { useNavigate } from "react-router-dom";
// import { successToast, errorToast } from "./Toast.jsx";


// const Header = ({ isCollapsed }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const { theme, toggleTheme } = useContext(ThemeContext);
//   const navigate = useNavigate();

//   // Toggle dropdown and manage body class
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     document.body.classList.toggle("dropdown-open", !isDropdownOpen);
//   };

  
//   const handleLogout = () => {
//   try {
//     // Clear user session / localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("user_id");
//     localStorage.removeItem("role");

//     // ✅ Show success toast
//     successToast("Logged out successfully!");

//     // Optionally, navigate to login page
//     navigate("/"); 
//   } catch (err) {
//     console.error(err);
//     // ✅ Show error toast if something goes wrong
//     errorToast("Logout failed. Please try again.");
//   }
// };
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//         document.body.classList.remove("dropdown-open");
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   return (
//     <div className="w-full">
//       <header
//         className="flex items-center justify-between p-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] gap-[20px] transition-all duration-300 ease-in-out"
//         style={{
//           width: `calc(100% - ${isCollapsed ? "120px" : "270px"})`,
//           maxWidth: "1580px",
//           position: "fixed",
//           left: isCollapsed ? "100px" : "247px",
//           zIndex: 40,
//           transitionProperty: "width, left",
//           transitionDuration: "300ms",
//           transitionTimingFunction: "ease-in-out",
//         }}
//       >
//         {/* Spacer for left side */}
//         <div className="w-[394px]"></div>

//         {/* Search Bar */}
//         <div className="relative w-[394px] h-[42px] mr-12">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 20 20"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
//                 stroke="#08994A"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M17.5 17.5L13.875 13.875"
//                 stroke="#08994A"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full h-full rounded-[40px] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] pl-12 pr-4 py-1 
//             text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-emerald-500 transition-all"
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-[20px]">
//           {/* Dark Mode Toggle Icon */}
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors"
//           >
//             {theme === "dark" ? (
//               <Sun size={20} className="text-[#08994A] dark:text-[#E4E4E7]" />
//             ) : (
//               <Moon size={20} className="text-[#08994A] dark:text-[#E4E4E7]" />
//             )}
//           </button>

//           {/* Settings Icon */}
//           <button 
//           onClick={() => navigate("/security")}
//           className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#08994A"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="dark:stroke-[#E4E4E7]"
//             >
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 
//               2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 
//               0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 
//               2 0 0 1-4 0v-.09a1.65 1.65 0 
//               0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 
//               2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 
//               0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 
//               2 0 0 1 0-4h.09c.7 0 1.32-.4 
//               1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 
//               2 0 0 1 2.83-2.83l.06.06a1.65 1.65 
//               0 0 0 1.82.33H9a1.65 1.65 0 
//               0 0 1-1.51V3a2 2 0 0 1 4 
//               0v.09c0 .7.4 1.32 1 
//               1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 
//               2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 
//               0 0 0-.33 1.82V9c0 .7.4 1.32 
//               1 1.51H21a2 2 0 0 1 0 4h-.09c-.7 
//               0-1.32.4-1.51 1z" />
//             </svg>
//           </button>

//           {/* Bell Icon */}
//           <button className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 20 20"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M16 7C16 5.4087 15.3679 3.88258 14.2426 
//                 2.75736C13.1174 1.63214 11.5913 1 
//                 10 1C8.4087 1 6.88258 1.63214 
//                 5.75736 2.75736C4.63214 3.88258 4 5.4087 
//                 4 7C4 12 1 14 1 14H19C19 14 16 12 16 7Z"
//                 stroke="#08994A"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="dark:stroke-[#E4E4E7]"
//               />
//               <path
//                 d="M11.73 15C11.5542 15.3031 11.3019 
//                 15.5547 10.9982 15.7295C10.6946 15.9044 
//                 10.3504 15.9965 10 15.9965C9.6496 
//                 15.9965 9.3054 15.9044 9.0018 
//                 15.7295C8.6982 15.5547 8.4458 15.3031 
//                 8.27 15"
//                 stroke="#08994A"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="dark:stroke-[#E4E4E7]"
//               />
//             </svg>
//             <span className="absolute top-1 right-1 w-2 h-2 bg-[#08994A] dark:bg-emerald-500 rounded-full"></span>
//           </button>

//           {/* Mail Icon */}
//           <button className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 20 20"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M18 4C18 2.9 17.1 2 16 2H4C2.9 2 2 
//                 2.9 2 4V16C2 17.1 2.9 18 4 
//                 18H16C17.1 18 18 17.1 18 
//                 16V4Z"
//                 stroke="#08994A"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="dark:stroke-[#E4E4E7]"
//               />
//               <path
//                 d="M18 6L10 11L2 6"
//                 stroke="#08994A"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="dark:stroke-[#E4E4E7]"
//               />
//             </svg>
//             <span className="absolute top-1 right-1 w-2 h-2 bg-[#08994A] dark:bg-emerald-500 rounded-full"></span>
//           </button>

//           {/* Divider */}
//           <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

//           {/* Profile Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <div
//               className="flex items-center gap-3 cursor-pointer group w-[163px] h-[32px]"
//               onClick={toggleDropdown}
//             >
//               <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-gradient-to-br from-[#0EFF7B] to-[#08994A] dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center text-white font-medium shrink-0">
//                 JD
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium whitespace-nowrap text-ellipsis group-hover:text-[#08994A] dark:group-hover:text-emerald-400 text-black dark:text-white transition-colors">
//                   John Doe
//                 </span>
//                 <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
//                   Admin
//                 </span>
//               </div>
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className={`text-gray-600 dark:text-gray-400 group-hover:text-[#08994A] dark:group-hover:text-emerald-400 transition-colors shrink-0 ${
//                   isDropdownOpen ? "rotate-180" : ""
//                 }`}
//               >
//                 <path
//                   d="M6 9L12 15L18 9"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             {isDropdownOpen && (
//               <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-md shadow-lg py-2 z-50">
//                 <ul>
//                   <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer">
//                     Profile
//                   </li>
//                   <li 
//                   onClick={() => navigate("/UserSettings")}
//                   className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer">
//                     Settings
//                   </li>
//                   <li className="px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
//                   onClick={handleLogout}>
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// };

// export default Header;
import React, { useState, useEffect, useRef, useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "./ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "./Toast.jsx";

const Header = ({ isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mailRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Sample notification and mail data
  const notifications = [
    { 
      id: 1, 
      message: "New user registered", 
      time: "2m ago", 
      type: "info",
      read: false 
    },
    { 
      id: 2, 
      message: "System update available", 
      time: "1h ago", 
      type: "warning",
      read: false 
    },
    { 
      id: 3, 
      message: "Task completed successfully", 
      time: "3h ago", 
      type: "success",
      read: true 
    },
    { 
      id: 4, 
      message: "Payment received", 
      time: "5h ago", 
      type: "success",
      read: true 
    },
    { 
      id: 5, 
      message: "Database backup completed", 
      time: "6h ago", 
      type: "info",
      read: true 
    },
    { 
      id: 6, 
      message: "New comment on your post", 
      time: "7h ago", 
      type: "info",
      read: true 
    },
  ];

  const mails = [
    { 
      id: 1, 
      sender: "System Admin", 
      subject: "Welcome to Our Platform", 
      preview: "Thank you for joining us. We're excited to have you...",
      time: "10m ago",
      read: false 
    },
    { 
      id: 2, 
      sender: "Support Team", 
      subject: "Your Ticket #1234 Update", 
      preview: "We've reviewed your request and working on a solution...",
      time: "2h ago",
      read: false 
    },
    { 
      id: 3, 
      sender: "HR Department", 
      subject: "Monthly Meeting Schedule", 
      preview: "Please find attached the schedule for upcoming meetings...",
      time: "1d ago",
      read: true 
    },
    { 
      id: 4, 
      sender: "Marketing Team", 
      subject: "New Campaign Launch", 
      preview: "We're excited to announce our new marketing campaign...",
      time: "2d ago",
      read: true 
    },
    { 
      id: 5, 
      sender: "Finance Department", 
      subject: "Invoice #INV-001", 
      preview: "Your invoice for the month of December is now available...",
      time: "3d ago",
      read: true 
    },
  ];

  // Toggle functions
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
    setIsMailOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
    setIsMailOpen(false);
  };

  const toggleMail = () => {
    setIsMailOpen(!isMailOpen);
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(event.target)) {
        setIsMailOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationColor = (type) => {
    switch (type) {
      case "info": return "bg-blue-500";
      case "warning": return "bg-yellow-500";
      case "success": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMailsCount = mails.filter(m => !m.read).length;

  return (
    <div className="w-full">
      <header
        className="flex items-center justify-between p-4 bg-white dark:bg-black text-black dark:text-white dark:border-[#1E1E1E] gap-[20px] transition-all duration-300 ease-in-out"
        style={{
          width: `calc(100% - ${isCollapsed ? "120px" : "270px"})`,
          maxWidth: "1580px",
          position: "fixed",
          left: isCollapsed ? "100px" : "247px",
          zIndex: 40,
          transitionProperty: "width, left",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        <div className="w-[394px]"></div>

        <div className="relative w-[394px] h-[42px] mr-12">
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
            type="text"
            placeholder="Search"
            className="w-full h-full rounded-[40px] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] border border-[#0EFF7B] dark:border-[#0EFF7B1A] pl-12 pr-4 py-1 
            text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#08994A] dark:focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-[20px]">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-[#08994A] dark:text-[#E4E4E7]" />
            ) : (
              <Moon size={20} className="text-[#08994A] dark:text-[#E4E4E7]" />
            )}
          </button>

          <button 
            onClick={() => navigate("/security")}
            className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#08994A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-[#E4E4E7]"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 
              2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 
              0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 
              2 0 0 1-4 0v-.09a1.65 1.65 0 
              0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 
              2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 
              0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 
              2 0 0 1 0-4h.09c.7 0 1.32-.4 
              1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 
              2 0 0 1 2.83-2.83l.06.06a1.65 1.65 
              0 0 0 1.82.33H9a1.65 1.65 0 
              0 0 1-1.51V3a2 2 0 0 1 4 
              0v.09c0 .7.4 1.32 1 
              1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 
              2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 
              0 0 0-.33 1.82V9c0 .7.4 1.32 
              1 1.51H21a2 2 0 0 1 0 4h-.09c-.7 
              0-1.32.4-1.51 1z" />
            </svg>
          </button>

          {/* Notifications with Arrow Indicator */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={toggleNotification}
              className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7C16 5.4087 15.3679 3.88258 14.2426 
                  2.75736C13.1174 1.63214 11.5913 1 
                  10 1C8.4087 1 6.88258 1.63214 
                  5.75736 2.75736C4.63214 3.88258 4 5.4087 
                  4 7C4 12 1 14 1 14H19C19 14 16 12 16 7Z"
                  stroke="#08994A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-[#E4E4E7]"
                />
                <path
                  d="M11.73 15C11.5542 15.3031 11.3019 
                  15.5547 10.9982 15.7295C10.6946 15.9044 
                  10.3504 15.9965 10 15.9965C9.6496 
                  15.9965 9.3054 15.9044 9.0018 
                  15.7295C8.6982 15.5547 8.4458 15.3031 
                  8.27 15"
                  stroke="#08994A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-[#E4E4E7]"
                />
              </svg>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#08994A] dark:bg-emerald-500 rounded-full"></span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-gray-800 border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-lg shadow-xl z-50">
                {/* Arrow Indicator */}
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-gray-800 border-l border-t border-[#0EFF7B] dark:border-[#1E1E1E]"></div>
                
                <div className="relative bg-white dark:bg-gray-800 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <span className="bg-[#08994A] text-white text-xs px-2 py-1 rounded-full">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  
                  {/* Scrollable content with hidden scrollbar */}
                  <div 
                    className="max-h-[300px] overflow-auto"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <div 
                      className="p-2"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                              !notification.read 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${getNotificationColor(notification.type)}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${
                                  !notification.read 
                                    ? 'text-gray-900 dark:text-white font-medium' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-[#08994A] rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                          <div className="text-3xl mb-2">🔔</div>
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hide scrollbar for Webkit browsers */}
                  <style jsx>{`
                    div[class*="overflow-auto"]::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>

          {/* Mail with Arrow Indicator */}
          <div className="relative" ref={mailRef}>
            <button 
              onClick={toggleMail}
              className="p-2 rounded-full bg-white dark:bg-transparent border border-[#0EFF7B] dark:border-[#1E1E1E] hover:bg-[#0EFF7B1A] dark:hover:bg-gray-800 hover:text-white transition-colors relative"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 4C18 2.9 17.1 2 16 2H4C2.9 2 2 
                  2.9 2 4V16C2 17.1 2.9 18 4 
                  18H16C17.1 18 18 17.1 18 
                  16V4Z"
                  stroke="#08994A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-[#E4E4E7]"
                />
                <path
                  d="M18 6L10 11L2 6"
                  stroke="#08994A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-[#E4E4E7]"
                />
              </svg>
              {unreadMailsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#08994A] dark:bg-emerald-500 rounded-full"></span>
              )}
            </button>

            {isMailOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-gray-800 border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-lg shadow-xl z-50">
                {/* Arrow Indicator */}
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-gray-800 border-l border-t border-[#0EFF7B] dark:border-[#1E1E1E]"></div>
                
                <div className="relative bg-white dark:bg-gray-800 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Messages</h3>
                    {unreadMailsCount > 0 && (
                      <span className="bg-[#08994A] text-white text-xs px-2 py-1 rounded-full">
                        {unreadMailsCount} new
                      </span>
                    )}
                  </div>
                  
                  {/* Scrollable content with hidden scrollbar */}
                  <div 
                    className="max-h-[300px] overflow-auto"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <div 
                      className="p-2"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {mails.length > 0 ? (
                        mails.map((mail) => (
                          <div
                            key={mail.id}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                              !mail.read 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                {mail.sender.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${
                                    !mail.read 
                                      ? 'text-gray-900 dark:text-white' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {mail.sender}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                    {mail.time}
                                  </p>
                                </div>
                                <p className={`text-sm font-semibold mt-1 ${
                                  !mail.read 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {mail.subject}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                  {mail.preview}
                                </p>
                              </div>
                              {!mail.read && (
                                <div className="w-2 h-2 bg-[#08994A] rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                          <div className="text-3xl mb-2">✉️</div>
                          <p className="text-sm">No messages</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hide scrollbar for Webkit browsers */}
                  <style jsx>{`
                    div[class*="overflow-auto"]::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

          {/* Profile Dropdown with Arrow Indicator */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer group w-[163px] h-[32px]"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-gradient-to-br from-[#0EFF7B] to-[#08994A] dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-center text-white font-medium shrink-0">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium whitespace-nowrap text-ellipsis group-hover:text-[#08994A] dark:group-hover:text-emerald-400 text-black dark:text-white transition-colors">
                  John Doe
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Admin
                </span>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-gray-600 dark:text-gray-400 group-hover:text-[#08994A] dark:group-hover:text-emerald-400 transition-colors shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-gray-800 border border-[#0EFF7B] dark:border-[#1E1E1E] rounded-lg shadow-xl z-50">
                {/* Arrow Indicator */}
                <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-gray-800 border-l border-t border-[#0EFF7B] dark:border-[#1E1E1E]"></div>
                
                <div className="relative bg-white dark:bg-gray-800 rounded-lg py-2">
                  <ul>
                    <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer transition-colors rounded mx-2">
                      Profile
                    </li>
                    <li 
                      onClick={() => navigate("/UserSettings")}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-[#08994A] dark:hover:bg-gray-700 hover:text-white cursor-pointer transition-colors rounded mx-2"
                    >
                      Settings
                    </li>
                    <li 
                      className="px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer transition-colors rounded mx-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
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