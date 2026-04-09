
"use client";

import React from "react";

interface AlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[90%] max-w-md p-6">
          
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Are you sure you want to sign out? 
          </h2>

          
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 dark:text-gray-200 dark:bg-gray-700 text-sm"
            >
            Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;

