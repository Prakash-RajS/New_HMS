// Login.jsx
import React, { useState, useEffect } from "react";
import {
  Microscope,
  Pill,
  HeartPulse,
  Ambulance,
  User,
  ShieldCheck,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_1.png";
import Eclipse from "../assets/eclipse.png";
import LightEclipse from "../assets/eclipse_1.png";
import { successToast, errorToast } from "../components/Toast.jsx";
import axios from "axios";


const icons = [
  Microscope,
  Pill,
  HeartPulse,
  Ambulance,
  User,
  ShieldCheck,
  Activity,
];

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Auto-detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setIsLightMode(mediaQuery.matches);

    const handleChange = (e) => setIsLightMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username && !password) {
      errorToast("Please enter username and password");
      return;
    }
    if (!username) {
      errorToast("Username is required");
      return;
    }
    if (!password) {
      errorToast("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post(
        "http://localhost:8000/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      successToast(`Welcome back, ${username}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      // Backend should ideally send proper error messages
      if (err.response?.data?.detail) {
        errorToast(err.response.data.detail);
      } else {
        errorToast("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!username && !password) {
  //     errorToast("Please enter username and password");
  //     return;
  //   }
  //   if (!username) {
  //     errorToast("Username is required");
  //     return;
  //   }
  //   if (!password) {
  //     errorToast("Password is required");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const demoEmail = "sample@gmail.com";
  //     const demoPassword = "12345";

  //     if (username === demoEmail && password === demoPassword) {
  //       const fakeToken = "test_token_12345";
  //       const fakeUserId = "1";
  //       const fakeRole = "user";

  //       localStorage.setItem("token", fakeToken);
  //       localStorage.setItem("user_id", fakeUserId);
  //       localStorage.setItem("role", fakeRole);

  //       successToast(`Welcome back, ${username}!`);
  //       navigate("/dashboard");
  //     } else {
  //       errorToast("Invalid email or password. Try again.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     errorToast("Something went wrong. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      {/* 🔹 FIXED: Dots Background Layer - BEFORE Main Container */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${
          isLightMode ? "bg-white" : "bg-black"
        }`}
      >
        {Array.from({ length: 200 }).map((_, i) => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                isLightMode ? "bg-[#0EFF7BCC]" : "bg-white"
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 1 + 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 1,
              }}
            />
          );
        })}
      </div>

      <div
        className={`flex flex-col md:flex-row w-screen h-full ${
          isLightMode ? "bg-white" : "bg-black"
        }`}
      >
        {/* Left Side */}
        <div className="relative w-full md:w-1/2 h-full flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full flex items-center"
            style={{ justifyContent: "flex-start", paddingLeft: "70px" }}
          >
            <motion.img
              src={isLightMode ? LightEclipse : Eclipse}
              alt="Eclipse"
              className="absolute w-2/3 max-h-1/2 md:w-3/5 md:max-h-1/2 left-0 object-contain -translate-y-1/2 z-0"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <motion.img
              src={Logo}
              alt="StackCare Logo"
              className="absolute w-1/2 max-h-1/2 md:w-2/5 md:max-h-1/3 object-contain -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* 🔹 FIXED: Floating icons with BOLDER colors + INSTANT visibility */}
          <motion.div
            className="absolute top-1/2 left-[200px] -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {icons.map((Icon, index) => {
              const startAngle = -Math.PI / 2;
              const totalArc = Math.PI;
              const angle =
                startAngle + (index / (icons.length - 1)) * totalArc;

              let radiusX = 280;
              let radiusY = 250;
              if (window.innerWidth >= 1441) {
                radiusX = 380;
                radiusY = 320;
              }

              const x = radiusX * Math.cos(angle);
              const y = radiusY * Math.sin(angle);

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0.3, opacity: 0.3 }} // 🔹 START: Small + Faint
                  animate={{
                    scale: 1,
                    opacity: 1, // 🔹 END: Full size + FULLY VISIBLE
                  }}
                  transition={{
                    duration: 0.8, // 🔹 FASTER: 0.8s (was 0.5s)
                    delay: index * 0.15, // 🔹 QUICKER stagger
                    ease: "easeOut",
                  }}
                >
                  <Icon
                    className={`absolute drop-shadow-md ${
                      isLightMode
                        ? "text-[#0EFF7B]" // 🔹 LIGHT: BOLD #08994A
                        : "text-[#0EFF7B]" // 🔹 DARK: BOLD #0EFF7B
                    }`}
                    style={{
                      width: "28px", // 🔹 BIGGER: 36px (was 28px)
                      height: "28px", // 🔹 BIGGER: 36px (was 28px)
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 h-auto flex items-center justify-center relative">
          <motion.div
            className={`border-[1.5px] mr-12 rounded-[12px] p-8 flex flex-col items-center relative ${
              isLightMode
                ? "bg-white border-[#0EFF7B] shadow-[0px_0px_50px_0px_#0EFF7B40]"
                : "bg-black border-[#0EFF7B33]"
            }`}
            style={{ minWidth: "595px", minHeight: "550px" }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Welcome Text */}
            <motion.h1
              className={`text-[32px] font-bold mb-2 text-center ${
                isLightMode ? "text-black" : "text-white"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to <span className="text-[#0EFF7B]">Stacklycare</span>
            </motion.h1>
            <motion.p
              className={`text-[18px] mb-8 text-center ${
                isLightMode ? "text-[#08994A]" : "text-gray-300"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Life is Happy when you are Healthy
            </motion.p>

            {/* Login Form */}
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {/* Autofill style fix - Light/Dark compatible */}
              <style>{`
                input:-webkit-autofill {
                  -webkit-box-shadow: 0 0 0px 1000px ${
                    isLightMode ? "#0EFF7B1A" : "#0EFF7B1A"
                  } inset !important;
                  -webkit-text-fill-color: ${
                    isLightMode ? "#000" : "#fff"
                  } !important;
                  caret-color: ${isLightMode ? "#000" : "#fff"} !important;
                  transition: background-color 9999s ease-in-out 0s;
                }
              `}</style>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label
                  htmlFor="username"
                  className={`font-medium mb-1 ${
                    isLightMode ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className={`min-w-[500px] h-[51px] rounded-[8px] px-3 py-2  focus:outline-none focus:bg-[#0EFF7B1A] transition-all duration-300 hover:border-[#0EFF7B] border border-transparent ${
                    isLightMode
                      ? "text-[#00E569E5] placeholder-[#00E569E5] bg-[#0EFF7B1A]"
                      : "text-white placeholder-gray-400 bg-[#0EFF7B1A]"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Username"
                />
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label
                  htmlFor="password"
                  className={`font-medium mb-1 ${
                    isLightMode ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className={`min-w-[500px] h-[51px] rounded-[8px] px-3 py-2 bg-[#0EFF7B1A] focus:outline-none focus:bg-[#0EFF7B1A] pr-10 transition-all duration-300 hover:border-[#0EFF7B] border border-transparent ${
                      isLightMode
                        ? "text-[#00E569E5] placeholder-[#00E569E5]"
                        : "text-white placeholder-gray-400"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0EFF7B] w-5 h-5"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-between items-center mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="accent-[#0EFF7B] mr-2"
                    aria-label="Remember me"
                  />
                  <label
                    htmlFor="remember"
                    className={`${
                      isLightMode ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    Remember me
                  </label>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className={`min-w-[500px] h-[54px] rounded-[8px] font-semibold transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : isLightMode
                    ? "bg-[#0EFF7BB2] text-black"
                    : "bg-[#0EFF7B80] text-black"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                whileHover={
                  !isLoading ? { scale: 1.05, backgroundColor: "#0EFF7B" } : {}
                }
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            {/* StacklyCare Text inside container */}
            <motion.div
              className="relative mt-8 flex items-center justify-center w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <motion.span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "38px",
                  lineHeight: "100%",
                  letterSpacing: "8%",
                  color: isLightMode ? "#0EFF7BB2" : "#FFFFFF1F",
                  display: "block",
                  zIndex: 10,
                }}
              >
                StacklyCare
              </motion.span>
              <motion.div
                style={{
                  position: "absolute",
                  width: "400px",
                  height: "50px",
                  background: isLightMode ? "#0EFF7BCC" : "#0EFF7B33",
                  borderRadius: "50%",
                  backdropFilter: "blur(150px)",
                  filter: "blur(30px)",
                  zIndex: 1,
                }}
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
