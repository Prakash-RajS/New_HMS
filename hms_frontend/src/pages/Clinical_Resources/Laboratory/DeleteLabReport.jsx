import React from "react";
import { X } from "lucide-react";

const DeleteLabReportPopup = ({ order, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
       
        {/* Inner Container */}
        <div
          className="w-[505px] h-auto rounded-[19px] bg-white dark:bg-[#000000] text-black dark:text-white p-6 relative"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >{/* Gradient Border */}
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
          {/* Header */}
          <div className="flex justify-between items-center pb-3 mb-4">
            <h2
              className="text-black dark:text-white font-medium text-[16px] leading-[19px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Delete Test Order
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full border border-gray-300 dark:border-[#0EFF7B1A] bg-white dark:bg-[#0EFF7B1A] shadow flex items-center justify-center"
            >
              <X size={16} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Message */}
          <p
            className="text-gray-600 dark:text-gray-300 text-center text-[15px] mb-8"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            Are you sure you want to delete test order{" "}
            <span className="font-semibold text-black dark:text-[#0EFF7B]">
              {order?.id}
            </span>
            ? <br />
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              className="w-[144px] h-[32px] rounded-[8px] border border-gray-300 dark:border-[#3A3A3A]
              bg-white dark:bg-transparent text-black dark:text-white font-medium text-[14px] leading-[16px]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(order.id)}
              className="w-[144px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#FF4D4D] to-[#B30000]
              text-white font-medium text-[14px] leading-[16px] hover:scale-105 transition"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
   
  );
};

export default DeleteLabReportPopup;
