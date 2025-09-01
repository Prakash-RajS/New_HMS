import React from "react";
import { X } from "lucide-react";

const DeleteAppointmentPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[504px] rounded-[20px] border border-[#1E1E1E] bg-[#000000E5] text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-lg font-semibold">Delete Patient</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] shadow-[0px 0px 4px 0px #0EFF7B1A;] flex items-center justify-center"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-center text-base mb-8">
          Are you sure you want to delete this appointment? <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#3A3A3A] px-3 py-2 flex items-center justify-center gap-2 
               text-white font-medium text-[14px] leading-[16px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.25)] opacity-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-[104px] h-[33px] rounded-[20px]  px-3 py-2 flex items-center justify-center gap-2 
             bg-gradient-to-r from-[#FF4D4D] to-[#B30000]
             text-white font-medium text-[14px] leading-[16px] opacity-100 hover:scale-105 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointmentPopup;
