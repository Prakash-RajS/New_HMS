import React from "react";
import { X } from "lucide-react";

const DeleteAppointmentPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="w-[505px] rounded-[20px] p-[1px] backdrop-blur-md 
        "
      >
        <div
          className="rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 shadow-lg relative"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        ><div
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
          <div className="flex justify-between items-center pb-3 mb-4">
            <h3
              className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Delete Patient
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full 
              border border-gray-300 dark:border-[#0EFF7B1A] 
              bg-white dark:bg-[#0EFF7B1A] 
              shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Message */}
          <p
            className="text-gray-600 dark:text-gray-300 text-center text-base mb-8"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Are you sure you want to delete this appointment? <br />
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[34px] rounded-[8px] py-2 px-1 border border-[#3C3C3C] text-white font-medium text-[14px] leading-[16px] shadow-[0_2px_12px_0px_#00000040] opacity-100 bg-black dark:bg-transparent dark:text-white"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-[144px] h-[32px] rounded-[8px] py-2 px-3 border-b border-[#0EFF7B] bg-gradient-to-r from-[#FF4D4D] to-[#B30000] shadow-[0_2px_12px_0px_#00000040] text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointmentPopup;
