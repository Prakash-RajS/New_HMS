import React from "react";
import { X } from "lucide-react";

const DeleteLabReportPopup = ({ order, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-[504px] rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] bg-white dark:bg-[#000000E5] text-black dark:text-white p-6 shadow-[0px_0px_4px_0px_rgba(255,255,255,0.12)] backdrop-blur-md relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#0EFF7B]">Delete Test Order</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#0EFF7B1A] bg-[#0EFF7B1A] dark:bg-[#0EFF7B1A] shadow-[0px_0px_4px_0px_#0EFF7B1A] flex items-center justify-center"
          >
            <X size={16} className="text-[#08994A] dark:text-[#0EFF7B]" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center text-base mb-8">
          Are you sure you want to delete test order {order.id}? <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="w-[104px] h-[33px] rounded-[20px] border border-[#0EFF7B] dark:border-[#0D0D0D] px-3 py-2 flex items-center justify-center gap-2 text-[#08994A] dark:text-white font-medium text-[14px] leading-[16px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.25)] hover:bg-[#0EFF7B1A] dark:hover:bg-[#3A3A3A]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(order.id)}
            className="w-[104px] h-[33px] rounded-[20px] px-3 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4D4D] to-[#B30000] text-white font-medium text-[14px] leading-[16px] hover:bg-[#FF4D4D] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLabReportPopup;